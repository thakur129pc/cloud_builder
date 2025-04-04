!(function (e) {
  function t(e, t) {
    return t * Math.floor(e / t);
  }
  function n(e, t, n, r) {
    if ('function' == typeof e.strftime) return e.strftime(t);
    var a = function (e, t) {
        return (
          (e = '' + e),
          (t = '' + (null == t ? '0' : t)),
          1 == e.length ? t + e : e
        );
      },
      i = [],
      o = !1,
      s = e.getHours(),
      u = 12 > s;
    null == n &&
      (n = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ]),
      null == r && (r = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
    var m;
    m = s > 12 ? s - 12 : 0 == s ? 12 : s;
    for (var c = 0; c < t.length; ++c) {
      var l = t.charAt(c);
      if (o) {
        switch (l) {
          case 'a':
            l = '' + r[e.getDay()];
            break;
          case 'b':
            l = '' + n[e.getMonth()];
            break;
          case 'd':
            l = a(e.getDate());
            break;
          case 'e':
            l = a(e.getDate(), ' ');
            break;
          case 'h':
          case 'H':
            l = a(s);
            break;
          case 'I':
            l = a(m);
            break;
          case 'l':
            l = a(m, ' ');
            break;
          case 'm':
            l = a(e.getMonth() + 1);
            break;
          case 'M':
            l = a(e.getMinutes());
            break;
          case 'q':
            l = '' + (Math.floor(e.getMonth() / 3) + 1);
            break;
          case 'S':
            l = a(e.getSeconds());
            break;
          case 'y':
            l = a(e.getFullYear() % 100);
            break;
          case 'Y':
            l = '' + e.getFullYear();
            break;
          case 'p':
            l = u ? 'am' : 'pm';
            break;
          case 'P':
            l = u ? 'AM' : 'PM';
            break;
          case 'w':
            l = '' + e.getDay();
        }
        i.push(l), (o = !1);
      } else '%' == l ? (o = !0) : i.push(l);
    }
    return i.join('');
  }
  function r(e) {
    function t(e, t, n, r) {
      e[t] = function () {
        return n[r].apply(n, arguments);
      };
    }
    var n = { date: e };
    void 0 != e.strftime && t(n, 'strftime', e, 'strftime'),
      t(n, 'getTime', e, 'getTime'),
      t(n, 'setTime', e, 'setTime');
    for (
      var r = [
          'Date',
          'Day',
          'FullYear',
          'Hours',
          'Milliseconds',
          'Minutes',
          'Month',
          'Seconds',
        ],
        a = 0;
      a < r.length;
      a++
    )
      t(n, 'get' + r[a], e, 'getUTC' + r[a]),
        t(n, 'set' + r[a], e, 'setUTC' + r[a]);
    return n;
  }
  function a(e, t) {
    if ('browser' == t.timezone) return new Date(e);
    if (t.timezone && 'utc' != t.timezone) {
      if (
        'undefined' != typeof timezoneJS &&
        'undefined' != typeof timezoneJS.Date
      ) {
        var n = new timezoneJS.Date();
        return n.setTimezone(t.timezone), n.setTime(e), n;
      }
      return r(new Date(e));
    }
    return r(new Date(e));
  }
  function i(r) {
    r.hooks.processOptions.push(function (r) {
      e.each(r.getAxes(), function (e, r) {
        var i = r.options;
        'time' == i.mode &&
          ((r.tickGenerator = function (e) {
            var n = [],
              r = a(e.min, i),
              o = 0,
              u =
                (i.tickSize && 'quarter' === i.tickSize[1]) ||
                (i.minTickSize && 'quarter' === i.minTickSize[1])
                  ? c
                  : m;
            null != i.minTickSize &&
              (o =
                'number' == typeof i.tickSize
                  ? i.tickSize
                  : i.minTickSize[0] * s[i.minTickSize[1]]);
            for (
              var l = 0;
              l < u.length - 1 &&
              !(
                e.delta <
                  (u[l][0] * s[u[l][1]] + u[l + 1][0] * s[u[l + 1][1]]) / 2 &&
                u[l][0] * s[u[l][1]] >= o
              );
              ++l
            );
            var h = u[l][0],
              f = u[l][1];
            if ('year' == f) {
              if (null != i.minTickSize && 'year' == i.minTickSize[1])
                h = Math.floor(i.minTickSize[0]);
              else {
                var k = Math.pow(
                    10,
                    Math.floor(Math.log(e.delta / s.year) / Math.LN10)
                  ),
                  d = e.delta / s.year / k;
                (h = 1.5 > d ? 1 : 3 > d ? 2 : 7.5 > d ? 5 : 10), (h *= k);
              }
              1 > h && (h = 1);
            }
            e.tickSize = i.tickSize || [h, f];
            var g = e.tickSize[0];
            f = e.tickSize[1];
            var M = g * s[f];
            'second' == f
              ? r.setSeconds(t(r.getSeconds(), g))
              : 'minute' == f
                ? r.setMinutes(t(r.getMinutes(), g))
                : 'hour' == f
                  ? r.setHours(t(r.getHours(), g))
                  : 'month' == f
                    ? r.setMonth(t(r.getMonth(), g))
                    : 'quarter' == f
                      ? r.setMonth(3 * t(r.getMonth() / 3, g))
                      : 'year' == f && r.setFullYear(t(r.getFullYear(), g)),
              r.setMilliseconds(0),
              M >= s.minute && r.setSeconds(0),
              M >= s.hour && r.setMinutes(0),
              M >= s.day && r.setHours(0),
              M >= 4 * s.day && r.setDate(1),
              M >= 2 * s.month && r.setMonth(t(r.getMonth(), 3)),
              M >= 2 * s.quarter && r.setMonth(t(r.getMonth(), 6)),
              M >= s.year && r.setMonth(0);
            var y,
              S = 0,
              z = Number.NaN;
            do
              if (
                ((y = z),
                (z = r.getTime()),
                n.push(z),
                'month' == f || 'quarter' == f)
              )
                if (1 > g) {
                  r.setDate(1);
                  var p = r.getTime();
                  r.setMonth(r.getMonth() + ('quarter' == f ? 3 : 1));
                  var v = r.getTime();
                  r.setTime(z + S * s.hour + (v - p) * g),
                    (S = r.getHours()),
                    r.setHours(0);
                } else r.setMonth(r.getMonth() + g * ('quarter' == f ? 3 : 1));
              else
                'year' == f
                  ? r.setFullYear(r.getFullYear() + g)
                  : r.setTime(z + M);
            while (z < e.max && z != y);
            return n;
          }),
          (r.tickFormatter = function (e, t) {
            var r = a(e, t.options);
            if (null != i.timeformat)
              return n(r, i.timeformat, i.monthNames, i.dayNames);
            var o,
              u =
                (t.options.tickSize && 'quarter' == t.options.tickSize[1]) ||
                (t.options.minTickSize &&
                  'quarter' == t.options.minTickSize[1]),
              m = t.tickSize[0] * s[t.tickSize[1]],
              c = t.max - t.min,
              l = i.twelveHourClock ? ' %p' : '',
              h = i.twelveHourClock ? '%I' : '%H';
            o =
              m < s.minute
                ? h + ':%M:%S' + l
                : m < s.day
                  ? c < 2 * s.day
                    ? h + ':%M' + l
                    : '%b %d ' + h + ':%M' + l
                  : m < s.month
                    ? '%b %d'
                    : (u && m < s.quarter) || (!u && m < s.year)
                      ? c < s.year
                        ? '%b'
                        : '%b %Y'
                      : u && m < s.year
                        ? c < s.year
                          ? 'Q%q'
                          : 'Q%q %Y'
                        : '%Y';
            var f = n(r, o, i.monthNames, i.dayNames);
            return f;
          }));
      });
    });
  }
  var o = {
      xaxis: {
        timezone: null,
        timeformat: null,
        twelveHourClock: !1,
        monthNames: null,
      },
    },
    s = {
      second: 1e3,
      minute: 6e4,
      hour: 36e5,
      day: 864e5,
      month: 2592e6,
      quarter: 7776e6,
      year: 525949.2 * 60 * 1e3,
    },
    u = [
      [1, 'second'],
      [2, 'second'],
      [5, 'second'],
      [10, 'second'],
      [30, 'second'],
      [1, 'minute'],
      [2, 'minute'],
      [5, 'minute'],
      [10, 'minute'],
      [30, 'minute'],
      [1, 'hour'],
      [2, 'hour'],
      [4, 'hour'],
      [8, 'hour'],
      [12, 'hour'],
      [1, 'day'],
      [2, 'day'],
      [3, 'day'],
      [0.25, 'month'],
      [0.5, 'month'],
      [1, 'month'],
      [2, 'month'],
    ],
    m = u.concat([
      [3, 'month'],
      [6, 'month'],
      [1, 'year'],
    ]),
    c = u.concat([
      [1, 'quarter'],
      [2, 'quarter'],
      [1, 'year'],
    ]);
  e.plot.plugins.push({ init: i, options: o, name: 'time', version: '1.0' }),
    (e.plot.formatDate = n),
    (e.plot.dateGenerator = a);
})(jQuery);
