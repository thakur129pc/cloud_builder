function tableToGrid(e, t) {
  jQuery(e).each(function () {
    if (!this.grid) {
      jQuery(this).width('99%');
      var e = jQuery(this).width(),
        i = jQuery(
          'tr td:first-child input[type=checkbox]:first',
          jQuery(this)
        ),
        r = jQuery('tr td:first-child input[type=radio]:first', jQuery(this)),
        a = i.length > 0,
        o = !a && r.length > 0,
        s = a || o,
        n = [],
        d = [];
      jQuery('th', jQuery(this)).each(function () {
        0 === n.length && s
          ? (n.push({
              name: '__selection__',
              index: '__selection__',
              width: 0,
              hidden: !0,
            }),
            d.push('__selection__'))
          : (n.push({
              name:
                jQuery(this).attr('id') ||
                jQuery
                  .trim(jQuery.jgrid.stripHtml(jQuery(this).html()))
                  .split(' ')
                  .join('_'),
              index:
                jQuery(this).attr('id') ||
                jQuery
                  .trim(jQuery.jgrid.stripHtml(jQuery(this).html()))
                  .split(' ')
                  .join('_'),
              width: jQuery(this).width() || 150,
            }),
            d.push(jQuery(this).html()));
      });
      var l = [],
        p = [],
        c = [];
      jQuery('tbody > tr', jQuery(this)).each(function () {
        var e = {},
          t = 0;
        jQuery('td', jQuery(this)).each(function () {
          if (0 === t && s) {
            var i = jQuery('input', jQuery(this)),
              r = i.attr('value');
            p.push(r || l.length),
              i.is(':checked') && c.push(r),
              (e[n[t].name] = i.attr('value'));
          } else e[n[t].name] = jQuery(this).html();
          t++;
        }),
          t > 0 && l.push(e);
      }),
        jQuery(this).empty(),
        jQuery(this).addClass('scroll'),
        jQuery(this).jqGrid(
          jQuery.extend(
            {
              datatype: 'local',
              width: e,
              colNames: d,
              colModel: n,
              multiselect: a,
            },
            t || {}
          )
        );
      var u;
      for (u = 0; u < l.length; u++) {
        var h = null;
        p.length > 0 &&
          ((h = p[u]),
          h &&
            h.replace &&
            (h = encodeURIComponent(h).replace(/[.\-%]/g, '_'))),
          null === h && (h = u + 1),
          jQuery(this).jqGrid('addRowData', h, l[u]);
      }
      for (u = 0; u < c.length; u++) jQuery(this).jqGrid('setSelection', c[u]);
    }
  });
}
!(function ($) {
  'use strict';
  ($.jgrid = $.jgrid || {}),
    $.extend($.jgrid, {
      version: '4.7.1',
      htmlDecode: function (e) {
        return e &&
          ('&nbsp;' === e ||
            '&#160;' === e ||
            (1 === e.length && 160 === e.charCodeAt(0)))
          ? ''
          : e
            ? String(e)
                .replace(/&gt;/g, '>')
                .replace(/&lt;/g, '<')
                .replace(/&quot;/g, '"')
                .replace(/&amp;/g, '&')
            : e;
      },
      htmlEncode: function (e) {
        return e
          ? String(e)
              .replace(/&/g, '&amp;')
              .replace(/\"/g, '&quot;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
          : e;
      },
      format: function (e) {
        var t = $.makeArray(arguments).slice(1);
        return (
          null == e && (e = ''),
          e.replace(/\{(\d+)\}/g, function (e, i) {
            return t[i];
          })
        );
      },
      msie: 'Microsoft Internet Explorer' === navigator.appName,
      msiever: function () {
        var e = -1,
          t = navigator.userAgent,
          i = new RegExp('MSIE ([0-9]{1,}[.0-9]{0,})');
        return null != i.exec(t) && (e = parseFloat(RegExp.$1)), e;
      },
      getCellIndex: function (e) {
        var t = $(e);
        return t.is('tr')
          ? -1
          : ((t = (t.is('td') || t.is('th') ? t : t.closest('td,th'))[0]),
            $.jgrid.msie ? $.inArray(t, t.parentNode.cells) : t.cellIndex);
      },
      stripHtml: function (e) {
        e = String(e);
        var t = /<("[^"]*"|'[^']*'|[^'">])*>/gi;
        return e
          ? ((e = e.replace(t, '')),
            e && '&nbsp;' !== e && '&#160;' !== e ? e.replace(/\"/g, "'") : '')
          : e;
      },
      stripPref: function (e, t) {
        var i = $.type(e);
        return (
          ('string' === i || 'number' === i) &&
            ((e = String(e)),
            (t = '' !== e ? String(t).replace(String(e), '') : t)),
          t
        );
      },
      parse: function (jsonString) {
        var js = jsonString;
        return (
          'while(1);' === js.substr(0, 9) && (js = js.substr(9)),
          '/*' === js.substr(0, 2) && (js = js.substr(2, js.length - 4)),
          js || (js = '{}'),
          $.jgrid.useJSON === !0 &&
          'object' == typeof JSON &&
          'function' == typeof JSON.parse
            ? JSON.parse(js)
            : eval('(' + js + ')')
        );
      },
      parseDate: function (e, t, i, r) {
        var a,
          o,
          s,
          n = /\\.|[dDjlNSwzWFmMntLoYyaABgGhHisueIOPTZcrU]/g,
          d =
            /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
          l = /[^-+\dA-Z]/g,
          p = new RegExp(
            '^/Date\\((([-+])?[0-9]+)(([-+])([0-9]{2})([0-9]{2}))?\\)/$'
          ),
          c = 'string' == typeof t ? t.match(p) : null,
          u = function (e, t) {
            for (e = String(e), t = parseInt(t, 10) || 2; e.length < t; )
              e = '0' + e;
            return e;
          },
          h = { m: 1, d: 1, y: 1970, h: 0, i: 0, s: 0, u: 0 },
          g = 0,
          f = function (e, t) {
            return 0 === e ? 12 === t && (t = 0) : 12 !== t && (t += 12), t;
          },
          m = 0;
        if (
          (void 0 === r && (r = $.jgrid.formatter.date),
          void 0 === r.parseRe && (r.parseRe = /[#%\\\/:_;.,\t\s-]/),
          r.masks.hasOwnProperty(e) && (e = r.masks[e]),
          t && null != t)
        )
          if (isNaN(t - 0) || 'u' !== String(e).toLowerCase())
            if (t.constructor === Date) g = t;
            else if (null !== c)
              (g = new Date(parseInt(c[1], 10))),
                c[3] &&
                  ((m = 60 * Number(c[5]) + Number(c[6])),
                  (m *= '-' === c[4] ? 1 : -1),
                  (m -= g.getTimezoneOffset()),
                  g.setTime(Number(Number(g) + 60 * m * 1e3)));
            else {
              for (
                'ISO8601Long' === r.srcformat &&
                  'Z' === t.charAt(t.length - 1) &&
                  (m -= new Date().getTimezoneOffset()),
                  t = String(t)
                    .replace(/\T/g, '#')
                    .replace(/\t/, '%')
                    .split(r.parseRe),
                  e = e.replace(/\T/g, '#').replace(/\t/, '%').split(r.parseRe),
                  o = 0,
                  s = e.length;
                s > o;
                o++
              )
                'M' === e[o] &&
                  ((a = $.inArray(t[o], r.monthNames)),
                  -1 !== a && 12 > a && ((t[o] = a + 1), (h.m = t[o]))),
                  'F' === e[o] &&
                    ((a = $.inArray(t[o], r.monthNames, 12)),
                    -1 !== a && a > 11 && ((t[o] = a + 1 - 12), (h.m = t[o]))),
                  'a' === e[o] &&
                    ((a = $.inArray(t[o], r.AmPm)),
                    -1 !== a &&
                      2 > a &&
                      t[o] === r.AmPm[a] &&
                      ((t[o] = a), (h.h = f(t[o], h.h)))),
                  'A' === e[o] &&
                    ((a = $.inArray(t[o], r.AmPm)),
                    -1 !== a &&
                      a > 1 &&
                      t[o] === r.AmPm[a] &&
                      ((t[o] = a - 2), (h.h = f(t[o], h.h)))),
                  'g' === e[o] && (h.h = parseInt(t[o], 10)),
                  void 0 !== t[o] &&
                    (h[e[o].toLowerCase()] = parseInt(t[o], 10));
              if ((h.f && (h.m = h.f), 0 === h.m && 0 === h.y && 0 === h.d))
                return '&#160;';
              h.m = parseInt(h.m, 10) - 1;
              var v = h.y;
              v >= 70 && 99 >= v
                ? (h.y = 1900 + h.y)
                : v >= 0 && 69 >= v && (h.y = 2e3 + h.y),
                (g = new Date(h.y, h.m, h.d, h.h, h.i, h.s, h.u)),
                m > 0 && g.setTime(Number(Number(g) + 60 * m * 1e3));
            }
          else g = new Date(1e3 * parseFloat(t));
        else g = new Date(h.y, h.m, h.d, h.h, h.i, h.s, h.u);
        if (
          (r.userLocalTime &&
            0 === m &&
            ((m -= new Date().getTimezoneOffset()),
            m > 0 && g.setTime(Number(Number(g) + 60 * m * 1e3))),
          void 0 === i)
        )
          return g;
        r.masks.hasOwnProperty(i) ? (i = r.masks[i]) : i || (i = 'Y-m-d');
        var j = g.getHours(),
          b = g.getMinutes(),
          w = g.getDate(),
          y = g.getMonth() + 1,
          x = g.getTimezoneOffset(),
          q = g.getSeconds(),
          D = g.getMilliseconds(),
          _ = g.getDay(),
          C = g.getFullYear(),
          G = ((_ + 6) % 7) + 1,
          I = (new Date(C, y - 1, w) - new Date(C, 0, 1)) / 864e5,
          F = {
            d: u(w),
            D: r.dayNames[_],
            j: w,
            l: r.dayNames[_ + 7],
            N: G,
            S: r.S(w),
            w: _,
            z: I,
            W:
              5 > G
                ? Math.floor((I + G - 1) / 7) + 1
                : Math.floor((I + G - 1) / 7) ||
                  ((new Date(C - 1, 0, 1).getDay() + 6) % 7 < 4 ? 53 : 52),
            F: r.monthNames[y - 1 + 12],
            m: u(y),
            M: r.monthNames[y - 1],
            n: y,
            t: '?',
            L: '?',
            o: '?',
            Y: C,
            y: String(C).substring(2),
            a: 12 > j ? r.AmPm[0] : r.AmPm[1],
            A: 12 > j ? r.AmPm[2] : r.AmPm[3],
            B: '?',
            g: j % 12 || 12,
            G: j,
            h: u(j % 12 || 12),
            H: u(j),
            i: u(b),
            s: u(q),
            u: D,
            e: '?',
            I: '?',
            O:
              (x > 0 ? '-' : '+') +
              u(100 * Math.floor(Math.abs(x) / 60) + (Math.abs(x) % 60), 4),
            P: '?',
            T: (String(g).match(d) || ['']).pop().replace(l, ''),
            Z: '?',
            c: '?',
            r: '?',
            U: Math.floor(g / 1e3),
          };
        return i.replace(n, function (e) {
          return F.hasOwnProperty(e) ? F[e] : e.substring(1);
        });
      },
      jqID: function (e) {
        return String(e).replace(
          /[!"#$%&'()*+,.\/:; <=>?@\[\\\]\^`{|}~]/g,
          '\\$&'
        );
      },
      guid: 1,
      uidPref: 'jqg',
      randId: function (e) {
        return (e || $.jgrid.uidPref) + $.jgrid.guid++;
      },
      getAccessor: function (e, t) {
        var i,
          r,
          a,
          o = [];
        if ('function' == typeof t) return t(e);
        if (((i = e[t]), void 0 === i))
          try {
            if (('string' == typeof t && (o = t.split('.')), (a = o.length)))
              for (i = e; i && a--; ) (r = o.shift()), (i = i[r]);
          } catch (s) {}
        return i;
      },
      getXmlData: function (e, t, i) {
        var r,
          a = 'string' == typeof t ? t.match(/^(.*)\[(\w+)\]$/) : null;
        return 'function' == typeof t
          ? t(e)
          : a && a[2]
            ? a[1]
              ? $(a[1], e).attr(a[2])
              : $(e).attr(a[2])
            : ((r = $(t, e)), i ? r : r.length > 0 ? $(r).text() : void 0);
      },
      cellWidth: function () {
        var e = $(
            "<div class='ui-jqgrid' style='left:10000px'><table class='ui-jqgrid-btable' style='width:5px;'><tr class='jqgrow'><td style='width:5px;display:block;'></td></tr></table></div>"
          ),
          t = e.appendTo('body').find('td').width();
        return e.remove(), Math.abs(t - 5) > 0.1;
      },
      cell_width: !0,
      ajaxOptions: {},
      from: function (source) {
        var QueryObject = function (d, q) {
          'string' == typeof d && (d = $.data(d));
          var self = this,
            _data = d,
            _usecase = !0,
            _trim = !1,
            _query = q,
            _stripNum = /[\$,%]/g,
            _lastCommand = null,
            _lastField = null,
            _orDepth = 0,
            _negate = !1,
            _queuedOperator = '',
            _sorting = [],
            _useProperties = !0;
          if ('object' != typeof d || !d.push)
            throw 'data provides is not an array';
          return (
            d.length > 0 &&
              (_useProperties = 'object' != typeof d[0] ? !1 : !0),
            (this._hasData = function () {
              return null === _data ? !1 : 0 === _data.length ? !1 : !0;
            }),
            (this._getStr = function (e) {
              var t = [];
              return (
                _trim && t.push('jQuery.trim('),
                t.push('String(' + e + ')'),
                _trim && t.push(')'),
                _usecase || t.push('.toLowerCase()'),
                t.join('')
              );
            }),
            (this._strComp = function (e) {
              return 'string' == typeof e ? '.toString()' : '';
            }),
            (this._group = function (e, t) {
              return { field: e.toString(), unique: t, items: [] };
            }),
            (this._toStr = function (e) {
              return (
                _trim && (e = $.trim(e)),
                (e = e.toString().replace(/\\/g, '\\\\').replace(/\"/g, '\\"')),
                _usecase ? e : e.toLowerCase()
              );
            }),
            (this._funcLoop = function (e) {
              var t = [];
              return (
                $.each(_data, function (i, r) {
                  t.push(e(r));
                }),
                t
              );
            }),
            (this._append = function (e) {
              var t;
              for (
                null === _query
                  ? (_query = '')
                  : (_query +=
                      '' === _queuedOperator ? ' && ' : _queuedOperator),
                  t = 0;
                _orDepth > t;
                t++
              )
                _query += '(';
              _negate && (_query += '!'),
                (_query += '(' + e + ')'),
                (_negate = !1),
                (_queuedOperator = ''),
                (_orDepth = 0);
            }),
            (this._setCommand = function (e, t) {
              (_lastCommand = e), (_lastField = t);
            }),
            (this._resetNegate = function () {
              _negate = !1;
            }),
            (this._repeatCommand = function (e, t) {
              return null === _lastCommand
                ? self
                : null !== e && null !== t
                  ? _lastCommand(e, t)
                  : null === _lastField
                    ? _lastCommand(e)
                    : _useProperties
                      ? _lastCommand(_lastField, e)
                      : _lastCommand(e);
            }),
            (this._equals = function (e, t) {
              return 0 === self._compare(e, t, 1);
            }),
            (this._compare = function (e, t, i) {
              var r = Object.prototype.toString;
              return (
                void 0 === i && (i = 1),
                void 0 === e && (e = null),
                void 0 === t && (t = null),
                null === e && null === t
                  ? 0
                  : null === e && null !== t
                    ? 1
                    : null !== e && null === t
                      ? -1
                      : '[object Date]' === r.call(e) &&
                          '[object Date]' === r.call(t)
                        ? t > e
                          ? -i
                          : e > t
                            ? i
                            : 0
                        : (_usecase ||
                            'number' == typeof e ||
                            'number' == typeof t ||
                            ((e = String(e)), (t = String(t))),
                          t > e ? -i : e > t ? i : 0)
              );
            }),
            (this._performSort = function () {
              0 !== _sorting.length && (_data = self._doSort(_data, 0));
            }),
            (this._doSort = function (e, t) {
              var i = _sorting[t].by,
                r = _sorting[t].dir,
                a = _sorting[t].type,
                o = _sorting[t].datefmt,
                s = _sorting[t].sfunc;
              if (t === _sorting.length - 1)
                return self._getOrder(e, i, r, a, o, s);
              t++;
              var n,
                d,
                l,
                p = self._getGroup(e, i, r, a, o),
                c = [];
              for (n = 0; n < p.length; n++)
                for (l = self._doSort(p[n].items, t), d = 0; d < l.length; d++)
                  c.push(l[d]);
              return c;
            }),
            (this._getOrder = function (e, t, i, r, a, o) {
              var s,
                n,
                d,
                l,
                p = [],
                c = [],
                u = 'a' === i ? 1 : -1;
              void 0 === r && (r = 'text'),
                (l =
                  'float' === r ||
                  'number' === r ||
                  'currency' === r ||
                  'numeric' === r
                    ? function (e) {
                        var t = parseFloat(String(e).replace(_stripNum, ''));
                        return isNaN(t) ? Number.NEGATIVE_INFINITY : t;
                      }
                    : 'int' === r || 'integer' === r
                      ? function (e) {
                          return e
                            ? parseFloat(String(e).replace(_stripNum, ''))
                            : Number.NEGATIVE_INFINITY;
                        }
                      : 'date' === r || 'datetime' === r
                        ? function (e) {
                            return $.jgrid.parseDate(a, e).getTime();
                          }
                        : $.isFunction(r)
                          ? r
                          : function (e) {
                              return (
                                (e = e ? $.trim(String(e)) : ''),
                                _usecase ? e : e.toLowerCase()
                              );
                            }),
                $.each(e, function (e, i) {
                  (n = '' !== t ? $.jgrid.getAccessor(i, t) : i),
                    void 0 === n && (n = ''),
                    (n = l(n, i)),
                    c.push({ vSort: n, index: e });
                }),
                c.sort(
                  $.isFunction(o)
                    ? function (e, t) {
                        return (
                          (e = e.vSort), (t = t.vSort), o.call(this, e, t, u)
                        );
                      }
                    : function (e, t) {
                        return (
                          (e = e.vSort), (t = t.vSort), self._compare(e, t, u)
                        );
                      }
                ),
                (d = 0);
              for (var h = e.length; h > d; )
                (s = c[d].index), p.push(e[s]), d++;
              return p;
            }),
            (this._getGroup = function (e, t, i, r, a) {
              var o,
                s = [],
                n = null,
                d = null;
              return (
                $.each(self._getOrder(e, t, i, r, a), function (e, i) {
                  (o = $.jgrid.getAccessor(i, t)),
                    null == o && (o = ''),
                    self._equals(d, o) ||
                      ((d = o),
                      null !== n && s.push(n),
                      (n = self._group(t, o))),
                    n.items.push(i);
                }),
                null !== n && s.push(n),
                s
              );
            }),
            (this.ignoreCase = function () {
              return (_usecase = !1), self;
            }),
            (this.useCase = function () {
              return (_usecase = !0), self;
            }),
            (this.trim = function () {
              return (_trim = !0), self;
            }),
            (this.noTrim = function () {
              return (_trim = !1), self;
            }),
            (this.execute = function () {
              var match = _query,
                results = [];
              return null === match
                ? self
                : ($.each(_data, function () {
                    eval(match) && results.push(this);
                  }),
                  (_data = results),
                  self);
            }),
            (this.data = function () {
              return _data;
            }),
            (this.select = function (e) {
              if ((self._performSort(), !self._hasData())) return [];
              if ((self.execute(), $.isFunction(e))) {
                var t = [];
                return (
                  $.each(_data, function (i, r) {
                    t.push(e(r));
                  }),
                  t
                );
              }
              return _data;
            }),
            (this.hasMatch = function () {
              return self._hasData() ? (self.execute(), _data.length > 0) : !1;
            }),
            (this.andNot = function (e, t, i) {
              return (_negate = !_negate), self.and(e, t, i);
            }),
            (this.orNot = function (e, t, i) {
              return (_negate = !_negate), self.or(e, t, i);
            }),
            (this.not = function (e, t, i) {
              return self.andNot(e, t, i);
            }),
            (this.and = function (e, t, i) {
              return (
                (_queuedOperator = ' && '),
                void 0 === e ? self : self._repeatCommand(e, t, i)
              );
            }),
            (this.or = function (e, t, i) {
              return (
                (_queuedOperator = ' || '),
                void 0 === e ? self : self._repeatCommand(e, t, i)
              );
            }),
            (this.orBegin = function () {
              return _orDepth++, self;
            }),
            (this.orEnd = function () {
              return null !== _query && (_query += ')'), self;
            }),
            (this.isNot = function (e) {
              return (_negate = !_negate), self.is(e);
            }),
            (this.is = function (e) {
              return self._append('this.' + e), self._resetNegate(), self;
            }),
            (this._compareValues = function (e, t, i, r, a) {
              var o;
              (o = _useProperties
                ? "jQuery.jgrid.getAccessor(this,'" + t + "')"
                : 'this'),
                void 0 === i && (i = null);
              var s = i,
                n = void 0 === a.stype ? 'text' : a.stype;
              if (null !== i)
                switch (n) {
                  case 'int':
                  case 'integer':
                    (s = isNaN(Number(s)) || '' === s ? '0' : s),
                      (o = 'parseInt(' + o + ',10)'),
                      (s = 'parseInt(' + s + ',10)');
                    break;
                  case 'float':
                  case 'number':
                  case 'numeric':
                    (s = String(s).replace(_stripNum, '')),
                      (s = isNaN(Number(s)) || '' === s ? '0' : s),
                      (o = 'parseFloat(' + o + ')'),
                      (s = 'parseFloat(' + s + ')');
                    break;
                  case 'date':
                  case 'datetime':
                    (s = String(
                      $.jgrid.parseDate(a.newfmt || 'Y-m-d', s).getTime()
                    )),
                      (o =
                        'jQuery.jgrid.parseDate("' +
                        a.srcfmt +
                        '",' +
                        o +
                        ').getTime()');
                    break;
                  default:
                    (o = self._getStr(o)),
                      (s = self._getStr('"' + self._toStr(s) + '"'));
                }
              return (
                self._append(o + ' ' + r + ' ' + s),
                self._setCommand(e, t),
                self._resetNegate(),
                self
              );
            }),
            (this.equals = function (e, t, i) {
              return self._compareValues(self.equals, e, t, '==', i);
            }),
            (this.notEquals = function (e, t, i) {
              return self._compareValues(self.equals, e, t, '!==', i);
            }),
            (this.isNull = function (e, t, i) {
              return self._compareValues(self.equals, e, null, '===', i);
            }),
            (this.greater = function (e, t, i) {
              return self._compareValues(self.greater, e, t, '>', i);
            }),
            (this.less = function (e, t, i) {
              return self._compareValues(self.less, e, t, '<', i);
            }),
            (this.greaterOrEquals = function (e, t, i) {
              return self._compareValues(self.greaterOrEquals, e, t, '>=', i);
            }),
            (this.lessOrEquals = function (e, t, i) {
              return self._compareValues(self.lessOrEquals, e, t, '<=', i);
            }),
            (this.startsWith = function (e, t) {
              var i = null == t ? e : t,
                r = _trim ? $.trim(i.toString()).length : i.toString().length;
              return (
                _useProperties
                  ? self._append(
                      self._getStr(
                        "jQuery.jgrid.getAccessor(this,'" + e + "')"
                      ) +
                        '.substr(0,' +
                        r +
                        ') == ' +
                        self._getStr('"' + self._toStr(t) + '"')
                    )
                  : (null != t &&
                      (r = _trim
                        ? $.trim(t.toString()).length
                        : t.toString().length),
                    self._append(
                      self._getStr('this') +
                        '.substr(0,' +
                        r +
                        ') == ' +
                        self._getStr('"' + self._toStr(e) + '"')
                    )),
                self._setCommand(self.startsWith, e),
                self._resetNegate(),
                self
              );
            }),
            (this.endsWith = function (e, t) {
              var i = null == t ? e : t,
                r = _trim ? $.trim(i.toString()).length : i.toString().length;
              return (
                self._append(
                  _useProperties
                    ? self._getStr(
                        "jQuery.jgrid.getAccessor(this,'" + e + "')"
                      ) +
                        '.substr(' +
                        self._getStr(
                          "jQuery.jgrid.getAccessor(this,'" + e + "')"
                        ) +
                        '.length-' +
                        r +
                        ',' +
                        r +
                        ') == "' +
                        self._toStr(t) +
                        '"'
                    : self._getStr('this') +
                        '.substr(' +
                        self._getStr('this') +
                        '.length-"' +
                        self._toStr(e) +
                        '".length,"' +
                        self._toStr(e) +
                        '".length) == "' +
                        self._toStr(e) +
                        '"'
                ),
                self._setCommand(self.endsWith, e),
                self._resetNegate(),
                self
              );
            }),
            (this.contains = function (e, t) {
              return (
                self._append(
                  _useProperties
                    ? self._getStr(
                        "jQuery.jgrid.getAccessor(this,'" + e + "')"
                      ) +
                        '.indexOf("' +
                        self._toStr(t) +
                        '",0) > -1'
                    : self._getStr('this') +
                        '.indexOf("' +
                        self._toStr(e) +
                        '",0) > -1'
                ),
                self._setCommand(self.contains, e),
                self._resetNegate(),
                self
              );
            }),
            (this.groupBy = function (e, t, i, r) {
              return self._hasData() ? self._getGroup(_data, e, t, i, r) : null;
            }),
            (this.orderBy = function (e, t, i, r, a) {
              return (
                (t = null == t ? 'a' : $.trim(t.toString().toLowerCase())),
                null == i && (i = 'text'),
                null == r && (r = 'Y-m-d'),
                null == a && (a = !1),
                ('desc' === t || 'descending' === t) && (t = 'd'),
                ('asc' === t || 'ascending' === t) && (t = 'a'),
                _sorting.push({ by: e, dir: t, type: i, datefmt: r, sfunc: a }),
                self
              );
            }),
            self
          );
        };
        return new QueryObject(source, null);
      },
      getMethod: function (e) {
        return this.getAccessor($.fn.jqGrid, e);
      },
      extend: function (e) {
        $.extend($.fn.jqGrid, e), this.no_legacy_api || $.fn.extend(e);
      },
    }),
    ($.fn.jqGrid = function (e) {
      if ('string' == typeof e) {
        var t = $.jgrid.getMethod(e);
        if (!t) throw 'jqGrid - No such method: ' + e;
        var i = $.makeArray(arguments).slice(1);
        return t.apply(this, i);
      }
      return this.each(function () {
        if (!this.grid) {
          var t;
          null != e && void 0 !== e.data && ((t = e.data), (e.data = []));
          var i = $.extend(
            !0,
            {
              url: '',
              height: 150,
              page: 1,
              rowNum: 20,
              rowTotal: null,
              records: 0,
              pager: '',
              pgbuttons: !0,
              pginput: !0,
              colModel: [],
              rowList: [],
              colNames: [],
              sortorder: 'asc',
              sortname: '',
              datatype: 'xml',
              mtype: 'GET',
              altRows: !1,
              selarrrow: [],
              savedRow: [],
              shrinkToFit: !0,
              xmlReader: {},
              jsonReader: {},
              subGrid: !1,
              subGridModel: [],
              reccount: 0,
              lastpage: 0,
              lastsort: 0,
              selrow: null,
              beforeSelectRow: null,
              onSelectRow: null,
              onSortCol: null,
              ondblClickRow: null,
              onRightClickRow: null,
              onPaging: null,
              onSelectAll: null,
              onInitGrid: null,
              loadComplete: null,
              gridComplete: null,
              loadError: null,
              loadBeforeSend: null,
              afterInsertRow: null,
              beforeRequest: null,
              beforeProcessing: null,
              onHeaderClick: null,
              viewrecords: !1,
              loadonce: !1,
              multiselect: !1,
              multikey: !1,
              editurl: null,
              search: !1,
              caption: '',
              hidegrid: !0,
              hiddengrid: !1,
              postData: {},
              userData: {},
              treeGrid: !1,
              treeGridModel: 'nested',
              treeReader: {},
              treeANode: -1,
              ExpandColumn: null,
              tree_root_level: 0,
              prmNames: {
                page: 'page',
                rows: 'rows',
                sort: 'sidx',
                order: 'sord',
                search: '_search',
                nd: 'nd',
                id: 'id',
                oper: 'oper',
                editoper: 'edit',
                addoper: 'add',
                deloper: 'del',
                subgridid: 'id',
                npage: null,
                totalrows: 'totalrows',
              },
              forceFit: !1,
              gridstate: 'visible',
              cellEdit: !1,
              cellsubmit: 'remote',
              nv: 0,
              loadui: 'enable',
              toolbar: [!1, ''],
              scroll: !1,
              multiboxonly: !1,
              deselectAfterSort: !0,
              scrollrows: !1,
              autowidth: !1,
              scrollOffset: 18,
              cellLayout: 5,
              subGridWidth: 20,
              multiselectWidth: 20,
              gridview: !1,
              rownumWidth: 25,
              rownumbers: !1,
              pagerpos: 'center',
              recordpos: 'right',
              footerrow: !1,
              userDataOnFooter: !1,
              hoverrows: !0,
              altclass: 'ui-priority-secondary',
              viewsortcols: [!1, 'vertical', !0],
              resizeclass: '',
              autoencode: !1,
              remapColumns: [],
              ajaxGridOptions: {},
              direction: 'ltr',
              toppager: !1,
              headertitles: !1,
              scrollTimeout: 40,
              data: [],
              _index: {},
              grouping: !1,
              groupingView: {
                groupField: [],
                groupOrder: [],
                groupText: [],
                groupColumnShow: [],
                groupSummary: [],
                showSummaryOnHide: !1,
                sortitems: [],
                sortnames: [],
                summary: [],
                summaryval: [],
                plusicon: 'ui-icon-circlesmall-plus',
                minusicon: 'ui-icon-circlesmall-minus',
                displayField: [],
                groupSummaryPos: [],
                formatDisplayField: [],
                _locgr: !1,
              },
              ignoreCase: !1,
              cmTemplate: {},
              idPrefix: '',
              multiSort: !1,
              minColWidth: 33,
            },
            $.jgrid.defaults,
            e || {}
          );
          void 0 !== t && ((i.data = t), (e.data = t));
          var r = this,
            a = {
              headers: [],
              cols: [],
              footers: [],
              dragStart: function (e, t, a) {
                var o = $(this.bDiv).offset().left;
                (this.resizing = { idx: e, startX: t.pageX, sOL: t.pageX - o }),
                  (this.hDiv.style.cursor = 'col-resize'),
                  (this.curGbox = $(
                    '#rs_m' + $.jgrid.jqID(i.id),
                    '#gbox_' + $.jgrid.jqID(i.id)
                  )),
                  this.curGbox.css({
                    display: 'block',
                    left: t.pageX - o,
                    top: a[1],
                    height: a[2],
                  }),
                  $(r).triggerHandler('jqGridResizeStart', [t, e]),
                  $.isFunction(i.resizeStart) && i.resizeStart.call(r, t, e),
                  (document.onselectstart = function () {
                    return !1;
                  });
              },
              dragMove: function (e) {
                if (this.resizing) {
                  var t,
                    r,
                    a = e.pageX - this.resizing.startX,
                    o = this.headers[this.resizing.idx],
                    s = 'ltr' === i.direction ? o.width + a : o.width - a;
                  s > 33 &&
                    (this.curGbox.css({ left: this.resizing.sOL + a }),
                    i.forceFit === !0
                      ? ((t = this.headers[this.resizing.idx + i.nv]),
                        (r = 'ltr' === i.direction ? t.width - a : t.width + a),
                        r > i.minColWidth &&
                          ((o.newWidth = s), (t.newWidth = r)))
                      : ((this.newWidth =
                          'ltr' === i.direction
                            ? i.tblwidth + a
                            : i.tblwidth - a),
                        (o.newWidth = s)));
                }
              },
              dragEnd: function () {
                if (((this.hDiv.style.cursor = 'default'), this.resizing)) {
                  var e = this.resizing.idx,
                    t = this.headers[e].newWidth || this.headers[e].width;
                  (t = parseInt(t, 10)),
                    (this.resizing = !1),
                    $('#rs_m' + $.jgrid.jqID(i.id)).css('display', 'none'),
                    (i.colModel[e].width = t),
                    (this.headers[e].width = t),
                    (this.headers[e].el.style.width = t + 'px'),
                    (this.cols[e].style.width = t + 'px'),
                    this.footers.length > 0 &&
                      (this.footers[e].style.width = t + 'px'),
                    i.forceFit === !0
                      ? ((t =
                          this.headers[e + i.nv].newWidth ||
                          this.headers[e + i.nv].width),
                        (this.headers[e + i.nv].width = t),
                        (this.headers[e + i.nv].el.style.width = t + 'px'),
                        (this.cols[e + i.nv].style.width = t + 'px'),
                        this.footers.length > 0 &&
                          (this.footers[e + i.nv].style.width = t + 'px'),
                        (i.colModel[e + i.nv].width = t))
                      : ((i.tblwidth = this.newWidth || i.tblwidth),
                        $('table:first', this.bDiv).css(
                          'width',
                          i.tblwidth + 'px'
                        ),
                        $('table:first', this.hDiv).css(
                          'width',
                          i.tblwidth + 'px'
                        ),
                        (this.hDiv.scrollLeft = this.bDiv.scrollLeft),
                        i.footerrow &&
                          ($('table:first', this.sDiv).css(
                            'width',
                            i.tblwidth + 'px'
                          ),
                          (this.sDiv.scrollLeft = this.bDiv.scrollLeft))),
                    $(r).triggerHandler('jqGridResizeStop', [t, e]),
                    $.isFunction(i.resizeStop) && i.resizeStop.call(r, t, e);
                }
                (this.curGbox = null),
                  (document.onselectstart = function () {
                    return !0;
                  });
              },
              populateVisible: function () {
                a.timer && clearTimeout(a.timer), (a.timer = null);
                var e = $(a.bDiv).height();
                if (e) {
                  var t,
                    r,
                    o = $('table:first', a.bDiv);
                  if (o[0].rows.length)
                    try {
                      (t = o[0].rows[1]),
                        (r = t
                          ? $(t).outerHeight() || a.prevRowHeight
                          : a.prevRowHeight);
                    } catch (s) {
                      r = a.prevRowHeight;
                    }
                  if (r) {
                    a.prevRowHeight = r;
                    var n,
                      d,
                      l,
                      p = i.rowNum,
                      c = (a.scrollTop = a.bDiv.scrollTop),
                      u = Math.round(o.position().top) - c,
                      h = u + o.height(),
                      g = r * p;
                    if (
                      (e > h &&
                        0 >= u &&
                        (void 0 === i.lastpage ||
                          (parseInt((h + c + g - 1) / g, 10) || 0) <=
                            i.lastpage) &&
                        ((d = parseInt((e - h + g - 1) / g, 10) || 1),
                        h >= 0 || 2 > d || i.scroll === !0
                          ? ((n = (Math.round((h + c) / g) || 0) + 1), (u = -1))
                          : (u = 1)),
                      u > 0 &&
                        ((n = (parseInt(c / g, 10) || 0) + 1),
                        (d = (parseInt((c + e) / g, 10) || 0) + 2 - n),
                        (l = !0)),
                      d)
                    ) {
                      if (
                        i.lastpage &&
                        (n > i.lastpage ||
                          1 === i.lastpage ||
                          (n === i.page && n === i.lastpage))
                      )
                        return;
                      a.hDiv.loading
                        ? (a.timer = setTimeout(
                            a.populateVisible,
                            i.scrollTimeout
                          ))
                        : ((i.page = n),
                          l &&
                            (a.selectionPreserver(o[0]),
                            a.emptyRows.call(o[0], !1, !1)),
                          a.populate(d));
                    }
                  }
                }
              },
              scrollGrid: function (e) {
                if (i.scroll) {
                  var t = a.bDiv.scrollTop;
                  void 0 === a.scrollTop && (a.scrollTop = 0),
                    t !== a.scrollTop &&
                      ((a.scrollTop = t),
                      a.timer && clearTimeout(a.timer),
                      (a.timer = setTimeout(
                        a.populateVisible,
                        i.scrollTimeout
                      )));
                }
                (a.hDiv.scrollLeft = a.bDiv.scrollLeft),
                  i.footerrow && (a.sDiv.scrollLeft = a.bDiv.scrollLeft),
                  e && e.stopPropagation();
              },
              selectionPreserver: function (e) {
                var t = e.p,
                  i = t.selrow,
                  r = t.selarrrow ? $.makeArray(t.selarrrow) : null,
                  a = e.grid.bDiv.scrollLeft,
                  o = function () {
                    var s;
                    if (
                      ((t.selrow = null),
                      (t.selarrrow = []),
                      t.multiselect && r && r.length > 0)
                    )
                      for (s = 0; s < r.length; s++)
                        r[s] !== i &&
                          $(e).jqGrid('setSelection', r[s], !1, null);
                    i && $(e).jqGrid('setSelection', i, !1, null),
                      (e.grid.bDiv.scrollLeft = a),
                      $(e).unbind('.selectionPreserver', o);
                  };
                $(e).bind('jqGridGridComplete.selectionPreserver', o);
              },
            };
          if ('TABLE' !== this.tagName.toUpperCase() || null == this.id)
            return void alert('Element is not a table or has no id!');
          if (void 0 !== document.documentMode && document.documentMode <= 5)
            return void alert("Grid can not be used in this ('quirks') mode!");
          $(this).empty().attr('tabindex', '0'),
            (this.p = i),
            (this.p.useProp = !!$.fn.prop);
          var o, s;
          if (0 === this.p.colNames.length)
            for (o = 0; o < this.p.colModel.length; o++)
              this.p.colNames[o] =
                this.p.colModel[o].label || this.p.colModel[o].name;
          if (this.p.colNames.length !== this.p.colModel.length)
            return void alert($.jgrid.errors.model);
          var n = $("<div class='ui-jqgrid-view' role='grid'></div>"),
            d = $.jgrid.msie;
          (r.p.direction = $.trim(r.p.direction.toLowerCase())),
            -1 === $.inArray(r.p.direction, ['ltr', 'rtl']) &&
              (r.p.direction = 'ltr'),
            (s = r.p.direction),
            $(n).insertBefore(this),
            $(this).removeClass('scroll').appendTo(n);
          var l = $(
            "<div class='ui-jqgrid ui-widget ui-widget-content ui-corner-all'></div>"
          );
          $(l)
            .attr({ id: 'gbox_' + this.id, dir: s })
            .insertBefore(n),
            $(n)
              .attr('id', 'gview_' + this.id)
              .appendTo(l),
            $(
              "<div class='ui-widget-overlay jqgrid-overlay' id='lui_" +
                this.id +
                "'></div>"
            ).insertBefore(n),
            $(
              "<div class='loading ui-state-default ui-state-active' id='load_" +
                this.id +
                "'>" +
                this.p.loadtext +
                '</div>'
            ).insertBefore(n),
            $(this).attr({
              cellspacing: '0',
              cellpadding: '0',
              border: '0',
              role: 'presentation',
              'aria-multiselectable': !!this.p.multiselect,
              'aria-labelledby': 'gbox_' + this.id,
            });
          var p,
            c = ['shiftKey', 'altKey', 'ctrlKey'],
            u = function (e, t) {
              return (e = parseInt(e, 10)), isNaN(e) ? t || 0 : e;
            },
            h = function (e, t, i, o, s, n) {
              var d,
                l,
                p = r.p.colModel[e],
                c = p.align,
                u = 'style="',
                h = p.classes,
                g = p.name,
                f = [];
              return (
                c && (u += 'text-align:' + c + ';'),
                p.hidden === !0 && (u += 'display:none;'),
                0 === t
                  ? (u += 'width: ' + a.headers[e].width + 'px;')
                  : ($.isFunction(p.cellattr) ||
                      ('string' == typeof p.cellattr &&
                        null != $.jgrid.cellattr &&
                        $.isFunction($.jgrid.cellattr[p.cellattr]))) &&
                    ((d = $.isFunction(p.cellattr)
                      ? p.cellattr
                      : $.jgrid.cellattr[p.cellattr]),
                    (l = d.call(r, s, i, o, p, n)),
                    l &&
                      'string' == typeof l &&
                      ((l = l
                        .replace(/style/i, 'style')
                        .replace(/title/i, 'title')),
                      l.indexOf('title') > -1 && (p.title = !1),
                      l.indexOf('class') > -1 && (h = void 0),
                      (f = l.replace(/\-style/g, '-sti').split(/style/)),
                      2 === f.length
                        ? ((f[1] = $.trim(
                            f[1].replace(/\-sti/g, '-style').replace('=', '')
                          )),
                          (0 === f[1].indexOf("'") ||
                            0 === f[1].indexOf('"')) &&
                            (f[1] = f[1].substring(1)),
                          (u += f[1].replace(/'/gi, '"')))
                        : (u += '"'))),
                f.length || ((f[0] = ''), (u += '"')),
                (u +=
                  (void 0 !== h ? ' class="' + h + '"' : '') +
                  (p.title && i
                    ? ' title="' + $.jgrid.stripHtml(i) + '"'
                    : '')),
                (u += ' aria-describedby="' + r.p.id + '_' + g + '"'),
                u + f[0]
              );
            },
            g = function (e) {
              return null == e || '' === e
                ? '&#160;'
                : r.p.autoencode
                  ? $.jgrid.htmlEncode(e)
                  : String(e);
            },
            f = function (e, t, i, a, o) {
              var s,
                n = r.p.colModel[i];
              if (void 0 !== n.formatter) {
                e =
                  '' !== String(r.p.idPrefix)
                    ? $.jgrid.stripPref(r.p.idPrefix, e)
                    : e;
                var d = { rowId: e, colModel: n, gid: r.p.id, pos: i };
                s = $.isFunction(n.formatter)
                  ? n.formatter.call(r, t, d, a, o)
                  : $.fmatter
                    ? $.fn.fmatter.call(r, n.formatter, t, d, a, o)
                    : g(t);
              } else s = g(t);
              return s;
            },
            m = function (e, t, i, r, a, o) {
              var s, n;
              return (
                (s = f(e, t, i, a, 'add')),
                (n = h(i, r, s, a, e, o)),
                '<td role="gridcell" ' + n + '>' + s + '</td>'
              );
            },
            v = function (e, t, i, a) {
              var o =
                  '<input role="checkbox" type="checkbox" id="jqg_' +
                  r.p.id +
                  '_' +
                  e +
                  '" class="cbox" name="jqg_' +
                  r.p.id +
                  '_' +
                  e +
                  '"' +
                  (a ? 'checked="checked"' : '') +
                  '/>',
                s = h(t, i, '', null, e, !0);
              return '<td role="gridcell" ' + s + '>' + o + '</td>';
            },
            j = function (e, t, i, r) {
              var a = (parseInt(i, 10) - 1) * parseInt(r, 10) + 1 + t,
                o = h(e, t, a, null, t, !0);
              return (
                '<td role="gridcell" class="ui-state-default jqgrid-rownum" ' +
                o +
                '>' +
                a +
                '</td>'
              );
            },
            b = function (e) {
              var t,
                i,
                a = [],
                o = 0;
              for (i = 0; i < r.p.colModel.length; i++)
                (t = r.p.colModel[i]),
                  'cb' !== t.name &&
                    'subgrid' !== t.name &&
                    'rn' !== t.name &&
                    ((a[o] =
                      'local' === e
                        ? t.name
                        : 'xml' === e || 'xmlstring' === e
                          ? t.xmlmap || t.name
                          : t.jsonmap || t.name),
                    r.p.keyName !== !1 && t.key === !0 && (r.p.keyName = a[o]),
                    o++);
              return a;
            },
            w = function (e) {
              var t = r.p.remapColumns;
              return (
                (t && t.length) ||
                  (t = $.map(r.p.colModel, function (e, t) {
                    return t;
                  })),
                e &&
                  (t = $.map(t, function (t) {
                    return e > t ? null : t - e;
                  })),
                t
              );
            },
            y = function (e, t) {
              var i;
              this.p.deepempty
                ? $(this.rows).slice(1).remove()
                : ((i = this.rows.length > 0 ? this.rows[0] : null),
                  $(this.firstChild).empty().append(i)),
                e &&
                  this.p.scroll &&
                  ($(this.grid.bDiv.firstChild).css({ height: 'auto' }),
                  $(this.grid.bDiv.firstChild.firstChild).css({
                    height: 0,
                    display: 'none',
                  }),
                  0 !== this.grid.bDiv.scrollTop &&
                    (this.grid.bDiv.scrollTop = 0)),
                t === !0 &&
                  this.p.treeGrid &&
                  ((this.p.data = []), (this.p._index = {}));
            },
            x = function () {
              var e,
                t,
                i,
                a,
                o,
                s,
                n,
                d,
                l,
                p,
                c,
                u = r.p,
                h = u.data,
                g = h.length,
                f = u.localReader,
                m = u.colModel,
                v = f.cell,
                j =
                  (u.multiselect === !0 ? 1 : 0) +
                  (u.subGrid === !0 ? 1 : 0) +
                  (u.rownumbers === !0 ? 1 : 0),
                y = u.scroll ? $.jgrid.randId() : 1;
              if ('local' === u.datatype && f.repeatitems === !0)
                for (
                  l = w(j),
                    p = b('local'),
                    a =
                      u.keyIndex === !1
                        ? $.isFunction(f.id)
                          ? f.id.call(r, h)
                          : f.id
                        : u.keyIndex,
                    e = 0;
                  g > e;
                  e++
                ) {
                  for (
                    i = h[e],
                      o = $.jgrid.getAccessor(i, a),
                      void 0 === o &&
                        ('number' == typeof a &&
                          null != m[a + j] &&
                          (o = $.jgrid.getAccessor(i, m[a + j].name)),
                        void 0 === o &&
                          ((o = y + e),
                          v &&
                            ((s = $.jgrid.getAccessor(i, v) || i),
                            (o = null != s && void 0 !== s[a] ? s[a] : o),
                            (s = null)))),
                      d = {},
                      d[f.id] = o,
                      v && (i = $.jgrid.getAccessor(i, v) || i),
                      c = $.isArray(i) ? l : p,
                      t = 0;
                    t < c.length;
                    t++
                  )
                    (n = $.jgrid.getAccessor(i, c[t])), (d[m[t + j].name] = n);
                  $.extend(!0, h[e], d);
                }
            },
            q = function () {
              var e,
                t,
                i,
                a = r.p.data.length;
              for (
                e =
                  r.p.keyName === !1 || r.p.loadonce === !0
                    ? r.p.localReader.id
                    : r.p.keyName,
                  r.p._index = [],
                  t = 0;
                a > t;
                t++
              )
                (i = $.jgrid.getAccessor(r.p.data[t], e)),
                  void 0 === i && (i = String(t + 1)),
                  (r.p._index[i] = t);
            },
            D = function (e, t, i, a, o, s) {
              var n,
                d = '-1',
                l = '',
                p = t ? 'display:none;' : '',
                c =
                  'ui-widget-content jqgrow ui-row-' +
                  r.p.direction +
                  (i ? ' ' + i : '') +
                  (s ? ' ui-state-highlight' : ''),
                u = $(r).triggerHandler('jqGridRowAttr', [a, o, e]);
              if (
                ('object' != typeof u &&
                  (u = $.isFunction(r.p.rowattr)
                    ? r.p.rowattr.call(r, a, o, e)
                    : 'string' == typeof r.p.rowattr &&
                        null != $.jgrid.rowattr &&
                        $.isFunction($.jgrid.rowattr[r.p.rowattr])
                      ? $.jgrid.rowattr[r.p.rowattr].call(r, a, o, e)
                      : {}),
                !$.isEmptyObject(u))
              ) {
                u.hasOwnProperty('id') && ((e = u.id), delete u.id),
                  u.hasOwnProperty('tabindex') &&
                    ((d = u.tabindex), delete u.tabindex),
                  u.hasOwnProperty('style') && ((p += u.style), delete u.style),
                  u.hasOwnProperty('class') &&
                    ((c += ' ' + u['class']), delete u['class']);
                try {
                  delete u.role;
                } catch (h) {}
                for (n in u) u.hasOwnProperty(n) && (l += ' ' + n + '=' + u[n]);
              }
              return (
                '<tr role="row" id="' +
                e +
                '" tabindex="' +
                d +
                '" class="' +
                c +
                '"' +
                ('' === p ? '' : ' style="' + p + '"') +
                l +
                '>'
              );
            },
            _ = function (e, t, i, a, o) {
              var s = new Date(),
                n =
                  ('local' !== r.p.datatype && r.p.loadonce) ||
                  'xmlstring' === r.p.datatype,
                d = '_id_',
                l = r.p.xmlReader,
                p = 'local' === r.p.datatype ? 'local' : 'xml';
              if (
                (n &&
                  ((r.p.data = []),
                  (r.p._index = {}),
                  (r.p.localReader.id = d)),
                (r.p.reccount = 0),
                $.isXMLDoc(e))
              ) {
                -1 !== r.p.treeANode || r.p.scroll
                  ? (i = i > 1 ? i : 1)
                  : (y.call(r, !1, !0), (i = 1));
                var c,
                  h,
                  g,
                  f,
                  x,
                  q,
                  _,
                  C,
                  G,
                  I,
                  F = $(r),
                  S = 0,
                  k = r.p.multiselect === !0 ? 1 : 0,
                  R = 0,
                  M = r.p.rownumbers === !0 ? 1 : 0,
                  N = [],
                  O = {},
                  A = [],
                  P = r.p.altRows === !0 ? r.p.altclass : '';
                r.p.subGrid === !0 &&
                  ((R = 1), (f = $.jgrid.getMethod('addSubGridCell'))),
                  l.repeatitems || (N = b(p)),
                  (x =
                    r.p.keyName === !1
                      ? $.isFunction(l.id)
                        ? l.id.call(r, e)
                        : l.id
                      : r.p.keyName),
                  (q =
                    -1 === String(x).indexOf('[')
                      ? N.length
                        ? function (e, t) {
                            return $(x, e).text() || t;
                          }
                        : function (e, t) {
                            return $(l.cell, e).eq(x).text() || t;
                          }
                      : function (e, t) {
                          return e.getAttribute(x.replace(/[\[\]]/g, '')) || t;
                        }),
                  (r.p.userData = {}),
                  (r.p.page = u($.jgrid.getXmlData(e, l.page), r.p.page)),
                  (r.p.lastpage = u($.jgrid.getXmlData(e, l.total), 1)),
                  (r.p.records = u($.jgrid.getXmlData(e, l.records))),
                  $.isFunction(l.userdata)
                    ? (r.p.userData = l.userdata.call(r, e) || {})
                    : $.jgrid.getXmlData(e, l.userdata, !0).each(function () {
                        r.p.userData[this.getAttribute('name')] =
                          $(this).text();
                      });
                var E = $.jgrid.getXmlData(e, l.root, !0);
                (E = $.jgrid.getXmlData(E, l.row, !0)), E || (E = []);
                var T,
                  z = E.length,
                  H = 0,
                  B = [],
                  L = parseInt(r.p.rowNum, 10),
                  V = r.p.scroll ? $.jgrid.randId() : 1;
                if ((z > 0 && r.p.page <= 0 && (r.p.page = 1), E && z)) {
                  o && (L *= o + 1);
                  var Q,
                    W = $.isFunction(r.p.afterInsertRow),
                    U = !1;
                  for (
                    r.p.grouping &&
                    ((U = r.p.groupingView.groupCollapse === !0),
                    (Q = $.jgrid.getMethod('groupingPrepare')));
                    z > H;

                  ) {
                    (C = E[H]),
                      (G = q(C, V + H)),
                      (G = r.p.idPrefix + G),
                      (T = 0 === i ? 0 : i + 1),
                      (I = (T + H) % 2 === 1 ? P : '');
                    var X = A.length;
                    if (
                      (A.push(''),
                      M && A.push(j(0, H, r.p.page, r.p.rowNum)),
                      k && A.push(v(G, M, H, !1)),
                      R && A.push(f.call(F, k + M, H + i)),
                      l.repeatitems)
                    ) {
                      _ || (_ = w(k + R + M));
                      var Y = $.jgrid.getXmlData(C, l.cell, !0);
                      $.each(_, function (e) {
                        var t = Y[this];
                        return t
                          ? ((g = t.textContent || t.text),
                            (O[r.p.colModel[e + k + R + M].name] = g),
                            void A.push(m(G, g, e + k + R + M, H + i, C, O)))
                          : !1;
                      });
                    } else
                      for (c = 0; c < N.length; c++)
                        (g = $.jgrid.getXmlData(C, N[c])),
                          (O[r.p.colModel[c + k + R + M].name] = g),
                          A.push(m(G, g, c + k + R + M, H + i, C, O));
                    if (
                      ((A[X] = D(G, U, I, O, C, !1)),
                      A.push('</tr>'),
                      r.p.grouping &&
                        (B.push(A),
                        r.p.groupingView._locgr || Q.call(F, O, H),
                        (A = [])),
                      (n || r.p.treeGrid === !0) &&
                        ((O[d] = $.jgrid.stripPref(r.p.idPrefix, G)),
                        r.p.data.push(O),
                        (r.p._index[O[d]] = r.p.data.length - 1)),
                      r.p.gridview === !1 &&
                        ($('tbody:first', t).append(A.join('')),
                        F.triggerHandler('jqGridAfterInsertRow', [G, O, C]),
                        W && r.p.afterInsertRow.call(r, G, O, C),
                        (A = [])),
                      (O = {}),
                      S++,
                      H++,
                      S === L)
                    )
                      break;
                  }
                }
                if (
                  (r.p.gridview === !0 &&
                    ((h = r.p.treeANode > -1 ? r.p.treeANode : 0),
                    r.p.grouping
                      ? n ||
                        (F.jqGrid(
                          'groupingRender',
                          B,
                          r.p.colModel.length,
                          r.p.page,
                          L
                        ),
                        (B = null))
                      : r.p.treeGrid === !0 && h > 0
                        ? $(r.rows[h]).after(A.join(''))
                        : ((r.firstElementChild.innerHTML += A.join('')),
                          (r.grid.cols = r.rows[0].cells))),
                  r.p.subGrid === !0)
                )
                  try {
                    F.jqGrid('addSubGrid', k + M);
                  } catch (J) {}
                if (
                  ((r.p.totaltime = new Date() - s),
                  S > 0 && 0 === r.p.records && (r.p.records = z),
                  (A = null),
                  r.p.treeGrid === !0)
                )
                  try {
                    F.jqGrid('setTreeNode', h + 1, S + h + 1);
                  } catch (K) {}
                if (
                  ((r.p.reccount = S),
                  (r.p.treeANode = -1),
                  r.p.userDataOnFooter &&
                    F.jqGrid('footerData', 'set', r.p.userData, !0),
                  n && ((r.p.records = z), (r.p.lastpage = Math.ceil(z / L))),
                  a || r.updatepager(!1, !0),
                  n)
                ) {
                  for (; z > S; ) {
                    if (
                      ((C = E[S]),
                      (G = q(C, S + V)),
                      (G = r.p.idPrefix + G),
                      l.repeatitems)
                    ) {
                      _ || (_ = w(k + R + M));
                      var Z = $.jgrid.getXmlData(C, l.cell, !0);
                      $.each(_, function (e) {
                        var t = Z[this];
                        return t
                          ? ((g = t.textContent || t.text),
                            void (O[r.p.colModel[e + k + R + M].name] = g))
                          : !1;
                      });
                    } else
                      for (c = 0; c < N.length; c++)
                        (g = $.jgrid.getXmlData(C, N[c])),
                          (O[r.p.colModel[c + k + R + M].name] = g);
                    (O[d] = $.jgrid.stripPref(r.p.idPrefix, G)),
                      r.p.grouping && Q.call(F, O, S),
                      r.p.data.push(O),
                      (r.p._index[O[d]] = r.p.data.length - 1),
                      (O = {}),
                      S++;
                  }
                  r.p.grouping &&
                    ((r.p.groupingView._locgr = !0),
                    F.jqGrid(
                      'groupingRender',
                      B,
                      r.p.colModel.length,
                      r.p.page,
                      L
                    ),
                    (B = null));
                }
              }
            },
            C = function (e, t, i, a, o) {
              var s = new Date();
              if (e) {
                -1 !== r.p.treeANode || r.p.scroll
                  ? (i = i > 1 ? i : 1)
                  : (y.call(r, !1, !0), (i = 1));
                var n,
                  d,
                  l = '_id_',
                  p =
                    ('local' !== r.p.datatype && r.p.loadonce) ||
                    'jsonstring' === r.p.datatype;
                p &&
                  ((r.p.data = []),
                  (r.p._index = {}),
                  (r.p.localReader.id = l)),
                  (r.p.reccount = 0),
                  'local' === r.p.datatype
                    ? ((n = r.p.localReader), (d = 'local'))
                    : ((n = r.p.jsonReader), (d = 'json'));
                var c,
                  h,
                  g,
                  f,
                  x,
                  q,
                  _,
                  C,
                  G,
                  I,
                  F,
                  S,
                  k = $(r),
                  R = 0,
                  M = [],
                  N = r.p.multiselect ? 1 : 0,
                  O = r.p.subGrid === !0 ? 1 : 0,
                  A = r.p.rownumbers === !0 ? 1 : 0,
                  P = w(N + O + A),
                  E = b(d),
                  T = {},
                  z = [],
                  H = r.p.altRows === !0 ? r.p.altclass : '';
                (r.p.page = u($.jgrid.getAccessor(e, n.page), r.p.page)),
                  (r.p.lastpage = u($.jgrid.getAccessor(e, n.total), 1)),
                  (r.p.records = u($.jgrid.getAccessor(e, n.records))),
                  (r.p.userData = $.jgrid.getAccessor(e, n.userdata) || {}),
                  O && (x = $.jgrid.getMethod('addSubGridCell')),
                  (G =
                    r.p.keyName === !1
                      ? $.isFunction(n.id)
                        ? n.id.call(r, e)
                        : n.id
                      : r.p.keyName),
                  (C = $.jgrid.getAccessor(e, n.root)),
                  null == C && $.isArray(e) && (C = e),
                  C || (C = []),
                  (_ = C.length),
                  (h = 0),
                  _ > 0 && r.p.page <= 0 && (r.p.page = 1);
                var B,
                  L,
                  V = parseInt(r.p.rowNum, 10),
                  Q = r.p.scroll ? $.jgrid.randId() : 1,
                  W = !1;
                o && (V *= o + 1),
                  'local' !== r.p.datatype || r.p.deselectAfterSort || (W = !0);
                var U,
                  X = $.isFunction(r.p.afterInsertRow),
                  Y = [],
                  J = !1;
                for (
                  r.p.grouping &&
                  ((J = r.p.groupingView.groupCollapse === !0),
                  (U = $.jgrid.getMethod('groupingPrepare')));
                  _ > h;

                ) {
                  if (
                    ((f = C[h]),
                    (F = $.jgrid.getAccessor(f, G)),
                    void 0 === F &&
                      ('number' == typeof G &&
                        null != r.p.colModel[G + N + O + A] &&
                        (F = $.jgrid.getAccessor(
                          f,
                          r.p.colModel[G + N + O + A].name
                        )),
                      void 0 === F && ((F = Q + h), 0 === M.length && n.cell)))
                  ) {
                    var K = $.jgrid.getAccessor(f, n.cell) || f;
                    (F = null != K && void 0 !== K[G] ? K[G] : F), (K = null);
                  }
                  (F = r.p.idPrefix + F),
                    (B = 1 === i ? 0 : i),
                    (S = (B + h) % 2 === 1 ? H : ''),
                    W &&
                      (L = r.p.multiselect
                        ? -1 !== $.inArray(F, r.p.selarrrow)
                        : F === r.p.selrow);
                  var Z = z.length;
                  for (
                    z.push(''),
                      A && z.push(j(0, h, r.p.page, r.p.rowNum)),
                      N && z.push(v(F, A, h, L)),
                      O && z.push(x.call(k, N + A, h + i)),
                      q = E,
                      n.repeatitems &&
                        (n.cell && (f = $.jgrid.getAccessor(f, n.cell) || f),
                        $.isArray(f) && (q = P)),
                      g = 0;
                    g < q.length;
                    g++
                  )
                    (c = $.jgrid.getAccessor(f, q[g])),
                      (T[r.p.colModel[g + N + O + A].name] = c),
                      z.push(m(F, c, g + N + O + A, h + i, f, T));
                  if (
                    ((z[Z] = D(F, J, S, T, f, L)),
                    z.push('</tr>'),
                    r.p.grouping &&
                      (Y.push(z),
                      r.p.groupingView._locgr || U.call(k, T, h),
                      (z = [])),
                    (p || r.p.treeGrid === !0) &&
                      ((T[l] = $.jgrid.stripPref(r.p.idPrefix, F)),
                      r.p.data.push(T),
                      (r.p._index[T[l]] = r.p.data.length - 1)),
                    r.p.gridview === !1 &&
                      ($('#' + $.jgrid.jqID(r.p.id) + ' tbody:first').append(
                        z.join('')
                      ),
                      k.triggerHandler('jqGridAfterInsertRow', [F, T, f]),
                      X && r.p.afterInsertRow.call(r, F, T, f),
                      (z = [])),
                    (T = {}),
                    R++,
                    h++,
                    R === V)
                  )
                    break;
                }
                if (
                  (r.p.gridview === !0 &&
                    ((I = r.p.treeANode > -1 ? r.p.treeANode : 0),
                    r.p.grouping
                      ? p ||
                        (k.jqGrid(
                          'groupingRender',
                          Y,
                          r.p.colModel.length,
                          r.p.page,
                          V
                        ),
                        (Y = null))
                      : r.p.treeGrid === !0 && I > 0
                        ? $(r.rows[I]).after(z.join(''))
                        : ((r.firstElementChild.innerHTML += z.join('')),
                          (r.grid.cols = r.rows[0].cells))),
                  r.p.subGrid === !0)
                )
                  try {
                    k.jqGrid('addSubGrid', N + A);
                  } catch (et) {}
                if (
                  ((r.p.totaltime = new Date() - s),
                  R > 0 && 0 === r.p.records && (r.p.records = _),
                  (z = null),
                  r.p.treeGrid === !0)
                )
                  try {
                    k.jqGrid('setTreeNode', I + 1, R + I + 1);
                  } catch (tt) {}
                if (
                  ((r.p.reccount = R),
                  (r.p.treeANode = -1),
                  r.p.userDataOnFooter &&
                    k.jqGrid('footerData', 'set', r.p.userData, !0),
                  p && ((r.p.records = _), (r.p.lastpage = Math.ceil(_ / V))),
                  a || r.updatepager(!1, !0),
                  p)
                ) {
                  for (; _ > R && C[R]; ) {
                    if (
                      ((f = C[R]),
                      (F = $.jgrid.getAccessor(f, G)),
                      void 0 === F &&
                        ('number' == typeof G &&
                          null != r.p.colModel[G + N + O + A] &&
                          (F = $.jgrid.getAccessor(
                            f,
                            r.p.colModel[G + N + O + A].name
                          )),
                        void 0 === F &&
                          ((F = Q + R), 0 === M.length && n.cell)))
                    ) {
                      var it = $.jgrid.getAccessor(f, n.cell) || f;
                      (F = null != it && void 0 !== it[G] ? it[G] : F),
                        (it = null);
                    }
                    if (f) {
                      for (
                        F = r.p.idPrefix + F,
                          q = E,
                          n.repeatitems &&
                            (n.cell &&
                              (f = $.jgrid.getAccessor(f, n.cell) || f),
                            $.isArray(f) && (q = P)),
                          g = 0;
                        g < q.length;
                        g++
                      )
                        T[r.p.colModel[g + N + O + A].name] =
                          $.jgrid.getAccessor(f, q[g]);
                      (T[l] = $.jgrid.stripPref(r.p.idPrefix, F)),
                        r.p.grouping && U.call(k, T, R),
                        r.p.data.push(T),
                        (r.p._index[T[l]] = r.p.data.length - 1),
                        (T = {});
                    }
                    R++;
                  }
                  r.p.grouping &&
                    ((r.p.groupingView._locgr = !0),
                    k.jqGrid(
                      'groupingRender',
                      Y,
                      r.p.colModel.length,
                      r.p.page,
                      V
                    ),
                    (Y = null));
                }
              }
            },
            G = function () {
              function e(t) {
                var i,
                  r,
                  a,
                  o,
                  s,
                  n = 0;
                if (null != t.groups) {
                  for (
                    r =
                      t.groups.length &&
                      'OR' === t.groupOp.toString().toUpperCase(),
                      r && f.orBegin(),
                      i = 0;
                    i < t.groups.length;
                    i++
                  ) {
                    n > 0 && r && f.or();
                    try {
                      e(t.groups[i]);
                    } catch (l) {
                      alert(l);
                    }
                    n++;
                  }
                  r && f.orEnd();
                }
                if (null != t.rules)
                  try {
                    for (
                      a =
                        t.rules.length &&
                        'OR' === t.groupOp.toString().toUpperCase(),
                        a && f.orBegin(),
                        i = 0;
                      i < t.rules.length;
                      i++
                    )
                      (s = t.rules[i]),
                        (o = t.groupOp.toString().toUpperCase()),
                        g[s.op] &&
                          s.field &&
                          (n > 0 && o && 'OR' === o && (f = f.or()),
                          (f = g[s.op](f, o)(s.field, s.data, d[s.field]))),
                        n++;
                    a && f.orEnd();
                  } catch (p) {
                    alert(p);
                  }
              }
              var t,
                i,
                a,
                o = r.p.multiSort ? [] : '',
                s = [],
                n = !1,
                d = {},
                l = [],
                p = [];
              if ($.isArray(r.p.data)) {
                var c,
                  u,
                  h = r.p.grouping ? r.p.groupingView : !1;
                if (
                  ($.each(r.p.colModel, function () {
                    if (
                      ((i = this.sorttype || 'text'),
                      'date' === i || 'datetime' === i
                        ? (this.formatter &&
                          'string' == typeof this.formatter &&
                          'date' === this.formatter
                            ? ((t =
                                this.formatoptions &&
                                this.formatoptions.srcformat
                                  ? this.formatoptions.srcformat
                                  : $.jgrid.formatter.date.srcformat),
                              (a =
                                this.formatoptions &&
                                this.formatoptions.newformat
                                  ? this.formatoptions.newformat
                                  : $.jgrid.formatter.date.newformat))
                            : (t = a = this.datefmt || 'Y-m-d'),
                          (d[this.name] = {
                            stype: i,
                            srcfmt: t,
                            newfmt: a,
                            sfunc: this.sortfunc || null,
                          }))
                        : (d[this.name] = {
                            stype: i,
                            srcfmt: '',
                            newfmt: '',
                            sfunc: this.sortfunc || null,
                          }),
                      r.p.grouping)
                    )
                      for (u = 0, c = h.groupField.length; c > u; u++)
                        if (this.name === h.groupField[u]) {
                          var e = this.name;
                          this.index && (e = this.index),
                            (l[u] = d[e]),
                            (p[u] = e);
                        }
                    if (r.p.multiSort) {
                      if (this.lso) {
                        o.push(this.name);
                        var g = this.lso.split('-');
                        s.push(g[g.length - 1]);
                      }
                    } else
                      n ||
                        (this.index !== r.p.sortname &&
                          this.name !== r.p.sortname) ||
                        ((o = this.name), (n = !0));
                  }),
                  r.p.treeGrid)
                )
                  return void $(r).jqGrid(
                    'SortTree',
                    o,
                    r.p.sortorder,
                    d[o].stype || 'text',
                    d[o].srcfmt || ''
                  );
                var g = {
                    eq: function (e) {
                      return e.equals;
                    },
                    ne: function (e) {
                      return e.notEquals;
                    },
                    lt: function (e) {
                      return e.less;
                    },
                    le: function (e) {
                      return e.lessOrEquals;
                    },
                    gt: function (e) {
                      return e.greater;
                    },
                    ge: function (e) {
                      return e.greaterOrEquals;
                    },
                    cn: function (e) {
                      return e.contains;
                    },
                    nc: function (e, t) {
                      return 'OR' === t
                        ? e.orNot().contains
                        : e.andNot().contains;
                    },
                    bw: function (e) {
                      return e.startsWith;
                    },
                    bn: function (e, t) {
                      return 'OR' === t
                        ? e.orNot().startsWith
                        : e.andNot().startsWith;
                    },
                    en: function (e, t) {
                      return 'OR' === t
                        ? e.orNot().endsWith
                        : e.andNot().endsWith;
                    },
                    ew: function (e) {
                      return e.endsWith;
                    },
                    ni: function (e, t) {
                      return 'OR' === t ? e.orNot().equals : e.andNot().equals;
                    },
                    in: function (e) {
                      return e.equals;
                    },
                    nu: function (e) {
                      return e.isNull;
                    },
                    nn: function (e, t) {
                      return 'OR' === t ? e.orNot().isNull : e.andNot().isNull;
                    },
                  },
                  f = $.jgrid.from(r.p.data);
                if (
                  (r.p.ignoreCase && (f = f.ignoreCase()), r.p.search === !0)
                ) {
                  var m = r.p.postData.filters;
                  if (m) 'string' == typeof m && (m = $.jgrid.parse(m)), e(m);
                  else
                    try {
                      f = g[r.p.postData.searchOper](f)(
                        r.p.postData.searchField,
                        r.p.postData.searchString,
                        d[r.p.postData.searchField]
                      );
                    } catch (v) {}
                }
                if (r.p.grouping)
                  for (u = 0; c > u; u++)
                    f.orderBy(p[u], h.groupOrder[u], l[u].stype, l[u].srcfmt);
                r.p.multiSort
                  ? $.each(o, function (e) {
                      f.orderBy(
                        this,
                        s[e],
                        d[this].stype,
                        d[this].srcfmt,
                        d[this].sfunc
                      );
                    })
                  : o &&
                    r.p.sortorder &&
                    n &&
                    ('DESC' === r.p.sortorder.toUpperCase()
                      ? f.orderBy(
                          r.p.sortname,
                          'd',
                          d[o].stype,
                          d[o].srcfmt,
                          d[o].sfunc
                        )
                      : f.orderBy(
                          r.p.sortname,
                          'a',
                          d[o].stype,
                          d[o].srcfmt,
                          d[o].sfunc
                        ));
                var j = f.select(),
                  b = parseInt(r.p.rowNum, 10),
                  w = j.length,
                  y = parseInt(r.p.page, 10),
                  x = Math.ceil(w / b),
                  q = {};
                if (
                  (r.p.search || r.p.resetsearch) &&
                  r.p.grouping &&
                  r.p.groupingView._locgr
                ) {
                  r.p.groupingView.groups = [];
                  var D,
                    _,
                    C,
                    G = $.jgrid.getMethod('groupingPrepare');
                  if (r.p.footerrow && r.p.userDataOnFooter) {
                    for (_ in r.p.userData)
                      r.p.userData.hasOwnProperty(_) && (r.p.userData[_] = 0);
                    C = !0;
                  }
                  for (D = 0; w > D; D++) {
                    if (C)
                      for (_ in r.p.userData)
                        r.p.userData[_] += parseFloat(j[D][_] || 0);
                    G.call($(r), j[D], D, b);
                  }
                }
                return (
                  (j = j.slice((y - 1) * b, y * b)),
                  (f = null),
                  (d = null),
                  (q[r.p.localReader.total] = x),
                  (q[r.p.localReader.page] = y),
                  (q[r.p.localReader.records] = w),
                  (q[r.p.localReader.root] = j),
                  (q[r.p.localReader.userdata] = r.p.userData),
                  (j = null),
                  q
                );
              }
            },
            I = function (e, t) {
              var i,
                a,
                o,
                s,
                n,
                d,
                l,
                p,
                c = '',
                h = r.p.pager ? '_' + $.jgrid.jqID(r.p.pager.substr(1)) : '',
                g = r.p.toppager ? '_' + r.p.toppager.substr(1) : '';
              if (
                ((o = parseInt(r.p.page, 10) - 1),
                0 > o && (o = 0),
                (o *= parseInt(r.p.rowNum, 10)),
                (n = o + r.p.reccount),
                r.p.scroll)
              ) {
                var f = $('tbody:first > tr:gt(0)', r.grid.bDiv);
                (o = n - f.length), (r.p.reccount = f.length);
                var m = f.outerHeight() || r.grid.prevRowHeight;
                if (m) {
                  var v = o * m,
                    j = parseInt(r.p.records, 10) * m;
                  $('>div:first', r.grid.bDiv)
                    .css({ height: j })
                    .children('div:first')
                    .css({ height: v, display: v ? '' : 'none' }),
                    0 == r.grid.bDiv.scrollTop &&
                      r.p.page > 1 &&
                      (r.grid.bDiv.scrollTop = r.p.rowNum * (r.p.page - 1) * m);
                }
                r.grid.bDiv.scrollLeft = r.grid.hDiv.scrollLeft;
              }
              (c = r.p.pager || ''),
                (c += r.p.toppager
                  ? c
                    ? ',' + r.p.toppager
                    : r.p.toppager
                  : ''),
                c &&
                  ((l = $.jgrid.formatter.integer || {}),
                  (i = u(r.p.page)),
                  (a = u(r.p.lastpage)),
                  $('.selbox', c)[this.p.useProp ? 'prop' : 'attr'](
                    'disabled',
                    !1
                  ),
                  r.p.pginput === !0 &&
                    ($('.ui-pg-input', c).val(r.p.page),
                    (p = r.p.toppager
                      ? '#sp_1' + h + ',#sp_1' + g
                      : '#sp_1' + h),
                    $(p).html(
                      $.fmatter
                        ? $.fmatter.util.NumberFormat(r.p.lastpage, l)
                        : r.p.lastpage
                    )),
                  r.p.viewrecords &&
                    (0 === r.p.reccount
                      ? $('.ui-paging-info', c).html(r.p.emptyrecords)
                      : ((s = o + 1),
                        (d = r.p.records),
                        $.fmatter &&
                          ((s = $.fmatter.util.NumberFormat(s, l)),
                          (n = $.fmatter.util.NumberFormat(n, l)),
                          (d = $.fmatter.util.NumberFormat(d, l))),
                        $('.ui-paging-info', c).html(
                          $.jgrid.format(r.p.recordtext, s, n, d)
                        ))),
                  r.p.pgbuttons === !0 &&
                    (0 >= i && (i = a = 0),
                    1 === i || 0 === i
                      ? ($('#first' + h + ', #prev' + h)
                          .addClass('ui-state-disabled')
                          .removeClass('ui-state-hover'),
                        r.p.toppager &&
                          $('#first_t' + g + ', #prev_t' + g)
                            .addClass('ui-state-disabled')
                            .removeClass('ui-state-hover'))
                      : ($('#first' + h + ', #prev' + h).removeClass(
                          'ui-state-disabled'
                        ),
                        r.p.toppager &&
                          $('#first_t' + g + ', #prev_t' + g).removeClass(
                            'ui-state-disabled'
                          )),
                    i === a || 0 === i
                      ? ($('#next' + h + ', #last' + h)
                          .addClass('ui-state-disabled')
                          .removeClass('ui-state-hover'),
                        r.p.toppager &&
                          $('#next_t' + g + ', #last_t' + g)
                            .addClass('ui-state-disabled')
                            .removeClass('ui-state-hover'))
                      : ($('#next' + h + ', #last' + h).removeClass(
                          'ui-state-disabled'
                        ),
                        r.p.toppager &&
                          $('#next_t' + g + ', #last_t' + g).removeClass(
                            'ui-state-disabled'
                          )))),
                e === !0 &&
                  r.p.rownumbers === !0 &&
                  $('>td.jqgrid-rownum', r.rows).each(function (e) {
                    $(this).html(o + 1 + e);
                  }),
                t && r.p.jqgdnd && $(r).jqGrid('gridDnD', 'updateDnD'),
                $(r).triggerHandler('jqGridGridComplete'),
                $.isFunction(r.p.gridComplete) && r.p.gridComplete.call(r),
                $(r).triggerHandler('jqGridAfterGridComplete');
            },
            F = function () {
              (r.grid.hDiv.loading = !0),
                r.p.hiddengrid ||
                  $(r).jqGrid('progressBar', {
                    method: 'show',
                    loadtype: r.p.loadui,
                    htmlcontent: r.p.loadtext,
                  });
            },
            S = function () {
              (r.grid.hDiv.loading = !1),
                $(r).jqGrid('progressBar', {
                  method: 'hide',
                  loadtype: r.p.loadui,
                });
            },
            k = function (e) {
              if (!r.grid.hDiv.loading) {
                var t,
                  i,
                  a = r.p.scroll && e === !1,
                  o = {},
                  s = r.p.prmNames;
                r.p.page <= 0 && (r.p.page = Math.min(1, r.p.lastpage)),
                  null !== s.search && (o[s.search] = r.p.search),
                  null !== s.nd && (o[s.nd] = new Date().getTime()),
                  null !== s.rows && (o[s.rows] = r.p.rowNum),
                  null !== s.page && (o[s.page] = r.p.page),
                  null !== s.sort && (o[s.sort] = r.p.sortname),
                  null !== s.order && (o[s.order] = r.p.sortorder),
                  null !== r.p.rowTotal &&
                    null !== s.totalrows &&
                    (o[s.totalrows] = r.p.rowTotal);
                var n = $.isFunction(r.p.loadComplete),
                  d = n ? r.p.loadComplete : null,
                  l = 0;
                if (
                  ((e = e || 1),
                  e > 1
                    ? null !== s.npage
                      ? ((o[s.npage] = e), (l = e - 1), (e = 1))
                      : (d = function (t) {
                          r.p.page++,
                            (r.grid.hDiv.loading = !1),
                            n && r.p.loadComplete.call(r, t),
                            k(e - 1);
                        })
                    : null !== s.npage && delete r.p.postData[s.npage],
                  r.p.grouping)
                ) {
                  $(r).jqGrid('groupingSetup');
                  var p,
                    c = r.p.groupingView,
                    u = '';
                  for (p = 0; p < c.groupField.length; p++) {
                    var h = c.groupField[p];
                    $.each(r.p.colModel, function (e, t) {
                      t.name === h && t.index && (h = t.index);
                    }),
                      (u += h + ' ' + c.groupOrder[p] + ', ');
                  }
                  o[s.sort] = u + o[s.sort];
                }
                $.extend(r.p.postData, o);
                var g = r.p.scroll ? r.rows.length - 1 : 1,
                  f = $(r).triggerHandler('jqGridBeforeRequest');
                if (f === !1 || 'stop' === f) return;
                if ($.isFunction(r.p.datatype))
                  return void r.p.datatype.call(
                    r,
                    r.p.postData,
                    'load_' + r.p.id,
                    g,
                    e,
                    l
                  );
                if (
                  $.isFunction(r.p.beforeRequest) &&
                  ((f = r.p.beforeRequest.call(r)),
                  void 0 === f && (f = !0),
                  f === !1)
                )
                  return;
                switch ((t = r.p.datatype.toLowerCase())) {
                  case 'json':
                  case 'jsonp':
                  case 'xml':
                  case 'script':
                    $.ajax(
                      $.extend(
                        {
                          url: r.p.url,
                          type: r.p.mtype,
                          dataType: t,
                          data: $.isFunction(r.p.serializeGridData)
                            ? r.p.serializeGridData.call(r, r.p.postData)
                            : r.p.postData,
                          success: function (i, o, s) {
                            return $.isFunction(r.p.beforeProcessing) &&
                              r.p.beforeProcessing.call(r, i, o, s) === !1
                              ? void S()
                              : ('xml' === t
                                  ? _(i, r.grid.bDiv, g, e > 1, l)
                                  : C(i, r.grid.bDiv, g, e > 1, l),
                                $(r).triggerHandler('jqGridLoadComplete', [i]),
                                d && d.call(r, i),
                                $(r).triggerHandler('jqGridAfterLoadComplete', [
                                  i,
                                ]),
                                a && r.grid.populateVisible(),
                                (r.p.loadonce || r.p.treeGrid) &&
                                  (r.p.datatype = 'local'),
                                (i = null),
                                void (1 === e && S()));
                          },
                          error: function (t, i, a) {
                            $.isFunction(r.p.loadError) &&
                              r.p.loadError.call(r, t, i, a),
                              1 === e && S(),
                              (t = null);
                          },
                          beforeSend: function (e, t) {
                            var i = !0;
                            return (
                              $.isFunction(r.p.loadBeforeSend) &&
                                (i = r.p.loadBeforeSend.call(r, e, t)),
                              void 0 === i && (i = !0),
                              i === !1 ? !1 : void F()
                            );
                          },
                        },
                        $.jgrid.ajaxOptions,
                        r.p.ajaxGridOptions
                      )
                    );
                    break;
                  case 'xmlstring':
                    F(),
                      (i =
                        'string' != typeof r.p.datastr
                          ? r.p.datastr
                          : $.parseXML(r.p.datastr)),
                      _(i, r.grid.bDiv),
                      $(r).triggerHandler('jqGridLoadComplete', [i]),
                      n && r.p.loadComplete.call(r, i),
                      $(r).triggerHandler('jqGridAfterLoadComplete', [i]),
                      (r.p.datatype = 'local'),
                      (r.p.datastr = null),
                      S();
                    break;
                  case 'jsonstring':
                    F(),
                      (i =
                        'string' == typeof r.p.datastr
                          ? $.jgrid.parse(r.p.datastr)
                          : r.p.datastr),
                      C(i, r.grid.bDiv),
                      $(r).triggerHandler('jqGridLoadComplete', [i]),
                      n && r.p.loadComplete.call(r, i),
                      $(r).triggerHandler('jqGridAfterLoadComplete', [i]),
                      (r.p.datatype = 'local'),
                      (r.p.datastr = null),
                      S();
                    break;
                  case 'local':
                  case 'clientside':
                    F(), (r.p.datatype = 'local');
                    var m = G();
                    C(m, r.grid.bDiv, g, e > 1, l),
                      $(r).triggerHandler('jqGridLoadComplete', [m]),
                      d && d.call(r, m),
                      $(r).triggerHandler('jqGridAfterLoadComplete', [m]),
                      a && r.grid.populateVisible(),
                      S();
                }
              }
            },
            R = function (e) {
              $('#cb_' + $.jgrid.jqID(r.p.id), r.grid.hDiv)[
                r.p.useProp ? 'prop' : 'attr'
              ]('checked', e);
              var t = r.p.frozenColumns ? r.p.id + '_frozen' : '';
              t &&
                $('#cb_' + $.jgrid.jqID(r.p.id), r.grid.fhDiv)[
                  r.p.useProp ? 'prop' : 'attr'
                ]('checked', e);
            },
            M = function (e, t) {
              var i,
                a,
                o,
                n,
                d,
                l,
                p,
                c =
                  "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>",
                h = '',
                g =
                  "<table cellspacing='0' cellpadding='0' border='0' style='table-layout:auto;' class='ui-pg-table'><tbody><tr>",
                f = '',
                m = function (e) {
                  var t;
                  return (
                    $.isFunction(r.p.onPaging) && (t = r.p.onPaging.call(r, e)),
                    'stop' === t
                      ? !1
                      : ((r.p.selrow = null),
                        r.p.multiselect && ((r.p.selarrrow = []), R(!1)),
                        (r.p.savedRow = []),
                        !0)
                  );
                };
              if (
                ((e = e.substr(1)),
                (t += '_' + e),
                (i = 'pg_' + e),
                (a = e + '_left'),
                (o = e + '_center'),
                (n = e + '_right'),
                $('#' + $.jgrid.jqID(e))
                  .append(
                    "<div id='" +
                      i +
                      "' class='ui-pager-control' role='group'><table cellspacing='0' cellpadding='0' border='0' class='ui-pg-table' style='width:100%;table-layout:fixed;height:100%;' role='row'><tbody><tr><td id='" +
                      a +
                      "' align='left'></td><td id='" +
                      o +
                      "' align='center' style='white-space:pre;'></td><td id='" +
                      n +
                      "' align='right'></td></tr></tbody></table></div>"
                  )
                  .attr('dir', 'ltr'),
                r.p.rowList.length > 0)
              ) {
                (f = "<td dir='" + s + "'>"),
                  (f +=
                    "<select class='ui-pg-selbox' role='listbox' " +
                    (r.p.pgrecs ? "title='" + r.p.pgrecs + "'" : '') +
                    '>');
                var v;
                for (p = 0; p < r.p.rowList.length; p++)
                  (v = r.p.rowList[p].toString().split(':')),
                    1 === v.length && (v[1] = v[0]),
                    (f +=
                      '<option role="option" value="' +
                      v[0] +
                      '"' +
                      (u(r.p.rowNum, 0) === u(v[0], 0)
                        ? ' selected="selected"'
                        : '') +
                      '>' +
                      v[1] +
                      '</option>');
                f += '</select></td>';
              }
              if (
                ('rtl' === s && (g += f),
                r.p.pginput === !0 &&
                  (h =
                    "<td dir='" +
                    s +
                    "'>" +
                    $.jgrid.format(
                      r.p.pgtext || '',
                      "<input class='ui-pg-input' type='text' size='2' maxlength='7' value='0' role='textbox'/>",
                      "<span id='sp_1_" + $.jgrid.jqID(e) + "'></span>"
                    ) +
                    '</td>'),
                r.p.pgbuttons === !0)
              ) {
                var j = ['first' + t, 'prev' + t, 'next' + t, 'last' + t];
                'rtl' === s && j.reverse(),
                  (g +=
                    "<td id='" +
                    j[0] +
                    "' class='ui-pg-button ui-corner-all' " +
                    (r.p.pgfirst ? "title='" + r.p.pgfirst + "'" : '') +
                    "><span class='ui-icon ui-icon-seek-first'></span></td>"),
                  (g +=
                    "<td id='" +
                    j[1] +
                    "' class='ui-pg-button ui-corner-all' " +
                    (r.p.pgprev ? "title='" + r.p.pgprev + "'" : '') +
                    "><span class='ui-icon ui-icon-seek-prev'></span></td>"),
                  (g += '' !== h ? c + h + c : ''),
                  (g +=
                    "<td id='" +
                    j[2] +
                    "' class='ui-pg-button ui-corner-all' " +
                    (r.p.pgnext ? "title='" + r.p.pgnext + "'" : '') +
                    "><span class='ui-icon ui-icon-seek-next'></span></td>"),
                  (g +=
                    "<td id='" +
                    j[3] +
                    "' class='ui-pg-button ui-corner-all' " +
                    (r.p.pglast ? "title='" + r.p.pglast + "'" : '') +
                    "><span class='ui-icon ui-icon-seek-end'></span></td>");
              } else '' !== h && (g += h);
              'ltr' === s && (g += f),
                (g += '</tr></tbody></table>'),
                r.p.viewrecords === !0 &&
                  $('td#' + e + '_' + r.p.recordpos, '#' + i).append(
                    "<div dir='" +
                      s +
                      "' style='text-align:" +
                      r.p.recordpos +
                      "' class='ui-paging-info'></div>"
                  ),
                $('td#' + e + '_' + r.p.pagerpos, '#' + i).append(g),
                (l = $('.ui-jqgrid').css('font-size') || '11px'),
                $(document.body).append(
                  "<div id='testpg' class='ui-jqgrid ui-widget ui-widget-content' style='font-size:" +
                    l +
                    ";visibility:hidden;' ></div>"
                ),
                (d = $(g).clone().appendTo('#testpg').width()),
                $('#testpg').remove(),
                d > 0 &&
                  ('' !== h && (d += 50),
                  $('td#' + e + '_' + r.p.pagerpos, '#' + i).width(d)),
                (r.p._nvtd = []),
                (r.p._nvtd[0] = Math.floor(
                  d ? (r.p.width - d) / 2 : r.p.width / 3
                )),
                (r.p._nvtd[1] = 0),
                (g = null),
                $('.ui-pg-selbox', '#' + i).bind('change', function () {
                  return m('records')
                    ? ((r.p.page =
                        Math.round(
                          (r.p.rowNum * (r.p.page - 1)) / this.value - 0.5
                        ) + 1),
                      (r.p.rowNum = this.value),
                      r.p.pager &&
                        $('.ui-pg-selbox', r.p.pager).val(this.value),
                      r.p.toppager &&
                        $('.ui-pg-selbox', r.p.toppager).val(this.value),
                      k(),
                      !1)
                    : !1;
                }),
                r.p.pgbuttons === !0 &&
                  ($('.ui-pg-button', '#' + i).hover(
                    function () {
                      $(this).hasClass('ui-state-disabled')
                        ? (this.style.cursor = 'default')
                        : ($(this).addClass('ui-state-hover'),
                          (this.style.cursor = 'pointer'));
                    },
                    function () {
                      $(this).hasClass('ui-state-disabled') ||
                        ($(this).removeClass('ui-state-hover'),
                        (this.style.cursor = 'default'));
                    }
                  ),
                  $(
                    '#first' +
                      $.jgrid.jqID(t) +
                      ', #prev' +
                      $.jgrid.jqID(t) +
                      ', #next' +
                      $.jgrid.jqID(t) +
                      ', #last' +
                      $.jgrid.jqID(t)
                  ).click(function () {
                    if ($(this).hasClass('ui-state-disabled')) return !1;
                    var e = u(r.p.page, 1),
                      i = u(r.p.lastpage, 1),
                      a = !1,
                      o = !0,
                      s = !0,
                      n = !0,
                      d = !0;
                    return (
                      0 === i || 1 === i
                        ? ((o = !1), (s = !1), (n = !1), (d = !1))
                        : i > 1 && e >= 1
                          ? 1 === e
                            ? ((o = !1), (s = !1))
                            : e === i && ((n = !1), (d = !1))
                          : i > 1 &&
                            0 === e &&
                            ((n = !1), (d = !1), (e = i - 1)),
                      m(this.id)
                        ? (this.id === 'first' + t &&
                            o &&
                            ((r.p.page = 1), (a = !0)),
                          this.id === 'prev' + t &&
                            s &&
                            ((r.p.page = e - 1), (a = !0)),
                          this.id === 'next' + t &&
                            n &&
                            ((r.p.page = e + 1), (a = !0)),
                          this.id === 'last' + t &&
                            d &&
                            ((r.p.page = i), (a = !0)),
                          a && k(),
                          !1)
                        : !1
                    );
                  })),
                r.p.pginput === !0 &&
                  $('input.ui-pg-input', '#' + i).keypress(function (e) {
                    var t = e.charCode || e.keyCode || 0;
                    return 13 === t
                      ? m('user')
                        ? ($(this).val(u($(this).val(), 1)),
                          (r.p.page =
                            $(this).val() > 0 ? $(this).val() : r.p.page),
                          k(),
                          !1)
                        : !1
                      : this;
                  });
            },
            N = function (e, t) {
              var i,
                a,
                o = '',
                s = r.p.colModel,
                n = !1,
                d = r.p.frozenColumns ? t : r.grid.headers[e].el,
                l = '';
              $('span.ui-grid-ico-sort', d).addClass('ui-state-disabled'),
                $(d).attr('aria-selected', 'false'),
                s[e].lso
                  ? 'asc' === s[e].lso
                    ? ((s[e].lso += '-desc'), (l = 'desc'))
                    : 'desc' === s[e].lso
                      ? ((s[e].lso += '-asc'), (l = 'asc'))
                      : ('asc-desc' === s[e].lso || 'desc-asc' === s[e].lso) &&
                        (s[e].lso = '')
                  : (s[e].lso = l = s[e].firstsortorder || 'asc'),
                l
                  ? ($('span.s-ico', d).show(),
                    $('span.ui-icon-' + l, d).removeClass('ui-state-disabled'),
                    $(d).attr('aria-selected', 'true'))
                  : r.p.viewsortcols[0] || $('span.s-ico', d).hide(),
                (r.p.sortorder = ''),
                $.each(s, function (e) {
                  this.lso &&
                    (e > 0 && n && (o += ', '),
                    (i = this.lso.split('-')),
                    (o += s[e].index || s[e].name),
                    (o += ' ' + i[i.length - 1]),
                    (n = !0),
                    (r.p.sortorder = i[i.length - 1]));
                }),
                (a = o.lastIndexOf(r.p.sortorder)),
                (o = o.substring(0, a)),
                (r.p.sortname = o);
            },
            O = function (e, t, i, a, o) {
              if (r.p.colModel[t].sortable && !(r.p.savedRow.length > 0)) {
                if (
                  (i ||
                    (r.p.lastsort === t && '' !== r.p.sortname
                      ? 'asc' === r.p.sortorder
                        ? (r.p.sortorder = 'desc')
                        : 'desc' === r.p.sortorder && (r.p.sortorder = 'asc')
                      : (r.p.sortorder =
                          r.p.colModel[t].firstsortorder || 'asc'),
                    (r.p.page = 1)),
                  r.p.multiSort)
                )
                  N(t, o);
                else {
                  if (a) {
                    if (r.p.lastsort === t && r.p.sortorder === a && !i) return;
                    r.p.sortorder = a;
                  }
                  var s = r.grid.headers[r.p.lastsort].el,
                    n = r.p.frozenColumns ? o : r.grid.headers[t].el;
                  $('span.ui-grid-ico-sort', s).addClass('ui-state-disabled'),
                    $(s).attr('aria-selected', 'false'),
                    r.p.frozenColumns &&
                      (r.grid.fhDiv
                        .find('span.ui-grid-ico-sort')
                        .addClass('ui-state-disabled'),
                      r.grid.fhDiv.find('th').attr('aria-selected', 'false')),
                    $('span.ui-icon-' + r.p.sortorder, n).removeClass(
                      'ui-state-disabled'
                    ),
                    $(n).attr('aria-selected', 'true'),
                    r.p.viewsortcols[0] ||
                      (r.p.lastsort !== t
                        ? (r.p.frozenColumns &&
                            r.grid.fhDiv.find('span.s-ico').hide(),
                          $('span.s-ico', s).hide(),
                          $('span.s-ico', n).show())
                        : '' === r.p.sortname && $('span.s-ico', n).show()),
                    (e = e.substring(5 + r.p.id.length + 1)),
                    (r.p.sortname = r.p.colModel[t].index || e);
                }
                if (
                  'stop' ===
                  $(r).triggerHandler('jqGridSortCol', [
                    r.p.sortname,
                    t,
                    r.p.sortorder,
                  ])
                )
                  return void (r.p.lastsort = t);
                if (
                  $.isFunction(r.p.onSortCol) &&
                  'stop' ===
                    r.p.onSortCol.call(r, r.p.sortname, t, r.p.sortorder)
                )
                  return void (r.p.lastsort = t);
                if (
                  ('local' === r.p.datatype
                    ? r.p.deselectAfterSort && $(r).jqGrid('resetSelection')
                    : ((r.p.selrow = null),
                      r.p.multiselect && R(!1),
                      (r.p.selarrrow = []),
                      (r.p.savedRow = [])),
                  r.p.scroll)
                ) {
                  var d = r.grid.bDiv.scrollLeft;
                  y.call(r, !0, !1), (r.grid.hDiv.scrollLeft = d);
                }
                r.p.subGrid &&
                  'local' === r.p.datatype &&
                  $('td.sgexpanded', '#' + $.jgrid.jqID(r.p.id)).each(
                    function () {
                      $(this).trigger('click');
                    }
                  ),
                  k(),
                  (r.p.lastsort = t),
                  r.p.sortname !== e && t && (r.p.lastsort = t);
              }
            },
            A = function () {
              var e,
                t,
                i,
                o,
                s = 0,
                n = $.jgrid.cell_width ? 0 : u(r.p.cellLayout, 0),
                d = 0,
                l = u(r.p.scrollOffset, 0),
                p = !1,
                c = 0;
              $.each(r.p.colModel, function () {
                if (
                  (void 0 === this.hidden && (this.hidden = !1),
                  r.p.grouping && r.p.autowidth)
                ) {
                  var e = $.inArray(this.name, r.p.groupingView.groupField);
                  e >= 0 &&
                    r.p.groupingView.groupColumnShow.length > e &&
                    (this.hidden = !r.p.groupingView.groupColumnShow[e]);
                }
                (this.widthOrg = t = u(this.width, 0)),
                  this.hidden === !1 &&
                    ((s += t + n), this.fixed ? (c += t + n) : d++);
              }),
                isNaN(r.p.width) &&
                  (r.p.width =
                    s + (r.p.shrinkToFit !== !1 || isNaN(r.p.height) ? 0 : l)),
                (a.width = r.p.width),
                (r.p.tblwidth = s),
                r.p.shrinkToFit === !1 &&
                  r.p.forceFit === !0 &&
                  (r.p.forceFit = !1),
                r.p.shrinkToFit === !0 &&
                  d > 0 &&
                  ((i = a.width - n * d - c),
                  isNaN(r.p.height) || ((i -= l), (p = !0)),
                  (s = 0),
                  $.each(r.p.colModel, function (a) {
                    this.hidden !== !1 ||
                      this.fixed ||
                      ((t = Math.round(
                        (i * this.width) / (r.p.tblwidth - n * d - c)
                      )),
                      (this.width = t),
                      (s += t),
                      (e = a));
                  }),
                  (o = 0),
                  p
                    ? a.width - c - (s + n * d) !== l &&
                      (o = a.width - c - (s + n * d) - l)
                    : p ||
                      1 === Math.abs(a.width - c - (s + n * d)) ||
                      (o = a.width - c - (s + n * d)),
                  (r.p.colModel[e].width += o),
                  (r.p.tblwidth = s + o + n * d + c),
                  r.p.tblwidth > r.p.width &&
                    ((r.p.colModel[e].width -=
                      r.p.tblwidth - parseInt(r.p.width, 10)),
                    (r.p.tblwidth = r.p.width)));
            },
            P = function (e) {
              var t,
                i = e,
                a = e;
              for (t = e + 1; t < r.p.colModel.length; t++)
                if (r.p.colModel[t].hidden !== !0) {
                  a = t;
                  break;
                }
              return a - i;
            },
            E = function (e) {
              var t = $(r.grid.headers[e].el),
                i = [t.position().left + t.outerWidth()];
              return (
                'rtl' === r.p.direction && (i[0] = r.p.width - i[0]),
                (i[0] -= r.grid.bDiv.scrollLeft),
                i.push($(r.grid.hDiv).position().top),
                i.push(
                  $(r.grid.bDiv).offset().top -
                    $(r.grid.hDiv).offset().top +
                    $(r.grid.bDiv).height()
                ),
                i
              );
            },
            T = function (e) {
              var t,
                i = r.grid.headers,
                a = $.jgrid.getCellIndex(e);
              for (t = 0; t < i.length; t++)
                if (e === i[t].el) {
                  a = t;
                  break;
                }
              return a;
            };
          for (
            this.p.id = this.id,
              -1 === $.inArray(r.p.multikey, c) && (r.p.multikey = !1),
              r.p.keyName = !1,
              o = 0;
            o < r.p.colModel.length;
            o++
          )
            (p =
              'string' == typeof r.p.colModel[o].template
                ? null != $.jgrid.cmTemplate &&
                  'object' ==
                    typeof $.jgrid.cmTemplate[r.p.colModel[o].template]
                  ? $.jgrid.cmTemplate[r.p.colModel[o].template]
                  : {}
                : r.p.colModel[o].template),
              (r.p.colModel[o] = $.extend(
                !0,
                {},
                r.p.cmTemplate,
                p || {},
                r.p.colModel[o]
              )),
              r.p.keyName === !1 &&
                r.p.colModel[o].key === !0 &&
                (r.p.keyName = r.p.colModel[o].name);
          if (
            ((r.p.sortorder = r.p.sortorder.toLowerCase()),
            ($.jgrid.cell_width = $.jgrid.cellWidth()),
            r.p.grouping === !0 &&
              ((r.p.scroll = !1),
              (r.p.rownumbers = !1),
              (r.p.treeGrid = !1),
              (r.p.gridview = !0)),
            this.p.treeGrid === !0)
          ) {
            try {
              $(this).jqGrid('setTreeGrid');
            } catch (z) {}
            'local' !== r.p.datatype && (r.p.localReader = { id: '_id_' });
          }
          if (this.p.subGrid)
            try {
              $(r).jqGrid('setSubGrid');
            } catch (H) {}
          this.p.multiselect &&
            (this.p.colNames.unshift(
              "<input role='checkbox' id='cb_" +
                this.p.id +
                "' class='cbox' type='checkbox'/>"
            ),
            this.p.colModel.unshift({
              name: 'cb',
              width: $.jgrid.cell_width
                ? r.p.multiselectWidth + r.p.cellLayout
                : r.p.multiselectWidth,
              sortable: !1,
              resizable: !1,
              hidedlg: !0,
              search: !1,
              align: 'center',
              fixed: !0,
            })),
            this.p.rownumbers &&
              (this.p.colNames.unshift(''),
              this.p.colModel.unshift({
                name: 'rn',
                width: r.p.rownumWidth,
                sortable: !1,
                resizable: !1,
                hidedlg: !0,
                search: !1,
                align: 'center',
                fixed: !0,
              })),
            (r.p.xmlReader = $.extend(
              !0,
              {
                root: 'rows',
                row: 'row',
                page: 'rows>page',
                total: 'rows>total',
                records: 'rows>records',
                repeatitems: !0,
                cell: 'cell',
                id: '[id]',
                userdata: 'userdata',
                subgrid: {
                  root: 'rows',
                  row: 'row',
                  repeatitems: !0,
                  cell: 'cell',
                },
              },
              r.p.xmlReader
            )),
            (r.p.jsonReader = $.extend(
              !0,
              {
                root: 'rows',
                page: 'page',
                total: 'total',
                records: 'records',
                repeatitems: !0,
                cell: 'cell',
                id: 'id',
                userdata: 'userdata',
                subgrid: { root: 'rows', repeatitems: !0, cell: 'cell' },
              },
              r.p.jsonReader
            )),
            (r.p.localReader = $.extend(
              !0,
              {
                root: 'rows',
                page: 'page',
                total: 'total',
                records: 'records',
                repeatitems: !1,
                cell: 'cell',
                id: 'id',
                userdata: 'userdata',
                subgrid: { root: 'rows', repeatitems: !0, cell: 'cell' },
              },
              r.p.localReader
            )),
            r.p.scroll &&
              ((r.p.pgbuttons = !1), (r.p.pginput = !1), (r.p.rowList = [])),
            r.p.data.length && (x(), q());
          var B,
            L,
            V,
            Q,
            W,
            U,
            X,
            Y,
            J,
            K = "<thead><tr class='ui-jqgrid-labels' role='row'>",
            Z = '',
            et = '',
            tt = [],
            it = [],
            rt = [];
          if (r.p.shrinkToFit === !0 && r.p.forceFit === !0)
            for (o = r.p.colModel.length - 1; o >= 0; o--)
              if (!r.p.colModel[o].hidden) {
                r.p.colModel[o].resizable = !1;
                break;
              }
          if (
            ('horizontal' === r.p.viewsortcols[1] &&
              ((Z = ' ui-i-asc'), (et = ' ui-i-desc')),
            (B = d ? "class='ui-th-div-ie'" : ''),
            (J =
              "<span class='s-ico' style='display:none'><span sort='asc' class='ui-grid-ico-sort ui-icon-asc" +
              Z +
              ' ui-state-disabled ui-icon ui-icon-triangle-1-n ui-sort-' +
              s +
              "'></span>"),
            (J +=
              "<span sort='desc' class='ui-grid-ico-sort ui-icon-desc" +
              et +
              ' ui-state-disabled ui-icon ui-icon-triangle-1-s ui-sort-' +
              s +
              "'></span></span>"),
            r.p.multiSort)
          )
            for (tt = r.p.sortname.split(','), o = 0; o < tt.length; o++)
              (rt = $.trim(tt[o]).split(' ')),
                (tt[o] = $.trim(rt[0])),
                (it[o] = rt[1] ? $.trim(rt[1]) : r.p.sortorder || 'asc');
          for (o = 0; o < this.p.colNames.length; o++) {
            var at = r.p.headertitles
              ? ' title="' + $.jgrid.stripHtml(r.p.colNames[o]) + '"'
              : '';
            (K +=
              "<th id='" +
              r.p.id +
              '_' +
              r.p.colModel[o].name +
              "' role='columnheader' class='ui-state-default ui-th-column ui-th-" +
              s +
              "'" +
              at +
              '>'),
              (L = r.p.colModel[o].index || r.p.colModel[o].name),
              (K +=
                "<div id='jqgh_" +
                r.p.id +
                '_' +
                r.p.colModel[o].name +
                "' " +
                B +
                '>' +
                r.p.colNames[o]),
              (r.p.colModel[o].width = r.p.colModel[o].width
                ? parseInt(r.p.colModel[o].width, 10)
                : 150),
              'boolean' != typeof r.p.colModel[o].title &&
                (r.p.colModel[o].title = !0),
              (r.p.colModel[o].lso = ''),
              L === r.p.sortname && (r.p.lastsort = o),
              r.p.multiSort &&
                ((rt = $.inArray(L, tt)),
                -1 !== rt && (r.p.colModel[o].lso = it[rt])),
              (K += J + '</div></th>');
          }
          if (
            ((K += '</tr></thead>'),
            (J = null),
            $(this).append(K),
            $('thead tr:first th', this).hover(
              function () {
                $(this).addClass('ui-state-hover');
              },
              function () {
                $(this).removeClass('ui-state-hover');
              }
            ),
            this.p.multiselect)
          ) {
            var ot,
              st = [];
            $('#cb_' + $.jgrid.jqID(r.p.id), this).bind('click', function () {
              r.p.selarrrow = [];
              var e = r.p.frozenColumns === !0 ? r.p.id + '_frozen' : '';
              this.checked
                ? ($(r.rows).each(function (t) {
                    t > 0 &&
                      ($(this).hasClass('ui-subgrid') ||
                        $(this).hasClass('jqgroup') ||
                        $(this).hasClass('ui-state-disabled') ||
                        $(this).hasClass('jqfoot') ||
                        ($(
                          '#jqg_' +
                            $.jgrid.jqID(r.p.id) +
                            '_' +
                            $.jgrid.jqID(this.id)
                        )[r.p.useProp ? 'prop' : 'attr']('checked', !0),
                        $(this)
                          .addClass('ui-state-highlight')
                          .attr('aria-selected', 'true'),
                        r.p.selarrrow.push(this.id),
                        (r.p.selrow = this.id),
                        e &&
                          ($(
                            '#jqg_' +
                              $.jgrid.jqID(r.p.id) +
                              '_' +
                              $.jgrid.jqID(this.id),
                            r.grid.fbDiv
                          )[r.p.useProp ? 'prop' : 'attr']('checked', !0),
                          $('#' + $.jgrid.jqID(this.id), r.grid.fbDiv).addClass(
                            'ui-state-highlight'
                          ))));
                  }),
                  (ot = !0),
                  (st = []))
                : ($(r.rows).each(function (t) {
                    t > 0 &&
                      ($(this).hasClass('ui-subgrid') ||
                        $(this).hasClass('jqgroup') ||
                        $(this).hasClass('ui-state-disabled') ||
                        $(this).hasClass('jqfoot') ||
                        ($(
                          '#jqg_' +
                            $.jgrid.jqID(r.p.id) +
                            '_' +
                            $.jgrid.jqID(this.id)
                        )[r.p.useProp ? 'prop' : 'attr']('checked', !1),
                        $(this)
                          .removeClass('ui-state-highlight')
                          .attr('aria-selected', 'false'),
                        st.push(this.id),
                        e &&
                          ($(
                            '#jqg_' +
                              $.jgrid.jqID(r.p.id) +
                              '_' +
                              $.jgrid.jqID(this.id),
                            r.grid.fbDiv
                          )[r.p.useProp ? 'prop' : 'attr']('checked', !1),
                          $(
                            '#' + $.jgrid.jqID(this.id),
                            r.grid.fbDiv
                          ).removeClass('ui-state-highlight'))));
                  }),
                  (r.p.selrow = null),
                  (ot = !1)),
                $(r).triggerHandler('jqGridSelectAll', [
                  ot ? r.p.selarrrow : st,
                  ot,
                ]),
                $.isFunction(r.p.onSelectAll) &&
                  r.p.onSelectAll.call(r, ot ? r.p.selarrrow : st, ot);
            });
          }
          if (r.p.autowidth === !0) {
            var nt = $(l).innerWidth();
            r.p.width = nt > 0 ? nt : 'nw';
          }
          A(),
            $(l)
              .css('width', a.width + 'px')
              .append(
                "<div class='ui-jqgrid-resize-mark' id='rs_m" +
                  r.p.id +
                  "'>&#160;</div>"
              ),
            $(n).css('width', a.width + 'px'),
            (K = $('thead:first', r).get(0));
          var dt = '';
          r.p.footerrow &&
            (dt +=
              "<table role='presentation' style='width:" +
              r.p.tblwidth +
              "px' class='ui-jqgrid-ftable' cellspacing='0' cellpadding='0' border='0'><tbody><tr role='row' class='ui-widget-content footrow footrow-" +
              s +
              "'>");
          var lt = $('tr:first', K),
            pt = "<tr class='jqgfirstrow' role='row' style='height:auto'>";
          if (
            ((r.p.disableClick = !1),
            $('th', lt)
              .each(function (e) {
                (V = r.p.colModel[e].width),
                  void 0 === r.p.colModel[e].resizable &&
                    (r.p.colModel[e].resizable = !0),
                  r.p.colModel[e].resizable
                    ? ((Q = document.createElement('span')),
                      $(Q)
                        .html('&#160;')
                        .addClass('ui-jqgrid-resize ui-jqgrid-resize-' + s)
                        .css('cursor', 'col-resize'),
                      $(this).addClass(r.p.resizeclass))
                    : (Q = ''),
                  $(this)
                    .css('width', V + 'px')
                    .prepend(Q),
                  (Q = null);
                var t = '';
                r.p.colModel[e].hidden &&
                  ($(this).css('display', 'none'), (t = 'display:none;')),
                  (pt +=
                    "<td role='gridcell' style='height:0px;width:" +
                    V +
                    'px;' +
                    t +
                    "'></td>"),
                  (a.headers[e] = { width: V, el: this }),
                  (W = r.p.colModel[e].sortable),
                  'boolean' != typeof W &&
                    ((r.p.colModel[e].sortable = !0), (W = !0));
                var i = r.p.colModel[e].name;
                'cb' !== i &&
                  'subgrid' !== i &&
                  'rn' !== i &&
                  r.p.viewsortcols[2] &&
                  $('>div', this).addClass('ui-jqgrid-sortable'),
                  W &&
                    (r.p.multiSort
                      ? r.p.viewsortcols[0]
                        ? ($('div span.s-ico', this).show(),
                          r.p.colModel[e].lso &&
                            $(
                              'div span.ui-icon-' + r.p.colModel[e].lso,
                              this
                            ).removeClass('ui-state-disabled'))
                        : r.p.colModel[e].lso &&
                          ($('div span.s-ico', this).show(),
                          $(
                            'div span.ui-icon-' + r.p.colModel[e].lso,
                            this
                          ).removeClass('ui-state-disabled'))
                      : r.p.viewsortcols[0]
                        ? ($('div span.s-ico', this).show(),
                          e === r.p.lastsort &&
                            $(
                              'div span.ui-icon-' + r.p.sortorder,
                              this
                            ).removeClass('ui-state-disabled'))
                        : e === r.p.lastsort &&
                          '' !== r.p.sortname &&
                          ($('div span.s-ico', this).show(),
                          $(
                            'div span.ui-icon-' + r.p.sortorder,
                            this
                          ).removeClass('ui-state-disabled'))),
                  r.p.footerrow &&
                    (dt +=
                      "<td role='gridcell' " +
                      h(e, 0, '', null, '', !1) +
                      '>&#160;</td>');
              })
              .mousedown(function (e) {
                if (
                  1 === $(e.target).closest('th>span.ui-jqgrid-resize').length
                ) {
                  var t = T(this);
                  return (
                    r.p.forceFit === !0 && (r.p.nv = P(t)),
                    a.dragStart(t, e, E(t)),
                    !1
                  );
                }
              })
              .click(function (e) {
                if (r.p.disableClick) return (r.p.disableClick = !1), !1;
                var t,
                  i,
                  a = 'th>div.ui-jqgrid-sortable';
                r.p.viewsortcols[2] ||
                  (a = 'th>div>span>span.ui-grid-ico-sort');
                var o = $(e.target).closest(a);
                if (1 === o.length) {
                  var s;
                  if (r.p.frozenColumns) {
                    var n = $(this)[0].id.substring(r.p.id.length + 1);
                    $(r.p.colModel).each(function (e) {
                      return this.name === n ? ((s = e), !1) : void 0;
                    });
                  } else s = T(this);
                  return (
                    r.p.viewsortcols[2] || ((t = !0), (i = o.attr('sort'))),
                    null != s && O($('div', this)[0].id, s, t, i, this),
                    !1
                  );
                }
              }),
            r.p.sortable && $.fn.sortable)
          )
            try {
              $(r).jqGrid('sortableColumns', lt);
            } catch (ct) {}
          r.p.footerrow && (dt += '</tr></tbody></table>'),
            (pt += '</tr>'),
            (Y = document.createElement('tbody')),
            this.appendChild(Y),
            $(this).addClass('ui-jqgrid-btable').append(pt),
            (pt = null);
          var ut = $(
              "<table class='ui-jqgrid-htable' style='width:" +
                r.p.tblwidth +
                "px' role='presentation' aria-labelledby='gbox_" +
                this.id +
                "' cellspacing='0' cellpadding='0' border='0'></table>"
            ).append(K),
            ht = r.p.caption && r.p.hiddengrid === !0 ? !0 : !1,
            gt = $(
              "<div class='ui-jqgrid-hbox" +
                ('rtl' === s ? '-rtl' : '') +
                "'></div>"
            );
          (K = null),
            (a.hDiv = document.createElement('div')),
            $(a.hDiv)
              .css({ width: a.width + 'px' })
              .addClass('ui-state-default ui-jqgrid-hdiv')
              .append(gt),
            $(gt).append(ut),
            (ut = null),
            ht && $(a.hDiv).hide(),
            r.p.pager &&
              ('string' == typeof r.p.pager
                ? '#' !== r.p.pager.substr(0, 1) &&
                  (r.p.pager = '#' + r.p.pager)
                : (r.p.pager = '#' + $(r.p.pager).attr('id')),
              $(r.p.pager)
                .css({ width: a.width + 'px' })
                .addClass('ui-state-default ui-jqgrid-pager ui-corner-bottom')
                .appendTo(l),
              ht && $(r.p.pager).hide(),
              M(r.p.pager, '')),
            r.p.cellEdit === !1 &&
              r.p.hoverrows === !0 &&
              $(r)
                .bind('mouseover', function (e) {
                  (X = $(e.target).closest('tr.jqgrow')),
                    'ui-subgrid' !== $(X).attr('class') &&
                      $(X).addClass('ui-state-hover');
                })
                .bind('mouseout', function (e) {
                  (X = $(e.target).closest('tr.jqgrow')),
                    $(X).removeClass('ui-state-hover');
                });
          var ft, mt, vt;
          $(r)
            .before(a.hDiv)
            .click(function (e) {
              if (
                ((U = e.target),
                (X = $(U, r.rows).closest('tr.jqgrow')),
                0 === $(X).length ||
                  X[0].className.indexOf('ui-state-disabled') > -1 ||
                  (
                    $(U, r).closest('table.ui-jqgrid-btable').attr('id') || ''
                  ).replace('_frozen', '') !== r.id)
              )
                return this;
              var t = $(U).hasClass('cbox'),
                i = $(r).triggerHandler('jqGridBeforeSelectRow', [X[0].id, e]);
              if (
                ((i = i === !1 || 'stop' === i ? !1 : !0),
                $.isFunction(r.p.beforeSelectRow))
              ) {
                var a = r.p.beforeSelectRow.call(r, X[0].id, e);
                (a === !1 || 'stop' === a) && (i = !1);
              }
              if (
                'A' !== U.tagName &&
                (('INPUT' !== U.tagName &&
                  'TEXTAREA' !== U.tagName &&
                  'OPTION' !== U.tagName &&
                  'SELECT' !== U.tagName) ||
                  t)
              ) {
                if (
                  ((ft = X[0].id),
                  (U = $(U).closest('tr.jqgrow>td')),
                  U.length > 0 &&
                    ((mt = $.jgrid.getCellIndex(U)),
                    (vt = $(U).closest('td,th').html()),
                    $(r).triggerHandler('jqGridCellSelect', [ft, mt, vt, e]),
                    $.isFunction(r.p.onCellSelect) &&
                      r.p.onCellSelect.call(r, ft, mt, vt, e)),
                  r.p.cellEdit === !0)
                )
                  if (r.p.multiselect && t && i)
                    $(r).jqGrid('setSelection', ft, !0, e);
                  else if (U.length > 0) {
                    ft = X[0].rowIndex;
                    try {
                      $(r).jqGrid('editCell', ft, mt, !0);
                    } catch (o) {}
                  }
                if (i)
                  if (r.p.multikey)
                    e[r.p.multikey]
                      ? $(r).jqGrid('setSelection', ft, !0, e)
                      : r.p.multiselect &&
                        t &&
                        ((t = $('#jqg_' + $.jgrid.jqID(r.p.id) + '_' + ft).is(
                          ':checked'
                        )),
                        $('#jqg_' + $.jgrid.jqID(r.p.id) + '_' + ft)[
                          r.p.useProp ? 'prop' : 'attr'
                        ]('checked', t));
                  else if (r.p.multiselect && r.p.multiboxonly)
                    if (t) $(r).jqGrid('setSelection', ft, !0, e);
                    else {
                      var s = r.p.frozenColumns ? r.p.id + '_frozen' : '';
                      $(r.p.selarrrow).each(function (e, t) {
                        var i = $(r).jqGrid('getGridRowById', t);
                        i && $(i).removeClass('ui-state-highlight'),
                          $(
                            '#jqg_' +
                              $.jgrid.jqID(r.p.id) +
                              '_' +
                              $.jgrid.jqID(t)
                          )[r.p.useProp ? 'prop' : 'attr']('checked', !1),
                          s &&
                            ($(
                              '#' + $.jgrid.jqID(t),
                              '#' + $.jgrid.jqID(s)
                            ).removeClass('ui-state-highlight'),
                            $(
                              '#jqg_' +
                                $.jgrid.jqID(r.p.id) +
                                '_' +
                                $.jgrid.jqID(t),
                              '#' + $.jgrid.jqID(s)
                            )[r.p.useProp ? 'prop' : 'attr']('checked', !1));
                      }),
                        (r.p.selarrrow = []),
                        $(r).jqGrid('setSelection', ft, !0, e);
                    }
                  else $(r).jqGrid('setSelection', ft, !0, e);
              }
            })
            .bind('reloadGrid', function (e, t) {
              if (
                (r.p.treeGrid === !0 && (r.p.datatype = r.p.treedatatype),
                t && t.current && r.grid.selectionPreserver(r),
                'local' === r.p.datatype
                  ? ($(r).jqGrid('resetSelection'),
                    r.p.data.length && (x(), q()))
                  : r.p.treeGrid ||
                    ((r.p.selrow = null),
                    r.p.multiselect && ((r.p.selarrrow = []), R(!1)),
                    (r.p.savedRow = [])),
                r.p.scroll && y.call(r, !0, !1),
                t && t.page)
              ) {
                var i = t.page;
                i > r.p.lastpage && (i = r.p.lastpage),
                  1 > i && (i = 1),
                  (r.p.page = i),
                  (r.grid.bDiv.scrollTop = r.grid.prevRowHeight
                    ? (i - 1) * r.grid.prevRowHeight * r.p.rowNum
                    : 0);
              }
              return (
                r.grid.prevRowHeight && r.p.scroll
                  ? (delete r.p.lastpage, r.grid.populateVisible())
                  : r.grid.populate(),
                r.p._inlinenav === !0 && $(r).jqGrid('showAddEditButtons'),
                !1
              );
            })
            .dblclick(function (e) {
              if (
                ((U = e.target),
                (X = $(U, r.rows).closest('tr.jqgrow')),
                0 !== $(X).length)
              ) {
                (ft = X[0].rowIndex), (mt = $.jgrid.getCellIndex(U));
                var t = $(r).triggerHandler('jqGridDblClickRow', [
                  $(X).attr('id'),
                  ft,
                  mt,
                  e,
                ]);
                return null != t
                  ? t
                  : $.isFunction(r.p.ondblClickRow) &&
                      ((t = r.p.ondblClickRow.call(
                        r,
                        $(X).attr('id'),
                        ft,
                        mt,
                        e
                      )),
                      null != t)
                    ? t
                    : void 0;
              }
            })
            .bind('contextmenu', function (e) {
              if (
                ((U = e.target),
                (X = $(U, r.rows).closest('tr.jqgrow')),
                0 !== $(X).length)
              ) {
                r.p.multiselect || $(r).jqGrid('setSelection', X[0].id, !0, e),
                  (ft = X[0].rowIndex),
                  (mt = $.jgrid.getCellIndex(U));
                var t = $(r).triggerHandler('jqGridRightClickRow', [
                  $(X).attr('id'),
                  ft,
                  mt,
                  e,
                ]);
                return null != t
                  ? t
                  : $.isFunction(r.p.onRightClickRow) &&
                      ((t = r.p.onRightClickRow.call(
                        r,
                        $(X).attr('id'),
                        ft,
                        mt,
                        e
                      )),
                      null != t)
                    ? t
                    : void 0;
              }
            }),
            (a.bDiv = document.createElement('div')),
            d &&
              'auto' === String(r.p.height).toLowerCase() &&
              (r.p.height = '100%'),
            $(a.bDiv)
              .append(
                $(
                  '<div style="position:relative;' +
                    (d && $.jgrid.msiever() < 8 ? 'height:0.01%;' : '') +
                    '"></div>'
                )
                  .append('<div></div>')
                  .append(this)
              )
              .addClass('ui-jqgrid-bdiv')
              .css({
                height: r.p.height + (isNaN(r.p.height) ? '' : 'px'),
                width: a.width + 'px',
              })
              .scroll(a.scrollGrid),
            $('table:first', a.bDiv).css({ width: r.p.tblwidth + 'px' }),
            $.support.tbody ||
              (2 === $('tbody', this).length &&
                $('tbody:gt(0)', this).remove()),
            r.p.multikey &&
              ($.jgrid.msie
                ? $(a.bDiv).bind('selectstart', function () {
                    return !1;
                  })
                : $(a.bDiv).bind('mousedown', function () {
                    return !1;
                  })),
            ht && $(a.bDiv).hide(),
            (a.cDiv = document.createElement('div'));
          var jt =
            r.p.hidegrid === !0
              ? $(
                  "<a role='link' class='ui-jqgrid-titlebar-close ui-corner-all HeaderButton' " +
                    (r.p.showhide ? "title='" + r.p.showhide + "'" : '') +
                    ' />'
                )
                  .hover(
                    function () {
                      jt.addClass('ui-state-hover');
                    },
                    function () {
                      jt.removeClass('ui-state-hover');
                    }
                  )
                  .append(
                    "<span class='ui-icon ui-icon-circle-triangle-n'></span>"
                  )
                  .css('rtl' === s ? 'left' : 'right', '0px')
              : '';
          if (
            ($(a.cDiv)
              .append(jt)
              .append(
                "<span class='ui-jqgrid-title'>" + r.p.caption + '</span>'
              )
              .addClass(
                'ui-jqgrid-titlebar ui-jqgrid-caption' +
                  ('rtl' === s ? '-rtl' : '') +
                  ' ui-widget-header ui-corner-top ui-helper-clearfix'
              ),
            $(a.cDiv).insertBefore(a.hDiv),
            r.p.toolbar[0] &&
              ((a.uDiv = document.createElement('div')),
              'top' === r.p.toolbar[1]
                ? $(a.uDiv).insertBefore(a.hDiv)
                : 'bottom' === r.p.toolbar[1] && $(a.uDiv).insertAfter(a.hDiv),
              'both' === r.p.toolbar[1]
                ? ((a.ubDiv = document.createElement('div')),
                  $(a.uDiv)
                    .addClass('ui-userdata ui-state-default')
                    .attr('id', 't_' + this.id)
                    .insertBefore(a.hDiv),
                  $(a.ubDiv)
                    .addClass('ui-userdata ui-state-default')
                    .attr('id', 'tb_' + this.id)
                    .insertAfter(a.hDiv),
                  ht && $(a.ubDiv).hide())
                : $(a.uDiv)
                    .width(a.width)
                    .addClass('ui-userdata ui-state-default')
                    .attr('id', 't_' + this.id),
              ht && $(a.uDiv).hide()),
            r.p.toppager &&
              ((r.p.toppager = $.jgrid.jqID(r.p.id) + '_toppager'),
              (a.topDiv = $("<div id='" + r.p.toppager + "'></div>")[0]),
              (r.p.toppager = '#' + r.p.toppager),
              $(a.topDiv)
                .addClass('ui-state-default ui-jqgrid-toppager')
                .width(a.width)
                .insertBefore(a.hDiv),
              M(r.p.toppager, '_t')),
            r.p.footerrow &&
              ((a.sDiv = $("<div class='ui-jqgrid-sdiv'></div>")[0]),
              (gt = $(
                "<div class='ui-jqgrid-hbox" +
                  ('rtl' === s ? '-rtl' : '') +
                  "'></div>"
              )),
              $(a.sDiv).append(gt).width(a.width).insertAfter(a.hDiv),
              $(gt).append(dt),
              (a.footers = $('.ui-jqgrid-ftable', a.sDiv)[0].rows[0].cells),
              r.p.rownumbers &&
                (a.footers[0].className = 'ui-state-default jqgrid-rownum'),
              ht && $(a.sDiv).hide()),
            (gt = null),
            r.p.caption)
          ) {
            var bt = r.p.datatype;
            r.p.hidegrid === !0 &&
              ($('.ui-jqgrid-titlebar-close', a.cDiv).click(function (e) {
                var t,
                  i = $.isFunction(r.p.onHeaderClick),
                  o =
                    '.ui-jqgrid-bdiv, .ui-jqgrid-hdiv, .ui-jqgrid-pager, .ui-jqgrid-sdiv',
                  s = this;
                return (
                  r.p.toolbar[0] === !0 &&
                    ('both' === r.p.toolbar[1] &&
                      (o += ', #' + $(a.ubDiv).attr('id')),
                    (o += ', #' + $(a.uDiv).attr('id'))),
                  (t = $(o, '#gview_' + $.jgrid.jqID(r.p.id)).length),
                  'visible' === r.p.gridstate
                    ? $(o, '#gbox_' + $.jgrid.jqID(r.p.id)).slideUp(
                        'fast',
                        function () {
                          t--,
                            0 === t &&
                              ($('span', s)
                                .removeClass('ui-icon-circle-triangle-n')
                                .addClass('ui-icon-circle-triangle-s'),
                              (r.p.gridstate = 'hidden'),
                              $('#gbox_' + $.jgrid.jqID(r.p.id)).hasClass(
                                'ui-resizable'
                              ) &&
                                $(
                                  '.ui-resizable-handle',
                                  '#gbox_' + $.jgrid.jqID(r.p.id)
                                ).hide(),
                              $(r).triggerHandler('jqGridHeaderClick', [
                                r.p.gridstate,
                                e,
                              ]),
                              i &&
                                (ht ||
                                  r.p.onHeaderClick.call(r, r.p.gridstate, e)));
                        }
                      )
                    : 'hidden' === r.p.gridstate &&
                      $(o, '#gbox_' + $.jgrid.jqID(r.p.id)).slideDown(
                        'fast',
                        function () {
                          t--,
                            0 === t &&
                              ($('span', s)
                                .removeClass('ui-icon-circle-triangle-s')
                                .addClass('ui-icon-circle-triangle-n'),
                              ht && ((r.p.datatype = bt), k(), (ht = !1)),
                              (r.p.gridstate = 'visible'),
                              $('#gbox_' + $.jgrid.jqID(r.p.id)).hasClass(
                                'ui-resizable'
                              ) &&
                                $(
                                  '.ui-resizable-handle',
                                  '#gbox_' + $.jgrid.jqID(r.p.id)
                                ).show(),
                              $(r).triggerHandler('jqGridHeaderClick', [
                                r.p.gridstate,
                                e,
                              ]),
                              i &&
                                (ht ||
                                  r.p.onHeaderClick.call(r, r.p.gridstate, e)));
                        }
                      ),
                  !1
                );
              }),
              ht &&
                ((r.p.datatype = 'local'),
                $('.ui-jqgrid-titlebar-close', a.cDiv).trigger('click')));
          } else
            $(a.cDiv).hide(),
              r.p.toppager || $(a.hDiv).addClass('ui-corner-top');
          $(a.hDiv)
            .after(a.bDiv)
            .mousemove(function (e) {
              return a.resizing ? (a.dragMove(e), !1) : void 0;
            }),
            $('.ui-jqgrid-labels', a.hDiv).bind('selectstart', function () {
              return !1;
            }),
            $(document).bind('mouseup.jqGrid' + r.p.id, function () {
              return a.resizing ? (a.dragEnd(), !1) : !0;
            }),
            (r.formatCol = h),
            (r.sortData = O),
            (r.updatepager = I),
            (r.refreshIndex = q),
            (r.setHeadCheckBox = R),
            (r.constructTr = D),
            (r.formatter = function (e, t, i, r, a) {
              return f(e, t, i, r, a);
            }),
            $.extend(a, { populate: k, emptyRows: y, beginReq: F, endReq: S }),
            (this.grid = a),
            (r.addXmlData = function (e) {
              _(e, r.grid.bDiv);
            }),
            (r.addJSONData = function (e) {
              C(e, r.grid.bDiv);
            }),
            (this.grid.cols = this.rows[0].cells),
            $(r).triggerHandler('jqGridInitGrid'),
            $.isFunction(r.p.onInitGrid) && r.p.onInitGrid.call(r),
            k(),
            (r.p.hiddengrid = !1);
        }
      });
    }),
    $.jgrid.extend({
      getGridParam: function (e) {
        var t = this[0];
        if (t && t.grid) return e ? (void 0 !== t.p[e] ? t.p[e] : null) : t.p;
      },
      setGridParam: function (e, t) {
        return this.each(function () {
          if ((null == t && (t = !1), this.grid && 'object' == typeof e))
            if (t === !0) {
              var i = $.extend({}, this.p, e);
              this.p = i;
            } else $.extend(!0, this.p, e);
        });
      },
      getGridRowById: function (e) {
        var t;
        return (
          this.each(function () {
            try {
              for (var i = this.rows.length; i--; )
                if (e.toString() === this.rows[i].id) {
                  t = this.rows[i];
                  break;
                }
            } catch (r) {
              t = $(this.grid.bDiv).find('#' + $.jgrid.jqID(e));
            }
          }),
          t
        );
      },
      getDataIDs: function () {
        var e,
          t = [],
          i = 0,
          r = 0;
        return (
          this.each(function () {
            if (((e = this.rows.length), e && e > 0))
              for (; e > i; )
                $(this.rows[i]).hasClass('jqgrow') &&
                  ((t[r] = this.rows[i].id), r++),
                  i++;
          }),
          t
        );
      },
      setSelection: function (e, t, i) {
        return this.each(function () {
          function r(e) {
            var t = $(c.grid.bDiv)[0].clientHeight,
              i = $(c.grid.bDiv)[0].scrollTop,
              r = $(c.rows[e]).position().top,
              a = c.rows[e].clientHeight;
            r + a >= t + i
              ? ($(c.grid.bDiv)[0].scrollTop = r - (t + i) + a + i)
              : t + i > r && i > r && ($(c.grid.bDiv)[0].scrollTop = r);
          }
          var a,
            o,
            s,
            n,
            d,
            l,
            p,
            c = this;
          void 0 !== e &&
            ((t = t === !1 ? !1 : !0),
            (o = $(c).jqGrid('getGridRowById', e)),
            !o ||
              !o.className ||
              o.className.indexOf('ui-state-disabled') > -1 ||
              (c.p.scrollrows === !0 &&
                ((s = $(c).jqGrid('getGridRowById', e).rowIndex),
                s >= 0 && r(s)),
              c.p.frozenColumns === !0 && (l = c.p.id + '_frozen'),
              c.p.multiselect
                ? (c.setHeadCheckBox(!1),
                  (c.p.selrow = o.id),
                  (n = $.inArray(c.p.selrow, c.p.selarrrow)),
                  -1 === n
                    ? ('ui-subgrid' !== o.className &&
                        $(o)
                          .addClass('ui-state-highlight')
                          .attr('aria-selected', 'true'),
                      (a = !0),
                      c.p.selarrrow.push(c.p.selrow))
                    : ('ui-subgrid' !== o.className &&
                        $(o)
                          .removeClass('ui-state-highlight')
                          .attr('aria-selected', 'false'),
                      (a = !1),
                      c.p.selarrrow.splice(n, 1),
                      (d = c.p.selarrrow[0]),
                      (c.p.selrow = void 0 === d ? null : d)),
                  $('#jqg_' + $.jgrid.jqID(c.p.id) + '_' + $.jgrid.jqID(o.id))[
                    c.p.useProp ? 'prop' : 'attr'
                  ]('checked', a),
                  l &&
                    (-1 === n
                      ? $(
                          '#' + $.jgrid.jqID(e),
                          '#' + $.jgrid.jqID(l)
                        ).addClass('ui-state-highlight')
                      : $(
                          '#' + $.jgrid.jqID(e),
                          '#' + $.jgrid.jqID(l)
                        ).removeClass('ui-state-highlight'),
                    $(
                      '#jqg_' + $.jgrid.jqID(c.p.id) + '_' + $.jgrid.jqID(e),
                      '#' + $.jgrid.jqID(l)
                    )[c.p.useProp ? 'prop' : 'attr']('checked', a)),
                  t &&
                    ($(c).triggerHandler('jqGridSelectRow', [o.id, a, i]),
                    c.p.onSelectRow && c.p.onSelectRow.call(c, o.id, a, i)))
                : 'ui-subgrid' !== o.className &&
                  (c.p.selrow !== o.id
                    ? ((p = $(c).jqGrid('getGridRowById', c.p.selrow)),
                      p &&
                        $(p)
                          .removeClass('ui-state-highlight')
                          .attr({ 'aria-selected': 'false', tabindex: '-1' }),
                      $(o)
                        .addClass('ui-state-highlight')
                        .attr({ 'aria-selected': 'true', tabindex: '0' }),
                      l &&
                        ($(
                          '#' + $.jgrid.jqID(c.p.selrow),
                          '#' + $.jgrid.jqID(l)
                        ).removeClass('ui-state-highlight'),
                        $(
                          '#' + $.jgrid.jqID(e),
                          '#' + $.jgrid.jqID(l)
                        ).addClass('ui-state-highlight')),
                      (a = !0))
                    : (a = !1),
                  (c.p.selrow = o.id),
                  t &&
                    ($(c).triggerHandler('jqGridSelectRow', [o.id, a, i]),
                    c.p.onSelectRow && c.p.onSelectRow.call(c, o.id, a, i)))));
        });
      },
      resetSelection: function (e) {
        return this.each(function () {
          var t,
            i,
            r = this;
          if (
            (r.p.frozenColumns === !0 && (i = r.p.id + '_frozen'), void 0 !== e)
          ) {
            if (
              ((t = e === r.p.selrow ? r.p.selrow : e),
              $(
                '#' +
                  $.jgrid.jqID(r.p.id) +
                  ' tbody:first tr#' +
                  $.jgrid.jqID(t)
              )
                .removeClass('ui-state-highlight')
                .attr('aria-selected', 'false'),
              i &&
                $('#' + $.jgrid.jqID(t), '#' + $.jgrid.jqID(i)).removeClass(
                  'ui-state-highlight'
                ),
              r.p.multiselect)
            ) {
              $(
                '#jqg_' + $.jgrid.jqID(r.p.id) + '_' + $.jgrid.jqID(t),
                '#' + $.jgrid.jqID(r.p.id)
              )[r.p.useProp ? 'prop' : 'attr']('checked', !1),
                i &&
                  $(
                    '#jqg_' + $.jgrid.jqID(r.p.id) + '_' + $.jgrid.jqID(t),
                    '#' + $.jgrid.jqID(i)
                  )[r.p.useProp ? 'prop' : 'attr']('checked', !1),
                r.setHeadCheckBox(!1);
              var a = $.inArray($.jgrid.jqID(t), r.p.selarrrow);
              -1 !== a && r.p.selarrrow.splice(a, 1);
            }
            t = null;
          } else
            r.p.multiselect
              ? ($(r.p.selarrrow).each(function (e, t) {
                  $($(r).jqGrid('getGridRowById', t))
                    .removeClass('ui-state-highlight')
                    .attr('aria-selected', 'false'),
                    $('#jqg_' + $.jgrid.jqID(r.p.id) + '_' + $.jgrid.jqID(t))[
                      r.p.useProp ? 'prop' : 'attr'
                    ]('checked', !1),
                    i &&
                      ($(
                        '#' + $.jgrid.jqID(t),
                        '#' + $.jgrid.jqID(i)
                      ).removeClass('ui-state-highlight'),
                      $(
                        '#jqg_' + $.jgrid.jqID(r.p.id) + '_' + $.jgrid.jqID(t),
                        '#' + $.jgrid.jqID(i)
                      )[r.p.useProp ? 'prop' : 'attr']('checked', !1));
                }),
                r.setHeadCheckBox(!1),
                (r.p.selarrrow = []),
                (r.p.selrow = null))
              : r.p.selrow &&
                ($(
                  '#' +
                    $.jgrid.jqID(r.p.id) +
                    ' tbody:first tr#' +
                    $.jgrid.jqID(r.p.selrow)
                )
                  .removeClass('ui-state-highlight')
                  .attr('aria-selected', 'false'),
                i &&
                  $(
                    '#' + $.jgrid.jqID(r.p.selrow),
                    '#' + $.jgrid.jqID(i)
                  ).removeClass('ui-state-highlight'),
                (r.p.selrow = null));
          r.p.cellEdit === !0 &&
            parseInt(r.p.iCol, 10) >= 0 &&
            parseInt(r.p.iRow, 10) >= 0 &&
            ($('td:eq(' + r.p.iCol + ')', r.rows[r.p.iRow]).removeClass(
              'edit-cell ui-state-highlight'
            ),
            $(r.rows[r.p.iRow]).removeClass('selected-row ui-state-hover')),
            (r.p.savedRow = []);
        });
      },
      getRowData: function (e) {
        var t,
          i,
          r = {},
          a = !1,
          o = 0;
        return (
          this.each(function () {
            var s,
              n,
              d = this;
            if (void 0 === e) (a = !0), (t = []), (i = d.rows.length);
            else {
              if (((n = $(d).jqGrid('getGridRowById', e)), !n)) return r;
              i = 2;
            }
            for (; i > o; )
              a && (n = d.rows[o]),
                $(n).hasClass('jqgrow') &&
                  ($('td[role="gridcell"]', n).each(function (e) {
                    if (
                      ((s = d.p.colModel[e].name),
                      'cb' !== s && 'subgrid' !== s && 'rn' !== s)
                    )
                      if (d.p.treeGrid === !0 && s === d.p.ExpandColumn)
                        r[s] = $.jgrid.htmlDecode($('span:first', this).html());
                      else
                        try {
                          r[s] = $.unformat.call(
                            d,
                            this,
                            { rowId: n.id, colModel: d.p.colModel[e] },
                            e
                          );
                        } catch (t) {
                          r[s] = $.jgrid.htmlDecode($(this).html());
                        }
                  }),
                  a && (t.push(r), (r = {}))),
                o++;
          }),
          t || r
        );
      },
      delRowData: function (e) {
        var t,
          i,
          r,
          a = !1;
        return (
          this.each(function () {
            var o = this;
            if (((t = $(o).jqGrid('getGridRowById', e)), !t)) return !1;
            if (
              (o.p.subGrid &&
                ((r = $(t).next()), r.hasClass('ui-subgrid') && r.remove()),
              $(t).remove(),
              o.p.records--,
              o.p.reccount--,
              o.updatepager(!0, !1),
              (a = !0),
              o.p.multiselect &&
                ((i = $.inArray(e, o.p.selarrrow)),
                -1 !== i && o.p.selarrrow.splice(i, 1)),
              (o.p.selrow =
                o.p.multiselect && o.p.selarrrow.length > 0
                  ? o.p.selarrrow[o.p.selarrrow.length - 1]
                  : null),
              'local' === o.p.datatype)
            ) {
              var s = $.jgrid.stripPref(o.p.idPrefix, e),
                n = o.p._index[s];
              void 0 !== n && (o.p.data.splice(n, 1), o.refreshIndex());
            }
            if (o.p.altRows === !0 && a) {
              var d = o.p.altclass;
              $(o.rows).each(function (e) {
                e % 2 === 1 ? $(this).addClass(d) : $(this).removeClass(d);
              });
            }
          }),
          a
        );
      },
      setRowData: function (e, t, i) {
        var r,
          a,
          o = !0;
        return (
          this.each(function () {
            if (!this.grid) return !1;
            var s,
              n,
              d = this,
              l = typeof i,
              p = {};
            if (((n = $(this).jqGrid('getGridRowById', e)), !n)) return !1;
            if (t)
              try {
                if (
                  ($(this.p.colModel).each(function (i) {
                    r = this.name;
                    var o = $.jgrid.getAccessor(t, r);
                    void 0 !== o &&
                      ((p[r] =
                        this.formatter &&
                        'string' == typeof this.formatter &&
                        'date' === this.formatter
                          ? $.unformat.date.call(d, o, this)
                          : o),
                      (s = d.formatter(e, p[r], i, t, 'edit')),
                      (a = this.title ? { title: $.jgrid.stripHtml(s) } : {}),
                      d.p.treeGrid === !0 && r === d.p.ExpandColumn
                        ? $("td[role='gridcell']:eq(" + i + ') > span:first', n)
                            .html(s)
                            .attr(a)
                        : $("td[role='gridcell']:eq(" + i + ')', n)
                            .html(s)
                            .attr(a));
                  }),
                  'local' === d.p.datatype)
                ) {
                  var c,
                    u = $.jgrid.stripPref(d.p.idPrefix, e),
                    h = d.p._index[u];
                  if (d.p.treeGrid)
                    for (c in d.p.treeReader)
                      d.p.treeReader.hasOwnProperty(c) &&
                        delete p[d.p.treeReader[c]];
                  void 0 !== h && (d.p.data[h] = $.extend(!0, d.p.data[h], p)),
                    (p = null);
                }
              } catch (g) {
                o = !1;
              }
            o &&
              ('string' === l
                ? $(n).addClass(i)
                : null !== i && 'object' === l && $(n).css(i),
              $(d).triggerHandler('jqGridAfterGridComplete'));
          }),
          o
        );
      },
      addRowData: function (e, t, i, r) {
        -1 == ['first', 'last', 'before', 'after'].indexOf(i) && (i = 'last');
        var a,
          o,
          s,
          n,
          d,
          l,
          p,
          c,
          u,
          h,
          g,
          f,
          m,
          v,
          j = !1,
          b = '';
        return (
          t &&
            ($.isArray(t) ? ((u = !0), (h = e)) : ((t = [t]), (u = !1)),
            this.each(function () {
              var w = this,
                y = t.length;
              (d = w.p.rownumbers === !0 ? 1 : 0),
                (s = w.p.multiselect === !0 ? 1 : 0),
                (n = w.p.subGrid === !0 ? 1 : 0),
                u ||
                  (void 0 !== e
                    ? (e = String(e))
                    : ((e = $.jgrid.randId()),
                      w.p.keyName !== !1 &&
                        ((h = w.p.keyName),
                        void 0 !== t[0][h] && (e = t[0][h])))),
                (g = w.p.altclass);
              for (
                var x = 0,
                  q = '',
                  D = {},
                  _ = $.isFunction(w.p.afterInsertRow) ? !0 : !1;
                y > x;

              ) {
                if (((f = t[x]), (o = []), u)) {
                  try {
                    (e = f[h]), void 0 === e && (e = $.jgrid.randId());
                  } catch (C) {
                    e = $.jgrid.randId();
                  }
                  q =
                    w.p.altRows === !0 && (w.rows.length - 1) % 2 === 0
                      ? g
                      : '';
                }
                for (
                  v = e,
                    e = w.p.idPrefix + e,
                    d &&
                      ((b = w.formatCol(0, 1, '', null, e, !0)),
                      (o[o.length] =
                        '<td role="gridcell" class="ui-state-default jqgrid-rownum" ' +
                        b +
                        '>0</td>')),
                    s &&
                      ((c =
                        '<input role="checkbox" type="checkbox" id="jqg_' +
                        w.p.id +
                        '_' +
                        e +
                        '" class="cbox"/>'),
                      (b = w.formatCol(d, 1, '', null, e, !0)),
                      (o[o.length] =
                        '<td role="gridcell" ' + b + '>' + c + '</td>')),
                    n &&
                      (o[o.length] = $(w).jqGrid('addSubGridCell', s + d, 1)),
                    p = s + n + d;
                  p < w.p.colModel.length;
                  p++
                )
                  (m = w.p.colModel[p]),
                    (a = m.name),
                    (D[a] = f[a]),
                    (c = w.formatter(e, $.jgrid.getAccessor(f, a), p, f)),
                    (b = w.formatCol(p, 1, c, f, e, D)),
                    (o[o.length] =
                      '<td role="gridcell" ' + b + '>' + c + '</td>');
                if (
                  (o.unshift(w.constructTr(e, !1, q, D, f, !1)),
                  (o[o.length] = '</tr>'),
                  0 === w.rows.length)
                )
                  $('table:first', w.grid.bDiv).append(o.join(''));
                else
                  switch (i) {
                    case 'last':
                      $(w.rows[w.rows.length - 1]).after(o.join('')),
                        (l = w.rows.length - 1);
                      break;
                    case 'first':
                      $(w.rows[0]).after(o.join('')), (l = 1);
                      break;
                    case 'after':
                      (l = $(w).jqGrid('getGridRowById', r)),
                        l &&
                          ($(w.rows[l.rowIndex + 1]).hasClass('ui-subgrid')
                            ? $(w.rows[l.rowIndex + 1]).after(o)
                            : $(l).after(o.join('')),
                          (l = l.rowIndex + 1));
                      break;
                    case 'before':
                      (l = $(w).jqGrid('getGridRowById', r)),
                        l && ($(l).before(o.join('')), (l = l.rowIndex - 1));
                  }
                w.p.subGrid === !0 && $(w).jqGrid('addSubGrid', s + d, l),
                  w.p.records++,
                  w.p.reccount++,
                  $(w).triggerHandler('jqGridAfterInsertRow', [e, f, f]),
                  _ && w.p.afterInsertRow.call(w, e, f, f),
                  x++,
                  'local' === w.p.datatype &&
                    ((D[w.p.localReader.id] = v),
                    (w.p._index[v] = w.p.data.length),
                    w.p.data.push(D),
                    (D = {}));
              }
              w.p.altRows !== !0 ||
                u ||
                ('last' === i
                  ? (w.rows.length - 1) % 2 === 1 &&
                    $(w.rows[w.rows.length - 1]).addClass(g)
                  : $(w.rows).each(function (e) {
                      e % 2 === 1
                        ? $(this).addClass(g)
                        : $(this).removeClass(g);
                    })),
                w.updatepager(!0, !0),
                (j = !0);
            })),
          j
        );
      },
      footerData: function (e, t, i) {
        function r(e) {
          var t;
          for (t in e) if (e.hasOwnProperty(t)) return !1;
          return !0;
        }
        var a,
          o,
          s = !1,
          n = {};
        return (
          void 0 == e && (e = 'get'),
          'boolean' != typeof i && (i = !0),
          (e = e.toLowerCase()),
          this.each(function () {
            var d,
              l = this;
            return l.grid && l.p.footerrow
              ? 'set' === e && r(t)
                ? !1
                : ((s = !0),
                  void $(this.p.colModel).each(function (r) {
                    (a = this.name),
                      'set' === e
                        ? void 0 !== t[a] &&
                          ((d = i ? l.formatter('', t[a], r, t, 'edit') : t[a]),
                          (o = this.title
                            ? { title: $.jgrid.stripHtml(d) }
                            : {}),
                          $('tr.footrow td:eq(' + r + ')', l.grid.sDiv)
                            .html(d)
                            .attr(o),
                          (s = !0))
                        : 'get' === e &&
                          (n[a] = $(
                            'tr.footrow td:eq(' + r + ')',
                            l.grid.sDiv
                          ).html());
                  }))
              : !1;
          }),
          'get' === e ? n : s
        );
      },
      showHideCol: function (e, t) {
        return this.each(function () {
          var i,
            r = this,
            a = !1,
            o = $.jgrid.cell_width ? 0 : r.p.cellLayout;
          if (r.grid) {
            'string' == typeof e && (e = [e]), (t = 'none' !== t ? '' : 'none');
            var s = '' === t ? !0 : !1,
              n =
                r.p.groupHeader &&
                ('object' == typeof r.p.groupHeader ||
                  $.isFunction(r.p.groupHeader));
            n && $(r).jqGrid('destroyGroupHeader', !1),
              $(this.p.colModel).each(function (n) {
                if (-1 !== $.inArray(this.name, e) && this.hidden === s) {
                  if (r.p.frozenColumns === !0 && this.frozen === !0) return !0;
                  $('tr[role=row]', r.grid.hDiv).each(function () {
                    $(this.cells[n]).css('display', t);
                  }),
                    $(r.rows).each(function () {
                      $(this).hasClass('jqgroup') ||
                        $(this.cells[n]).css('display', t);
                    }),
                    r.p.footerrow &&
                      $('tr.footrow td:eq(' + n + ')', r.grid.sDiv).css(
                        'display',
                        t
                      ),
                    (i = parseInt(this.width, 10)),
                    'none' === t
                      ? (r.p.tblwidth -= i + o)
                      : (r.p.tblwidth += i + o),
                    (this.hidden = !s),
                    (a = !0),
                    $(r).triggerHandler('jqGridShowHideCol', [s, this.name, n]);
                }
              }),
              a === !0 &&
                (r.p.shrinkToFit !== !0 ||
                  isNaN(r.p.height) ||
                  (r.p.tblwidth += parseInt(r.p.scrollOffset, 10)),
                $(r).jqGrid(
                  'setGridWidth',
                  r.p.shrinkToFit === !0 ? r.p.tblwidth : r.p.width
                )),
              n && $(r).jqGrid('setGroupHeaders', r.p.groupHeader);
          }
        });
      },
      hideCol: function (e) {
        return this.each(function () {
          $(this).jqGrid('showHideCol', e, 'none');
        });
      },
      showCol: function (e) {
        return this.each(function () {
          $(this).jqGrid('showHideCol', e, '');
        });
      },
      remapColumns: function (e, t, i) {
        function r(t) {
          var i;
          (i = t.length ? $.makeArray(t) : $.extend({}, t)),
            $.each(e, function (e) {
              t[e] = i[this];
            });
        }
        function a(t, i) {
          $('>tr' + (i || ''), t).each(function () {
            var t = this,
              i = $.makeArray(t.cells);
            $.each(e, function () {
              var e = i[this];
              e && t.appendChild(e);
            });
          });
        }
        var o = this.get(0);
        r(o.p.colModel),
          r(o.p.colNames),
          r(o.grid.headers),
          a($('thead:first', o.grid.hDiv), i && ':not(.ui-jqgrid-labels)'),
          t &&
            a(
              $('#' + $.jgrid.jqID(o.p.id) + ' tbody:first'),
              '.jqgfirstrow, tr.jqgrow, tr.jqfoot'
            ),
          o.p.footerrow && a($('tbody:first', o.grid.sDiv)),
          o.p.remapColumns &&
            (o.p.remapColumns.length
              ? r(o.p.remapColumns)
              : (o.p.remapColumns = $.makeArray(e))),
          (o.p.lastsort = $.inArray(o.p.lastsort, e)),
          o.p.treeGrid && (o.p.expColInd = $.inArray(o.p.expColInd, e)),
          $(o).triggerHandler('jqGridRemapColumns', [e, t, i]);
      },
      setGridWidth: function (e, t) {
        return this.each(function () {
          if (this.grid) {
            var i,
              r,
              a,
              o,
              s = this,
              n = 0,
              d = $.jgrid.cell_width ? 0 : s.p.cellLayout,
              l = 0,
              p = !1,
              c = s.p.scrollOffset,
              u = 0;
            if (('boolean' != typeof t && (t = s.p.shrinkToFit), !isNaN(e))) {
              if (
                ((e = parseInt(e, 10)),
                (s.grid.width = s.p.width = e),
                $('#gbox_' + $.jgrid.jqID(s.p.id)).css('width', e + 'px'),
                $('#gview_' + $.jgrid.jqID(s.p.id)).css('width', e + 'px'),
                $(s.grid.bDiv).css('width', e + 'px'),
                $(s.grid.hDiv).css('width', e + 'px'),
                s.p.pager && $(s.p.pager).css('width', e + 'px'),
                s.p.toppager && $(s.p.toppager).css('width', e + 'px'),
                s.p.toolbar[0] === !0 &&
                  ($(s.grid.uDiv).css('width', e + 'px'),
                  'both' === s.p.toolbar[1] &&
                    $(s.grid.ubDiv).css('width', e + 'px')),
                s.p.footerrow && $(s.grid.sDiv).css('width', e + 'px'),
                t === !1 && s.p.forceFit === !0 && (s.p.forceFit = !1),
                t === !0)
              ) {
                if (
                  ($.each(s.p.colModel, function () {
                    this.hidden === !1 &&
                      ((i = this.widthOrg),
                      (n += i + d),
                      this.fixed ? (u += i + d) : l++);
                  }),
                  0 === l)
                )
                  return;
                (s.p.tblwidth = n),
                  (a = e - d * l - u),
                  isNaN(s.p.height) ||
                    (($(s.grid.bDiv)[0].clientHeight <
                      $(s.grid.bDiv)[0].scrollHeight ||
                      1 === s.rows.length) &&
                      ((p = !0), (a -= c))),
                  (n = 0);
                var h = s.grid.cols.length > 0;
                if (
                  ($.each(s.p.colModel, function (e) {
                    if (this.hidden === !1 && !this.fixed) {
                      if (
                        ((i = this.widthOrg),
                        (i = Math.round((a * i) / (s.p.tblwidth - d * l - u))),
                        0 > i)
                      )
                        return;
                      (this.width = i),
                        (n += i),
                        (s.grid.headers[e].width = i),
                        (s.grid.headers[e].el.style.width = i + 'px'),
                        s.p.footerrow &&
                          (s.grid.footers[e].style.width = i + 'px'),
                        h && (s.grid.cols[e].style.width = i + 'px'),
                        (r = e);
                    }
                  }),
                  !r)
                )
                  return;
                if (
                  ((o = 0),
                  p
                    ? e - u - (n + d * l) !== c && (o = e - u - (n + d * l) - c)
                    : 1 !== Math.abs(e - u - (n + d * l)) &&
                      (o = e - u - (n + d * l)),
                  (s.p.colModel[r].width += o),
                  (s.p.tblwidth = n + o + d * l + u),
                  s.p.tblwidth > e)
                ) {
                  var g = s.p.tblwidth - parseInt(e, 10);
                  (s.p.tblwidth = e),
                    (i = s.p.colModel[r].width = s.p.colModel[r].width - g);
                } else i = s.p.colModel[r].width;
                (s.grid.headers[r].width = i),
                  (s.grid.headers[r].el.style.width = i + 'px'),
                  h && (s.grid.cols[r].style.width = i + 'px'),
                  s.p.footerrow && (s.grid.footers[r].style.width = i + 'px');
              }
              s.p.tblwidth &&
                ($('table:first', s.grid.bDiv).css(
                  'width',
                  s.p.tblwidth + 'px'
                ),
                $('table:first', s.grid.hDiv).css('width', s.p.tblwidth + 'px'),
                (s.grid.hDiv.scrollLeft = s.grid.bDiv.scrollLeft),
                s.p.footerrow &&
                  $('table:first', s.grid.sDiv).css(
                    'width',
                    s.p.tblwidth + 'px'
                  ));
            }
          }
        });
      },
      setGridHeight: function (e) {
        return this.each(function () {
          var t = this;
          if (t.grid) {
            var i = $(t.grid.bDiv);
            i.css({ height: e + (isNaN(e) ? '' : 'px') }),
              t.p.frozenColumns === !0 &&
                $('#' + $.jgrid.jqID(t.p.id) + '_frozen')
                  .parent()
                  .height(i.height() - 16),
              (t.p.height = e),
              t.p.scroll && t.grid.populateVisible();
          }
        });
      },
      setCaption: function (e) {
        return this.each(function () {
          (this.p.caption = e),
            $(
              'span.ui-jqgrid-title, span.ui-jqgrid-title-rtl',
              this.grid.cDiv
            ).html(e),
            $(this.grid.cDiv).show(),
            $(this.grid.hDiv).removeClass('ui-corner-top');
        });
      },
      setLabel: function (e, t, i, r) {
        return this.each(function () {
          var a = this,
            o = -1;
          if (
            a.grid &&
            void 0 !== e &&
            ($(a.p.colModel).each(function (t) {
              return this.name === e ? ((o = t), !1) : void 0;
            }),
            o >= 0)
          ) {
            var s = $('tr.ui-jqgrid-labels th:eq(' + o + ')', a.grid.hDiv);
            if (t) {
              var n = $('.s-ico', s);
              $('[id^=jqgh_]', s).empty().html(t).append(n),
                (a.p.colNames[o] = t);
            }
            i && ('string' == typeof i ? $(s).addClass(i) : $(s).css(i)),
              'object' == typeof r && $(s).attr(r);
          }
        });
      },
      setCell: function (e, t, i, r, a, o) {
        return this.each(function () {
          var s,
            n,
            d = this,
            l = -1;
          if (
            d.grid &&
            (isNaN(t)
              ? $(d.p.colModel).each(function (e) {
                  return this.name === t ? ((l = e), !1) : void 0;
                })
              : (l = parseInt(t, 10)),
            l >= 0)
          ) {
            var p = $(d).jqGrid('getGridRowById', e);
            if (p) {
              var c = $('td:eq(' + l + ')', p),
                u = 0,
                h = [];
              if ('' !== i || o === !0) {
                for (; u < p.cells.length; ) h.push(p.cells[u].innerHTML), u++;
                if (
                  ((s = d.formatter(e, i, l, h, 'edit')),
                  (n = d.p.colModel[l].title
                    ? { title: $.jgrid.stripHtml(s) }
                    : {}),
                  d.p.treeGrid && $('.tree-wrap', $(c)).length > 0
                    ? $('span', $(c)).html(s).attr(n)
                    : $(c).html(s).attr(n),
                  'local' === d.p.datatype)
                ) {
                  var g,
                    f = d.p.colModel[l];
                  (i =
                    f.formatter &&
                    'string' == typeof f.formatter &&
                    'date' === f.formatter
                      ? $.unformat.date.call(d, i, f)
                      : i),
                    (g = d.p._index[$.jgrid.stripPref(d.p.idPrefix, e)]),
                    void 0 !== g && (d.p.data[g][f.name] = i);
                }
              }
              'string' == typeof r ? $(c).addClass(r) : r && $(c).css(r),
                'object' == typeof a && $(c).attr(a);
            }
          }
        });
      },
      getCell: function (e, t) {
        var i = !1;
        return (
          this.each(function () {
            var r = this,
              a = -1;
            if (
              r.grid &&
              (isNaN(t)
                ? $(r.p.colModel).each(function (e) {
                    return this.name === t ? ((a = e), !1) : void 0;
                  })
                : (a = parseInt(t, 10)),
              a >= 0)
            ) {
              var o = $(r).jqGrid('getGridRowById', e);
              if (o)
                try {
                  i = $.unformat.call(
                    r,
                    $('td:eq(' + a + ')', o),
                    { rowId: o.id, colModel: r.p.colModel[a] },
                    a
                  );
                } catch (s) {
                  i = $.jgrid.htmlDecode($('td:eq(' + a + ')', o).html());
                }
            }
          }),
          i
        );
      },
      getCol: function (e, t, i) {
        var r,
          a,
          o,
          s,
          n = [],
          d = 0;
        return (
          (t = 'boolean' != typeof t ? !1 : t),
          void 0 === i && (i = !1),
          this.each(function () {
            var l = this,
              p = -1;
            if (
              l.grid &&
              (isNaN(e)
                ? $(l.p.colModel).each(function (t) {
                    return this.name === e ? ((p = t), !1) : void 0;
                  })
                : (p = parseInt(e, 10)),
              p >= 0)
            ) {
              var c = l.rows.length,
                u = 0,
                h = 0;
              if (c && c > 0) {
                for (; c > u; ) {
                  if ($(l.rows[u]).hasClass('jqgrow')) {
                    try {
                      r = $.unformat.call(
                        l,
                        $(l.rows[u].cells[p]),
                        { rowId: l.rows[u].id, colModel: l.p.colModel[p] },
                        p
                      );
                    } catch (g) {
                      r = $.jgrid.htmlDecode(l.rows[u].cells[p].innerHTML);
                    }
                    i
                      ? ((s = parseFloat(r)),
                        isNaN(s) ||
                          ((d += s),
                          void 0 === o && (o = a = s),
                          (a = Math.min(a, s)),
                          (o = Math.max(o, s)),
                          h++))
                      : n.push(t ? { id: l.rows[u].id, value: r } : r);
                  }
                  u++;
                }
                if (i)
                  switch (i.toLowerCase()) {
                    case 'sum':
                      n = d;
                      break;
                    case 'avg':
                      n = d / h;
                      break;
                    case 'count':
                      n = c - 1;
                      break;
                    case 'min':
                      n = a;
                      break;
                    case 'max':
                      n = o;
                  }
              }
            }
          }),
          n
        );
      },
      clearGridData: function (e) {
        return this.each(function () {
          var t = this;
          if (t.grid) {
            if (('boolean' != typeof e && (e = !1), t.p.deepempty))
              $('#' + $.jgrid.jqID(t.p.id) + ' tbody:first tr:gt(0)').remove();
            else {
              var i = $(
                '#' + $.jgrid.jqID(t.p.id) + ' tbody:first tr:first'
              )[0];
              $('#' + $.jgrid.jqID(t.p.id) + ' tbody:first')
                .empty()
                .append(i);
            }
            t.p.footerrow &&
              e &&
              $('.ui-jqgrid-ftable td', t.grid.sDiv).html('&#160;'),
              (t.p.selrow = null),
              (t.p.selarrrow = []),
              (t.p.savedRow = []),
              (t.p.records = 0),
              (t.p.page = 1),
              (t.p.lastpage = 0),
              (t.p.reccount = 0),
              (t.p.data = []),
              (t.p._index = {}),
              t.updatepager(!0, !1);
          }
        });
      },
      getInd: function (e, t) {
        var i,
          r = !1;
        return (
          this.each(function () {
            (i = $(this).jqGrid('getGridRowById', e)),
              i && (r = t === !0 ? i : i.rowIndex);
          }),
          r
        );
      },
      bindKeys: function (e) {
        var t = $.extend(
          {
            onEnter: null,
            onSpace: null,
            onLeftKey: null,
            onRightKey: null,
            scrollingRows: !0,
          },
          e || {}
        );
        return this.each(function () {
          var e = this;
          $('body').is('[role]') || $('body').attr('role', 'application'),
            (e.p.scrollrows = t.scrollingRows),
            $(e).keydown(function (i) {
              var r,
                a,
                o,
                s = $(e).find('tr[tabindex=0]')[0],
                n = e.p.treeReader.expanded_field;
              if (s)
                if (
                  ((o = e.p._index[$.jgrid.stripPref(e.p.idPrefix, s.id)]),
                  37 === i.keyCode ||
                    38 === i.keyCode ||
                    39 === i.keyCode ||
                    40 === i.keyCode)
                ) {
                  if (38 === i.keyCode) {
                    if (((a = s.previousSibling), (r = ''), a))
                      if ($(a).is(':hidden')) {
                        for (; a; )
                          if (
                            ((a = a.previousSibling),
                            !$(a).is(':hidden') && $(a).hasClass('jqgrow'))
                          ) {
                            r = a.id;
                            break;
                          }
                      } else r = a.id;
                    $(e).jqGrid('setSelection', r, !0, i), i.preventDefault();
                  }
                  if (40 === i.keyCode) {
                    if (((a = s.nextSibling), (r = ''), a))
                      if ($(a).is(':hidden')) {
                        for (; a; )
                          if (
                            ((a = a.nextSibling),
                            !$(a).is(':hidden') && $(a).hasClass('jqgrow'))
                          ) {
                            r = a.id;
                            break;
                          }
                      } else r = a.id;
                    $(e).jqGrid('setSelection', r, !0, i), i.preventDefault();
                  }
                  37 === i.keyCode &&
                    (e.p.treeGrid &&
                      e.p.data[o][n] &&
                      $(s).find('div.treeclick').trigger('click'),
                    $(e).triggerHandler('jqGridKeyLeft', [e.p.selrow]),
                    $.isFunction(t.onLeftKey) &&
                      t.onLeftKey.call(e, e.p.selrow)),
                    39 === i.keyCode &&
                      (e.p.treeGrid &&
                        !e.p.data[o][n] &&
                        $(s).find('div.treeclick').trigger('click'),
                      $(e).triggerHandler('jqGridKeyRight', [e.p.selrow]),
                      $.isFunction(t.onRightKey) &&
                        t.onRightKey.call(e, e.p.selrow));
                } else
                  13 === i.keyCode
                    ? ($(e).triggerHandler('jqGridKeyEnter', [e.p.selrow]),
                      $.isFunction(t.onEnter) && t.onEnter.call(e, e.p.selrow))
                    : 32 === i.keyCode &&
                      ($(e).triggerHandler('jqGridKeySpace', [e.p.selrow]),
                      $.isFunction(t.onSpace) && t.onSpace.call(e, e.p.selrow));
            });
        });
      },
      unbindKeys: function () {
        return this.each(function () {
          $(this).unbind('keydown');
        });
      },
      getLocalRow: function (e) {
        var t,
          i = !1;
        return (
          this.each(function () {
            void 0 !== e &&
              ((t = this.p._index[$.jgrid.stripPref(this.p.idPrefix, e)]),
              t >= 0 && (i = this.p.data[t]));
          }),
          i
        );
      },
      progressBar: function (e) {
        return (
          (e = $.extend(
            { htmlcontent: '', method: 'hide', loadtype: 'disable' },
            e || {}
          )),
          this.each(function () {
            var t = 'show' === e.method ? !0 : !1;
            switch (
              ('' !== e.htmlcontent &&
                $('#load_' + $.jgrid.jqID(this.p.id)).html(e.htmlcontent),
              e.loadtype)
            ) {
              case 'disable':
                break;
              case 'enable':
                $('#load_' + $.jgrid.jqID(this.p.id)).toggle(t);
                break;
              case 'block':
                $('#lui_' + $.jgrid.jqID(this.p.id)).toggle(t),
                  $('#load_' + $.jgrid.jqID(this.p.id)).toggle(t);
            }
          })
        );
      },
    });
})(jQuery),
  (function (e) {
    'use strict';
    e.jgrid.extend({
      editCell: function (t, i, r) {
        return this.each(function () {
          var a,
            o,
            s,
            n,
            d = this;
          if (d.grid && d.p.cellEdit === !0) {
            if (
              ((i = parseInt(i, 10)),
              (d.p.selrow = d.rows[t].id),
              d.p.knv || e(d).jqGrid('GridNav'),
              d.p.savedRow.length > 0)
            ) {
              if (r === !0 && t == d.p.iRow && i == d.p.iCol) return;
              e(d).jqGrid('saveCell', d.p.savedRow[0].id, d.p.savedRow[0].ic);
            } else
              window.setTimeout(function () {
                e('#' + e.jgrid.jqID(d.p.knv))
                  .attr('tabindex', '-1')
                  .focus();
              }, 1);
            if (
              ((n = d.p.colModel[i]),
              (a = n.name),
              'subgrid' !== a && 'cb' !== a && 'rn' !== a)
            ) {
              if (
                ((s = e('td:eq(' + i + ')', d.rows[t])),
                n.editable !== !0 ||
                  r !== !0 ||
                  s.hasClass('not-editable-cell'))
              )
                parseInt(d.p.iCol, 10) >= 0 &&
                  parseInt(d.p.iRow, 10) >= 0 &&
                  (e('td:eq(' + d.p.iCol + ')', d.rows[d.p.iRow]).removeClass(
                    'edit-cell ui-state-highlight'
                  ),
                  e(d.rows[d.p.iRow]).removeClass(
                    'selected-row ui-state-hover'
                  )),
                  s.addClass('edit-cell ui-state-highlight'),
                  e(d.rows[t]).addClass('selected-row ui-state-hover'),
                  (o = s.html().replace(/\&#160\;/gi, '')),
                  e(d).triggerHandler('jqGridSelectCell', [
                    d.rows[t].id,
                    a,
                    o,
                    t,
                    i,
                  ]),
                  e.isFunction(d.p.onSelectCell) &&
                    d.p.onSelectCell.call(d, d.rows[t].id, a, o, t, i);
              else {
                parseInt(d.p.iCol, 10) >= 0 &&
                  parseInt(d.p.iRow, 10) >= 0 &&
                  (e('td:eq(' + d.p.iCol + ')', d.rows[d.p.iRow]).removeClass(
                    'edit-cell ui-state-highlight'
                  ),
                  e(d.rows[d.p.iRow]).removeClass(
                    'selected-row ui-state-hover'
                  )),
                  e(s).addClass('edit-cell ui-state-highlight'),
                  e(d.rows[t]).addClass('selected-row ui-state-hover');
                try {
                  o = e.unformat.call(
                    d,
                    s,
                    { rowId: d.rows[t].id, colModel: n },
                    i
                  );
                } catch (l) {
                  o =
                    n.edittype && 'textarea' === n.edittype
                      ? e(s).text()
                      : e(s).html();
                }
                if (
                  (d.p.autoencode && (o = e.jgrid.htmlDecode(o)),
                  n.edittype || (n.edittype = 'text'),
                  d.p.savedRow.push({ id: t, ic: i, name: a, v: o }),
                  ('&nbsp;' === o ||
                    '&#160;' === o ||
                    (1 === o.length && 160 === o.charCodeAt(0))) &&
                    (o = ''),
                  e.isFunction(d.p.formatCell))
                ) {
                  var p = d.p.formatCell.call(d, d.rows[t].id, a, o, t, i);
                  void 0 !== p && (o = p);
                }
                e(d).triggerHandler('jqGridBeforeEditCell', [
                  d.rows[t].id,
                  a,
                  o,
                  t,
                  i,
                ]),
                  e.isFunction(d.p.beforeEditCell) &&
                    d.p.beforeEditCell.call(d, d.rows[t].id, a, o, t, i);
                var c = e.extend({}, n.editoptions || {}, {
                    id: t + '_' + a,
                    name: a,
                    rowId: d.rows[t].id,
                  }),
                  u = e.jgrid.createEl.call(
                    d,
                    n.edittype,
                    c,
                    o,
                    !0,
                    e.extend(
                      {},
                      e.jgrid.ajaxOptions,
                      d.p.ajaxSelectOptions || {}
                    )
                  );
                e(s).html('').append(u).attr('tabindex', '0'),
                  e.jgrid.bindEv.call(d, u, c),
                  window.setTimeout(function () {
                    e(u).focus();
                  }, 1),
                  e('input, select, textarea', s).bind('keydown', function (r) {
                    if (
                      (27 === r.keyCode &&
                        (e('input.hasDatepicker', s).length > 0
                          ? e('.ui-datepicker').is(':hidden')
                            ? e(d).jqGrid('restoreCell', t, i)
                            : e('input.hasDatepicker', s).datepicker('hide')
                          : e(d).jqGrid('restoreCell', t, i)),
                      13 === r.keyCode && !r.shiftKey)
                    )
                      return e(d).jqGrid('saveCell', t, i), !1;
                    if (9 === r.keyCode) {
                      if (d.grid.hDiv.loading) return !1;
                      r.shiftKey
                        ? e(d).jqGrid('prevCell', t, i)
                        : e(d).jqGrid('nextCell', t, i);
                    }
                    r.stopPropagation();
                  }),
                  e(d).triggerHandler('jqGridAfterEditCell', [
                    d.rows[t].id,
                    a,
                    o,
                    t,
                    i,
                  ]),
                  e.isFunction(d.p.afterEditCell) &&
                    d.p.afterEditCell.call(d, d.rows[t].id, a, o, t, i);
              }
              (d.p.iCol = i), (d.p.iRow = t);
            }
          }
        });
      },
      saveCell: function (t, i) {
        return this.each(function () {
          var r,
            a = this;
          if (a.grid && a.p.cellEdit === !0) {
            if (((r = a.p.savedRow.length >= 1 ? 0 : null), null !== r)) {
              var o,
                s,
                n = e('td:eq(' + i + ')', a.rows[t]),
                d = a.p.colModel[i],
                l = d.name,
                p = e.jgrid.jqID(l);
              switch (d.edittype) {
                case 'select':
                  if (d.editoptions.multiple) {
                    var c = e('#' + t + '_' + p, a.rows[t]),
                      u = [];
                    (o = e(c).val()),
                      o ? o.join(',') : (o = ''),
                      e('option:selected', c).each(function (t, i) {
                        u[t] = e(i).text();
                      }),
                      (s = u.join(','));
                  } else
                    (o = e(
                      '#' + t + '_' + p + ' option:selected',
                      a.rows[t]
                    ).val()),
                      (s = e(
                        '#' + t + '_' + p + ' option:selected',
                        a.rows[t]
                      ).text());
                  d.formatter && (s = o);
                  break;
                case 'checkbox':
                  var h = ['Yes', 'No'];
                  d.editoptions && (h = d.editoptions.value.split(':')),
                    (o = e('#' + t + '_' + p, a.rows[t]).is(':checked')
                      ? h[0]
                      : h[1]),
                    (s = o);
                  break;
                case 'password':
                case 'text':
                case 'textarea':
                case 'button':
                  (o = e('#' + t + '_' + p, a.rows[t]).val()), (s = o);
                  break;
                case 'custom':
                  try {
                    if (
                      !d.editoptions ||
                      !e.isFunction(d.editoptions.custom_value)
                    )
                      throw 'e1';
                    if (
                      ((o = d.editoptions.custom_value.call(
                        a,
                        e('.customelement', n),
                        'get'
                      )),
                      void 0 === o)
                    )
                      throw 'e2';
                    s = o;
                  } catch (g) {
                    'e1' === g &&
                      e.jgrid.info_dialog(
                        e.jgrid.errors.errcap,
                        "function 'custom_value' " + e.jgrid.edit.msg.nodefined,
                        e.jgrid.edit.bClose
                      ),
                      'e2' === g
                        ? e.jgrid.info_dialog(
                            e.jgrid.errors.errcap,
                            "function 'custom_value' " +
                              e.jgrid.edit.msg.novalue,
                            e.jgrid.edit.bClose
                          )
                        : e.jgrid.info_dialog(
                            e.jgrid.errors.errcap,
                            g.message,
                            e.jgrid.edit.bClose
                          );
                  }
              }
              if (s !== a.p.savedRow[r].v) {
                var f = e(a).triggerHandler('jqGridBeforeSaveCell', [
                  a.rows[t].id,
                  l,
                  o,
                  t,
                  i,
                ]);
                if (
                  (f && ((o = f), (s = f)), e.isFunction(a.p.beforeSaveCell))
                ) {
                  var m = a.p.beforeSaveCell.call(a, a.rows[t].id, l, o, t, i);
                  m && ((o = m), (s = m));
                }
                var v = e.jgrid.checkValues.call(a, o, i);
                if (v[0] === !0) {
                  var j =
                    e(a).triggerHandler('jqGridBeforeSubmitCell', [
                      a.rows[t].id,
                      l,
                      o,
                      t,
                      i,
                    ]) || {};
                  if (
                    (e.isFunction(a.p.beforeSubmitCell) &&
                      ((j = a.p.beforeSubmitCell.call(
                        a,
                        a.rows[t].id,
                        l,
                        o,
                        t,
                        i
                      )),
                      j || (j = {})),
                    e('input.hasDatepicker', n).length > 0 &&
                      e('input.hasDatepicker', n).datepicker('hide'),
                    'remote' === a.p.cellsubmit)
                  )
                    if (a.p.cellurl) {
                      var b = {};
                      a.p.autoencode && (o = e.jgrid.htmlEncode(o)), (b[l] = o);
                      var w, y, x;
                      (x = a.p.prmNames),
                        (w = x.id),
                        (y = x.oper),
                        (b[w] = e.jgrid.stripPref(a.p.idPrefix, a.rows[t].id)),
                        (b[y] = x.editoper),
                        (b = e.extend(j, b)),
                        e(a).jqGrid('progressBar', {
                          method: 'show',
                          loadtype: a.p.loadui,
                          htmlcontent: e.jgrid.defaults.savetext || 'Saving...',
                        }),
                        (a.grid.hDiv.loading = !0),
                        e.ajax(
                          e.extend(
                            {
                              url: a.p.cellurl,
                              data: e.isFunction(a.p.serializeCellData)
                                ? a.p.serializeCellData.call(a, b)
                                : b,
                              type: 'POST',
                              complete: function (r, d) {
                                if (
                                  (e(a).jqGrid('progressBar', {
                                    method: 'hide',
                                    loadtype: a.p.loadui,
                                  }),
                                  (a.grid.hDiv.loading = !1),
                                  'success' === d)
                                ) {
                                  var p = e(a).triggerHandler(
                                    'jqGridAfterSubmitCell',
                                    [a, r, b.id, l, o, t, i]
                                  ) || [!0, ''];
                                  p[0] === !0 &&
                                    e.isFunction(a.p.afterSubmitCell) &&
                                    (p = a.p.afterSubmitCell.call(
                                      a,
                                      r,
                                      b.id,
                                      l,
                                      o,
                                      t,
                                      i
                                    )),
                                    p[0] === !0
                                      ? (e(n).empty(),
                                        e(a).jqGrid(
                                          'setCell',
                                          a.rows[t].id,
                                          i,
                                          s,
                                          !1,
                                          !1,
                                          !0
                                        ),
                                        e(n).addClass('dirty-cell'),
                                        e(a.rows[t]).addClass('edited'),
                                        e(a).triggerHandler(
                                          'jqGridAfterSaveCell',
                                          [a.rows[t].id, l, o, t, i]
                                        ),
                                        e.isFunction(a.p.afterSaveCell) &&
                                          a.p.afterSaveCell.call(
                                            a,
                                            a.rows[t].id,
                                            l,
                                            o,
                                            t,
                                            i
                                          ),
                                        a.p.savedRow.splice(0, 1))
                                      : (e.jgrid.info_dialog(
                                          e.jgrid.errors.errcap,
                                          p[1],
                                          e.jgrid.edit.bClose
                                        ),
                                        e(a).jqGrid('restoreCell', t, i));
                                }
                              },
                              error: function (r, o, s) {
                                e('#lui_' + e.jgrid.jqID(a.p.id)).hide(),
                                  (a.grid.hDiv.loading = !1),
                                  e(a).triggerHandler('jqGridErrorCell', [
                                    r,
                                    o,
                                    s,
                                  ]),
                                  e.isFunction(a.p.errorCell)
                                    ? (a.p.errorCell.call(a, r, o, s),
                                      e(a).jqGrid('restoreCell', t, i))
                                    : (e.jgrid.info_dialog(
                                        e.jgrid.errors.errcap,
                                        r.status +
                                          ' : ' +
                                          r.statusText +
                                          '<br/>' +
                                          o,
                                        e.jgrid.edit.bClose
                                      ),
                                      e(a).jqGrid('restoreCell', t, i));
                              },
                            },
                            e.jgrid.ajaxOptions,
                            a.p.ajaxCellOptions || {}
                          )
                        );
                    } else
                      try {
                        e.jgrid.info_dialog(
                          e.jgrid.errors.errcap,
                          e.jgrid.errors.nourl,
                          e.jgrid.edit.bClose
                        ),
                          e(a).jqGrid('restoreCell', t, i);
                      } catch (g) {}
                  'clientArray' === a.p.cellsubmit &&
                    (e(n).empty(),
                    e(a).jqGrid('setCell', a.rows[t].id, i, s, !1, !1, !0),
                    e(n).addClass('dirty-cell'),
                    e(a.rows[t]).addClass('edited'),
                    e(a).triggerHandler('jqGridAfterSaveCell', [
                      a.rows[t].id,
                      l,
                      o,
                      t,
                      i,
                    ]),
                    e.isFunction(a.p.afterSaveCell) &&
                      a.p.afterSaveCell.call(a, a.rows[t].id, l, o, t, i),
                    a.p.savedRow.splice(0, 1));
                } else
                  try {
                    window.setTimeout(function () {
                      e.jgrid.info_dialog(
                        e.jgrid.errors.errcap,
                        o + ' ' + v[1],
                        e.jgrid.edit.bClose
                      );
                    }, 100),
                      e(a).jqGrid('restoreCell', t, i);
                  } catch (g) {}
              } else e(a).jqGrid('restoreCell', t, i);
            }
            window.setTimeout(function () {
              e('#' + e.jgrid.jqID(a.p.knv))
                .attr('tabindex', '-1')
                .focus();
            }, 0);
          }
        });
      },
      restoreCell: function (t, i) {
        return this.each(function () {
          var r,
            a = this;
          if (a.grid && a.p.cellEdit === !0) {
            if (((r = a.p.savedRow.length >= 1 ? 0 : null), null !== r)) {
              var o = e('td:eq(' + i + ')', a.rows[t]);
              if (e.isFunction(e.fn.datepicker))
                try {
                  e('input.hasDatepicker', o).datepicker('hide');
                } catch (s) {}
              e(o).empty().attr('tabindex', '-1'),
                e(a).jqGrid(
                  'setCell',
                  a.rows[t].id,
                  i,
                  a.p.savedRow[r].v,
                  !1,
                  !1,
                  !0
                ),
                e(a).triggerHandler('jqGridAfterRestoreCell', [
                  a.rows[t].id,
                  a.p.savedRow[r].v,
                  t,
                  i,
                ]),
                e.isFunction(a.p.afterRestoreCell) &&
                  a.p.afterRestoreCell.call(
                    a,
                    a.rows[t].id,
                    a.p.savedRow[r].v,
                    t,
                    i
                  ),
                a.p.savedRow.splice(0, 1);
            }
            window.setTimeout(function () {
              e('#' + a.p.knv)
                .attr('tabindex', '-1')
                .focus();
            }, 0);
          }
        });
      },
      nextCell: function (t, i) {
        return this.each(function () {
          var r,
            a = this,
            o = !1;
          if (a.grid && a.p.cellEdit === !0) {
            for (r = i + 1; r < a.p.colModel.length; r++)
              if (a.p.colModel[r].editable === !0) {
                o = r;
                break;
              }
            o !== !1
              ? e(a).jqGrid('editCell', t, o, !0)
              : a.p.savedRow.length > 0 && e(a).jqGrid('saveCell', t, i);
          }
        });
      },
      prevCell: function (t, i) {
        return this.each(function () {
          var r,
            a = this,
            o = !1;
          if (a.grid && a.p.cellEdit === !0) {
            for (r = i - 1; r >= 0; r--)
              if (a.p.colModel[r].editable === !0) {
                o = r;
                break;
              }
            o !== !1
              ? e(a).jqGrid('editCell', t, o, !0)
              : a.p.savedRow.length > 0 && e(a).jqGrid('saveCell', t, i);
          }
        });
      },
      GridNav: function () {
        return this.each(function () {
          function t(t, i, a) {
            if ('v' === a.substr(0, 1)) {
              var o = e(r.grid.bDiv)[0].clientHeight,
                s = e(r.grid.bDiv)[0].scrollTop,
                n = r.rows[t].offsetTop + r.rows[t].clientHeight,
                d = r.rows[t].offsetTop;
              'vd' === a &&
                n >= o &&
                (e(r.grid.bDiv)[0].scrollTop =
                  e(r.grid.bDiv)[0].scrollTop + r.rows[t].clientHeight),
                'vu' === a &&
                  s > d &&
                  (e(r.grid.bDiv)[0].scrollTop =
                    e(r.grid.bDiv)[0].scrollTop - r.rows[t].clientHeight);
            }
            if ('h' === a) {
              var l = e(r.grid.bDiv)[0].clientWidth,
                p = e(r.grid.bDiv)[0].scrollLeft,
                c =
                  r.rows[t].cells[i].offsetLeft +
                  r.rows[t].cells[i].clientWidth,
                u = r.rows[t].cells[i].offsetLeft;
              c >= l + parseInt(p, 10)
                ? (e(r.grid.bDiv)[0].scrollLeft =
                    e(r.grid.bDiv)[0].scrollLeft +
                    r.rows[t].cells[i].clientWidth)
                : p > u &&
                  (e(r.grid.bDiv)[0].scrollLeft =
                    e(r.grid.bDiv)[0].scrollLeft -
                    r.rows[t].cells[i].clientWidth);
            }
          }
          function i(e, t) {
            var i, a;
            if ('lft' === t)
              for (i = e + 1, a = e; a >= 0; a--)
                if (r.p.colModel[a].hidden !== !0) {
                  i = a;
                  break;
                }
            if ('rgt' === t)
              for (i = e - 1, a = e; a < r.p.colModel.length; a++)
                if (r.p.colModel[a].hidden !== !0) {
                  i = a;
                  break;
                }
            return i;
          }
          var r = this;
          if (r.grid && r.p.cellEdit === !0) {
            r.p.knv = r.p.id + '_kn';
            var a,
              o,
              s = e(
                "<div style='position:fixed;top:0px;width:1px;height:1px;' tabindex='0'><div tabindex='-1' style='width:1px;height:1px;' id='" +
                  r.p.knv +
                  "'></div></div>"
              );
            e(s).insertBefore(r.grid.cDiv),
              e('#' + r.p.knv)
                .focus()
                .keydown(function (s) {
                  switch (
                    ((o = s.keyCode),
                    'rtl' === r.p.direction &&
                      (37 === o ? (o = 39) : 39 === o && (o = 37)),
                    o)
                  ) {
                    case 38:
                      r.p.iRow - 1 > 0 &&
                        (t(r.p.iRow - 1, r.p.iCol, 'vu'),
                        e(r).jqGrid('editCell', r.p.iRow - 1, r.p.iCol, !1));
                      break;
                    case 40:
                      r.p.iRow + 1 <= r.rows.length - 1 &&
                        (t(r.p.iRow + 1, r.p.iCol, 'vd'),
                        e(r).jqGrid('editCell', r.p.iRow + 1, r.p.iCol, !1));
                      break;
                    case 37:
                      r.p.iCol - 1 >= 0 &&
                        ((a = i(r.p.iCol - 1, 'lft')),
                        t(r.p.iRow, a, 'h'),
                        e(r).jqGrid('editCell', r.p.iRow, a, !1));
                      break;
                    case 39:
                      r.p.iCol + 1 <= r.p.colModel.length - 1 &&
                        ((a = i(r.p.iCol + 1, 'rgt')),
                        t(r.p.iRow, a, 'h'),
                        e(r).jqGrid('editCell', r.p.iRow, a, !1));
                      break;
                    case 13:
                      parseInt(r.p.iCol, 10) >= 0 &&
                        parseInt(r.p.iRow, 10) >= 0 &&
                        e(r).jqGrid('editCell', r.p.iRow, r.p.iCol, !0);
                      break;
                    default:
                      return !0;
                  }
                  return !1;
                });
          }
        });
      },
      getChangedCells: function (t) {
        var i = [];
        return (
          t || (t = 'all'),
          this.each(function () {
            var r,
              a = this;
            a.grid &&
              a.p.cellEdit === !0 &&
              e(a.rows).each(function (o) {
                var s = {};
                e(this).hasClass('edited') &&
                  (e('td', this).each(function (i) {
                    if (
                      ((r = a.p.colModel[i].name),
                      'cb' !== r && 'subgrid' !== r)
                    )
                      if ('dirty' === t) {
                        if (e(this).hasClass('dirty-cell'))
                          try {
                            s[r] = e.unformat.call(
                              a,
                              this,
                              {
                                rowId: a.rows[o].id,
                                colModel: a.p.colModel[i],
                              },
                              i
                            );
                          } catch (n) {
                            s[r] = e.jgrid.htmlDecode(e(this).html());
                          }
                      } else
                        try {
                          s[r] = e.unformat.call(
                            a,
                            this,
                            { rowId: a.rows[o].id, colModel: a.p.colModel[i] },
                            i
                          );
                        } catch (n) {
                          s[r] = e.jgrid.htmlDecode(e(this).html());
                        }
                  }),
                  (s.id = this.id),
                  i.push(s));
              });
          }),
          i
        );
      },
    });
  })(jQuery),
  (function (e) {
    'use strict';
    e.extend(e.jgrid, {
      showModal: function (e) {
        e.w.show();
      },
      closeModal: function (e) {
        e.w.hide().attr('aria-hidden', 'true'), e.o && e.o.remove();
      },
      hideModal: function (t, i) {
        i = e.extend(
          { jqm: !0, gb: '', removemodal: !1, formprop: !1, form: '' },
          i || {}
        );
        var r =
          i.gb && 'string' == typeof i.gb && '#gbox_' === i.gb.substr(0, 6)
            ? e('#' + i.gb.substr(6))[0]
            : !1;
        if (i.onClose) {
          var a = r ? i.onClose.call(r, t) : i.onClose(t);
          if ('boolean' == typeof a && !a) return;
        }
        if (i.formprop && r && i.form) {
          var o = e(t)[0].style.height;
          o.indexOf('px') > -1 && (o = parseFloat(o));
          var s, n;
          'edit' === i.form
            ? ((s = '#' + e.jgrid.jqID('FrmGrid_' + i.gb.substr(6))),
              (n = 'formProp'))
            : 'view' === i.form &&
              ((s = '#' + e.jgrid.jqID('ViewGrid_' + i.gb.substr(6))),
              (n = 'viewProp')),
            e(r).data(n, {
              top: parseFloat(e(t).css('top')),
              left: parseFloat(e(t).css('left')),
              width: e(t).width(),
              height: o,
              dataheight: e(s).height(),
              datawidth: e(s).width(),
            });
        }
        if (e.fn.jqm && i.jqm === !0)
          e(t).attr('aria-hidden', 'true').jqmHide();
        else {
          if ('' !== i.gb)
            try {
              e('.jqgrid-overlay:first', i.gb).hide();
            } catch (d) {}
          e(t).hide().attr('aria-hidden', 'true');
        }
        i.removemodal && e(t).remove();
      },
      findPos: function (e) {
        var t = 0,
          i = 0;
        if (e.offsetParent)
          do (t += e.offsetLeft), (i += e.offsetTop);
          while ((e = e.offsetParent));
        return [t, i];
      },
      createModal: function (t, i, r, a, o, s, n) {
        r = e.extend(!0, {}, e.jgrid.jqModal || {}, r);
        var d,
          l = document.createElement('div'),
          p = this;
        (n = e.extend({}, n || {})),
          (d = 'rtl' === e(r.gbox).attr('dir') ? !0 : !1),
          (l.className =
            'ui-widget ui-widget-content ui-corner-all ui-jqdialog'),
          (l.id = t.themodal);
        var c = document.createElement('div');
        (c.className =
          'ui-jqdialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix'),
          (c.id = t.modalhead),
          e(c).append(
            "<span class='ui-jqdialog-title'>" + r.caption + '</span>'
          );
        var u = e("<a class='ui-jqdialog-titlebar-close ui-corner-all'></a>")
          .hover(
            function () {
              u.addClass('ui-state-hover');
            },
            function () {
              u.removeClass('ui-state-hover');
            }
          )
          .append("<span class='ui-icon ui-icon-closethick'></span>");
        e(c).append(u),
          d
            ? ((l.dir = 'rtl'),
              e('.ui-jqdialog-title', c).css('float', 'right'),
              e('.ui-jqdialog-titlebar-close', c).css('left', '0.3em'))
            : ((l.dir = 'ltr'),
              e('.ui-jqdialog-title', c).css('float', 'left'),
              e('.ui-jqdialog-titlebar-close', c).css('right', '0.3em'));
        var h = document.createElement('div');
        e(h)
          .addClass('ui-jqdialog-content ui-widget-content')
          .attr('id', t.modalcontent),
          e(h).append(i),
          l.appendChild(h),
          e(l).prepend(c),
          s === !0
            ? e('body').append(l)
            : 'string' == typeof s
              ? e(s).append(l)
              : e(l).insertBefore(a),
          e(l).css(n),
          void 0 === r.jqModal && (r.jqModal = !0);
        var g = {};
        if (e.fn.jqm && r.jqModal === !0) {
          if (0 === r.left && 0 === r.top && r.overlay) {
            var f = [];
            (f = e.jgrid.findPos(o)), (r.left = f[0] + 4), (r.top = f[1] + 4);
          }
          (g.top = r.top + 'px'), (g.left = r.left);
        } else
          (0 !== r.left || 0 !== r.top) &&
            ((g.left = r.left), (g.top = r.top + 'px'));
        if (
          (e('a.ui-jqdialog-titlebar-close', c).click(function () {
            var i =
                e('#' + e.jgrid.jqID(t.themodal)).data('onClose') || r.onClose,
              a = e('#' + e.jgrid.jqID(t.themodal)).data('gbox') || r.gbox;
            return (
              p.hideModal('#' + e.jgrid.jqID(t.themodal), {
                gb: a,
                jqm: r.jqModal,
                onClose: i,
                removemodal: r.removemodal || !1,
                formprop: !r.recreateForm || !1,
                form: r.form || '',
              }),
              !1
            );
          }),
          (0 !== r.width && r.width) || (r.width = 300),
          (0 !== r.height && r.height) || (r.height = 200),
          !r.zIndex)
        ) {
          var m = e(a)
            .parents('*[role=dialog]')
            .filter(':first')
            .css('z-index');
          r.zIndex = m ? parseInt(m, 10) + 2 : 950;
        }
        var v = 0;
        if (
          (d &&
            g.left &&
            !s &&
            ((v =
              e(r.gbox).width() -
              (isNaN(r.width) ? 0 : parseInt(r.width, 10)) -
              8),
            (g.left = parseInt(g.left, 10) + parseInt(v, 10))),
          g.left && (g.left += 'px'),
          e(l)
            .css(
              e.extend(
                {
                  width: isNaN(r.width) ? 'auto' : r.width + 'px',
                  height: isNaN(r.height) ? 'auto' : r.height + 'px',
                  zIndex: r.zIndex,
                  overflow: 'hidden',
                },
                g
              )
            )
            .attr({
              tabIndex: '-1',
              role: 'dialog',
              'aria-labelledby': t.modalhead,
              'aria-hidden': 'true',
            }),
          void 0 === r.drag && (r.drag = !0),
          void 0 === r.resize && (r.resize = !0),
          r.drag)
        )
          if ((e(c).css('cursor', 'move'), e.fn.jqDrag)) e(l).jqDrag(c);
          else
            try {
              e(l).draggable({ handle: e('#' + e.jgrid.jqID(c.id)) });
            } catch (j) {}
        if (r.resize)
          if (e.fn.jqResize)
            e(l).append(
              "<div class='jqResize ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se'></div>"
            ),
              e('#' + e.jgrid.jqID(t.themodal)).jqResize(
                '.jqResize',
                t.scrollelm ? '#' + e.jgrid.jqID(t.scrollelm) : !1
              );
          else
            try {
              e(l).resizable({
                handles: 'se, sw',
                alsoResize: t.scrollelm ? '#' + e.jgrid.jqID(t.scrollelm) : !1,
              });
            } catch (b) {}
        r.closeOnEscape === !0 &&
          e(l).keydown(function (i) {
            if (27 === i.which) {
              var a =
                e('#' + e.jgrid.jqID(t.themodal)).data('onClose') || r.onClose;
              p.hideModal('#' + e.jgrid.jqID(t.themodal), {
                gb: r.gbox,
                jqm: r.jqModal,
                onClose: a,
                removemodal: r.removemodal || !1,
                formprop: !r.recreateForm || !1,
                form: r.form || '',
              });
            }
          });
      },
      viewModal: function (t, i) {
        if (
          ((i = e.extend(
            {
              toTop: !0,
              overlay: 10,
              modal: !1,
              overlayClass: 'ui-widget-overlay',
              onShow: e.jgrid.showModal,
              onHide: e.jgrid.closeModal,
              gbox: '',
              jqm: !0,
              jqM: !0,
            },
            i || {}
          )),
          e.fn.jqm && i.jqm === !0)
        )
          i.jqM
            ? e(t).attr('aria-hidden', 'false').jqm(i).jqmShow()
            : e(t).attr('aria-hidden', 'false').jqmShow();
        else {
          '' !== i.gbox &&
            (e('.jqgrid-overlay:first', i.gbox).show(),
            e(t).data('gbox', i.gbox)),
            e(t).show().attr('aria-hidden', 'false');
          try {
            e(':input:visible', t)[0].focus();
          } catch (r) {}
        }
      },
      info_dialog: function (t, i, r, a) {
        var o = {
          width: 290,
          height: 'auto',
          dataheight: 'auto',
          drag: !0,
          resize: !1,
          left: 250,
          top: 170,
          zIndex: 1e3,
          jqModal: !0,
          modal: !1,
          closeOnEscape: !0,
          align: 'center',
          buttonalign: 'center',
          buttons: [],
        };
        e.extend(
          !0,
          o,
          e.jgrid.jqModal || {},
          { caption: '<b>' + t + '</b>' },
          a || {}
        );
        var s = o.jqModal,
          n = this;
        e.fn.jqm && !s && (s = !1);
        var d,
          l = '';
        if (o.buttons.length > 0)
          for (d = 0; d < o.buttons.length; d++)
            void 0 === o.buttons[d].id &&
              (o.buttons[d].id = 'info_button_' + d),
              (l +=
                "<a id='" +
                o.buttons[d].id +
                "' class='fm-button ui-state-default ui-corner-all'>" +
                o.buttons[d].text +
                '</a>');
        var p = isNaN(o.dataheight) ? o.dataheight : o.dataheight + 'px',
          c = 'text-align:' + o.align + ';',
          u = "<div id='info_id'>";
        (u +=
          "<div id='infocnt' style='margin:0px;padding-bottom:1em;width:100%;overflow:auto;position:relative;height:" +
          p +
          ';' +
          c +
          "'>" +
          i +
          '</div>'),
          (u += r
            ? "<div class='ui-widget-content ui-helper-clearfix' style='text-align:" +
              o.buttonalign +
              ";padding-bottom:0.8em;padding-top:0.5em;background-image: none;border-width: 1px 0 0 0;'><a id='closedialog' class='fm-button ui-state-default ui-corner-all'>" +
              r +
              '</a>' +
              l +
              '</div>'
            : '' !== l
              ? "<div class='ui-widget-content ui-helper-clearfix' style='text-align:" +
                o.buttonalign +
                ";padding-bottom:0.8em;padding-top:0.5em;background-image: none;border-width: 1px 0 0 0;'>" +
                l +
                '</div>'
              : ''),
          (u += '</div>');
        try {
          'false' === e('#info_dialog').attr('aria-hidden') &&
            e.jgrid.hideModal('#info_dialog', { jqm: s }),
            e('#info_dialog').remove();
        } catch (h) {}
        e.jgrid.createModal(
          {
            themodal: 'info_dialog',
            modalhead: 'info_head',
            modalcontent: 'info_content',
            scrollelm: 'infocnt',
          },
          u,
          o,
          '',
          '',
          !0
        ),
          l &&
            e.each(o.buttons, function (t) {
              e('#' + e.jgrid.jqID(this.id), '#info_id').bind(
                'click',
                function () {
                  return o.buttons[t].onClick.call(e('#info_dialog')), !1;
                }
              );
            }),
          e('#closedialog', '#info_id').click(function () {
            return (
              n.hideModal('#info_dialog', {
                jqm: s,
                onClose: e('#info_dialog').data('onClose') || o.onClose,
                gb: e('#info_dialog').data('gbox') || o.gbox,
              }),
              !1
            );
          }),
          e('.fm-button', '#info_dialog').hover(
            function () {
              e(this).addClass('ui-state-hover');
            },
            function () {
              e(this).removeClass('ui-state-hover');
            }
          ),
          e.isFunction(o.beforeOpen) && o.beforeOpen(),
          e.jgrid.viewModal('#info_dialog', {
            onHide: function (e) {
              e.w.hide().remove(), e.o && e.o.remove();
            },
            modal: o.modal,
            jqm: s,
          }),
          e.isFunction(o.afterOpen) && o.afterOpen();
        try {
          e('#info_dialog').focus();
        } catch (g) {}
      },
      bindEv: function (t, i) {
        var r = this;
        e.isFunction(i.dataInit) && i.dataInit.call(r, t, i),
          i.dataEvents &&
            e.each(i.dataEvents, function () {
              void 0 !== this.data
                ? e(t).bind(this.type, this.data, this.fn)
                : e(t).bind(this.type, this.fn);
            });
      },
      createEl: function (t, i, r, a, o) {
        function s(t, i, r) {
          var a = [
            'dataInit',
            'dataEvents',
            'dataUrl',
            'buildSelect',
            'sopt',
            'searchhidden',
            'defaultValue',
            'attr',
            'custom_element',
            'custom_value',
          ];
          void 0 !== r && e.isArray(r) && e.merge(a, r),
            e.each(i, function (i, r) {
              -1 === e.inArray(i, a) && e(t).attr(i, r);
            }),
            i.hasOwnProperty('id') || e(t).attr('id', e.jgrid.randId());
        }
        var n = '',
          d = this;
        switch (t) {
          case 'textarea':
            (n = document.createElement('textarea')),
              a
                ? i.cols || e(n).css({ width: '98%' })
                : i.cols || (i.cols = 20),
              i.rows || (i.rows = 2),
              ('&nbsp;' === r ||
                '&#160;' === r ||
                (1 === r.length && 160 === r.charCodeAt(0))) &&
                (r = ''),
              (n.value = r),
              s(n, i),
              e(n).attr({ role: 'textbox', multiline: 'true' });
            break;
          case 'checkbox':
            if (
              ((n = document.createElement('input')),
              (n.type = 'checkbox'),
              i.value)
            ) {
              var l = i.value.split(':');
              r === l[0] && ((n.checked = !0), (n.defaultChecked = !0)),
                (n.value = l[0]),
                e(n).attr('offval', l[1]);
            } else {
              var p = (r + '').toLowerCase();
              p.search(/(false|f|0|no|n|off|undefined)/i) < 0 && '' !== p
                ? ((n.checked = !0), (n.defaultChecked = !0), (n.value = r))
                : (n.value = 'on'),
                e(n).attr('offval', 'off');
            }
            s(n, i, ['value']), e(n).attr('role', 'checkbox');
            break;
          case 'select':
            (n = document.createElement('select')),
              n.setAttribute('role', 'select');
            var c,
              u = [];
            if (
              (i.multiple === !0
                ? ((c = !0),
                  (n.multiple = 'multiple'),
                  e(n).attr('aria-multiselectable', 'true'))
                : (c = !1),
              void 0 !== i.dataUrl)
            ) {
              var h = null,
                g = i.postData || o.postData;
              try {
                h = i.rowId;
              } catch (f) {}
              d.p && d.p.idPrefix && (h = e.jgrid.stripPref(d.p.idPrefix, h)),
                e.ajax(
                  e.extend(
                    {
                      url: e.isFunction(i.dataUrl)
                        ? i.dataUrl.call(d, h, r, String(i.name))
                        : i.dataUrl,
                      type: 'GET',
                      dataType: 'html',
                      data: e.isFunction(g)
                        ? g.call(d, h, r, String(i.name))
                        : g,
                      context: { elem: n, options: i, vl: r },
                      success: function (t) {
                        var i = [],
                          r = this.elem,
                          a = this.vl,
                          o = e.extend({}, this.options),
                          n = o.multiple === !0,
                          l = e.isFunction(o.buildSelect)
                            ? o.buildSelect.call(d, t)
                            : t;
                        'string' == typeof l && (l = e(e.trim(l)).html()),
                          l &&
                            (e(r).append(l),
                            s(r, o, g ? ['postData'] : void 0),
                            void 0 === o.size && (o.size = n ? 3 : 1),
                            n
                              ? ((i = a.split(',')),
                                (i = e.map(i, function (t) {
                                  return e.trim(t);
                                })))
                              : (i[0] = e.trim(a)),
                            setTimeout(function () {
                              e('option', r).each(function (t) {
                                0 === t && r.multiple && (this.selected = !1),
                                  e(this).attr('role', 'option'),
                                  (e.inArray(e.trim(e(this).text()), i) > -1 ||
                                    e.inArray(e.trim(e(this).val()), i) > -1) &&
                                    (this.selected = 'selected');
                              });
                            }, 0));
                      },
                    },
                    o || {}
                  )
                );
            } else if (i.value) {
              var m;
              void 0 === i.size && (i.size = c ? 3 : 1),
                c &&
                  ((u = r.split(',')),
                  (u = e.map(u, function (t) {
                    return e.trim(t);
                  }))),
                'function' == typeof i.value && (i.value = i.value());
              var v,
                j,
                b,
                w = void 0 === i.separator ? ':' : i.separator,
                y = void 0 === i.delimiter ? ';' : i.delimiter;
              if ('string' == typeof i.value)
                for (v = i.value.split(y), m = 0; m < v.length; m++)
                  (j = v[m].split(w)),
                    j.length > 2 &&
                      (j[1] = e
                        .map(j, function (e, t) {
                          return t > 0 ? e : void 0;
                        })
                        .join(w)),
                    (b = document.createElement('option')),
                    b.setAttribute('role', 'option'),
                    (b.value = j[0]),
                    (b.innerHTML = j[1]),
                    n.appendChild(b),
                    c ||
                      (e.trim(j[0]) !== e.trim(r) &&
                        e.trim(j[1]) !== e.trim(r)) ||
                      (b.selected = 'selected'),
                    c &&
                      (e.inArray(e.trim(j[1]), u) > -1 ||
                        e.inArray(e.trim(j[0]), u) > -1) &&
                      (b.selected = 'selected');
              else if ('object' == typeof i.value) {
                var x,
                  q = i.value;
                for (x in q)
                  q.hasOwnProperty(x) &&
                    ((b = document.createElement('option')),
                    b.setAttribute('role', 'option'),
                    (b.value = x),
                    (b.innerHTML = q[x]),
                    n.appendChild(b),
                    c ||
                      (e.trim(x) !== e.trim(r) && e.trim(q[x]) !== e.trim(r)) ||
                      (b.selected = 'selected'),
                    c &&
                      (e.inArray(e.trim(q[x]), u) > -1 ||
                        e.inArray(e.trim(x), u) > -1) &&
                      (b.selected = 'selected'));
              }
              s(n, i, ['value']);
            }
            break;
          case 'text':
          case 'password':
          case 'button':
            var D;
            (D = 'button' === t ? 'button' : 'textbox'),
              (n = document.createElement('input')),
              (n.type = t),
              (n.value = r),
              s(n, i),
              'button' !== t &&
                (a
                  ? i.size || e(n).css({ width: '98%' })
                  : i.size || (i.size = 20)),
              e(n).attr('role', D);
            break;
          case 'image':
          case 'file':
            (n = document.createElement('input')), (n.type = t), s(n, i);
            break;
          case 'custom':
            n = document.createElement('span');
            try {
              if (!e.isFunction(i.custom_element)) throw 'e1';
              var $ = i.custom_element.call(d, r, i);
              if (!$) throw 'e2';
              ($ = e($)
                .addClass('customelement')
                .attr({ id: i.id, name: i.name })),
                e(n).empty().append($);
            } catch (f) {
              'e1' === f &&
                e.jgrid.info_dialog(
                  e.jgrid.errors.errcap,
                  "function 'custom_element' " + e.jgrid.edit.msg.nodefined,
                  e.jgrid.edit.bClose
                ),
                'e2' === f
                  ? e.jgrid.info_dialog(
                      e.jgrid.errors.errcap,
                      "function 'custom_element' " + e.jgrid.edit.msg.novalue,
                      e.jgrid.edit.bClose
                    )
                  : e.jgrid.info_dialog(
                      e.jgrid.errors.errcap,
                      'string' == typeof f ? f : f.message,
                      e.jgrid.edit.bClose
                    );
            }
        }
        return n;
      },
      checkDate: function (e, t) {
        var i,
          r = function (e) {
            return e % 4 !== 0 || (e % 100 === 0 && e % 400 !== 0) ? 28 : 29;
          },
          a = {};
        if (
          ((e = e.toLowerCase()),
          (i =
            -1 !== e.indexOf('/')
              ? '/'
              : -1 !== e.indexOf('-')
                ? '-'
                : -1 !== e.indexOf('.')
                  ? '.'
                  : '/'),
          (e = e.split(i)),
          (t = t.split(i)),
          3 !== t.length)
        )
          return !1;
        var o,
          s,
          n = -1,
          d = -1,
          l = -1;
        for (s = 0; s < e.length; s++) {
          var p = isNaN(t[s]) ? 0 : parseInt(t[s], 10);
          (a[e[s]] = p),
            (o = e[s]),
            -1 !== o.indexOf('y') && (n = s),
            -1 !== o.indexOf('m') && (l = s),
            -1 !== o.indexOf('d') && (d = s);
        }
        o = 'y' === e[n] || 'yyyy' === e[n] ? 4 : 'yy' === e[n] ? 2 : -1;
        var c,
          u = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return -1 === n
          ? !1
          : ((c = a[e[n]].toString()),
            2 === o && 1 === c.length && (o = 1),
            c.length !== o || (0 === a[e[n]] && '00' !== t[n])
              ? !1
              : -1 === l
                ? !1
                : ((c = a[e[l]].toString()),
                  c.length < 1 || a[e[l]] < 1 || a[e[l]] > 12
                    ? !1
                    : -1 === d
                      ? !1
                      : ((c = a[e[d]].toString()),
                        c.length < 1 ||
                        a[e[d]] < 1 ||
                        a[e[d]] > 31 ||
                        (2 === a[e[l]] && a[e[d]] > r(a[e[n]])) ||
                        a[e[d]] > u[a[e[l]]]
                          ? !1
                          : !0)));
      },
      isEmpty: function (e) {
        return e.match(/^\s+$/) || '' === e ? !0 : !1;
      },
      checkTime: function (t) {
        var i,
          r = /^(\d{1,2}):(\d{2})([apAP][Mm])?$/;
        if (!e.jgrid.isEmpty(t)) {
          if (((i = t.match(r)), !i)) return !1;
          if (i[3]) {
            if (i[1] < 1 || i[1] > 12) return !1;
          } else if (i[1] > 23) return !1;
          if (i[2] > 59) return !1;
        }
        return !0;
      },
      checkValues: function (t, i, r, a) {
        var o,
          s,
          n,
          d,
          l,
          p = this,
          c = p.p.colModel;
        if (void 0 === r)
          if ('string' == typeof i) {
            for (s = 0, l = c.length; l > s; s++)
              if (c[s].name === i) {
                (o = c[s].editrules),
                  (i = s),
                  null != c[s].formoptions && (n = c[s].formoptions.label);
                break;
              }
          } else i >= 0 && (o = c[i].editrules);
        else (o = r), (n = void 0 === a ? '_' : a);
        if (o) {
          if (
            (n || (n = null != p.p.colNames ? p.p.colNames[i] : c[i].label),
            o.required === !0 && e.jgrid.isEmpty(t))
          )
            return [!1, n + ': ' + e.jgrid.edit.msg.required, ''];
          var u = o.required === !1 ? !1 : !0;
          if (o.number === !0 && (u !== !1 || !e.jgrid.isEmpty(t)) && isNaN(t))
            return [!1, n + ': ' + e.jgrid.edit.msg.number, ''];
          if (
            void 0 !== o.minValue &&
            !isNaN(o.minValue) &&
            parseFloat(t) < parseFloat(o.minValue)
          )
            return [
              !1,
              n + ': ' + e.jgrid.edit.msg.minValue + ' ' + o.minValue,
              '',
            ];
          if (
            void 0 !== o.maxValue &&
            !isNaN(o.maxValue) &&
            parseFloat(t) > parseFloat(o.maxValue)
          )
            return [
              !1,
              n + ': ' + e.jgrid.edit.msg.maxValue + ' ' + o.maxValue,
              '',
            ];
          var h;
          if (
            o.email === !0 &&
            !(
              (u === !1 && e.jgrid.isEmpty(t)) ||
              ((h =
                /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i),
              h.test(t))
            )
          )
            return [!1, n + ': ' + e.jgrid.edit.msg.email, ''];
          if (o.integer === !0 && (u !== !1 || !e.jgrid.isEmpty(t))) {
            if (isNaN(t)) return [!1, n + ': ' + e.jgrid.edit.msg.integer, ''];
            if (t % 1 !== 0 || -1 !== t.indexOf('.'))
              return [!1, n + ': ' + e.jgrid.edit.msg.integer, ''];
          }
          if (
            o.date === !0 &&
            !(
              (u === !1 && e.jgrid.isEmpty(t)) ||
              (c[i].formatoptions && c[i].formatoptions.newformat
                ? ((d = c[i].formatoptions.newformat),
                  e.jgrid.formatter.date.masks.hasOwnProperty(d) &&
                    (d = e.jgrid.formatter.date.masks[d]))
                : (d = c[i].datefmt || 'Y-m-d'),
              e.jgrid.checkDate(d, t))
            )
          )
            return [!1, n + ': ' + e.jgrid.edit.msg.date + ' - ' + d, ''];
          if (
            o.time === !0 &&
            !((u === !1 && e.jgrid.isEmpty(t)) || e.jgrid.checkTime(t))
          )
            return [
              !1,
              n + ': ' + e.jgrid.edit.msg.date + ' - hh:mm (am/pm)',
              '',
            ];
          if (
            o.url === !0 &&
            !(
              (u === !1 && e.jgrid.isEmpty(t)) ||
              ((h =
                /^(((https?)|(ftp)):\/\/([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*\/?)/i),
              h.test(t))
            )
          )
            return [!1, n + ': ' + e.jgrid.edit.msg.url, ''];
          if (o.custom === !0 && (u !== !1 || !e.jgrid.isEmpty(t))) {
            if (e.isFunction(o.custom_func)) {
              var g = o.custom_func.call(p, t, n, i);
              return e.isArray(g) ? g : [!1, e.jgrid.edit.msg.customarray, ''];
            }
            return [!1, e.jgrid.edit.msg.customfcheck, ''];
          }
        }
        return [!0, '', ''];
      },
    });
  })(jQuery),
  (function (e) {
    'use strict';
    e.jgrid.extend({
      getColProp: function (e) {
        var t = {},
          i = this[0];
        if (!i.grid) return !1;
        var r,
          a = i.p.colModel;
        for (r = 0; r < a.length; r++)
          if (a[r].name === e) {
            t = a[r];
            break;
          }
        return t;
      },
      setColProp: function (t, i) {
        return this.each(function () {
          if (this.grid && i) {
            var r,
              a = this.p.colModel;
            for (r = 0; r < a.length; r++)
              if (a[r].name === t) {
                e.extend(!0, this.p.colModel[r], i);
                break;
              }
          }
        });
      },
      sortGrid: function (e, t, i) {
        return this.each(function () {
          var r,
            a = this,
            o = -1,
            s = !1;
          if (a.grid) {
            for (e || (e = a.p.sortname), r = 0; r < a.p.colModel.length; r++)
              if (a.p.colModel[r].index === e || a.p.colModel[r].name === e) {
                (o = r),
                  a.p.frozenColumns === !0 &&
                    a.p.colModel[r].frozen === !0 &&
                    (s = a.grid.fhDiv.find('#' + a.p.id + '_' + e));
                break;
              }
            if (-1 !== o) {
              var n = a.p.colModel[o].sortable;
              s || (s = a.grid.headers[o].el),
                'boolean' != typeof n && (n = !0),
                'boolean' != typeof t && (t = !1),
                n && a.sortData('jqgh_' + a.p.id + '_' + e, o, t, i, s);
            }
          }
        });
      },
      clearBeforeUnload: function () {
        return this.each(function () {
          var t = this.grid;
          e.isFunction(t.emptyRows) && t.emptyRows.call(this, !0, !0),
            e(document).unbind('mouseup.jqGrid' + this.p.id),
            e(t.hDiv).unbind('mousemove'),
            e(this).unbind(),
            (t.dragEnd = null),
            (t.dragMove = null),
            (t.dragStart = null),
            (t.emptyRows = null),
            (t.populate = null),
            (t.populateVisible = null),
            (t.scrollGrid = null),
            (t.selectionPreserver = null),
            (t.bDiv = null),
            (t.cDiv = null),
            (t.hDiv = null),
            (t.cols = null);
          var i,
            r = t.headers.length;
          for (i = 0; r > i; i++) t.headers[i].el = null;
          (this.formatCol = null),
            (this.sortData = null),
            (this.updatepager = null),
            (this.refreshIndex = null),
            (this.setHeadCheckBox = null),
            (this.constructTr = null),
            (this.formatter = null),
            (this.addXmlData = null),
            (this.addJSONData = null),
            (this.grid = null);
        });
      },
      GridDestroy: function () {
        return this.each(function () {
          if (this.grid) {
            this.p.pager && e(this.p.pager).remove();
            try {
              e(this).jqGrid('clearBeforeUnload'),
                e('#gbox_' + e.jgrid.jqID(this.id)).remove(),
                e('#alertmod_' + e.jgrid.jqID(this.id)).remove();
            } catch (t) {}
          }
        });
      },
      GridUnload: function () {
        return this.each(function () {
          if (this.grid) {
            var t = { id: e(this).attr('id'), cl: e(this).attr('class') };
            this.p.pager &&
              e(this.p.pager)
                .empty()
                .removeClass(
                  'ui-state-default ui-jqgrid-pager ui-corner-bottom'
                );
            var i = document.createElement('table');
            e(i).attr({ id: t.id }), (i.className = t.cl);
            var r = e.jgrid.jqID(this.id);
            e(i).removeClass('ui-jqgrid-btable'),
              1 === e(this.p.pager).parents('#gbox_' + r).length
                ? (e(i)
                    .insertBefore('#gbox_' + r)
                    .show(),
                  e(this.p.pager).insertBefore('#gbox_' + r))
                : e(i)
                    .insertBefore('#gbox_' + r)
                    .show(),
              e(this).jqGrid('clearBeforeUnload'),
              e('#gbox_' + r).remove();
          }
        });
      },
      setGridState: function (t) {
        return this.each(function () {
          if (this.grid) {
            var i = this;
            'hidden' === t
              ? (e(
                  '.ui-jqgrid-bdiv, .ui-jqgrid-hdiv',
                  '#gview_' + e.jgrid.jqID(i.p.id)
                ).slideUp('fast'),
                i.p.pager && e(i.p.pager).slideUp('fast'),
                i.p.toppager && e(i.p.toppager).slideUp('fast'),
                i.p.toolbar[0] === !0 &&
                  ('both' === i.p.toolbar[1] && e(i.grid.ubDiv).slideUp('fast'),
                  e(i.grid.uDiv).slideUp('fast')),
                i.p.footerrow &&
                  e('.ui-jqgrid-sdiv', '#gbox_' + e.jgrid.jqID(i.p.id)).slideUp(
                    'fast'
                  ),
                e('.ui-jqgrid-titlebar-close span', i.grid.cDiv)
                  .removeClass('ui-icon-circle-triangle-n')
                  .addClass('ui-icon-circle-triangle-s'),
                (i.p.gridstate = 'hidden'))
              : 'visible' === t &&
                (e(
                  '.ui-jqgrid-hdiv, .ui-jqgrid-bdiv',
                  '#gview_' + e.jgrid.jqID(i.p.id)
                ).slideDown('fast'),
                i.p.pager && e(i.p.pager).slideDown('fast'),
                i.p.toppager && e(i.p.toppager).slideDown('fast'),
                i.p.toolbar[0] === !0 &&
                  ('both' === i.p.toolbar[1] &&
                    e(i.grid.ubDiv).slideDown('fast'),
                  e(i.grid.uDiv).slideDown('fast')),
                i.p.footerrow &&
                  e(
                    '.ui-jqgrid-sdiv',
                    '#gbox_' + e.jgrid.jqID(i.p.id)
                  ).slideDown('fast'),
                e('.ui-jqgrid-titlebar-close span', i.grid.cDiv)
                  .removeClass('ui-icon-circle-triangle-s')
                  .addClass('ui-icon-circle-triangle-n'),
                (i.p.gridstate = 'visible'));
          }
        });
      },
      filterToolbar: function (t) {
        return (
          (t = e.extend(
            {
              autosearch: !0,
              autosearchDelay: 500,
              searchOnEnter: !0,
              beforeSearch: null,
              afterSearch: null,
              beforeClear: null,
              afterClear: null,
              searchurl: '',
              stringResult: !1,
              groupOp: 'AND',
              defaultSearch: 'bw',
              searchOperators: !1,
              resetIcon: 'x',
              operands: {
                eq: '==',
                ne: '!',
                lt: '<',
                le: '<=',
                gt: '>',
                ge: '>=',
                bw: '^',
                bn: '!^',
                in: '=',
                ni: '!=',
                ew: '|',
                en: '!@',
                cn: '~',
                nc: '!~',
                nu: '#',
                nn: '!#',
              },
            },
            e.jgrid.search,
            t || {}
          )),
          this.each(function () {
            var i = this;
            if (!this.ftoolbar) {
              var r,
                a = function () {
                  var r,
                    a,
                    o,
                    s = {},
                    n = 0,
                    d = {};
                  e.each(i.p.colModel, function () {
                    var l = e(
                      '#gs_' + e.jgrid.jqID(this.name),
                      this.frozen === !0 && i.p.frozenColumns === !0
                        ? i.grid.fhDiv
                        : i.grid.hDiv
                    );
                    if (
                      ((a = this.index || this.name),
                      (o = t.searchOperators
                        ? l.parent().prev().children('a').attr('soper') ||
                          t.defaultSearch
                        : this.searchoptions && this.searchoptions.sopt
                          ? this.searchoptions.sopt[0]
                          : 'select' === this.stype
                            ? 'eq'
                            : t.defaultSearch),
                      (r =
                        'custom' === this.stype &&
                        e.isFunction(this.searchoptions.custom_value) &&
                        l.length > 0 &&
                        'SPAN' === l[0].nodeName.toUpperCase()
                          ? this.searchoptions.custom_value.call(
                              i,
                              l.children('.customelement:first'),
                              'get'
                            )
                          : l.val()),
                      r || 'nu' === o || 'nn' === o)
                    )
                      (s[a] = r), (d[a] = o), n++;
                    else
                      try {
                        delete i.p.postData[a];
                      } catch (p) {}
                  });
                  var l = n > 0 ? !0 : !1;
                  if (
                    t.stringResult === !0 ||
                    'local' === i.p.datatype ||
                    t.searchOperators === !0
                  ) {
                    var p = '{"groupOp":"' + t.groupOp + '","rules":[',
                      c = 0;
                    e.each(s, function (e, t) {
                      c > 0 && (p += ','),
                        (p += '{"field":"' + e + '",'),
                        (p += '"op":"' + d[e] + '",'),
                        (t += ''),
                        (p +=
                          '"data":"' +
                          t.replace(/\\/g, '\\\\').replace(/\"/g, '\\"') +
                          '"}'),
                        c++;
                    }),
                      (p += ']}'),
                      e.extend(i.p.postData, { filters: p }),
                      e.each(
                        ['searchField', 'searchString', 'searchOper'],
                        function (e, t) {
                          i.p.postData.hasOwnProperty(t) &&
                            delete i.p.postData[t];
                        }
                      );
                  } else e.extend(i.p.postData, s);
                  var u;
                  i.p.searchurl &&
                    ((u = i.p.url),
                    e(i).jqGrid('setGridParam', { url: i.p.searchurl }));
                  var h =
                    'stop' === e(i).triggerHandler('jqGridToolbarBeforeSearch')
                      ? !0
                      : !1;
                  !h &&
                    e.isFunction(t.beforeSearch) &&
                    (h = t.beforeSearch.call(i)),
                    h ||
                      e(i)
                        .jqGrid('setGridParam', { search: l })
                        .trigger('reloadGrid', [{ page: 1 }]),
                    u && e(i).jqGrid('setGridParam', { url: u }),
                    e(i).triggerHandler('jqGridToolbarAfterSearch'),
                    e.isFunction(t.afterSearch) && t.afterSearch.call(i);
                },
                o = function (r) {
                  var a,
                    o = {},
                    s = 0;
                  (r = 'boolean' != typeof r ? !0 : r),
                    e.each(i.p.colModel, function () {
                      var t,
                        r = e(
                          '#gs_' + e.jgrid.jqID(this.name),
                          this.frozen === !0 && i.p.frozenColumns === !0
                            ? i.grid.fhDiv
                            : i.grid.hDiv
                        );
                      switch (
                        (this.searchoptions &&
                          void 0 !== this.searchoptions.defaultValue &&
                          (t = this.searchoptions.defaultValue),
                        (a = this.index || this.name),
                        this.stype)
                      ) {
                        case 'select':
                          if (
                            (r.find('option').each(function (i) {
                              return (
                                0 === i && (this.selected = !0),
                                e(this).val() === t
                                  ? ((this.selected = !0), !1)
                                  : void 0
                              );
                            }),
                            void 0 !== t)
                          )
                            (o[a] = t), s++;
                          else
                            try {
                              delete i.p.postData[a];
                            } catch (n) {}
                          break;
                        case 'text':
                          if ((r.val(t || ''), void 0 !== t)) (o[a] = t), s++;
                          else
                            try {
                              delete i.p.postData[a];
                            } catch (d) {}
                          break;
                        case 'custom':
                          e.isFunction(this.searchoptions.custom_value) &&
                            r.length > 0 &&
                            'SPAN' === r[0].nodeName.toUpperCase() &&
                            this.searchoptions.custom_value.call(
                              i,
                              r.children('.customelement:first'),
                              'set',
                              t || ''
                            );
                      }
                    });
                  var n = s > 0 ? !0 : !1;
                  if (
                    ((i.p.resetsearch = !0),
                    t.stringResult === !0 || 'local' === i.p.datatype)
                  ) {
                    var d = '{"groupOp":"' + t.groupOp + '","rules":[',
                      l = 0;
                    e.each(o, function (e, t) {
                      l > 0 && (d += ','),
                        (d += '{"field":"' + e + '",'),
                        (d += '"op":"eq",'),
                        (t += ''),
                        (d +=
                          '"data":"' +
                          t.replace(/\\/g, '\\\\').replace(/\"/g, '\\"') +
                          '"}'),
                        l++;
                    }),
                      (d += ']}'),
                      e.extend(i.p.postData, { filters: d }),
                      e.each(
                        ['searchField', 'searchString', 'searchOper'],
                        function (e, t) {
                          i.p.postData.hasOwnProperty(t) &&
                            delete i.p.postData[t];
                        }
                      );
                  } else e.extend(i.p.postData, o);
                  var p;
                  i.p.searchurl &&
                    ((p = i.p.url),
                    e(i).jqGrid('setGridParam', { url: i.p.searchurl }));
                  var c =
                    'stop' === e(i).triggerHandler('jqGridToolbarBeforeClear')
                      ? !0
                      : !1;
                  !c &&
                    e.isFunction(t.beforeClear) &&
                    (c = t.beforeClear.call(i)),
                    c ||
                      (r &&
                        e(i)
                          .jqGrid('setGridParam', { search: n })
                          .trigger('reloadGrid', [{ page: 1 }])),
                    p && e(i).jqGrid('setGridParam', { url: p }),
                    e(i).triggerHandler('jqGridToolbarAfterClear'),
                    e.isFunction(t.afterClear) && t.afterClear();
                },
                s = function () {
                  var t = e('tr.ui-search-toolbar', i.grid.hDiv),
                    r =
                      i.p.frozenColumns === !0
                        ? e('tr.ui-search-toolbar', i.grid.fhDiv)
                        : !1;
                  'none' === t.css('display')
                    ? (t.show(), r && r.show())
                    : (t.hide(), r && r.hide());
                },
                n = function (r, o, s) {
                  e('#sopt_menu').remove(),
                    (o = parseInt(o, 10)),
                    (s = parseInt(s, 10) + 18);
                  for (
                    var n,
                      d,
                      l = e('.ui-jqgrid-view').css('font-size') || '11px',
                      p =
                        '<ul id="sopt_menu" class="ui-search-menu" role="menu" tabindex="0" style="font-size:' +
                        l +
                        ';left:' +
                        o +
                        'px;top:' +
                        s +
                        'px;">',
                      c = e(r).attr('soper'),
                      u = [],
                      h = 0,
                      g = e(r).attr('colname'),
                      f = i.p.colModel.length;
                    f > h && i.p.colModel[h].name !== g;

                  )
                    h++;
                  var m = i.p.colModel[h],
                    v = e.extend({}, m.searchoptions);
                  for (
                    v.sopt ||
                      ((v.sopt = []),
                      (v.sopt[0] =
                        'select' === m.stype ? 'eq' : t.defaultSearch)),
                      e.each(t.odata, function () {
                        u.push(this.oper);
                      }),
                      h = 0;
                    h < v.sopt.length;
                    h++
                  )
                    (d = e.inArray(v.sopt[h], u)),
                      -1 !== d &&
                        ((n =
                          c === t.odata[d].oper ? 'ui-state-highlight' : ''),
                        (p +=
                          '<li class="ui-menu-item ' +
                          n +
                          '" role="presentation"><a class="ui-corner-all g-menu-item" tabindex="0" role="menuitem" value="' +
                          t.odata[d].oper +
                          '" oper="' +
                          t.operands[t.odata[d].oper] +
                          '"><table cellspacing="0" cellpadding="0" border="0"><tr><td width="25px">' +
                          t.operands[t.odata[d].oper] +
                          '</td><td>' +
                          t.odata[d].text +
                          '</td></tr></table></a></li>'));
                  (p += '</ul>'),
                    e('body').append(p),
                    e('#sopt_menu').addClass(
                      'ui-menu ui-widget ui-widget-content ui-corner-all'
                    ),
                    e('#sopt_menu > li > a')
                      .hover(
                        function () {
                          e(this).addClass('ui-state-hover');
                        },
                        function () {
                          e(this).removeClass('ui-state-hover');
                        }
                      )
                      .click(function () {
                        var o = e(this).attr('value'),
                          s = e(this).attr('oper');
                        if (
                          (e(i).triggerHandler('jqGridToolbarSelectOper', [
                            o,
                            s,
                            r,
                          ]),
                          e('#sopt_menu').hide(),
                          e(r).text(s).attr('soper', o),
                          t.autosearch === !0)
                        ) {
                          var n = e(r).parent().next().children()[0];
                          (e(n).val() || 'nu' === o || 'nn' === o) && a();
                        }
                      });
                },
                d = e("<tr class='ui-search-toolbar' role='row'></tr>");
              e.each(i.p.colModel, function (o) {
                var s,
                  n,
                  l,
                  p,
                  c,
                  u = this,
                  h = '',
                  g = '=',
                  f = e(
                    "<th role='columnheader' class='ui-state-default ui-th-column ui-th-" +
                      i.p.direction +
                      "'></th>"
                  ),
                  m = e(
                    "<div style='position:relative;height:auto;padding-right:0.3em;padding-left:0.3em;'></div>"
                  ),
                  v = e(
                    "<table class='ui-search-table' cellspacing='0'><tr><td class='ui-search-oper'></td><td class='ui-search-input'></td><td class='ui-search-clear'></td></tr></table>"
                  );
                if (
                  (this.hidden === !0 && e(f).css('display', 'none'),
                  (this.search = this.search === !1 ? !1 : !0),
                  void 0 === this.stype && (this.stype = 'text'),
                  (s = e.extend({}, this.searchoptions || {})),
                  this.search)
                ) {
                  if (t.searchOperators) {
                    for (
                      p = s.sopt
                        ? s.sopt[0]
                        : 'select' === u.stype
                          ? 'eq'
                          : t.defaultSearch,
                        c = 0;
                      c < t.odata.length;
                      c++
                    )
                      if (t.odata[c].oper === p) {
                        g = t.operands[p] || '';
                        break;
                      }
                    var j =
                      null != s.searchtitle ? s.searchtitle : t.operandTitle;
                    h =
                      "<a title='" +
                      j +
                      "' style='padding-right: 0.5em;' soper='" +
                      p +
                      "' class='soptclass' colname='" +
                      this.name +
                      "'>" +
                      g +
                      '</a>';
                  }
                  if (
                    (e('td:eq(0)', v).attr('colindex', o).append(h),
                    void 0 === s.clearSearch && (s.clearSearch = !0),
                    s.clearSearch)
                  ) {
                    var b = t.resetTitle || 'Clear Search Value';
                    e('td:eq(2)', v).append(
                      "<a title='" +
                        b +
                        "' style='padding-right: 0.3em;padding-left: 0.3em;' class='clearsearchclass'>" +
                        t.resetIcon +
                        '</a>'
                    );
                  } else e('td:eq(2)', v).hide();
                  switch (this.stype) {
                    case 'select':
                      if ((n = this.surl || s.dataUrl))
                        (l = m),
                          e(l).append(v),
                          e.ajax(
                            e.extend(
                              {
                                url: n,
                                dataType: 'html',
                                success: function (r) {
                                  if (void 0 !== s.buildSelect) {
                                    var o = s.buildSelect(r);
                                    o && e('td:eq(1)', v).append(o);
                                  } else e('td:eq(1)', v).append(r);
                                  void 0 !== s.defaultValue &&
                                    e('select', l).val(s.defaultValue),
                                    e('select', l).attr({
                                      name: u.index || u.name,
                                      id: 'gs_' + u.name,
                                    }),
                                    s.attr && e('select', l).attr(s.attr),
                                    e('select', l).css({ width: '100%' }),
                                    e.jgrid.bindEv.call(
                                      i,
                                      e('select', l)[0],
                                      s
                                    ),
                                    t.autosearch === !0 &&
                                      e('select', l).change(function () {
                                        return a(), !1;
                                      }),
                                    (r = null);
                                },
                              },
                              e.jgrid.ajaxOptions,
                              i.p.ajaxSelectOptions || {}
                            )
                          );
                      else {
                        var w, y, x;
                        if (
                          (u.searchoptions
                            ? ((w =
                                void 0 === u.searchoptions.value
                                  ? ''
                                  : u.searchoptions.value),
                              (y =
                                void 0 === u.searchoptions.separator
                                  ? ':'
                                  : u.searchoptions.separator),
                              (x =
                                void 0 === u.searchoptions.delimiter
                                  ? ';'
                                  : u.searchoptions.delimiter))
                            : u.editoptions &&
                              ((w =
                                void 0 === u.editoptions.value
                                  ? ''
                                  : u.editoptions.value),
                              (y =
                                void 0 === u.editoptions.separator
                                  ? ':'
                                  : u.editoptions.separator),
                              (x =
                                void 0 === u.editoptions.delimiter
                                  ? ';'
                                  : u.editoptions.delimiter)),
                          w)
                        ) {
                          var q = document.createElement('select');
                          (q.style.width = '100%'),
                            e(q).attr({
                              name: u.index || u.name,
                              id: 'gs_' + u.name,
                            });
                          var D, $, _, C;
                          if ('string' == typeof w)
                            for (p = w.split(x), C = 0; C < p.length; C++)
                              (D = p[C].split(y)),
                                ($ = document.createElement('option')),
                                ($.value = D[0]),
                                ($.innerHTML = D[1]),
                                q.appendChild($);
                          else if ('object' == typeof w)
                            for (_ in w)
                              w.hasOwnProperty(_) &&
                                (($ = document.createElement('option')),
                                ($.value = _),
                                ($.innerHTML = w[_]),
                                q.appendChild($));
                          void 0 !== s.defaultValue && e(q).val(s.defaultValue),
                            s.attr && e(q).attr(s.attr),
                            e(m).append(v),
                            e.jgrid.bindEv.call(i, q, s),
                            e('td:eq(1)', v).append(q),
                            t.autosearch === !0 &&
                              e(q).change(function () {
                                return a(), !1;
                              });
                        }
                      }
                      break;
                    case 'text':
                      var G = void 0 !== s.defaultValue ? s.defaultValue : '';
                      e('td:eq(1)', v).append(
                        "<input type='text' style='width:100%;padding:0px;' name='" +
                          (u.index || u.name) +
                          "' id='gs_" +
                          u.name +
                          "' value='" +
                          G +
                          "'/>"
                      ),
                        e(m).append(v),
                        s.attr && e('input', m).attr(s.attr),
                        e.jgrid.bindEv.call(i, e('input', m)[0], s),
                        t.autosearch === !0 &&
                          (t.searchOnEnter
                            ? e('input', m).keypress(function (e) {
                                var t = e.charCode || e.keyCode || 0;
                                return 13 === t ? (a(), !1) : this;
                              })
                            : e('input', m).keydown(function (e) {
                                var i = e.which;
                                switch (i) {
                                  case 13:
                                    return !1;
                                  case 9:
                                  case 16:
                                  case 37:
                                  case 38:
                                  case 39:
                                  case 40:
                                  case 27:
                                    break;
                                  default:
                                    r && clearTimeout(r),
                                      (r = setTimeout(function () {
                                        a();
                                      }, t.autosearchDelay));
                                }
                              }));
                      break;
                    case 'custom':
                      e('td:eq(1)', v).append(
                        "<span style='width:95%;padding:0px;' name='" +
                          (u.index || u.name) +
                          "' id='gs_" +
                          u.name +
                          "'/>"
                      ),
                        e(m).append(v);
                      try {
                        if (!e.isFunction(s.custom_element)) throw 'e1';
                        var I = s.custom_element.call(
                          i,
                          void 0 !== s.defaultValue ? s.defaultValue : '',
                          s
                        );
                        if (!I) throw 'e2';
                        (I = e(I).addClass('customelement')),
                          e(m)
                            .find("span[name='" + (u.index || u.name) + "']")
                            .append(I);
                      } catch (F) {
                        'e1' === F &&
                          e.jgrid.info_dialog(
                            e.jgrid.errors.errcap,
                            "function 'custom_element' " +
                              e.jgrid.edit.msg.nodefined,
                            e.jgrid.edit.bClose
                          ),
                          'e2' === F
                            ? e.jgrid.info_dialog(
                                e.jgrid.errors.errcap,
                                "function 'custom_element' " +
                                  e.jgrid.edit.msg.novalue,
                                e.jgrid.edit.bClose
                              )
                            : e.jgrid.info_dialog(
                                e.jgrid.errors.errcap,
                                'string' == typeof F ? F : F.message,
                                e.jgrid.edit.bClose
                              );
                      }
                  }
                }
                e(f).append(m),
                  e(d).append(f),
                  t.searchOperators || e('td:eq(0)', v).hide();
              }),
                e('table thead', i.grid.hDiv).append(d),
                t.searchOperators &&
                  (e('.soptclass', d).click(function (t) {
                    var i = e(this).offset(),
                      r = i.left,
                      a = i.top;
                    n(this, r, a), t.stopPropagation();
                  }),
                  e('body').on('click', function (t) {
                    'soptclass' !== t.target.className &&
                      e('#sopt_menu').hide();
                  })),
                e('.clearsearchclass', d).click(function () {
                  var r = e(this).parents('tr:first'),
                    o = parseInt(
                      e('td.ui-search-oper', r).attr('colindex'),
                      10
                    ),
                    s = e.extend({}, i.p.colModel[o].searchoptions || {}),
                    n = s.defaultValue ? s.defaultValue : '';
                  'select' === i.p.colModel[o].stype
                    ? n
                      ? e('td.ui-search-input select', r).val(n)
                      : (e('td.ui-search-input select', r)[0].selectedIndex = 0)
                    : e('td.ui-search-input input', r).val(n),
                    t.autosearch === !0 && a();
                }),
                (this.ftoolbar = !0),
                (this.triggerToolbar = a),
                (this.clearToolbar = o),
                (this.toggleToolbar = s);
            }
          })
        );
      },
      destroyFilterToolbar: function () {
        return this.each(function () {
          this.ftoolbar &&
            ((this.triggerToolbar = null),
            (this.clearToolbar = null),
            (this.toggleToolbar = null),
            (this.ftoolbar = !1),
            e(this.grid.hDiv)
              .find('table thead tr.ui-search-toolbar')
              .remove());
        });
      },
      destroyGroupHeader: function (t) {
        return (
          void 0 === t && (t = !0),
          this.each(function () {
            var i,
              r,
              a,
              o,
              s,
              n,
              d,
              l = this,
              p = l.grid,
              c = e('table.ui-jqgrid-htable thead', p.hDiv),
              u = l.p.colModel;
            if (p) {
              for (
                e(this).unbind('.setGroupHeaders'),
                  i = e('<tr>', { role: 'row' }).addClass('ui-jqgrid-labels'),
                  o = p.headers,
                  r = 0,
                  a = o.length;
                a > r;
                r++
              ) {
                (d = u[r].hidden ? 'none' : ''),
                  (s = e(o[r].el).width(o[r].width).css('display', d));
                try {
                  s.removeAttr('rowSpan');
                } catch (h) {
                  s.attr('rowSpan', 1);
                }
                i.append(s),
                  (n = s.children('span.ui-jqgrid-resize')),
                  n.length > 0 && (n[0].style.height = ''),
                  (s.children('div')[0].style.top = '');
              }
              e(c).children('tr.ui-jqgrid-labels').remove(),
                e(c).prepend(i),
                t === !0 && e(l).jqGrid('setGridParam', { groupHeader: null });
            }
          })
        );
      },
      setGroupHeaders: function (t) {
        return (
          (t = e.extend({ useColSpanStyle: !1, groupHeaders: [] }, t || {})),
          this.each(function () {
            this.p.groupHeader = t;
            var i,
              r,
              a,
              o,
              s,
              n,
              d,
              l,
              p,
              c,
              u,
              h,
              g,
              f = this,
              m = 0,
              v = f.p.colModel,
              j = v.length,
              b = f.grid.headers,
              w = e('table.ui-jqgrid-htable', f.grid.hDiv),
              y = w
                .children('thead')
                .children('tr.ui-jqgrid-labels:last')
                .addClass('jqg-second-row-header'),
              x = w.children('thead'),
              q = w.find('.jqg-first-row-header');
            void 0 === q[0]
              ? (q = e('<tr>', { role: 'row', 'aria-hidden': 'true' })
                  .addClass('jqg-first-row-header')
                  .css('height', 'auto'))
              : q.empty();
            var D,
              $ = function (e, t) {
                var i,
                  r = t.length;
                for (i = 0; r > i; i++)
                  if (t[i].startColumnName === e) return i;
                return -1;
              };
            for (
              e(f).prepend(x),
                a = e('<tr>', { role: 'row' }).addClass(
                  'ui-jqgrid-labels jqg-third-row-header'
                ),
                i = 0;
              j > i;
              i++
            )
              if (
                ((s = b[i].el),
                (n = e(s)),
                (r = v[i]),
                (d = {
                  height: '0px',
                  width: b[i].width + 'px',
                  display: r.hidden ? 'none' : '',
                }),
                e('<th>', { role: 'gridcell' })
                  .css(d)
                  .addClass('ui-first-th-' + f.p.direction)
                  .appendTo(q),
                (s.style.width = ''),
                (l = $(r.name, t.groupHeaders)),
                l >= 0)
              ) {
                for (
                  p = t.groupHeaders[l],
                    c = p.numberOfColumns,
                    u = p.titleText,
                    h = 0,
                    l = 0;
                  c > l && j > i + l;
                  l++
                )
                  v[i + l].hidden || h++;
                (o = e('<th>')
                  .attr({ role: 'columnheader' })
                  .addClass(
                    'ui-state-default ui-th-column-header ui-th-' +
                      f.p.direction
                  )
                  .css({ height: '22px', 'border-top': '0 none' })
                  .html(u)),
                  h > 0 && o.attr('colspan', String(h)),
                  f.p.headertitles && o.attr('title', o.text()),
                  0 === h && o.hide(),
                  n.before(o),
                  a.append(s),
                  (m = c - 1);
              } else
                0 === m
                  ? t.useColSpanStyle
                    ? n.attr('rowspan', '2')
                    : (e('<th>', { role: 'columnheader' })
                        .addClass(
                          'ui-state-default ui-th-column-header ui-th-' +
                            f.p.direction
                        )
                        .css({
                          display: r.hidden ? 'none' : '',
                          'border-top': '0 none',
                        })
                        .insertBefore(n),
                      a.append(s))
                  : (a.append(s), m--);
            (g = e(f).children('thead')),
              g.prepend(q),
              a.insertAfter(y),
              w.append(g),
              t.useColSpanStyle &&
                (w.find('span.ui-jqgrid-resize').each(function () {
                  var t = e(this).parent();
                  t.is(':visible') &&
                    (this.style.cssText =
                      'height: ' +
                      t.height() +
                      'px !important; cursor: col-resize;');
                }),
                w.find('div.ui-jqgrid-sortable').each(function () {
                  var t = e(this),
                    i = t.parent();
                  i.is(':visible') &&
                    i.is(':has(span.ui-jqgrid-resize)') &&
                    t.css('top', (i.height() - t.outerHeight()) / 2 + 'px');
                })),
              (D = g.find('tr.jqg-first-row-header')),
              e(f).bind('jqGridResizeStop.setGroupHeaders', function (e, t, i) {
                D.find('th').eq(i).width(t);
              });
          })
        );
      },
      setFrozenColumns: function () {
        return this.each(function () {
          if (this.grid) {
            var t = this,
              i = t.p.colModel,
              r = 0,
              a = i.length,
              o = -1,
              s = !1;
            if (
              t.p.subGrid !== !0 &&
              t.p.treeGrid !== !0 &&
              t.p.cellEdit !== !0 &&
              !t.p.sortable &&
              !t.p.scroll
            ) {
              for (
                t.p.rownumbers && r++, t.p.multiselect && r++;
                a > r && i[r].frozen === !0;

              )
                (s = !0), (o = r), r++;
              if (o >= 0 && s) {
                var n = t.p.caption ? e(t.grid.cDiv).outerHeight() : 0,
                  d = e(
                    '.ui-jqgrid-htable',
                    '#gview_' + e.jgrid.jqID(t.p.id)
                  ).height();
                t.p.toppager && (n += e(t.grid.topDiv).outerHeight()),
                  t.p.toolbar[0] === !0 &&
                    'bottom' !== t.p.toolbar[1] &&
                    (n += e(t.grid.uDiv).outerHeight()),
                  (t.grid.fhDiv = e(
                    '<div style="position:absolute;left:0px;top:' +
                      n +
                      'px;height:' +
                      d +
                      'px;" class="frozen-div ui-state-default ui-jqgrid-hdiv"></div>'
                  )),
                  (t.grid.fbDiv = e(
                    '<div style="position:absolute;left:0px;top:' +
                      (parseInt(n, 10) + parseInt(d, 10) + 1) +
                      'px;overflow-y:hidden" class="frozen-bdiv ui-jqgrid-bdiv"></div>'
                  )),
                  e('#gview_' + e.jgrid.jqID(t.p.id)).append(t.grid.fhDiv);
                var l = e(
                  '.ui-jqgrid-htable',
                  '#gview_' + e.jgrid.jqID(t.p.id)
                ).clone(!0);
                if (t.p.groupHeader) {
                  e('tr.jqg-first-row-header, tr.jqg-third-row-header', l).each(
                    function () {
                      e('th:gt(' + o + ')', this).remove();
                    }
                  );
                  var p,
                    c,
                    u = -1,
                    h = -1;
                  e('tr.jqg-second-row-header th', l).each(function () {
                    return (
                      (p = parseInt(e(this).attr('colspan'), 10)),
                      (c = parseInt(e(this).attr('rowspan'), 10)),
                      c && (u++, h++),
                      p && ((u += p), h++),
                      u === o ? !1 : void 0
                    );
                  }),
                    u !== o && (h = o),
                    e('tr.jqg-second-row-header', l).each(function () {
                      e('th:gt(' + h + ')', this).remove();
                    });
                } else
                  e('tr', l).each(function () {
                    e('th:gt(' + o + ')', this).remove();
                  });
                if (
                  (e(l).width(1),
                  e(t.grid.fhDiv)
                    .append(l)
                    .mousemove(function (e) {
                      return t.grid.resizing
                        ? (t.grid.dragMove(e), !1)
                        : void 0;
                    }),
                  t.p.footerrow)
                ) {
                  var g = e(
                    '.ui-jqgrid-bdiv',
                    '#gview_' + e.jgrid.jqID(t.p.id)
                  ).height();
                  (t.grid.fsDiv = e(
                    '<div style="position:absolute;left:0px;top:' +
                      (parseInt(n, 10) +
                        parseInt(d, 10) +
                        parseInt(g, 10) +
                        1) +
                      'px;" class="frozen-sdiv ui-jqgrid-sdiv"></div>'
                  )),
                    e('#gview_' + e.jgrid.jqID(t.p.id)).append(t.grid.fsDiv);
                  var f = e(
                    '.ui-jqgrid-ftable',
                    '#gview_' + e.jgrid.jqID(t.p.id)
                  ).clone(!0);
                  e('tr', f).each(function () {
                    e('td:gt(' + o + ')', this).remove();
                  }),
                    e(f).width(1),
                    e(t.grid.fsDiv).append(f);
                }
                e(t).bind(
                  'jqGridResizeStop.setFrozenColumns',
                  function (i, r, a) {
                    var o = e('.ui-jqgrid-htable', t.grid.fhDiv);
                    e('th:eq(' + a + ')', o).width(r);
                    var s = e('.ui-jqgrid-btable', t.grid.fbDiv);
                    if (
                      (e('tr:first td:eq(' + a + ')', s).width(r),
                      t.p.footerrow)
                    ) {
                      var n = e('.ui-jqgrid-ftable', t.grid.fsDiv);
                      e('tr:first td:eq(' + a + ')', n).width(r);
                    }
                  }
                ),
                  e(t).bind(
                    'jqGridSortCol.setFrozenColumns',
                    function (i, r, a) {
                      var o = e(
                          'tr.ui-jqgrid-labels:last th:eq(' +
                            t.p.lastsort +
                            ')',
                          t.grid.fhDiv
                        ),
                        s = e(
                          'tr.ui-jqgrid-labels:last th:eq(' + a + ')',
                          t.grid.fhDiv
                        );
                      e('span.ui-grid-ico-sort', o).addClass(
                        'ui-state-disabled'
                      ),
                        e(o).attr('aria-selected', 'false'),
                        e('span.ui-icon-' + t.p.sortorder, s).removeClass(
                          'ui-state-disabled'
                        ),
                        e(s).attr('aria-selected', 'true'),
                        t.p.viewsortcols[0] ||
                          (t.p.lastsort !== a &&
                            (e('span.s-ico', o).hide(),
                            e('span.s-ico', s).show()));
                    }
                  ),
                  e('#gview_' + e.jgrid.jqID(t.p.id)).append(t.grid.fbDiv),
                  e(t.grid.bDiv).scroll(function () {
                    e(t.grid.fbDiv).scrollTop(e(this).scrollTop());
                  }),
                  t.p.hoverrows === !0 &&
                    e('#' + e.jgrid.jqID(t.p.id))
                      .unbind('mouseover')
                      .unbind('mouseout'),
                  e(t).bind(
                    'jqGridAfterGridComplete.setFrozenColumns',
                    function () {
                      e('#' + e.jgrid.jqID(t.p.id) + '_frozen').remove(),
                        e(t.grid.fbDiv).height(e(t.grid.bDiv).height() - 16);
                      var i = e('#' + e.jgrid.jqID(t.p.id)).clone(!0);
                      e('tr[role=row]', i).each(function () {
                        e('td[role=gridcell]:gt(' + o + ')', this).remove();
                      }),
                        e(i)
                          .width(1)
                          .attr('id', t.p.id + '_frozen'),
                        e(t.grid.fbDiv).append(i),
                        t.p.hoverrows === !0 &&
                          (e('tr.jqgrow', i).hover(
                            function () {
                              e(this).addClass('ui-state-hover'),
                                e(
                                  '#' + e.jgrid.jqID(this.id),
                                  '#' + e.jgrid.jqID(t.p.id)
                                ).addClass('ui-state-hover');
                            },
                            function () {
                              e(this).removeClass('ui-state-hover'),
                                e(
                                  '#' + e.jgrid.jqID(this.id),
                                  '#' + e.jgrid.jqID(t.p.id)
                                ).removeClass('ui-state-hover');
                            }
                          ),
                          e('tr.jqgrow', '#' + e.jgrid.jqID(t.p.id)).hover(
                            function () {
                              e(this).addClass('ui-state-hover'),
                                e(
                                  '#' + e.jgrid.jqID(this.id),
                                  '#' + e.jgrid.jqID(t.p.id) + '_frozen'
                                ).addClass('ui-state-hover');
                            },
                            function () {
                              e(this).removeClass('ui-state-hover'),
                                e(
                                  '#' + e.jgrid.jqID(this.id),
                                  '#' + e.jgrid.jqID(t.p.id) + '_frozen'
                                ).removeClass('ui-state-hover');
                            }
                          )),
                        (i = null);
                    }
                  ),
                  t.grid.hDiv.loading ||
                    e(t).triggerHandler('jqGridAfterGridComplete'),
                  (t.p.frozenColumns = !0);
              }
            }
          }
        });
      },
      destroyFrozenColumns: function () {
        return this.each(function () {
          if (this.grid && this.p.frozenColumns === !0) {
            var t = this;
            if (
              (e(t.grid.fhDiv).remove(),
              e(t.grid.fbDiv).remove(),
              (t.grid.fhDiv = null),
              (t.grid.fbDiv = null),
              t.p.footerrow &&
                (e(t.grid.fsDiv).remove(), (t.grid.fsDiv = null)),
              e(this).unbind('.setFrozenColumns'),
              t.p.hoverrows === !0)
            ) {
              var i;
              e('#' + e.jgrid.jqID(t.p.id))
                .bind('mouseover', function (t) {
                  (i = e(t.target).closest('tr.jqgrow')),
                    'ui-subgrid' !== e(i).attr('class') &&
                      e(i).addClass('ui-state-hover');
                })
                .bind('mouseout', function (t) {
                  (i = e(t.target).closest('tr.jqgrow')),
                    e(i).removeClass('ui-state-hover');
                });
            }
            this.p.frozenColumns = !1;
          }
        });
      },
    });
  })(jQuery),
  (function (e) {
    'use strict';
    (e.fn.jqFilter = function (t) {
      if ('string' == typeof t) {
        var i = e.fn.jqFilter[t];
        if (!i) throw 'jqFilter - No such method: ' + t;
        var r = e.makeArray(arguments).slice(1);
        return i.apply(this, r);
      }
      var a = e.extend(
        !0,
        {
          filter: null,
          columns: [],
          onChange: null,
          afterRedraw: null,
          checkValues: null,
          error: !1,
          errmsg: '',
          errorcheck: !0,
          showQuery: !0,
          sopt: null,
          ops: [],
          operands: null,
          numopts: ['eq', 'ne', 'lt', 'le', 'gt', 'ge', 'nu', 'nn', 'in', 'ni'],
          stropts: [
            'eq',
            'ne',
            'bw',
            'bn',
            'ew',
            'en',
            'cn',
            'nc',
            'nu',
            'nn',
            'in',
            'ni',
          ],
          strarr: ['text', 'string', 'blob'],
          groupOps: [
            { op: 'AND', text: 'AND' },
            { op: 'OR', text: 'OR' },
          ],
          groupButton: !0,
          ruleButtons: !0,
          direction: 'ltr',
        },
        e.jgrid.filter,
        t || {}
      );
      return this.each(function () {
        if (!this.filter) {
          (this.p = a),
            (null === this.p.filter || void 0 === this.p.filter) &&
              (this.p.filter = {
                groupOp: this.p.groupOps[0].op,
                rules: [],
                groups: [],
              });
          var t,
            i,
            r = this.p.columns.length,
            o = /msie/i.test(navigator.userAgent) && !window.opera;
          if (((this.p.initFilter = e.extend(!0, {}, this.p.filter)), r)) {
            for (t = 0; r > t; t++)
              (i = this.p.columns[t]),
                i.stype
                  ? (i.inputtype = i.stype)
                  : i.inputtype || (i.inputtype = 'text'),
                i.sorttype
                  ? (i.searchtype = i.sorttype)
                  : i.searchtype || (i.searchtype = 'string'),
                void 0 === i.hidden && (i.hidden = !1),
                i.label || (i.label = i.name),
                i.index && (i.name = i.index),
                i.hasOwnProperty('searchoptions') || (i.searchoptions = {}),
                i.hasOwnProperty('searchrules') || (i.searchrules = {});
            this.p.showQuery &&
              e(this).append(
                "<table class='queryresult ui-widget ui-widget-content' style='display:block;max-width:440px;border:0px none;' dir='" +
                  this.p.direction +
                  "'><tbody><tr><td class='query'></td></tr></tbody></table>"
              );
            var s = function () {
                return e('#' + e.jgrid.jqID(a.id))[0] || null;
              },
              n = function (t, i) {
                var r = [!0, ''],
                  o = s();
                if (e.isFunction(i.searchrules))
                  r = i.searchrules.call(o, t, i);
                else if (e.jgrid && e.jgrid.checkValues)
                  try {
                    r = e.jgrid.checkValues.call(
                      o,
                      t,
                      -1,
                      i.searchrules,
                      i.label
                    );
                  } catch (n) {}
                r &&
                  r.length &&
                  r[0] === !1 &&
                  ((a.error = !r[0]), (a.errmsg = r[1]));
              };
            (this.onchange = function () {
              return (
                (this.p.error = !1),
                (this.p.errmsg = ''),
                e.isFunction(this.p.onChange)
                  ? this.p.onChange.call(this, this.p)
                  : !1
              );
            }),
              (this.reDraw = function () {
                e('table.group:first', this).remove();
                var t = this.createTableForGroup(a.filter, null);
                e(this).append(t),
                  e.isFunction(this.p.afterRedraw) &&
                    this.p.afterRedraw.call(this, this.p);
              }),
              (this.createTableForGroup = function (t, i) {
                var r,
                  o = this,
                  s = e(
                    "<table class='group ui-widget ui-widget-content' style='border:0px none;'><tbody></tbody></table>"
                  ),
                  n = 'left';
                'rtl' === this.p.direction &&
                  ((n = 'right'), s.attr('dir', 'rtl')),
                  null === i &&
                    s.append(
                      "<tr class='error' style='display:none;'><th colspan='5' class='ui-state-error' align='" +
                        n +
                        "'></th></tr>"
                    );
                var d = e('<tr></tr>');
                s.append(d);
                var l = e("<th colspan='5' align='" + n + "'></th>");
                if ((d.append(l), this.p.ruleButtons === !0)) {
                  var p = e("<select class='opsel'></select>");
                  l.append(p);
                  var c,
                    u = '';
                  for (r = 0; r < a.groupOps.length; r++)
                    (c =
                      t.groupOp === o.p.groupOps[r].op
                        ? " selected='selected'"
                        : ''),
                      (u +=
                        "<option value='" +
                        o.p.groupOps[r].op +
                        "'" +
                        c +
                        '>' +
                        o.p.groupOps[r].text +
                        '</option>');
                  p.append(u).bind('change', function () {
                    (t.groupOp = e(p).val()), o.onchange();
                  });
                }
                var h = '<span></span>';
                if (
                  (this.p.groupButton &&
                    ((h = e(
                      "<input type='button' value='+ {}' title='Add subgroup' class='add-group'/>"
                    )),
                    h.bind('click', function () {
                      return (
                        void 0 === t.groups && (t.groups = []),
                        t.groups.push({
                          groupOp: a.groupOps[0].op,
                          rules: [],
                          groups: [],
                        }),
                        o.reDraw(),
                        o.onchange(),
                        !1
                      );
                    })),
                  l.append(h),
                  this.p.ruleButtons === !0)
                ) {
                  var g,
                    f = e(
                      "<input type='button' value='+' title='Add rule' class='add-rule ui-add'/>"
                    );
                  f.bind('click', function () {
                    for (
                      void 0 === t.rules && (t.rules = []), r = 0;
                      r < o.p.columns.length;
                      r++
                    ) {
                      var i =
                          void 0 === o.p.columns[r].search
                            ? !0
                            : o.p.columns[r].search,
                        a = o.p.columns[r].hidden === !0,
                        s = o.p.columns[r].searchoptions.searchhidden === !0;
                      if ((s && i) || (i && !a)) {
                        g = o.p.columns[r];
                        break;
                      }
                    }
                    var n;
                    return (
                      (n = g.searchoptions.sopt
                        ? g.searchoptions.sopt
                        : o.p.sopt
                          ? o.p.sopt
                          : -1 !== e.inArray(g.searchtype, o.p.strarr)
                            ? o.p.stropts
                            : o.p.numopts),
                      t.rules.push({ field: g.name, op: n[0], data: '' }),
                      o.reDraw(),
                      !1
                    );
                  }),
                    l.append(f);
                }
                if (null !== i) {
                  var m = e(
                    "<input type='button' value='-' title='Delete group' class='delete-group'/>"
                  );
                  l.append(m),
                    m.bind('click', function () {
                      for (r = 0; r < i.groups.length; r++)
                        if (i.groups[r] === t) {
                          i.groups.splice(r, 1);
                          break;
                        }
                      return o.reDraw(), o.onchange(), !1;
                    });
                }
                if (void 0 !== t.groups)
                  for (r = 0; r < t.groups.length; r++) {
                    var v = e('<tr></tr>');
                    s.append(v);
                    var j = e("<td class='first'></td>");
                    v.append(j);
                    var b = e("<td colspan='4'></td>");
                    b.append(this.createTableForGroup(t.groups[r], t)),
                      v.append(b);
                  }
                if (
                  (void 0 === t.groupOp && (t.groupOp = o.p.groupOps[0].op),
                  void 0 !== t.rules)
                )
                  for (r = 0; r < t.rules.length; r++)
                    s.append(this.createTableRowForRule(t.rules[r], t));
                return s;
              }),
              (this.createTableRowForRule = function (t, i) {
                var r,
                  n,
                  d,
                  l,
                  p,
                  c = this,
                  u = s(),
                  h = e('<tr></tr>'),
                  g = '';
                h.append("<td class='first'></td>");
                var f = e("<td class='columns'></td>");
                h.append(f);
                var m,
                  v = e('<select></select>'),
                  j = [];
                f.append(v),
                  v.bind('change', function () {
                    for (
                      t.field = e(v).val(),
                        d = e(this).parents('tr:first'),
                        r = 0;
                      r < c.p.columns.length;
                      r++
                    )
                      if (c.p.columns[r].name === t.field) {
                        l = c.p.columns[r];
                        break;
                      }
                    if (l) {
                      (l.searchoptions.id = e.jgrid.randId()),
                        o &&
                          'text' === l.inputtype &&
                          (l.searchoptions.size || (l.searchoptions.size = 10));
                      var i = e.jgrid.createEl.call(
                        u,
                        l.inputtype,
                        l.searchoptions,
                        '',
                        !0,
                        c.p.ajaxSelectOptions || {},
                        !0
                      );
                      e(i).addClass('input-elm'),
                        (n = l.searchoptions.sopt
                          ? l.searchoptions.sopt
                          : c.p.sopt
                            ? c.p.sopt
                            : -1 !== e.inArray(l.searchtype, c.p.strarr)
                              ? c.p.stropts
                              : c.p.numopts);
                      var a = '',
                        s = 0;
                      for (
                        j = [],
                          e.each(c.p.ops, function () {
                            j.push(this.oper);
                          }),
                          r = 0;
                        r < n.length;
                        r++
                      )
                        (m = e.inArray(n[r], j)),
                          -1 !== m &&
                            (0 === s && (t.op = c.p.ops[m].oper),
                            (a +=
                              "<option value='" +
                              c.p.ops[m].oper +
                              "'>" +
                              c.p.ops[m].text +
                              '</option>'),
                            s++);
                      if (
                        (e('.selectopts', d).empty().append(a),
                        (e('.selectopts', d)[0].selectedIndex = 0),
                        e.jgrid.msie && e.jgrid.msiever() < 9)
                      ) {
                        var p =
                          parseInt(
                            e('select.selectopts', d)[0].offsetWidth,
                            10
                          ) + 1;
                        e('.selectopts', d).width(p),
                          e('.selectopts', d).css('width', 'auto');
                      }
                      e('.data', d).empty().append(i),
                        e.jgrid.bindEv.call(u, i, l.searchoptions),
                        e('.input-elm', d).bind('change', function (i) {
                          var r = i.target;
                          (t.data =
                            'SPAN' === r.nodeName.toUpperCase() &&
                            l.searchoptions &&
                            e.isFunction(l.searchoptions.custom_value)
                              ? l.searchoptions.custom_value.call(
                                  u,
                                  e(r).children('.customelement:first'),
                                  'get'
                                )
                              : r.value),
                            c.onchange();
                        }),
                        setTimeout(function () {
                          (t.data = e(i).val()), c.onchange();
                        }, 0);
                    }
                  });
                var b = 0;
                for (r = 0; r < c.p.columns.length; r++) {
                  var w =
                      void 0 === c.p.columns[r].search
                        ? !0
                        : c.p.columns[r].search,
                    y = c.p.columns[r].hidden === !0,
                    x = c.p.columns[r].searchoptions.searchhidden === !0;
                  ((x && w) || (w && !y)) &&
                    ((p = ''),
                    t.field === c.p.columns[r].name &&
                      ((p = " selected='selected'"), (b = r)),
                    (g +=
                      "<option value='" +
                      c.p.columns[r].name +
                      "'" +
                      p +
                      '>' +
                      c.p.columns[r].label +
                      '</option>'));
                }
                v.append(g);
                var q = e("<td class='operators'></td>");
                h.append(q),
                  (l = a.columns[b]),
                  (l.searchoptions.id = e.jgrid.randId()),
                  o &&
                    'text' === l.inputtype &&
                    (l.searchoptions.size || (l.searchoptions.size = 10));
                var D = e.jgrid.createEl.call(
                  u,
                  l.inputtype,
                  l.searchoptions,
                  t.data,
                  !0,
                  c.p.ajaxSelectOptions || {},
                  !0
                );
                ('nu' === t.op || 'nn' === t.op) &&
                  (e(D).attr('readonly', 'true'),
                  e(D).attr('disabled', 'true'));
                var $ = e("<select class='selectopts'></select>");
                for (
                  q.append($),
                    $.bind('change', function () {
                      (t.op = e($).val()), (d = e(this).parents('tr:first'));
                      var i = e('.input-elm', d)[0];
                      'nu' === t.op || 'nn' === t.op
                        ? ((t.data = ''),
                          'SELECT' !== i.tagName.toUpperCase() &&
                            (i.value = ''),
                          i.setAttribute('readonly', 'true'),
                          i.setAttribute('disabled', 'true'))
                        : ('SELECT' === i.tagName.toUpperCase() &&
                            (t.data = i.value),
                          i.removeAttribute('readonly'),
                          i.removeAttribute('disabled')),
                        c.onchange();
                    }),
                    n = l.searchoptions.sopt
                      ? l.searchoptions.sopt
                      : c.p.sopt
                        ? c.p.sopt
                        : -1 !== e.inArray(l.searchtype, c.p.strarr)
                          ? c.p.stropts
                          : c.p.numopts,
                    g = '',
                    e.each(c.p.ops, function () {
                      j.push(this.oper);
                    }),
                    r = 0;
                  r < n.length;
                  r++
                )
                  (m = e.inArray(n[r], j)),
                    -1 !== m &&
                      ((p =
                        t.op === c.p.ops[m].oper ? " selected='selected'" : ''),
                      (g +=
                        "<option value='" +
                        c.p.ops[m].oper +
                        "'" +
                        p +
                        '>' +
                        c.p.ops[m].text +
                        '</option>'));
                $.append(g);
                var _ = e("<td class='data'></td>");
                h.append(_),
                  _.append(D),
                  e.jgrid.bindEv.call(u, D, l.searchoptions),
                  e(D)
                    .addClass('input-elm')
                    .bind('change', function () {
                      (t.data =
                        'custom' === l.inputtype
                          ? l.searchoptions.custom_value.call(
                              u,
                              e(this).children('.customelement:first'),
                              'get'
                            )
                          : e(this).val()),
                        c.onchange();
                    });
                var C = e('<td></td>');
                if ((h.append(C), this.p.ruleButtons === !0)) {
                  var G = e(
                    "<input type='button' value='-' title='Delete rule' class='delete-rule ui-del'/>"
                  );
                  C.append(G),
                    G.bind('click', function () {
                      for (r = 0; r < i.rules.length; r++)
                        if (i.rules[r] === t) {
                          i.rules.splice(r, 1);
                          break;
                        }
                      return c.reDraw(), c.onchange(), !1;
                    });
                }
                return h;
              }),
              (this.getStringForGroup = function (e) {
                var t,
                  i = '(';
                if (void 0 !== e.groups)
                  for (t = 0; t < e.groups.length; t++) {
                    i.length > 1 && (i += ' ' + e.groupOp + ' ');
                    try {
                      i += this.getStringForGroup(e.groups[t]);
                    } catch (r) {
                      alert(r);
                    }
                  }
                if (void 0 !== e.rules)
                  try {
                    for (t = 0; t < e.rules.length; t++)
                      i.length > 1 && (i += ' ' + e.groupOp + ' '),
                        (i += this.getStringForRule(e.rules[t]));
                  } catch (a) {
                    alert(a);
                  }
                return (i += ')'), '()' === i ? '' : i;
              }),
              (this.getStringForRule = function (t) {
                var i,
                  r,
                  o,
                  s,
                  d = '',
                  l = '',
                  p = ['int', 'integer', 'float', 'number', 'currency'];
                for (i = 0; i < this.p.ops.length; i++)
                  if (this.p.ops[i].oper === t.op) {
                    (d = this.p.operands.hasOwnProperty(t.op)
                      ? this.p.operands[t.op]
                      : ''),
                      (l = this.p.ops[i].oper);
                    break;
                  }
                for (i = 0; i < this.p.columns.length; i++)
                  if (this.p.columns[i].name === t.field) {
                    r = this.p.columns[i];
                    break;
                  }
                return void 0 == r
                  ? ''
                  : ((s = t.data),
                    ('bw' === l || 'bn' === l) && (s += '%'),
                    ('ew' === l || 'en' === l) && (s = '%' + s),
                    ('cn' === l || 'nc' === l) && (s = '%' + s + '%'),
                    ('in' === l || 'ni' === l) && (s = ' (' + s + ')'),
                    a.errorcheck && n(t.data, r),
                    (o =
                      -1 !== e.inArray(r.searchtype, p) ||
                      'nn' === l ||
                      'nu' === l
                        ? t.field + ' ' + d + ' ' + s
                        : t.field + ' ' + d + ' "' + s + '"'));
              }),
              (this.resetFilter = function () {
                (this.p.filter = e.extend(!0, {}, this.p.initFilter)),
                  this.reDraw(),
                  this.onchange();
              }),
              (this.hideError = function () {
                e('th.ui-state-error', this).html(''),
                  e('tr.error', this).hide();
              }),
              (this.showError = function () {
                e('th.ui-state-error', this).html(this.p.errmsg),
                  e('tr.error', this).show();
              }),
              (this.toUserFriendlyString = function () {
                return this.getStringForGroup(a.filter);
              }),
              (this.toString = function () {
                function e(e) {
                  if (i.p.errorcheck) {
                    var t, r;
                    for (t = 0; t < i.p.columns.length; t++)
                      if (i.p.columns[t].name === e.field) {
                        r = i.p.columns[t];
                        break;
                      }
                    r && n(e.data, r);
                  }
                  return e.op + '(item.' + e.field + ",'" + e.data + "')";
                }
                function t(i) {
                  var r,
                    a = '(';
                  if (void 0 !== i.groups)
                    for (r = 0; r < i.groups.length; r++)
                      a.length > 1 &&
                        (a += 'OR' === i.groupOp ? ' || ' : ' && '),
                        (a += t(i.groups[r]));
                  if (void 0 !== i.rules)
                    for (r = 0; r < i.rules.length; r++)
                      a.length > 1 &&
                        (a += 'OR' === i.groupOp ? ' || ' : ' && '),
                        (a += e(i.rules[r]));
                  return (a += ')'), '()' === a ? '' : a;
                }
                var i = this;
                return t(this.p.filter);
              }),
              this.reDraw(),
              this.p.showQuery && this.onchange(),
              (this.filter = !0);
          }
        }
      });
    }),
      e.extend(e.fn.jqFilter, {
        toSQLString: function () {
          var e = '';
          return (
            this.each(function () {
              e = this.toUserFriendlyString();
            }),
            e
          );
        },
        filterData: function () {
          var e;
          return (
            this.each(function () {
              e = this.p.filter;
            }),
            e
          );
        },
        getParameter: function (e) {
          return void 0 !== e && this.p.hasOwnProperty(e) ? this.p[e] : this.p;
        },
        resetFilter: function () {
          return this.each(function () {
            this.resetFilter();
          });
        },
        addFilter: function (t) {
          'string' == typeof t && (t = e.jgrid.parse(t)),
            this.each(function () {
              (this.p.filter = t), this.reDraw(), this.onchange();
            });
        },
      });
  })(jQuery),
  (function (e) {
    'use strict';
    var t = {};
    e.jgrid.extend({
      searchGrid: function (t) {
        return (
          (t = e.extend(
            !0,
            {
              recreateFilter: !1,
              drag: !0,
              sField: 'searchField',
              sValue: 'searchString',
              sOper: 'searchOper',
              sFilter: 'filters',
              loadDefaults: !0,
              beforeShowSearch: null,
              afterShowSearch: null,
              onInitializeSearch: null,
              afterRedraw: null,
              afterChange: null,
              closeAfterSearch: !1,
              closeAfterReset: !1,
              closeOnEscape: !1,
              searchOnEnter: !1,
              multipleSearch: !1,
              multipleGroup: !1,
              top: 0,
              left: 0,
              jqModal: !0,
              modal: !1,
              resize: !0,
              width: 450,
              height: 'auto',
              dataheight: 'auto',
              showQuery: !1,
              errorcheck: !0,
              sopt: null,
              stringResult: void 0,
              onClose: null,
              onSearch: null,
              onReset: null,
              toTop: !0,
              overlay: 30,
              columns: [],
              tmplNames: null,
              tmplFilters: null,
              tmplLabel: ' Template: ',
              showOnLoad: !1,
              layer: null,
              operands: {
                eq: '=',
                ne: '<>',
                lt: '<',
                le: '<=',
                gt: '>',
                ge: '>=',
                bw: 'LIKE',
                bn: 'NOT LIKE',
                in: 'IN',
                ni: 'NOT IN',
                ew: 'LIKE',
                en: 'NOT LIKE',
                cn: 'LIKE',
                nc: 'NOT LIKE',
                nu: 'IS NULL',
                nn: 'ISNOT NULL',
              },
            },
            e.jgrid.search,
            t || {}
          )),
          this.each(function () {
            function i(i) {
              (s = e(r).triggerHandler('jqGridFilterBeforeShow', [i])),
                void 0 === s && (s = !0),
                s &&
                  e.isFunction(t.beforeShowSearch) &&
                  (s = t.beforeShowSearch.call(r, i)),
                s &&
                  (e.jgrid.viewModal('#' + e.jgrid.jqID(d.themodal), {
                    gbox: '#gbox_' + e.jgrid.jqID(o),
                    jqm: t.jqModal,
                    modal: t.modal,
                    overlay: t.overlay,
                    toTop: t.toTop,
                  }),
                  e(r).triggerHandler('jqGridFilterAfterShow', [i]),
                  e.isFunction(t.afterShowSearch) &&
                    t.afterShowSearch.call(r, i));
            }
            var r = this;
            if (r.grid) {
              var a,
                o = 'fbox_' + r.p.id,
                s = !0,
                n = !0,
                d = {
                  themodal: 'searchmod' + o,
                  modalhead: 'searchhd' + o,
                  modalcontent: 'searchcnt' + o,
                  scrollelm: o,
                },
                l = r.p.postData[t.sFilter];
              if (
                ('string' == typeof l && (l = e.jgrid.parse(l)),
                t.recreateFilter === !0 &&
                  e('#' + e.jgrid.jqID(d.themodal)).remove(),
                void 0 !== e('#' + e.jgrid.jqID(d.themodal))[0])
              )
                i(e('#fbox_' + e.jgrid.jqID(+r.p.id)));
              else {
                var p = e(
                    "<div><div id='" +
                      o +
                      "' class='searchFilter' style='overflow:auto'></div></div>"
                  ).insertBefore('#gview_' + e.jgrid.jqID(r.p.id)),
                  c = 'left',
                  u = '';
                'rtl' === r.p.direction &&
                  ((c = 'right'),
                  (u = " style='text-align:left'"),
                  p.attr('dir', 'rtl'));
                var h,
                  g,
                  f = e.extend([], r.p.colModel),
                  m =
                    "<a id='" +
                    o +
                    "_search' class='fm-button ui-state-default ui-corner-all fm-button-icon-right ui-reset'><span class='ui-icon ui-icon-search'></span>" +
                    t.Find +
                    '</a>',
                  v =
                    "<a id='" +
                    o +
                    "_reset' class='fm-button ui-state-default ui-corner-all fm-button-icon-left ui-search'><span class='ui-icon ui-icon-arrowreturnthick-1-w'></span>" +
                    t.Reset +
                    '</a>',
                  j = '',
                  b = '',
                  w = !1,
                  y = -1;
                if (
                  (t.showQuery &&
                    (j =
                      "<a id='" +
                      o +
                      "_query' class='fm-button ui-state-default ui-corner-all fm-button-icon-left'><span class='ui-icon ui-icon-comment'></span>Query</a>"),
                  t.columns.length
                    ? ((f = t.columns), (y = 0), (h = f[0].index || f[0].name))
                    : e.each(f, function (e, t) {
                        if ((t.label || (t.label = r.p.colNames[e]), !w)) {
                          var i = void 0 === t.search ? !0 : t.search,
                            a = t.hidden === !0,
                            o =
                              t.searchoptions &&
                              t.searchoptions.searchhidden === !0;
                          ((o && i) || (i && !a)) &&
                            ((w = !0), (h = t.index || t.name), (y = e));
                        }
                      }),
                  (!l && h) || t.multipleSearch === !1)
                ) {
                  var x = 'eq';
                  y >= 0 && f[y].searchoptions && f[y].searchoptions.sopt
                    ? (x = f[y].searchoptions.sopt[0])
                    : t.sopt && t.sopt.length && (x = t.sopt[0]),
                    (l = {
                      groupOp: 'AND',
                      rules: [{ field: h, op: x, data: '' }],
                    });
                }
                (w = !1),
                  t.tmplNames &&
                    t.tmplNames.length &&
                    ((w = !0),
                    (b = t.tmplLabel),
                    (b += "<select class='ui-template'>"),
                    (b += "<option value='default'>Default</option>"),
                    e.each(t.tmplNames, function (e, t) {
                      b += "<option value='" + e + "'>" + t + '</option>';
                    }),
                    (b += '</select>')),
                  (g =
                    "<table class='EditTable' style='border:0px none;margin-top:5px' id='" +
                    o +
                    "_2'><tbody><tr><td colspan='2'><hr class='ui-widget-content' style='margin:1px'/></td></tr><tr><td class='EditButton' style='text-align:" +
                    c +
                    "'>" +
                    v +
                    b +
                    "</td><td class='EditButton' " +
                    u +
                    '>' +
                    j +
                    m +
                    '</td></tr></tbody></table>'),
                  (o = e.jgrid.jqID(o)),
                  e('#' + o).jqFilter({
                    columns: f,
                    filter: t.loadDefaults ? l : null,
                    showQuery: t.showQuery,
                    errorcheck: t.errorcheck,
                    sopt: t.sopt,
                    groupButton: t.multipleGroup,
                    ruleButtons: t.multipleSearch,
                    afterRedraw: t.afterRedraw,
                    ops: t.odata,
                    operands: t.operands,
                    ajaxSelectOptions: r.p.ajaxSelectOptions,
                    groupOps: t.groupOps,
                    onChange: function () {
                      this.p.showQuery &&
                        e('.query', this).html(this.toUserFriendlyString()),
                        e.isFunction(t.afterChange) &&
                          t.afterChange.call(r, e('#' + o), t);
                    },
                    direction: r.p.direction,
                    id: r.p.id,
                  }),
                  p.append(g),
                  w &&
                    t.tmplFilters &&
                    t.tmplFilters.length &&
                    e('.ui-template', p).bind('change', function () {
                      var i = e(this).val();
                      return (
                        'default' === i
                          ? e('#' + o).jqFilter('addFilter', l)
                          : e('#' + o).jqFilter(
                              'addFilter',
                              t.tmplFilters[parseInt(i, 10)]
                            ),
                        !1
                      );
                    }),
                  t.multipleGroup === !0 && (t.multipleSearch = !0),
                  e(r).triggerHandler('jqGridFilterInitialize', [e('#' + o)]),
                  e.isFunction(t.onInitializeSearch) &&
                    t.onInitializeSearch.call(r, e('#' + o)),
                  (t.gbox = '#gbox_' + o),
                  t.layer
                    ? e.jgrid.createModal(
                        d,
                        p,
                        t,
                        '#gview_' + e.jgrid.jqID(r.p.id),
                        e('#gbox_' + e.jgrid.jqID(r.p.id))[0],
                        '#' + e.jgrid.jqID(t.layer),
                        { position: 'relative' }
                      )
                    : e.jgrid.createModal(
                        d,
                        p,
                        t,
                        '#gview_' + e.jgrid.jqID(r.p.id),
                        e('#gbox_' + e.jgrid.jqID(r.p.id))[0]
                      ),
                  (t.searchOnEnter || t.closeOnEscape) &&
                    e('#' + e.jgrid.jqID(d.themodal)).keydown(function (i) {
                      var r = e(i.target);
                      return !t.searchOnEnter ||
                        13 !== i.which ||
                        r.hasClass('add-group') ||
                        r.hasClass('add-rule') ||
                        r.hasClass('delete-group') ||
                        r.hasClass('delete-rule') ||
                        (r.hasClass('fm-button') && r.is('[id$=_query]'))
                        ? t.closeOnEscape && 27 === i.which
                          ? (e('#' + e.jgrid.jqID(d.modalhead))
                              .find('.ui-jqdialog-titlebar-close')
                              .click(),
                            !1)
                          : void 0
                        : (e('#' + o + '_search').click(), !1);
                    }),
                  j &&
                    e('#' + o + '_query').bind('click', function () {
                      return e('.queryresult', p).toggle(), !1;
                    }),
                  void 0 === t.stringResult &&
                    (t.stringResult = t.multipleSearch),
                  e('#' + o + '_search').bind('click', function () {
                    var i,
                      s,
                      l = {};
                    if (
                      ((a = e('#' + o)),
                      a.find('.input-elm:focus').change(),
                      (s = a.jqFilter('filterData')),
                      t.errorcheck &&
                        (a[0].hideError(),
                        t.showQuery || a.jqFilter('toSQLString'),
                        a[0].p.error))
                    )
                      return a[0].showError(), !1;
                    if (t.stringResult) {
                      try {
                        i = xmlJsonClass.toJson(s, '', '', !1);
                      } catch (p) {
                        try {
                          i = JSON.stringify(s);
                        } catch (c) {}
                      }
                      'string' == typeof i &&
                        ((l[t.sFilter] = i),
                        e.each([t.sField, t.sValue, t.sOper], function () {
                          l[this] = '';
                        }));
                    } else
                      t.multipleSearch
                        ? ((l[t.sFilter] = s),
                          e.each([t.sField, t.sValue, t.sOper], function () {
                            l[this] = '';
                          }))
                        : ((l[t.sField] = s.rules[0].field),
                          (l[t.sValue] = s.rules[0].data),
                          (l[t.sOper] = s.rules[0].op),
                          (l[t.sFilter] = ''));
                    return (
                      (r.p.search = !0),
                      e.extend(r.p.postData, l),
                      (n = e(r).triggerHandler('jqGridFilterSearch')),
                      void 0 === n && (n = !0),
                      n &&
                        e.isFunction(t.onSearch) &&
                        (n = t.onSearch.call(r, r.p.filters)),
                      n !== !1 && e(r).trigger('reloadGrid', [{ page: 1 }]),
                      t.closeAfterSearch &&
                        e.jgrid.hideModal('#' + e.jgrid.jqID(d.themodal), {
                          gb: '#gbox_' + e.jgrid.jqID(r.p.id),
                          jqm: t.jqModal,
                          onClose: t.onClose,
                        }),
                      !1
                    );
                  }),
                  e('#' + o + '_reset').bind('click', function () {
                    var i = {},
                      a = e('#' + o);
                    return (
                      (r.p.search = !1),
                      (r.p.resetsearch = !0),
                      t.multipleSearch === !1
                        ? (i[t.sField] = i[t.sValue] = i[t.sOper] = '')
                        : (i[t.sFilter] = ''),
                      a[0].resetFilter(),
                      w && e('.ui-template', p).val('default'),
                      e.extend(r.p.postData, i),
                      (n = e(r).triggerHandler('jqGridFilterReset')),
                      void 0 === n && (n = !0),
                      n && e.isFunction(t.onReset) && (n = t.onReset.call(r)),
                      n !== !1 && e(r).trigger('reloadGrid', [{ page: 1 }]),
                      t.closeAfterReset &&
                        e.jgrid.hideModal('#' + e.jgrid.jqID(d.themodal), {
                          gb: '#gbox_' + e.jgrid.jqID(r.p.id),
                          jqm: t.jqModal,
                          onClose: t.onClose,
                        }),
                      !1
                    );
                  }),
                  i(e('#' + o)),
                  e('.fm-button:not(.ui-state-disabled)', p).hover(
                    function () {
                      e(this).addClass('ui-state-hover');
                    },
                    function () {
                      e(this).removeClass('ui-state-hover');
                    }
                  );
              }
            }
          })
        );
      },
      editGridRow: function (i, r) {
        return (
          (r = e.extend(
            !0,
            {
              top: 0,
              left: 0,
              width: 300,
              datawidth: 'auto',
              height: 'auto',
              dataheight: 'auto',
              modal: !1,
              overlay: 30,
              drag: !0,
              resize: !0,
              url: null,
              mtype: 'POST',
              clearAfterAdd: !0,
              closeAfterEdit: !1,
              reloadAfterSubmit: !0,
              onInitializeForm: null,
              beforeInitData: null,
              beforeShowForm: null,
              afterShowForm: null,
              beforeSubmit: null,
              afterSubmit: null,
              onclickSubmit: null,
              afterComplete: null,
              onclickPgButtons: null,
              afterclickPgButtons: null,
              editData: {},
              recreateForm: !1,
              jqModal: !0,
              closeOnEscape: !1,
              addedrow: 'first',
              topinfo: '',
              bottominfo: '',
              saveicon: [],
              closeicon: [],
              savekey: [!1, 13],
              navkeys: [!1, 38, 40],
              checkOnSubmit: !1,
              checkOnUpdate: !1,
              _savedData: {},
              processing: !1,
              onClose: null,
              ajaxEditOptions: {},
              serializeEditData: null,
              viewPagerButtons: !0,
              overlayClass: 'ui-widget-overlay',
              removemodal: !0,
              form: 'edit',
            },
            e.jgrid.edit,
            r || {}
          )),
          (t[e(this)[0].p.id] = r),
          this.each(function () {
            function a() {
              return (
                e(y + ' > tbody > tr > td .FormElement').each(function () {
                  var t = e('.customelement', this);
                  if (t.length) {
                    var i = t[0],
                      r = e(i).attr('name');
                    e.each(g.p.colModel, function () {
                      if (
                        this.name === r &&
                        this.editoptions &&
                        e.isFunction(this.editoptions.custom_value)
                      ) {
                        try {
                          if (
                            ((f[r] = this.editoptions.custom_value.call(
                              g,
                              e('#' + e.jgrid.jqID(r), y),
                              'get'
                            )),
                            void 0 === f[r])
                          )
                            throw 'e1';
                        } catch (t) {
                          'e1' === t
                            ? e.jgrid.info_dialog(
                                e.jgrid.errors.errcap,
                                "function 'custom_value' " +
                                  e.jgrid.edit.msg.novalue,
                                e.jgrid.edit.bClose
                              )
                            : e.jgrid.info_dialog(
                                e.jgrid.errors.errcap,
                                t.message,
                                e.jgrid.edit.bClose
                              );
                        }
                        return !0;
                      }
                    });
                  } else {
                    switch (e(this).get(0).type) {
                      case 'checkbox':
                        if (e(this).is(':checked'))
                          f[this.name] = e(this).val();
                        else {
                          var a = e(this).attr('offval');
                          f[this.name] = a;
                        }
                        break;
                      case 'select-one':
                        f[this.name] = e('option:selected', this).val();
                        break;
                      case 'select-multiple':
                        (f[this.name] = e(this).val()),
                          (f[this.name] = f[this.name]
                            ? f[this.name].join(',')
                            : '');
                        var o = [];
                        e('option:selected', this).each(function (t, i) {
                          o[t] = e(i).text();
                        });
                        break;
                      case 'password':
                      case 'text':
                      case 'textarea':
                      case 'button':
                        f[this.name] = e(this).val();
                    }
                    g.p.autoencode &&
                      (f[this.name] = e.jgrid.htmlEncode(f[this.name]));
                  }
                }),
                !0
              );
            }
            function o(i, r, a, o) {
              var s,
                n,
                d,
                l,
                p,
                c,
                u,
                h = 0,
                f = [],
                m = !1,
                v =
                  "<td class='CaptionTD'>&#160;</td><td class='DataTD'>&#160;</td>",
                j = '';
              for (u = 1; o >= u; u++) j += v;
              if (
                ('_empty' !== i && (m = e(r).jqGrid('getInd', i)),
                e(r.p.colModel).each(function (u) {
                  if (
                    ((s = this.name),
                    (n =
                      this.editrules && this.editrules.edithidden === !0
                        ? !1
                        : this.hidden === !0
                          ? !0
                          : !1),
                    (p = n ? "style='display:none'" : ''),
                    'cb' !== s &&
                      'subgrid' !== s &&
                      this.editable === !0 &&
                      'rn' !== s)
                  ) {
                    if (m === !1) l = '';
                    else if (s === r.p.ExpandColumn && r.p.treeGrid === !0)
                      l = e(
                        "td[role='gridcell']:eq(" + u + ')',
                        r.rows[m]
                      ).text();
                    else {
                      try {
                        l = e.unformat.call(
                          r,
                          e("td[role='gridcell']:eq(" + u + ')', r.rows[m]),
                          { rowId: i, colModel: this },
                          u
                        );
                      } catch (v) {
                        l =
                          this.edittype && 'textarea' === this.edittype
                            ? e(
                                "td[role='gridcell']:eq(" + u + ')',
                                r.rows[m]
                              ).text()
                            : e(
                                "td[role='gridcell']:eq(" + u + ')',
                                r.rows[m]
                              ).html();
                      }
                      (!l ||
                        '&nbsp;' === l ||
                        '&#160;' === l ||
                        (1 === l.length && 160 === l.charCodeAt(0))) &&
                        (l = '');
                    }
                    var w = e.extend({}, this.editoptions || {}, {
                        id: s,
                        name: s,
                        rowId: i,
                      }),
                      y = e.extend(
                        {},
                        {
                          elmprefix: '',
                          elmsuffix: '',
                          rowabove: !1,
                          rowcontent: '',
                        },
                        this.formoptions || {}
                      ),
                      x = parseInt(y.rowpos, 10) || h + 1,
                      q = parseInt(2 * (parseInt(y.colpos, 10) || 1), 10);
                    if (
                      ('_empty' === i &&
                        w.defaultValue &&
                        (l = e.isFunction(w.defaultValue)
                          ? w.defaultValue.call(g)
                          : w.defaultValue),
                      this.edittype || (this.edittype = 'text'),
                      g.p.autoencode && (l = e.jgrid.htmlDecode(l)),
                      (c = e.jgrid.createEl.call(
                        g,
                        this.edittype,
                        w,
                        l,
                        !1,
                        e.extend(
                          {},
                          e.jgrid.ajaxOptions,
                          r.p.ajaxSelectOptions || {}
                        )
                      )),
                      (t[g.p.id].checkOnSubmit || t[g.p.id].checkOnUpdate) &&
                        (t[g.p.id]._savedData[s] = l),
                      e(c).addClass('FormElement'),
                      e.inArray(this.edittype, [
                        'text',
                        'textarea',
                        'password',
                        'select',
                      ]) > -1 &&
                        e(c).addClass('ui-widget-content ui-corner-all'),
                      (d = e(a).find('tr[rowpos=' + x + ']')),
                      y.rowabove)
                    ) {
                      var D = e(
                        "<tr><td class='contentinfo' colspan='" +
                          2 * o +
                          "'>" +
                          y.rowcontent +
                          '</td></tr>'
                      );
                      e(a).append(D), (D[0].rp = x);
                    }
                    0 === d.length &&
                      ((d = e('<tr ' + p + " rowpos='" + x + "'></tr>")
                        .addClass('FormData')
                        .attr('id', 'tr_' + s)),
                      e(d).append(j),
                      e(a).append(d),
                      (d[0].rp = x)),
                      e('td:eq(' + (q - 2) + ')', d[0]).html(
                        void 0 === y.label ? r.p.colNames[u] : y.label
                      ),
                      e('td:eq(' + (q - 1) + ')', d[0])
                        .append(y.elmprefix)
                        .append(c)
                        .append(y.elmsuffix),
                      'custom' === this.edittype &&
                        e.isFunction(w.custom_value) &&
                        w.custom_value.call(g, e('#' + s, '#' + b), 'set', l),
                      e.jgrid.bindEv.call(g, c, w),
                      (f[h] = u),
                      h++;
                  }
                }),
                h > 0)
              ) {
                var w = e(
                  "<tr class='FormData' style='display:none'><td class='CaptionTD'></td><td colspan='" +
                    (2 * o - 1) +
                    "' class='DataTD'><input class='FormElement' id='id_g' type='text' name='" +
                    r.p.id +
                    "_id' value='" +
                    i +
                    "'/></td></tr>"
                );
                (w[0].rp = h + 999),
                  e(a).append(w),
                  (t[g.p.id].checkOnSubmit || t[g.p.id].checkOnUpdate) &&
                    (t[g.p.id]._savedData[r.p.id + '_id'] = i);
              }
              return f;
            }
            function s(i, r, a) {
              var o,
                s,
                n,
                d,
                l,
                p,
                c = 0;
              (t[g.p.id].checkOnSubmit || t[g.p.id].checkOnUpdate) &&
                ((t[g.p.id]._savedData = {}),
                (t[g.p.id]._savedData[r.p.id + '_id'] = i));
              var u = r.p.colModel;
              if ('_empty' === i)
                return (
                  e(u).each(function () {
                    (o = this.name),
                      (d = e.extend({}, this.editoptions || {})),
                      (n = e('#' + e.jgrid.jqID(o), '#' + a)),
                      n &&
                        n.length &&
                        null !== n[0] &&
                        ((l = ''),
                        'custom' === this.edittype &&
                        e.isFunction(d.custom_value)
                          ? d.custom_value.call(
                              g,
                              e('#' + o, '#' + a),
                              'set',
                              l
                            )
                          : d.defaultValue
                            ? ((l = e.isFunction(d.defaultValue)
                                ? d.defaultValue.call(g)
                                : d.defaultValue),
                              'checkbox' === n[0].type
                                ? ((p = l.toLowerCase()),
                                  p.search(/(false|f|0|no|n|off|undefined)/i) <
                                    0 && '' !== p
                                    ? ((n[0].checked = !0),
                                      (n[0].defaultChecked = !0),
                                      (n[0].value = l))
                                    : ((n[0].checked = !1),
                                      (n[0].defaultChecked = !1)))
                                : n.val(l))
                            : 'checkbox' === n[0].type
                              ? ((n[0].checked = !1),
                                (n[0].defaultChecked = !1),
                                (l = e(n).attr('offval')))
                              : n[0].type && 'select' === n[0].type.substr(0, 6)
                                ? (n[0].selectedIndex = 0)
                                : n.val(l),
                        (t[g.p.id].checkOnSubmit === !0 ||
                          t[g.p.id].checkOnUpdate) &&
                          (t[g.p.id]._savedData[o] = l));
                  }),
                  void e('#id_g', '#' + a).val(i)
                );
              var h = e(r).jqGrid('getInd', i, !0);
              h &&
                (e('td[role="gridcell"]', h).each(function (n) {
                  if (
                    ((o = u[n].name),
                    'cb' !== o &&
                      'subgrid' !== o &&
                      'rn' !== o &&
                      u[n].editable === !0)
                  ) {
                    if (o === r.p.ExpandColumn && r.p.treeGrid === !0)
                      s = e(this).text();
                    else
                      try {
                        s = e.unformat.call(
                          r,
                          e(this),
                          { rowId: i, colModel: u[n] },
                          n
                        );
                      } catch (d) {
                        s =
                          'textarea' === u[n].edittype
                            ? e(this).text()
                            : e(this).html();
                      }
                    switch (
                      (g.p.autoencode && (s = e.jgrid.htmlDecode(s)),
                      (t[g.p.id].checkOnSubmit === !0 ||
                        t[g.p.id].checkOnUpdate) &&
                        (t[g.p.id]._savedData[o] = s),
                      (o = e.jgrid.jqID(o)),
                      u[n].edittype)
                    ) {
                      case 'password':
                      case 'text':
                      case 'button':
                      case 'image':
                      case 'textarea':
                        ('&nbsp;' === s ||
                          '&#160;' === s ||
                          (1 === s.length && 160 === s.charCodeAt(0))) &&
                          (s = ''),
                          e('#' + o, '#' + a).val(s);
                        break;
                      case 'select':
                        var l = s.split(',');
                        (l = e.map(l, function (t) {
                          return e.trim(t);
                        })),
                          e('#' + o + ' option', '#' + a).each(function () {
                            this.selected =
                              u[n].editoptions.multiple ||
                              (e.trim(s) !== e.trim(e(this).text()) &&
                                l[0] !== e.trim(e(this).text()) &&
                                l[0] !== e.trim(e(this).val()))
                                ? u[n].editoptions.multiple &&
                                  (e.inArray(e.trim(e(this).text()), l) > -1 ||
                                    e.inArray(e.trim(e(this).val()), l) > -1)
                                  ? !0
                                  : !1
                                : !0;
                          });
                        break;
                      case 'checkbox':
                        if (
                          ((s = String(s)),
                          u[n].editoptions && u[n].editoptions.value)
                        ) {
                          var p = u[n].editoptions.value.split(':');
                          e('#' + o, '#' + a)[g.p.useProp ? 'prop' : 'attr'](
                            p[0] === s
                              ? { checked: !0, defaultChecked: !0 }
                              : { checked: !1, defaultChecked: !1 }
                          );
                        } else
                          (s = s.toLowerCase()),
                            s.search(/(false|f|0|no|n|off|undefined)/i) < 0 &&
                            '' !== s
                              ? (e('#' + o, '#' + a)[
                                  g.p.useProp ? 'prop' : 'attr'
                                ]('checked', !0),
                                e('#' + o, '#' + a)[
                                  g.p.useProp ? 'prop' : 'attr'
                                ]('defaultChecked', !0))
                              : (e('#' + o, '#' + a)[
                                  g.p.useProp ? 'prop' : 'attr'
                                ]('checked', !1),
                                e('#' + o, '#' + a)[
                                  g.p.useProp ? 'prop' : 'attr'
                                ]('defaultChecked', !1));
                        break;
                      case 'custom':
                        try {
                          if (
                            !u[n].editoptions ||
                            !e.isFunction(u[n].editoptions.custom_value)
                          )
                            throw 'e1';
                          u[n].editoptions.custom_value.call(
                            g,
                            e('#' + o, '#' + a),
                            'set',
                            s
                          );
                        } catch (h) {
                          'e1' === h
                            ? e.jgrid.info_dialog(
                                e.jgrid.errors.errcap,
                                "function 'custom_value' " +
                                  e.jgrid.edit.msg.nodefined,
                                e.jgrid.edit.bClose
                              )
                            : e.jgrid.info_dialog(
                                e.jgrid.errors.errcap,
                                h.message,
                                e.jgrid.edit.bClose
                              );
                        }
                    }
                    c++;
                  }
                }),
                c > 0 && e('#id_g', y).val(i));
            }
            function n() {
              e.each(g.p.colModel, function (e, t) {
                t.editoptions &&
                  t.editoptions.NullIfEmpty === !0 &&
                  f.hasOwnProperty(t.name) &&
                  '' === f[t.name] &&
                  (f[t.name] = 'null');
              });
            }
            function d() {
              var i,
                a,
                o,
                d,
                l,
                p,
                c,
                u = [!0, '', ''],
                h = {},
                m = g.p.prmNames,
                w = e(g).triggerHandler('jqGridAddEditBeforeCheckValues', [
                  e('#' + b),
                  v,
                ]);
              w && 'object' == typeof w && (f = w),
                e.isFunction(t[g.p.id].beforeCheckValues) &&
                  ((w = t[g.p.id].beforeCheckValues.call(g, f, e('#' + b), v)),
                  w && 'object' == typeof w && (f = w));
              for (d in f)
                if (
                  f.hasOwnProperty(d) &&
                  ((u = e.jgrid.checkValues.call(g, f[d], d)), u[0] === !1)
                )
                  break;
              if (
                (n(),
                u[0] &&
                  ((h = e(g).triggerHandler('jqGridAddEditClickSubmit', [
                    t[g.p.id],
                    f,
                    v,
                  ])),
                  void 0 === h &&
                    e.isFunction(t[g.p.id].onclickSubmit) &&
                    (h =
                      t[g.p.id].onclickSubmit.call(g, t[g.p.id], f, v) || {}),
                  (u = e(g).triggerHandler('jqGridAddEditBeforeSubmit', [
                    f,
                    e('#' + b),
                    v,
                  ])),
                  void 0 === u && (u = [!0, '', '']),
                  u[0] &&
                    e.isFunction(t[g.p.id].beforeSubmit) &&
                    (u = t[g.p.id].beforeSubmit.call(g, f, e('#' + b), v))),
                u[0] && !t[g.p.id].processing)
              ) {
                if (
                  ((t[g.p.id].processing = !0),
                  e('#sData', y + '_2').addClass('ui-state-active'),
                  (c = t[g.p.id].url || e(g).jqGrid('getGridParam', 'editurl')),
                  (o = m.oper),
                  (a = 'clientArray' === c ? g.p.keyName : m.id),
                  (f[o] =
                    '_empty' === e.trim(f[g.p.id + '_id'])
                      ? m.addoper
                      : m.editoper),
                  f[o] !== m.addoper
                    ? (f[a] = f[g.p.id + '_id'])
                    : void 0 === f[a] && (f[a] = f[g.p.id + '_id']),
                  delete f[g.p.id + '_id'],
                  (f = e.extend(f, t[g.p.id].editData, h)),
                  g.p.treeGrid === !0)
                ) {
                  if (f[o] === m.addoper) {
                    l = e(g).jqGrid('getGridParam', 'selrow');
                    var q =
                      'adjacency' === g.p.treeGridModel
                        ? g.p.treeReader.parent_id_field
                        : 'parent_id';
                    f[q] = l;
                  }
                  for (p in g.p.treeReader)
                    if (g.p.treeReader.hasOwnProperty(p)) {
                      var D = g.p.treeReader[p];
                      if (f.hasOwnProperty(D)) {
                        if (f[o] === m.addoper && 'parent_id_field' === p)
                          continue;
                        delete f[D];
                      }
                    }
                }
                f[a] = e.jgrid.stripPref(g.p.idPrefix, f[a]);
                var $ = e.extend(
                  {
                    url: c,
                    type: t[g.p.id].mtype,
                    data: e.isFunction(t[g.p.id].serializeEditData)
                      ? t[g.p.id].serializeEditData.call(g, f)
                      : f,
                    complete: function (n, d) {
                      var p;
                      if (
                        (e('#sData', y + '_2').removeClass('ui-state-active'),
                        (f[a] = g.p.idPrefix + f[a]),
                        n.status >= 300 && 304 !== n.status
                          ? ((u[0] = !1),
                            (u[1] = e(g).triggerHandler(
                              'jqGridAddEditErrorTextFormat',
                              [n, v]
                            )),
                            (u[1] = e.isFunction(t[g.p.id].errorTextFormat)
                              ? t[g.p.id].errorTextFormat.call(g, n, v)
                              : d +
                                " Status: '" +
                                n.statusText +
                                "'. Error code: " +
                                n.status))
                          : ((u = e(g).triggerHandler(
                              'jqGridAddEditAfterSubmit',
                              [n, f, v]
                            )),
                            void 0 === u && (u = [!0, '', '']),
                            u[0] &&
                              e.isFunction(t[g.p.id].afterSubmit) &&
                              (u = t[g.p.id].afterSubmit.call(g, n, f, v))),
                        u[0] === !1)
                      )
                        e('#FormError>td', y).html(u[1]),
                          e('#FormError', y).show();
                      else if (
                        (g.p.autoencode &&
                          e.each(f, function (t, i) {
                            f[t] = e.jgrid.htmlDecode(i);
                          }),
                        f[o] === m.addoper
                          ? (u[2] || (u[2] = e.jgrid.randId()),
                            null == f[a] || '_empty' === f[a]
                              ? (f[a] = u[2])
                              : (u[2] = f[a]),
                            t[g.p.id].reloadAfterSubmit
                              ? e(g).trigger('reloadGrid')
                              : g.p.treeGrid === !0
                                ? e(g).jqGrid('addChildNode', u[2], l, f)
                                : e(g).jqGrid(
                                    'addRowData',
                                    u[2],
                                    f,
                                    r.addedrow
                                  ),
                            t[g.p.id].closeAfterAdd
                              ? (g.p.treeGrid !== !0 &&
                                  e(g).jqGrid('setSelection', u[2]),
                                e.jgrid.hideModal(
                                  '#' + e.jgrid.jqID(x.themodal),
                                  {
                                    gb: '#gbox_' + e.jgrid.jqID(j),
                                    jqm: r.jqModal,
                                    onClose: t[g.p.id].onClose,
                                    removemodal: t[g.p.id].removemodal,
                                    formprop: !t[g.p.id].recreateForm,
                                    form: t[g.p.id].form,
                                  }
                                ))
                              : t[g.p.id].clearAfterAdd && s('_empty', g, b))
                          : (t[g.p.id].reloadAfterSubmit
                              ? (e(g).trigger('reloadGrid'),
                                t[g.p.id].closeAfterEdit ||
                                  setTimeout(function () {
                                    e(g).jqGrid('setSelection', f[a]);
                                  }, 1e3))
                              : g.p.treeGrid === !0
                                ? e(g).jqGrid('setTreeRow', f[a], f)
                                : e(g).jqGrid('setRowData', f[a], f),
                            t[g.p.id].closeAfterEdit &&
                              e.jgrid.hideModal(
                                '#' + e.jgrid.jqID(x.themodal),
                                {
                                  gb: '#gbox_' + e.jgrid.jqID(j),
                                  jqm: r.jqModal,
                                  onClose: t[g.p.id].onClose,
                                  removemodal: t[g.p.id].removemodal,
                                  formprop: !t[g.p.id].recreateForm,
                                  form: t[g.p.id].form,
                                }
                              )),
                        e.isFunction(t[g.p.id].afterComplete) &&
                          ((i = n),
                          setTimeout(function () {
                            e(g).triggerHandler('jqGridAddEditAfterComplete', [
                              i,
                              f,
                              e('#' + b),
                              v,
                            ]),
                              t[g.p.id].afterComplete.call(
                                g,
                                i,
                                f,
                                e('#' + b),
                                v
                              ),
                              (i = null);
                          }, 500)),
                        (t[g.p.id].checkOnSubmit || t[g.p.id].checkOnUpdate) &&
                          (e('#' + b).data('disabled', !1),
                          '_empty' !== t[g.p.id]._savedData[g.p.id + '_id']))
                      )
                        for (p in t[g.p.id]._savedData)
                          t[g.p.id]._savedData.hasOwnProperty(p) &&
                            f[p] &&
                            (t[g.p.id]._savedData[p] = f[p]);
                      t[g.p.id].processing = !1;
                      try {
                        e(':input:visible', '#' + b)[0].focus();
                      } catch (c) {}
                    },
                  },
                  e.jgrid.ajaxOptions,
                  t[g.p.id].ajaxEditOptions
                );
                if (
                  ($.url ||
                    t[g.p.id].useDataProxy ||
                    (e.isFunction(g.p.dataProxy)
                      ? (t[g.p.id].useDataProxy = !0)
                      : ((u[0] = !1), (u[1] += ' ' + e.jgrid.errors.nourl))),
                  u[0])
                )
                  if (t[g.p.id].useDataProxy) {
                    var _ = g.p.dataProxy.call(g, $, 'set_' + g.p.id);
                    void 0 === _ && (_ = [!0, '']),
                      _[0] === !1
                        ? ((u[0] = !1),
                          (u[1] = _[1] || 'Error deleting the selected row!'))
                        : ($.data.oper === m.addoper &&
                            t[g.p.id].closeAfterAdd &&
                            e.jgrid.hideModal('#' + e.jgrid.jqID(x.themodal), {
                              gb: '#gbox_' + e.jgrid.jqID(j),
                              jqm: r.jqModal,
                              onClose: t[g.p.id].onClose,
                              removemodal: t[g.p.id].removemodal,
                              formprop: !t[g.p.id].recreateForm,
                              form: t[g.p.id].form,
                            }),
                          $.data.oper === m.editoper &&
                            t[g.p.id].closeAfterEdit &&
                            e.jgrid.hideModal('#' + e.jgrid.jqID(x.themodal), {
                              gb: '#gbox_' + e.jgrid.jqID(j),
                              jqm: r.jqModal,
                              onClose: t[g.p.id].onClose,
                              removemodal: t[g.p.id].removemodal,
                              formprop: !t[g.p.id].recreateForm,
                              form: t[g.p.id].form,
                            }));
                  } else
                    'clientArray' === $.url
                      ? ((t[g.p.id].reloadAfterSubmit = !1),
                        (f = $.data),
                        $.complete({ status: 200, statusText: '' }, ''))
                      : e.ajax($);
              }
              u[0] === !1 &&
                (e('#FormError>td', y).html(u[1]), e('#FormError', y).show());
            }
            function l(e, t) {
              var i,
                r = !1;
              for (i in e)
                if (e.hasOwnProperty(i) && e[i] != t[i]) {
                  r = !0;
                  break;
                }
              return r;
            }
            function p() {
              var i = !0;
              return (
                e('#FormError', y).hide(),
                t[g.p.id].checkOnUpdate &&
                  ((f = {}),
                  a(),
                  (m = l(f, t[g.p.id]._savedData)),
                  m &&
                    (e('#' + b).data('disabled', !0),
                    e('.confirm', '#' + x.themodal).show(),
                    (i = !1))),
                i
              );
            }
            function c() {
              var t;
              if (
                '_empty' !== i &&
                void 0 !== g.p.savedRow &&
                g.p.savedRow.length > 0 &&
                e.isFunction(e.fn.jqGrid.restoreRow)
              )
                for (t = 0; t < g.p.savedRow.length; t++)
                  if (g.p.savedRow[t].id == i) {
                    e(g).jqGrid('restoreRow', i);
                    break;
                  }
            }
            function u(t, i) {
              var r = i[1].length - 1;
              0 === t
                ? e('#pData', y + '_2').addClass('ui-state-disabled')
                : void 0 !== i[1][t - 1] &&
                    e('#' + e.jgrid.jqID(i[1][t - 1])).hasClass(
                      'ui-state-disabled'
                    )
                  ? e('#pData', y + '_2').addClass('ui-state-disabled')
                  : e('#pData', y + '_2').removeClass('ui-state-disabled'),
                t === r
                  ? e('#nData', y + '_2').addClass('ui-state-disabled')
                  : void 0 !== i[1][t + 1] &&
                      e('#' + e.jgrid.jqID(i[1][t + 1])).hasClass(
                        'ui-state-disabled'
                      )
                    ? e('#nData', y + '_2').addClass('ui-state-disabled')
                    : e('#nData', y + '_2').removeClass('ui-state-disabled');
            }
            function h() {
              var t = e(g).jqGrid('getDataIDs'),
                i = e('#id_g', y).val(),
                r = e.inArray(i, t);
              return [r, t];
            }
            var g = this;
            if (g.grid && i) {
              var f,
                m,
                v,
                j = g.p.id,
                b = 'FrmGrid_' + j,
                w = 'TblGrid_' + j,
                y = '#' + e.jgrid.jqID(w),
                x = {
                  themodal: 'editmod' + j,
                  modalhead: 'edithd' + j,
                  modalcontent: 'editcnt' + j,
                  scrollelm: b,
                },
                q = e.isFunction(t[g.p.id].beforeShowForm)
                  ? t[g.p.id].beforeShowForm
                  : !1,
                D = e.isFunction(t[g.p.id].afterShowForm)
                  ? t[g.p.id].afterShowForm
                  : !1,
                $ = e.isFunction(t[g.p.id].beforeInitData)
                  ? t[g.p.id].beforeInitData
                  : !1,
                _ = e.isFunction(t[g.p.id].onInitializeForm)
                  ? t[g.p.id].onInitializeForm
                  : !1,
                C = !0,
                G = 1,
                I = 0;
              (b = e.jgrid.jqID(b)),
                'new' === i
                  ? ((i = '_empty'),
                    (v = 'add'),
                    (r.caption = t[g.p.id].addCaption))
                  : ((r.caption = t[g.p.id].editCaption), (v = 'edit')),
                r.recreateForm ||
                  (e(g).data('formProp') &&
                    e.extend(t[e(this)[0].p.id], e(g).data('formProp')));
              var F = !0;
              r.checkOnUpdate && r.jqModal && !r.modal && (F = !1);
              var S = isNaN(t[e(this)[0].p.id].dataheight)
                  ? t[e(this)[0].p.id].dataheight
                  : t[e(this)[0].p.id].dataheight + 'px',
                k = isNaN(t[e(this)[0].p.id].datawidth)
                  ? t[e(this)[0].p.id].datawidth
                  : t[e(this)[0].p.id].datawidth + 'px',
                R = e(
                  "<form name='FormPost' id='" +
                    b +
                    "' class='FormGrid' onSubmit='return false;' style='width:" +
                    k +
                    ';overflow:auto;position:relative;height:' +
                    S +
                    ";'></form>"
                ).data('disabled', !1),
                M = e(
                  "<table id='" +
                    w +
                    "' class='EditTable' cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>"
                );
              e(g.p.colModel).each(function () {
                var e = this.formoptions;
                (G = Math.max(G, e ? e.colpos || 0 : 0)),
                  (I = Math.max(I, e ? e.rowpos || 0 : 0));
              }),
                e(R).append(M);
              var N = e(
                "<tr id='FormError' style='display:none'><td class='ui-state-error' colspan='" +
                  2 * G +
                  "'></td></tr>"
              );
              if (
                ((N[0].rp = 0),
                e(M).append(N),
                (N = e(
                  "<tr style='display:none' class='tinfo'><td class='topinfo' colspan='" +
                    2 * G +
                    "'>" +
                    t[g.p.id].topinfo +
                    '</td></tr>'
                )),
                (N[0].rp = 0),
                e(M).append(N),
                (C = e(g).triggerHandler('jqGridAddEditBeforeInitData', [
                  R,
                  v,
                ])),
                void 0 === C && (C = !0),
                C && $ && (C = $.call(g, R, v)),
                C !== !1)
              ) {
                c();
                var O = 'rtl' === g.p.direction ? !0 : !1,
                  A = O ? 'nData' : 'pData',
                  P = O ? 'pData' : 'nData';
                o(i, g, M, G);
                var E =
                    "<a id='" +
                    A +
                    "' class='fm-button ui-state-default ui-corner-left'><span class='ui-icon ui-icon-triangle-1-w'></span></a>",
                  T =
                    "<a id='" +
                    P +
                    "' class='fm-button ui-state-default ui-corner-right'><span class='ui-icon ui-icon-triangle-1-e'></span></a>",
                  z =
                    "<a id='sData' class='fm-button ui-state-default ui-corner-all'>" +
                    r.bSubmit +
                    '</a>',
                  H =
                    "<a id='cData' class='fm-button ui-state-default ui-corner-all'>" +
                    r.bCancel +
                    '</a>',
                  B =
                    "<table border='0' cellspacing='0' cellpadding='0' class='EditTable' id='" +
                    w +
                    "_2'><tbody><tr><td colspan='2'><hr class='ui-widget-content' style='margin:1px'/></td></tr><tr id='Act_Buttons'><td class='navButton'>" +
                    (O ? T + E : E + T) +
                    "</td><td class='EditButton'>" +
                    z +
                    H +
                    '</td></tr>';
                if (
                  ((B +=
                    "<tr style='display:none' class='binfo'><td class='bottominfo' colspan='2'>" +
                    t[g.p.id].bottominfo +
                    '</td></tr>'),
                  (B += '</tbody></table>'),
                  I > 0)
                ) {
                  var L = [];
                  e.each(e(M)[0].rows, function (e, t) {
                    L[e] = t;
                  }),
                    L.sort(function (e, t) {
                      return e.rp > t.rp ? 1 : e.rp < t.rp ? -1 : 0;
                    }),
                    e.each(L, function (t, i) {
                      e('tbody', M).append(i);
                    });
                }
                r.gbox = '#gbox_' + e.jgrid.jqID(j);
                var V = !1;
                r.closeOnEscape === !0 && ((r.closeOnEscape = !1), (V = !0));
                var Q = e('<div></div>').append(R).append(B);
                if (
                  (e.jgrid.createModal(
                    x,
                    Q,
                    t[e(this)[0].p.id],
                    '#gview_' + e.jgrid.jqID(g.p.id),
                    e('#gbox_' + e.jgrid.jqID(g.p.id))[0]
                  ),
                  O &&
                    (e('#pData, #nData', y + '_2').css('float', 'right'),
                    e('.EditButton', y + '_2').css('text-align', 'left')),
                  t[g.p.id].topinfo && e('.tinfo', y).show(),
                  t[g.p.id].bottominfo && e('.binfo', y + '_2').show(),
                  (Q = null),
                  (B = null),
                  e('#' + e.jgrid.jqID(x.themodal)).keydown(function (i) {
                    var a = i.target;
                    if (e('#' + b).data('disabled') === !0) return !1;
                    if (
                      t[g.p.id].savekey[0] === !0 &&
                      i.which === t[g.p.id].savekey[1] &&
                      'TEXTAREA' !== a.tagName
                    )
                      return e('#sData', y + '_2').trigger('click'), !1;
                    if (27 === i.which)
                      return p()
                        ? (V &&
                            e.jgrid.hideModal('#' + e.jgrid.jqID(x.themodal), {
                              gb: r.gbox,
                              jqm: r.jqModal,
                              onClose: t[g.p.id].onClose,
                              removemodal: t[g.p.id].removemodal,
                              formprop: !t[g.p.id].recreateForm,
                              form: t[g.p.id].form,
                            }),
                          !1)
                        : !1;
                    if (t[g.p.id].navkeys[0] === !0) {
                      if ('_empty' === e('#id_g', y).val()) return !0;
                      if (i.which === t[g.p.id].navkeys[1])
                        return e('#pData', y + '_2').trigger('click'), !1;
                      if (i.which === t[g.p.id].navkeys[2])
                        return e('#nData', y + '_2').trigger('click'), !1;
                    }
                  }),
                  r.checkOnUpdate &&
                    (e(
                      'a.ui-jqdialog-titlebar-close span',
                      '#' + e.jgrid.jqID(x.themodal)
                    ).removeClass('jqmClose'),
                    e(
                      'a.ui-jqdialog-titlebar-close',
                      '#' + e.jgrid.jqID(x.themodal)
                    )
                      .unbind('click')
                      .click(function () {
                        return p()
                          ? (e.jgrid.hideModal('#' + e.jgrid.jqID(x.themodal), {
                              gb: '#gbox_' + e.jgrid.jqID(j),
                              jqm: r.jqModal,
                              onClose: t[g.p.id].onClose,
                              removemodal: t[g.p.id].removemodal,
                              formprop: !t[g.p.id].recreateForm,
                              form: t[g.p.id].form,
                            }),
                            !1)
                          : !1;
                      })),
                  (r.saveicon = e.extend(
                    [!0, 'left', 'ui-icon-disk'],
                    r.saveicon
                  )),
                  (r.closeicon = e.extend(
                    [!0, 'left', 'ui-icon-close'],
                    r.closeicon
                  )),
                  r.saveicon[0] === !0 &&
                    e('#sData', y + '_2')
                      .addClass(
                        'right' === r.saveicon[1]
                          ? 'fm-button-icon-right'
                          : 'fm-button-icon-left'
                      )
                      .append(
                        "<span class='ui-icon " + r.saveicon[2] + "'></span>"
                      ),
                  r.closeicon[0] === !0 &&
                    e('#cData', y + '_2')
                      .addClass(
                        'right' === r.closeicon[1]
                          ? 'fm-button-icon-right'
                          : 'fm-button-icon-left'
                      )
                      .append(
                        "<span class='ui-icon " + r.closeicon[2] + "'></span>"
                      ),
                  t[g.p.id].checkOnSubmit || t[g.p.id].checkOnUpdate)
                ) {
                  (z =
                    "<a id='sNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>" +
                    r.bYes +
                    '</a>'),
                    (T =
                      "<a id='nNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>" +
                      r.bNo +
                      '</a>'),
                    (H =
                      "<a id='cNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'>" +
                      r.bExit +
                      '</a>');
                  var W = r.zIndex || 999;
                  W++,
                    e(
                      "<div class='" +
                        r.overlayClass +
                        " jqgrid-overlay confirm' style='z-index:" +
                        W +
                        ";display:none;'>&#160;</div><div class='confirm ui-widget-content ui-jqconfirm' style='z-index:" +
                        (W + 1) +
                        "'>" +
                        r.saveData +
                        '<br/><br/>' +
                        z +
                        T +
                        H +
                        '</div>'
                    ).insertAfter('#' + b),
                    e('#sNew', '#' + e.jgrid.jqID(x.themodal)).click(
                      function () {
                        return (
                          d(),
                          e('#' + b).data('disabled', !1),
                          e('.confirm', '#' + e.jgrid.jqID(x.themodal)).hide(),
                          !1
                        );
                      }
                    ),
                    e('#nNew', '#' + e.jgrid.jqID(x.themodal)).click(
                      function () {
                        return (
                          e('.confirm', '#' + e.jgrid.jqID(x.themodal)).hide(),
                          e('#' + b).data('disabled', !1),
                          setTimeout(function () {
                            e(':input:visible', '#' + b)[0].focus();
                          }, 0),
                          !1
                        );
                      }
                    ),
                    e('#cNew', '#' + e.jgrid.jqID(x.themodal)).click(
                      function () {
                        return (
                          e('.confirm', '#' + e.jgrid.jqID(x.themodal)).hide(),
                          e('#' + b).data('disabled', !1),
                          e.jgrid.hideModal('#' + e.jgrid.jqID(x.themodal), {
                            gb: '#gbox_' + e.jgrid.jqID(j),
                            jqm: r.jqModal,
                            onClose: t[g.p.id].onClose,
                            removemodal: t[g.p.id].removemodal,
                            formprop: !t[g.p.id].recreateForm,
                            form: t[g.p.id].form,
                          }),
                          !1
                        );
                      }
                    );
                }
                e(g).triggerHandler('jqGridAddEditInitializeForm', [
                  e('#' + b),
                  v,
                ]),
                  _ && _.call(g, e('#' + b), v),
                  '_empty' !== i && t[g.p.id].viewPagerButtons
                    ? e('#pData,#nData', y + '_2').show()
                    : e('#pData,#nData', y + '_2').hide(),
                  e(g).triggerHandler('jqGridAddEditBeforeShowForm', [
                    e('#' + b),
                    v,
                  ]),
                  q && q.call(g, e('#' + b), v),
                  e('#' + e.jgrid.jqID(x.themodal)).data(
                    'onClose',
                    t[g.p.id].onClose
                  ),
                  e.jgrid.viewModal('#' + e.jgrid.jqID(x.themodal), {
                    gbox: '#gbox_' + e.jgrid.jqID(j),
                    jqm: r.jqModal,
                    overlay: r.overlay,
                    modal: r.modal,
                    overlayClass: r.overlayClass,
                    onHide: function (t) {
                      var i = e('#editmod' + j)[0].style.height;
                      i.indexOf('px') > -1 && (i = parseFloat(i)),
                        e(g).data('formProp', {
                          top: parseFloat(e(t.w).css('top')),
                          left: parseFloat(e(t.w).css('left')),
                          width: e(t.w).width(),
                          height: i,
                          dataheight: e('#' + b).height(),
                          datawidth: e('#' + b).width(),
                        }),
                        t.w.remove(),
                        t.o && t.o.remove();
                    },
                  }),
                  F ||
                    e('.' + e.jgrid.jqID(r.overlayClass)).click(function () {
                      return p()
                        ? (e.jgrid.hideModal('#' + e.jgrid.jqID(x.themodal), {
                            gb: '#gbox_' + e.jgrid.jqID(j),
                            jqm: r.jqModal,
                            onClose: t[g.p.id].onClose,
                            removemodal: t[g.p.id].removemodal,
                            formprop: !t[g.p.id].recreateForm,
                            form: t[g.p.id].form,
                          }),
                          !1)
                        : !1;
                    }),
                  e('.fm-button', '#' + e.jgrid.jqID(x.themodal)).hover(
                    function () {
                      e(this).addClass('ui-state-hover');
                    },
                    function () {
                      e(this).removeClass('ui-state-hover');
                    }
                  ),
                  e('#sData', y + '_2').click(function () {
                    return (
                      (f = {}),
                      e('#FormError', y).hide(),
                      a(),
                      '_empty' === f[g.p.id + '_id']
                        ? d()
                        : r.checkOnSubmit === !0
                          ? ((m = l(f, t[g.p.id]._savedData)),
                            m
                              ? (e('#' + b).data('disabled', !0),
                                e(
                                  '.confirm',
                                  '#' + e.jgrid.jqID(x.themodal)
                                ).show())
                              : d())
                          : d(),
                      !1
                    );
                  }),
                  e('#cData', y + '_2').click(function () {
                    return p()
                      ? (e.jgrid.hideModal('#' + e.jgrid.jqID(x.themodal), {
                          gb: '#gbox_' + e.jgrid.jqID(j),
                          jqm: r.jqModal,
                          onClose: t[g.p.id].onClose,
                          removemodal: t[g.p.id].removemodal,
                          formprop: !t[g.p.id].recreateForm,
                          form: t[g.p.id].form,
                        }),
                        !1)
                      : !1;
                  }),
                  e('#nData', y + '_2').click(function () {
                    if (!p()) return !1;
                    e('#FormError', y).hide();
                    var t = h();
                    if (
                      ((t[0] = parseInt(t[0], 10)),
                      -1 !== t[0] && t[1][t[0] + 1])
                    ) {
                      e(g).triggerHandler('jqGridAddEditClickPgButtons', [
                        'next',
                        e('#' + b),
                        t[1][t[0]],
                      ]);
                      var i;
                      if (
                        e.isFunction(r.onclickPgButtons) &&
                        ((i = r.onclickPgButtons.call(
                          g,
                          'next',
                          e('#' + b),
                          t[1][t[0]]
                        )),
                        void 0 !== i && i === !1)
                      )
                        return !1;
                      if (
                        e('#' + e.jgrid.jqID(t[1][t[0] + 1])).hasClass(
                          'ui-state-disabled'
                        )
                      )
                        return !1;
                      s(t[1][t[0] + 1], g, b),
                        e(g).jqGrid('setSelection', t[1][t[0] + 1]),
                        e(g).triggerHandler(
                          'jqGridAddEditAfterClickPgButtons',
                          ['next', e('#' + b), t[1][t[0]]]
                        ),
                        e.isFunction(r.afterclickPgButtons) &&
                          r.afterclickPgButtons.call(
                            g,
                            'next',
                            e('#' + b),
                            t[1][t[0] + 1]
                          ),
                        u(t[0] + 1, t);
                    }
                    return !1;
                  }),
                  e('#pData', y + '_2').click(function () {
                    if (!p()) return !1;
                    e('#FormError', y).hide();
                    var t = h();
                    if (-1 !== t[0] && t[1][t[0] - 1]) {
                      e(g).triggerHandler('jqGridAddEditClickPgButtons', [
                        'prev',
                        e('#' + b),
                        t[1][t[0]],
                      ]);
                      var i;
                      if (
                        e.isFunction(r.onclickPgButtons) &&
                        ((i = r.onclickPgButtons.call(
                          g,
                          'prev',
                          e('#' + b),
                          t[1][t[0]]
                        )),
                        void 0 !== i && i === !1)
                      )
                        return !1;
                      if (
                        e('#' + e.jgrid.jqID(t[1][t[0] - 1])).hasClass(
                          'ui-state-disabled'
                        )
                      )
                        return !1;
                      s(t[1][t[0] - 1], g, b),
                        e(g).jqGrid('setSelection', t[1][t[0] - 1]),
                        e(g).triggerHandler(
                          'jqGridAddEditAfterClickPgButtons',
                          ['prev', e('#' + b), t[1][t[0]]]
                        ),
                        e.isFunction(r.afterclickPgButtons) &&
                          r.afterclickPgButtons.call(
                            g,
                            'prev',
                            e('#' + b),
                            t[1][t[0] - 1]
                          ),
                        u(t[0] - 1, t);
                    }
                    return !1;
                  }),
                  e(g).triggerHandler('jqGridAddEditAfterShowForm', [
                    e('#' + b),
                    v,
                  ]),
                  D && D.call(g, e('#' + b), v);
                var U = h();
                u(U[0], U);
              }
            }
          })
        );
      },
      viewGridRow: function (i, r) {
        return (
          (r = e.extend(
            !0,
            {
              top: 0,
              left: 0,
              width: 0,
              datawidth: 'auto',
              height: 'auto',
              dataheight: 'auto',
              modal: !1,
              overlay: 30,
              drag: !0,
              resize: !0,
              jqModal: !0,
              closeOnEscape: !1,
              labelswidth: '30%',
              closeicon: [],
              navkeys: [!1, 38, 40],
              onClose: null,
              beforeShowForm: null,
              beforeInitData: null,
              viewPagerButtons: !0,
              recreateForm: !1,
              removemodal: !0,
              form: 'view',
            },
            e.jgrid.view,
            r || {}
          )),
          (t[e(this)[0].p.id] = r),
          this.each(function () {
            function a() {
              (t[l.p.id].closeOnEscape === !0 || t[l.p.id].navkeys[0] === !0) &&
                setTimeout(function () {
                  e(
                    '.ui-jqdialog-titlebar-close',
                    '#' + e.jgrid.jqID(f.modalhead)
                  )
                    .attr('tabindex', '-1')
                    .focus();
                }, 0);
            }
            function o(t, i, a, o) {
              var s,
                n,
                d,
                l,
                p,
                c,
                u,
                h,
                g,
                f = 0,
                m = [],
                v = !1,
                j =
                  "<td class='CaptionTD form-view-label ui-widget-content' width='" +
                  r.labelswidth +
                  "'>&#160;</td><td class='DataTD form-view-data ui-helper-reset ui-widget-content'>&#160;</td>",
                b = '',
                w =
                  "<td class='CaptionTD form-view-label ui-widget-content'>&#160;</td><td class='DataTD form-view-data ui-widget-content'>&#160;</td>",
                y = ['integer', 'number', 'currency'],
                x = 0,
                q = 0;
              for (c = 1; o >= c; c++) b += 1 === c ? j : w;
              if (
                (e(i.p.colModel).each(function () {
                  (n =
                    this.editrules && this.editrules.edithidden === !0
                      ? !1
                      : this.hidden === !0
                        ? !0
                        : !1),
                    n ||
                      'right' !== this.align ||
                      (this.formatter && -1 !== e.inArray(this.formatter, y)
                        ? (x = Math.max(x, parseInt(this.width, 10)))
                        : (q = Math.max(q, parseInt(this.width, 10))));
                }),
                (u = 0 !== x ? x : 0 !== q ? q : 0),
                (v = e(i).jqGrid('getInd', t)),
                e(i.p.colModel).each(function (t) {
                  if (
                    ((s = this.name),
                    (h = !1),
                    (n =
                      this.editrules && this.editrules.edithidden === !0
                        ? !1
                        : this.hidden === !0
                          ? !0
                          : !1),
                    (p = n ? "style='display:none'" : ''),
                    (g =
                      'boolean' != typeof this.viewable ? !0 : this.viewable),
                    'cb' !== s && 'subgrid' !== s && 'rn' !== s && g)
                  ) {
                    (l =
                      v === !1
                        ? ''
                        : s === i.p.ExpandColumn && i.p.treeGrid === !0
                          ? e('td:eq(' + t + ')', i.rows[v]).text()
                          : e('td:eq(' + t + ')', i.rows[v]).html()),
                      (h = 'right' === this.align && 0 !== u ? !0 : !1);
                    var r = e.extend(
                        {},
                        { rowabove: !1, rowcontent: '' },
                        this.formoptions || {}
                      ),
                      c = parseInt(r.rowpos, 10) || f + 1,
                      j = parseInt(2 * (parseInt(r.colpos, 10) || 1), 10);
                    if (r.rowabove) {
                      var w = e(
                        "<tr><td class='contentinfo' colspan='" +
                          2 * o +
                          "'>" +
                          r.rowcontent +
                          '</td></tr>'
                      );
                      e(a).append(w), (w[0].rp = c);
                    }
                    (d = e(a).find('tr[rowpos=' + c + ']')),
                      0 === d.length &&
                        ((d = e('<tr ' + p + " rowpos='" + c + "'></tr>")
                          .addClass('FormData')
                          .attr('id', 'trv_' + s)),
                        e(d).append(b),
                        e(a).append(d),
                        (d[0].rp = c)),
                      e('td:eq(' + (j - 2) + ')', d[0]).html(
                        '<b>' +
                          (void 0 === r.label ? i.p.colNames[t] : r.label) +
                          '</b>'
                      ),
                      e('td:eq(' + (j - 1) + ')', d[0])
                        .append('<span>' + l + '</span>')
                        .attr('id', 'v_' + s),
                      h &&
                        e('td:eq(' + (j - 1) + ') span', d[0]).css({
                          'text-align': 'right',
                          width: u + 'px',
                        }),
                      (m[f] = t),
                      f++;
                  }
                }),
                f > 0)
              ) {
                var D = e(
                  "<tr class='FormData' style='display:none'><td class='CaptionTD'></td><td colspan='" +
                    (2 * o - 1) +
                    "' class='DataTD'><input class='FormElement' id='id_g' type='text' name='id' value='" +
                    t +
                    "'/></td></tr>"
                );
                (D[0].rp = f + 99), e(a).append(D);
              }
              return m;
            }
            function s(t, i) {
              var r,
                a,
                o,
                s,
                n = 0;
              (s = e(i).jqGrid('getInd', t, !0)),
                s &&
                  (e('td', s).each(function (t) {
                    (r = i.p.colModel[t].name),
                      (a =
                        i.p.colModel[t].editrules &&
                        i.p.colModel[t].editrules.edithidden === !0
                          ? !1
                          : i.p.colModel[t].hidden === !0
                            ? !0
                            : !1),
                      'cb' !== r &&
                        'subgrid' !== r &&
                        'rn' !== r &&
                        ((o =
                          r === i.p.ExpandColumn && i.p.treeGrid === !0
                            ? e(this).text()
                            : e(this).html()),
                        (r = e.jgrid.jqID('v_' + r)),
                        e('#' + r + ' span', '#' + u).html(o),
                        a &&
                          e('#' + r, '#' + u)
                            .parents('tr:first')
                            .hide(),
                        n++);
                  }),
                  n > 0 && e('#id_g', '#' + u).val(t));
            }
            function n(t, i) {
              var r = i[1].length - 1;
              0 === t
                ? e('#pData', '#' + u + '_2').addClass('ui-state-disabled')
                : void 0 !== i[1][t - 1] &&
                    e('#' + e.jgrid.jqID(i[1][t - 1])).hasClass(
                      'ui-state-disabled'
                    )
                  ? e('#pData', u + '_2').addClass('ui-state-disabled')
                  : e('#pData', '#' + u + '_2').removeClass(
                      'ui-state-disabled'
                    ),
                t === r
                  ? e('#nData', '#' + u + '_2').addClass('ui-state-disabled')
                  : void 0 !== i[1][t + 1] &&
                      e('#' + e.jgrid.jqID(i[1][t + 1])).hasClass(
                        'ui-state-disabled'
                      )
                    ? e('#nData', u + '_2').addClass('ui-state-disabled')
                    : e('#nData', '#' + u + '_2').removeClass(
                        'ui-state-disabled'
                      );
            }
            function d() {
              var t = e(l).jqGrid('getDataIDs'),
                i = e('#id_g', '#' + u).val(),
                r = e.inArray(i, t);
              return [r, t];
            }
            var l = this;
            if (l.grid && i) {
              var p = l.p.id,
                c = 'ViewGrid_' + e.jgrid.jqID(p),
                u = 'ViewTbl_' + e.jgrid.jqID(p),
                h = 'ViewGrid_' + p,
                g = 'ViewTbl_' + p,
                f = {
                  themodal: 'viewmod' + p,
                  modalhead: 'viewhd' + p,
                  modalcontent: 'viewcnt' + p,
                  scrollelm: c,
                },
                m = e.isFunction(t[l.p.id].beforeInitData)
                  ? t[l.p.id].beforeInitData
                  : !1,
                v = !0,
                j = 1,
                b = 0;
              r.recreateForm ||
                (e(l).data('viewProp') &&
                  e.extend(t[e(this)[0].p.id], e(l).data('viewProp')));
              var w = isNaN(t[e(this)[0].p.id].dataheight)
                  ? t[e(this)[0].p.id].dataheight
                  : t[e(this)[0].p.id].dataheight + 'px',
                y = isNaN(t[e(this)[0].p.id].datawidth)
                  ? t[e(this)[0].p.id].datawidth
                  : t[e(this)[0].p.id].datawidth + 'px',
                x = e(
                  "<form name='FormPost' id='" +
                    h +
                    "' class='FormGrid' style='width:" +
                    y +
                    ';overflow:auto;position:relative;height:' +
                    w +
                    ";'></form>"
                ),
                q = e(
                  "<table id='" +
                    g +
                    "' class='EditTable' cellspacing='1' cellpadding='2' border='0' style='table-layout:fixed'><tbody></tbody></table>"
                );
              if (
                (e(l.p.colModel).each(function () {
                  var e = this.formoptions;
                  (j = Math.max(j, e ? e.colpos || 0 : 0)),
                    (b = Math.max(b, e ? e.rowpos || 0 : 0));
                }),
                e(x).append(q),
                m && ((v = m.call(l, x)), void 0 === v && (v = !0)),
                v !== !1)
              ) {
                o(i, l, q, j);
                var D = 'rtl' === l.p.direction ? !0 : !1,
                  $ = D ? 'nData' : 'pData',
                  _ = D ? 'pData' : 'nData',
                  C =
                    "<a id='" +
                    $ +
                    "' class='fm-button ui-state-default ui-corner-left'><span class='ui-icon ui-icon-triangle-1-w'></span></a>",
                  G =
                    "<a id='" +
                    _ +
                    "' class='fm-button ui-state-default ui-corner-right'><span class='ui-icon ui-icon-triangle-1-e'></span></a>",
                  I =
                    "<a id='cData' class='fm-button ui-state-default ui-corner-all'>" +
                    r.bClose +
                    '</a>';
                if (b > 0) {
                  var F = [];
                  e.each(e(q)[0].rows, function (e, t) {
                    F[e] = t;
                  }),
                    F.sort(function (e, t) {
                      return e.rp > t.rp ? 1 : e.rp < t.rp ? -1 : 0;
                    }),
                    e.each(F, function (t, i) {
                      e('tbody', q).append(i);
                    });
                }
                r.gbox = '#gbox_' + e.jgrid.jqID(p);
                var S = e('<div></div>')
                  .append(x)
                  .append(
                    "<table border='0' class='EditTable' id='" +
                      u +
                      "_2'><tbody><tr id='Act_Buttons'><td class='navButton' width='" +
                      r.labelswidth +
                      "'>" +
                      (D ? G + C : C + G) +
                      "</td><td class='EditButton'>" +
                      I +
                      '</td></tr></tbody></table>'
                  );
                e.jgrid.createModal(
                  f,
                  S,
                  r,
                  '#gview_' + e.jgrid.jqID(l.p.id),
                  e('#gview_' + e.jgrid.jqID(l.p.id))[0]
                ),
                  D &&
                    (e('#pData, #nData', '#' + u + '_2').css('float', 'right'),
                    e('.EditButton', '#' + u + '_2').css('text-align', 'left')),
                  r.viewPagerButtons ||
                    e('#pData, #nData', '#' + u + '_2').hide(),
                  (S = null),
                  e('#' + f.themodal).keydown(function (i) {
                    if (27 === i.which)
                      return (
                        t[l.p.id].closeOnEscape &&
                          e.jgrid.hideModal('#' + e.jgrid.jqID(f.themodal), {
                            gb: r.gbox,
                            jqm: r.jqModal,
                            onClose: r.onClose,
                            removemodal: t[l.p.id].removemodal,
                            formprop: !t[l.p.id].recreateForm,
                            form: t[l.p.id].form,
                          }),
                        !1
                      );
                    if (r.navkeys[0] === !0) {
                      if (i.which === r.navkeys[1])
                        return e('#pData', '#' + u + '_2').trigger('click'), !1;
                      if (i.which === r.navkeys[2])
                        return e('#nData', '#' + u + '_2').trigger('click'), !1;
                    }
                  }),
                  (r.closeicon = e.extend(
                    [!0, 'left', 'ui-icon-close'],
                    r.closeicon
                  )),
                  r.closeicon[0] === !0 &&
                    e('#cData', '#' + u + '_2')
                      .addClass(
                        'right' === r.closeicon[1]
                          ? 'fm-button-icon-right'
                          : 'fm-button-icon-left'
                      )
                      .append(
                        "<span class='ui-icon " + r.closeicon[2] + "'></span>"
                      ),
                  e.isFunction(r.beforeShowForm) &&
                    r.beforeShowForm.call(l, e('#' + c)),
                  e.jgrid.viewModal('#' + e.jgrid.jqID(f.themodal), {
                    gbox: '#gbox_' + e.jgrid.jqID(p),
                    jqm: r.jqModal,
                    overlay: r.overlay,
                    modal: r.modal,
                    onHide: function (t) {
                      e(l).data('viewProp', {
                        top: parseFloat(e(t.w).css('top')),
                        left: parseFloat(e(t.w).css('left')),
                        width: e(t.w).width(),
                        height: e(t.w).height(),
                        dataheight: e('#' + c).height(),
                        datawidth: e('#' + c).width(),
                      }),
                        t.w.remove(),
                        t.o && t.o.remove();
                    },
                  }),
                  e('.fm-button:not(.ui-state-disabled)', '#' + u + '_2').hover(
                    function () {
                      e(this).addClass('ui-state-hover');
                    },
                    function () {
                      e(this).removeClass('ui-state-hover');
                    }
                  ),
                  a(),
                  e('#cData', '#' + u + '_2').click(function () {
                    return (
                      e.jgrid.hideModal('#' + e.jgrid.jqID(f.themodal), {
                        gb: '#gbox_' + e.jgrid.jqID(p),
                        jqm: r.jqModal,
                        onClose: r.onClose,
                        removemodal: t[l.p.id].removemodal,
                        formprop: !t[l.p.id].recreateForm,
                        form: t[l.p.id].form,
                      }),
                      !1
                    );
                  }),
                  e('#nData', '#' + u + '_2').click(function () {
                    e('#FormError', '#' + u).hide();
                    var t = d();
                    return (
                      (t[0] = parseInt(t[0], 10)),
                      -1 !== t[0] &&
                        t[1][t[0] + 1] &&
                        (e.isFunction(r.onclickPgButtons) &&
                          r.onclickPgButtons.call(
                            l,
                            'next',
                            e('#' + c),
                            t[1][t[0]]
                          ),
                        s(t[1][t[0] + 1], l),
                        e(l).jqGrid('setSelection', t[1][t[0] + 1]),
                        e.isFunction(r.afterclickPgButtons) &&
                          r.afterclickPgButtons.call(
                            l,
                            'next',
                            e('#' + c),
                            t[1][t[0] + 1]
                          ),
                        n(t[0] + 1, t)),
                      a(),
                      !1
                    );
                  }),
                  e('#pData', '#' + u + '_2').click(function () {
                    e('#FormError', '#' + u).hide();
                    var t = d();
                    return (
                      -1 !== t[0] &&
                        t[1][t[0] - 1] &&
                        (e.isFunction(r.onclickPgButtons) &&
                          r.onclickPgButtons.call(
                            l,
                            'prev',
                            e('#' + c),
                            t[1][t[0]]
                          ),
                        s(t[1][t[0] - 1], l),
                        e(l).jqGrid('setSelection', t[1][t[0] - 1]),
                        e.isFunction(r.afterclickPgButtons) &&
                          r.afterclickPgButtons.call(
                            l,
                            'prev',
                            e('#' + c),
                            t[1][t[0] - 1]
                          ),
                        n(t[0] - 1, t)),
                      a(),
                      !1
                    );
                  });
                var k = d();
                n(k[0], k);
              }
            }
          })
        );
      },
      delGridRow: function (i, r) {
        return (
          (r = e.extend(
            !0,
            {
              top: 0,
              left: 0,
              width: 240,
              height: 'auto',
              dataheight: 'auto',
              modal: !1,
              overlay: 30,
              drag: !0,
              resize: !0,
              url: '',
              mtype: 'POST',
              reloadAfterSubmit: !0,
              beforeShowForm: null,
              beforeInitData: null,
              afterShowForm: null,
              beforeSubmit: null,
              onclickSubmit: null,
              afterSubmit: null,
              jqModal: !0,
              closeOnEscape: !1,
              delData: {},
              delicon: [],
              cancelicon: [],
              onClose: null,
              ajaxDelOptions: {},
              processing: !1,
              serializeDelData: null,
              useDataProxy: !1,
            },
            e.jgrid.del,
            r || {}
          )),
          (t[e(this)[0].p.id] = r),
          this.each(function () {
            var a = this;
            if (a.grid && i) {
              var o,
                s,
                n,
                d,
                l = e.isFunction(t[a.p.id].beforeShowForm),
                p = e.isFunction(t[a.p.id].afterShowForm),
                c = e.isFunction(t[a.p.id].beforeInitData)
                  ? t[a.p.id].beforeInitData
                  : !1,
                u = a.p.id,
                h = {},
                g = !0,
                f = 'DelTbl_' + e.jgrid.jqID(u),
                m = 'DelTbl_' + u,
                v = {
                  themodal: 'delmod' + u,
                  modalhead: 'delhd' + u,
                  modalcontent: 'delcnt' + u,
                  scrollelm: f,
                };
              if (
                (e.isArray(i) && (i = i.join()),
                void 0 !== e('#' + e.jgrid.jqID(v.themodal))[0])
              ) {
                if (
                  (c && ((g = c.call(a, e('#' + f))), void 0 === g && (g = !0)),
                  g === !1)
                )
                  return;
                e('#DelData>td', '#' + f).text(i),
                  e('#DelError', '#' + f).hide(),
                  t[a.p.id].processing === !0 &&
                    ((t[a.p.id].processing = !1),
                    e('#dData', '#' + f).removeClass('ui-state-active')),
                  l && t[a.p.id].beforeShowForm.call(a, e('#' + f)),
                  e.jgrid.viewModal('#' + e.jgrid.jqID(v.themodal), {
                    gbox: '#gbox_' + e.jgrid.jqID(u),
                    jqm: t[a.p.id].jqModal,
                    jqM: !1,
                    overlay: t[a.p.id].overlay,
                    modal: t[a.p.id].modal,
                  }),
                  p && t[a.p.id].afterShowForm.call(a, e('#' + f));
              } else {
                var j = isNaN(t[a.p.id].dataheight)
                    ? t[a.p.id].dataheight
                    : t[a.p.id].dataheight + 'px',
                  b = isNaN(r.datawidth) ? r.datawidth : r.datawidth + 'px',
                  w =
                    "<div id='" +
                    m +
                    "' class='formdata' style='width:" +
                    b +
                    ';overflow:auto;position:relative;height:' +
                    j +
                    ";'>";
                (w += "<table class='DelTable'><tbody>"),
                  (w +=
                    "<tr id='DelError' style='display:none'><td class='ui-state-error'></td></tr>"),
                  (w +=
                    "<tr id='DelData' style='display:none'><td >" +
                    i +
                    '</td></tr>'),
                  (w +=
                    '<tr><td class="delmsg" style="white-space:pre;">' +
                    t[a.p.id].msg +
                    '</td></tr><tr><td >&#160;</td></tr>'),
                  (w += '</tbody></table></div>');
                var y =
                    "<a id='dData' class='fm-button ui-state-default ui-corner-all'>" +
                    r.bSubmit +
                    '</a>',
                  x =
                    "<a id='eData' class='fm-button ui-state-default ui-corner-all'>" +
                    r.bCancel +
                    '</a>';
                if (
                  ((w +=
                    "<table cellspacing='0' cellpadding='0' border='0' class='EditTable' id='" +
                    f +
                    "_2'><tbody><tr><td><hr class='ui-widget-content' style='margin:1px'/></td></tr><tr><td class='DelButton EditButton'>" +
                    y +
                    '&#160;' +
                    x +
                    '</td></tr></tbody></table>'),
                  (r.gbox = '#gbox_' + e.jgrid.jqID(u)),
                  e.jgrid.createModal(
                    v,
                    w,
                    r,
                    '#gview_' + e.jgrid.jqID(a.p.id),
                    e('#gview_' + e.jgrid.jqID(a.p.id))[0]
                  ),
                  c && ((g = c.call(a, e(w))), void 0 === g && (g = !0)),
                  g === !1)
                )
                  return;
                e('.fm-button', '#' + f + '_2').hover(
                  function () {
                    e(this).addClass('ui-state-hover');
                  },
                  function () {
                    e(this).removeClass('ui-state-hover');
                  }
                ),
                  (r.delicon = e.extend(
                    [!0, 'left', 'ui-icon-scissors'],
                    t[a.p.id].delicon
                  )),
                  (r.cancelicon = e.extend(
                    [!0, 'left', 'ui-icon-cancel'],
                    t[a.p.id].cancelicon
                  )),
                  r.delicon[0] === !0 &&
                    e('#dData', '#' + f + '_2')
                      .addClass(
                        'right' === r.delicon[1]
                          ? 'fm-button-icon-right'
                          : 'fm-button-icon-left'
                      )
                      .append(
                        "<span class='ui-icon " + r.delicon[2] + "'></span>"
                      ),
                  r.cancelicon[0] === !0 &&
                    e('#eData', '#' + f + '_2')
                      .addClass(
                        'right' === r.cancelicon[1]
                          ? 'fm-button-icon-right'
                          : 'fm-button-icon-left'
                      )
                      .append(
                        "<span class='ui-icon " + r.cancelicon[2] + "'></span>"
                      ),
                  e('#dData', '#' + f + '_2').click(function () {
                    var i,
                      l = [!0, ''],
                      p = e('#DelData>td', '#' + f).text();
                    if (
                      ((h = {}),
                      e.isFunction(t[a.p.id].onclickSubmit) &&
                        (h =
                          t[a.p.id].onclickSubmit.call(a, t[a.p.id], p) || {}),
                      e.isFunction(t[a.p.id].beforeSubmit) &&
                        (l = t[a.p.id].beforeSubmit.call(a, p)),
                      l[0] && !t[a.p.id].processing)
                    ) {
                      if (
                        ((t[a.p.id].processing = !0),
                        (n = a.p.prmNames),
                        (o = e.extend({}, t[a.p.id].delData, h)),
                        (d = n.oper),
                        (o[d] = n.deloper),
                        (s = n.id),
                        (p = String(p).split(',')),
                        !p.length)
                      )
                        return !1;
                      for (i in p)
                        p.hasOwnProperty(i) &&
                          (p[i] = e.jgrid.stripPref(a.p.idPrefix, p[i]));
                      (o[s] = p.join()), e(this).addClass('ui-state-active');
                      var c = e.extend(
                        {
                          url:
                            t[a.p.id].url ||
                            e(a).jqGrid('getGridParam', 'editurl'),
                          type: t[a.p.id].mtype,
                          data: e.isFunction(t[a.p.id].serializeDelData)
                            ? t[a.p.id].serializeDelData.call(a, o)
                            : o,
                          complete: function (i, s) {
                            var n;
                            if (
                              (e('#dData', '#' + f + '_2').removeClass(
                                'ui-state-active'
                              ),
                              i.status >= 300 && 304 !== i.status
                                ? ((l[0] = !1),
                                  (l[1] = e.isFunction(
                                    t[a.p.id].errorTextFormat
                                  )
                                    ? t[a.p.id].errorTextFormat.call(a, i)
                                    : s +
                                      " Status: '" +
                                      i.statusText +
                                      "'. Error code: " +
                                      i.status))
                                : e.isFunction(t[a.p.id].afterSubmit) &&
                                  (l = t[a.p.id].afterSubmit.call(a, i, o)),
                              l[0] === !1)
                            )
                              e('#DelError>td', '#' + f).html(l[1]),
                                e('#DelError', '#' + f).show();
                            else {
                              if (
                                t[a.p.id].reloadAfterSubmit &&
                                'local' !== a.p.datatype
                              )
                                e(a).trigger('reloadGrid');
                              else {
                                if (a.p.treeGrid === !0)
                                  try {
                                    e(a).jqGrid(
                                      'delTreeNode',
                                      a.p.idPrefix + p[0]
                                    );
                                  } catch (d) {}
                                else
                                  for (n = 0; n < p.length; n++)
                                    e(a).jqGrid(
                                      'delRowData',
                                      a.p.idPrefix + p[n]
                                    );
                                (a.p.selrow = null), (a.p.selarrrow = []);
                              }
                              e.isFunction(t[a.p.id].afterComplete) &&
                                setTimeout(function () {
                                  t[a.p.id].afterComplete.call(a, i, p);
                                }, 500);
                            }
                            (t[a.p.id].processing = !1),
                              l[0] &&
                                e.jgrid.hideModal(
                                  '#' + e.jgrid.jqID(v.themodal),
                                  {
                                    gb: '#gbox_' + e.jgrid.jqID(u),
                                    jqm: r.jqModal,
                                    onClose: t[a.p.id].onClose,
                                  }
                                );
                          },
                        },
                        e.jgrid.ajaxOptions,
                        t[a.p.id].ajaxDelOptions
                      );
                      if (
                        (c.url ||
                          t[a.p.id].useDataProxy ||
                          (e.isFunction(a.p.dataProxy)
                            ? (t[a.p.id].useDataProxy = !0)
                            : ((l[0] = !1),
                              (l[1] += ' ' + e.jgrid.errors.nourl))),
                        l[0])
                      )
                        if (t[a.p.id].useDataProxy) {
                          var g = a.p.dataProxy.call(a, c, 'del_' + a.p.id);
                          void 0 === g && (g = [!0, '']),
                            g[0] === !1
                              ? ((l[0] = !1),
                                (l[1] =
                                  g[1] || 'Error deleting the selected row!'))
                              : e.jgrid.hideModal(
                                  '#' + e.jgrid.jqID(v.themodal),
                                  {
                                    gb: '#gbox_' + e.jgrid.jqID(u),
                                    jqm: r.jqModal,
                                    onClose: t[a.p.id].onClose,
                                  }
                                );
                        } else
                          'clientArray' === c.url
                            ? ((o = c.data),
                              c.complete({ status: 200, statusText: '' }, ''))
                            : e.ajax(c);
                    }
                    return (
                      l[0] === !1 &&
                        (e('#DelError>td', '#' + f).html(l[1]),
                        e('#DelError', '#' + f).show()),
                      !1
                    );
                  }),
                  e('#eData', '#' + f + '_2').click(function () {
                    return (
                      e.jgrid.hideModal('#' + e.jgrid.jqID(v.themodal), {
                        gb: '#gbox_' + e.jgrid.jqID(u),
                        jqm: t[a.p.id].jqModal,
                        onClose: t[a.p.id].onClose,
                      }),
                      !1
                    );
                  }),
                  l && t[a.p.id].beforeShowForm.call(a, e('#' + f)),
                  e.jgrid.viewModal('#' + e.jgrid.jqID(v.themodal), {
                    gbox: '#gbox_' + e.jgrid.jqID(u),
                    jqm: t[a.p.id].jqModal,
                    overlay: t[a.p.id].overlay,
                    modal: t[a.p.id].modal,
                  }),
                  p && t[a.p.id].afterShowForm.call(a, e('#' + f));
              }
              t[a.p.id].closeOnEscape === !0 &&
                setTimeout(function () {
                  e(
                    '.ui-jqdialog-titlebar-close',
                    '#' + e.jgrid.jqID(v.modalhead)
                  )
                    .attr('tabindex', '-1')
                    .focus();
                }, 0);
            }
          })
        );
      },
      navGrid: function (t, i, r, a, o, s, n) {
        return (
          (i = e.extend(
            {
              edit: !0,
              editicon: 'ui-icon-pencil',
              add: !0,
              addicon: 'ui-icon-plus',
              del: !0,
              delicon: 'ui-icon-trash',
              search: !0,
              searchicon: 'ui-icon-search',
              refresh: !0,
              refreshicon: 'ui-icon-refresh',
              refreshstate: 'firstpage',
              view: !1,
              viewicon: 'ui-icon-document',
              position: 'left',
              closeOnEscape: !0,
              beforeRefresh: null,
              afterRefresh: null,
              cloneToTop: !1,
              alertwidth: 200,
              alertheight: 'auto',
              alerttop: null,
              alertleft: null,
              alertzIndex: null,
            },
            e.jgrid.nav,
            i || {}
          )),
          this.each(function () {
            if (!this.nav) {
              var d,
                l,
                p = {
                  themodal: 'alertmod_' + this.p.id,
                  modalhead: 'alerthd_' + this.p.id,
                  modalcontent: 'alertcnt_' + this.p.id,
                },
                c = this;
              if (c.grid && 'string' == typeof t) {
                void 0 === e('#' + p.themodal)[0] &&
                  (i.alerttop ||
                    i.alertleft ||
                    (void 0 !== window.innerWidth
                      ? ((i.alertleft = window.innerWidth),
                        (i.alerttop = window.innerHeight))
                      : void 0 !== document.documentElement &&
                          void 0 !== document.documentElement.clientWidth &&
                          0 !== document.documentElement.clientWidth
                        ? ((i.alertleft = document.documentElement.clientWidth),
                          (i.alerttop = document.documentElement.clientHeight))
                        : ((i.alertleft = 1024), (i.alerttop = 768)),
                    (i.alertleft =
                      i.alertleft / 2 - parseInt(i.alertwidth, 10) / 2),
                    (i.alerttop = i.alerttop / 2 - 25)),
                  e.jgrid.createModal(
                    p,
                    '<div>' +
                      i.alerttext +
                      "</div><span tabindex='0'><span tabindex='-1' id='jqg_alrt'></span></span>",
                    {
                      gbox: '#gbox_' + e.jgrid.jqID(c.p.id),
                      jqModal: !0,
                      drag: !0,
                      resize: !0,
                      caption: i.alertcap,
                      top: i.alerttop,
                      left: i.alertleft,
                      width: i.alertwidth,
                      height: i.alertheight,
                      closeOnEscape: i.closeOnEscape,
                      zIndex: i.alertzIndex,
                    },
                    '#gview_' + e.jgrid.jqID(c.p.id),
                    e('#gbox_' + e.jgrid.jqID(c.p.id))[0],
                    !0
                  ));
                var u,
                  h = 1,
                  g = function () {
                    e(this).hasClass('ui-state-disabled') ||
                      e(this).addClass('ui-state-hover');
                  },
                  f = function () {
                    e(this).removeClass('ui-state-hover');
                  };
                for (
                  i.cloneToTop && c.p.toppager && (h = 2), u = 0;
                  h > u;
                  u++
                ) {
                  var m,
                    v,
                    j,
                    b = e(
                      "<table cellspacing='0' cellpadding='0' border='0' class='ui-pg-table navtable' style='float:left;table-layout:auto;'><tbody><tr></tr></tbody></table>"
                    ),
                    w =
                      "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>";
                  0 === u
                    ? ((v = t),
                      (j = c.p.id),
                      v === c.p.toppager && ((j += '_top'), (h = 1)))
                    : ((v = c.p.toppager), (j = c.p.id + '_top')),
                    'rtl' === c.p.direction &&
                      e(b).attr('dir', 'rtl').css('float', 'right'),
                    i.add &&
                      ((a = a || {}),
                      (m = e("<td class='ui-pg-button ui-corner-all'></td>")),
                      e(m).append(
                        "<div class='ui-pg-div'><span class='ui-icon " +
                          i.addicon +
                          "'></span>" +
                          i.addtext +
                          '</div>'
                      ),
                      e('tr', b).append(m),
                      e(m, b)
                        .attr({
                          title: i.addtitle || '',
                          id: a.id || 'add_' + j,
                        })
                        .click(function () {
                          return (
                            e(this).hasClass('ui-state-disabled') ||
                              (e.isFunction(i.addfunc)
                                ? i.addfunc.call(c)
                                : e(c).jqGrid('editGridRow', 'new', a)),
                            !1
                          );
                        })
                        .hover(g, f),
                      (m = null)),
                    i.edit &&
                      ((m = e("<td class='ui-pg-button ui-corner-all'></td>")),
                      (r = r || {}),
                      e(m).append(
                        "<div class='ui-pg-div'><span class='ui-icon " +
                          i.editicon +
                          "'></span>" +
                          i.edittext +
                          '</div>'
                      ),
                      e('tr', b).append(m),
                      e(m, b)
                        .attr({
                          title: i.edittitle || '',
                          id: r.id || 'edit_' + j,
                        })
                        .click(function () {
                          if (!e(this).hasClass('ui-state-disabled')) {
                            var t = c.p.selrow;
                            t
                              ? e.isFunction(i.editfunc)
                                ? i.editfunc.call(c, t)
                                : e(c).jqGrid('editGridRow', t, r)
                              : (e.jgrid.viewModal('#' + p.themodal, {
                                  gbox: '#gbox_' + e.jgrid.jqID(c.p.id),
                                  jqm: !0,
                                }),
                                e('#jqg_alrt').focus());
                          }
                          return !1;
                        })
                        .hover(g, f),
                      (m = null)),
                    i.view &&
                      ((m = e("<td class='ui-pg-button ui-corner-all'></td>")),
                      (n = n || {}),
                      e(m).append(
                        "<div class='ui-pg-div'><span class='ui-icon " +
                          i.viewicon +
                          "'></span>" +
                          i.viewtext +
                          '</div>'
                      ),
                      e('tr', b).append(m),
                      e(m, b)
                        .attr({
                          title: i.viewtitle || '',
                          id: n.id || 'view_' + j,
                        })
                        .click(function () {
                          if (!e(this).hasClass('ui-state-disabled')) {
                            var t = c.p.selrow;
                            t
                              ? e.isFunction(i.viewfunc)
                                ? i.viewfunc.call(c, t)
                                : e(c).jqGrid('viewGridRow', t, n)
                              : (e.jgrid.viewModal('#' + p.themodal, {
                                  gbox: '#gbox_' + e.jgrid.jqID(c.p.id),
                                  jqm: !0,
                                }),
                                e('#jqg_alrt').focus());
                          }
                          return !1;
                        })
                        .hover(g, f),
                      (m = null)),
                    i.del &&
                      ((m = e("<td class='ui-pg-button ui-corner-all'></td>")),
                      (o = o || {}),
                      e(m).append(
                        "<div class='ui-pg-div'><span class='ui-icon " +
                          i.delicon +
                          "'></span>" +
                          i.deltext +
                          '</div>'
                      ),
                      e('tr', b).append(m),
                      e(m, b)
                        .attr({
                          title: i.deltitle || '',
                          id: o.id || 'del_' + j,
                        })
                        .click(function () {
                          if (!e(this).hasClass('ui-state-disabled')) {
                            var t;
                            c.p.multiselect
                              ? ((t = c.p.selarrrow),
                                0 === t.length && (t = null))
                              : (t = c.p.selrow),
                              t
                                ? e.isFunction(i.delfunc)
                                  ? i.delfunc.call(c, t)
                                  : e(c).jqGrid('delGridRow', t, o)
                                : (e.jgrid.viewModal('#' + p.themodal, {
                                    gbox: '#gbox_' + e.jgrid.jqID(c.p.id),
                                    jqm: !0,
                                  }),
                                  e('#jqg_alrt').focus());
                          }
                          return !1;
                        })
                        .hover(g, f),
                      (m = null)),
                    (i.add || i.edit || i.del || i.view) &&
                      e('tr', b).append(w),
                    i.search &&
                      ((m = e("<td class='ui-pg-button ui-corner-all'></td>")),
                      (s = s || {}),
                      e(m).append(
                        "<div class='ui-pg-div'><span class='ui-icon " +
                          i.searchicon +
                          "'></span>" +
                          i.searchtext +
                          '</div>'
                      ),
                      e('tr', b).append(m),
                      e(m, b)
                        .attr({
                          title: i.searchtitle || '',
                          id: s.id || 'search_' + j,
                        })
                        .click(function () {
                          return (
                            e(this).hasClass('ui-state-disabled') ||
                              (e.isFunction(i.searchfunc)
                                ? i.searchfunc.call(c, s)
                                : e(c).jqGrid('searchGrid', s)),
                            !1
                          );
                        })
                        .hover(g, f),
                      s.showOnLoad && s.showOnLoad === !0 && e(m, b).click(),
                      (m = null)),
                    i.refresh &&
                      ((m = e("<td class='ui-pg-button ui-corner-all'></td>")),
                      e(m).append(
                        "<div class='ui-pg-div'><span class='ui-icon " +
                          i.refreshicon +
                          "'></span>" +
                          i.refreshtext +
                          '</div>'
                      ),
                      e('tr', b).append(m),
                      e(m, b)
                        .attr({
                          title: i.refreshtitle || '',
                          id: 'refresh_' + j,
                        })
                        .click(function () {
                          if (!e(this).hasClass('ui-state-disabled')) {
                            e.isFunction(i.beforeRefresh) &&
                              i.beforeRefresh.call(c),
                              (c.p.search = !1),
                              (c.p.resetsearch = !0);
                            try {
                              if ('currentfilter' !== i.refreshstate) {
                                var t = c.p.id;
                                c.p.postData.filters = '';
                                try {
                                  e('#fbox_' + e.jgrid.jqID(t)).jqFilter(
                                    'resetFilter'
                                  );
                                } catch (r) {}
                                e.isFunction(c.clearToolbar) &&
                                  c.clearToolbar.call(c, !1);
                              }
                            } catch (a) {}
                            switch (i.refreshstate) {
                              case 'firstpage':
                                e(c).trigger('reloadGrid', [{ page: 1 }]);
                                break;
                              case 'current':
                              case 'currentfilter':
                                e(c).trigger('reloadGrid', [{ current: !0 }]);
                            }
                            e.isFunction(i.afterRefresh) &&
                              i.afterRefresh.call(c);
                          }
                          return !1;
                        })
                        .hover(g, f),
                      (m = null)),
                    (l = e('.ui-jqgrid').css('font-size') || '11px'),
                    e('body').append(
                      "<div id='testpg2' class='ui-jqgrid ui-widget ui-widget-content' style='font-size:" +
                        l +
                        ";visibility:hidden;' ></div>"
                    ),
                    (d = e(b).clone().appendTo('#testpg2').width()),
                    e('#testpg2').remove(),
                    e(v + '_' + i.position, v).append(b),
                    c.p._nvtd &&
                      (d > c.p._nvtd[0] &&
                        (e(v + '_' + i.position, v).width(d),
                        (c.p._nvtd[0] = d)),
                      (c.p._nvtd[1] = d)),
                    (l = null),
                    (d = null),
                    (b = null),
                    (this.nav = !0);
                }
              }
            }
          })
        );
      },
      navButtonAdd: function (t, i) {
        return (
          (i = e.extend(
            {
              caption: 'newButton',
              title: '',
              buttonicon: 'ui-icon-newwin',
              onClickButton: null,
              position: 'last',
              cursor: 'pointer',
            },
            i || {}
          )),
          this.each(function () {
            if (this.grid) {
              'string' == typeof t &&
                0 !== t.indexOf('#') &&
                (t = '#' + e.jgrid.jqID(t));
              var r = e('.navtable', t)[0],
                a = this;
              if (r) {
                if (i.id && void 0 !== e('#' + e.jgrid.jqID(i.id), r)[0])
                  return;
                var o = e('<td></td>');
                e(o)
                  .addClass('ui-pg-button ui-corner-all')
                  .append(
                    'NONE' === i.buttonicon.toString().toUpperCase()
                      ? "<div class='ui-pg-div'>" + i.caption + '</div>'
                      : "<div class='ui-pg-div'><span class='ui-icon " +
                          i.buttonicon +
                          "'></span>" +
                          i.caption +
                          '</div>'
                  ),
                  i.id && e(o).attr('id', i.id),
                  'first' === i.position
                    ? 0 === r.rows[0].cells.length
                      ? e('tr', r).append(o)
                      : e('tr td:eq(0)', r).before(o)
                    : e('tr', r).append(o),
                  e(o, r)
                    .attr('title', i.title || '')
                    .click(function (t) {
                      return (
                        e(this).hasClass('ui-state-disabled') ||
                          (e.isFunction(i.onClickButton) &&
                            i.onClickButton.call(a, t)),
                        !1
                      );
                    })
                    .hover(
                      function () {
                        e(this).hasClass('ui-state-disabled') ||
                          e(this).addClass('ui-state-hover');
                      },
                      function () {
                        e(this).removeClass('ui-state-hover');
                      }
                    );
              }
            }
          })
        );
      },
      navSeparatorAdd: function (t, i) {
        return (
          (i = e.extend(
            { sepclass: 'ui-separator', sepcontent: '', position: 'last' },
            i || {}
          )),
          this.each(function () {
            if (this.grid) {
              'string' == typeof t &&
                0 !== t.indexOf('#') &&
                (t = '#' + e.jgrid.jqID(t));
              var r = e('.navtable', t)[0];
              if (r) {
                var a =
                  "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='" +
                  i.sepclass +
                  "'></span>" +
                  i.sepcontent +
                  '</td>';
                'first' === i.position
                  ? 0 === r.rows[0].cells.length
                    ? e('tr', r).append(a)
                    : e('tr td:eq(0)', r).before(a)
                  : e('tr', r).append(a);
              }
            }
          })
        );
      },
      GridToForm: function (t, i) {
        return this.each(function () {
          var r,
            a = this;
          if (a.grid) {
            var o = e(a).jqGrid('getRowData', t);
            if (o)
              for (r in o)
                o.hasOwnProperty(r) &&
                  (e('[name=' + e.jgrid.jqID(r) + ']', i).is('input:radio') ||
                  e('[name=' + e.jgrid.jqID(r) + ']', i).is('input:checkbox')
                    ? e('[name=' + e.jgrid.jqID(r) + ']', i).each(function () {
                        e(this).val() == o[r]
                          ? e(this)[a.p.useProp ? 'prop' : 'attr'](
                              'checked',
                              !0
                            )
                          : e(this)[a.p.useProp ? 'prop' : 'attr'](
                              'checked',
                              !1
                            );
                      })
                    : e('[name=' + e.jgrid.jqID(r) + ']', i).val(o[r]));
          }
        });
      },
      FormToGrid: function (t, i, r, a) {
        return this.each(function () {
          var o = this;
          if (o.grid) {
            r || (r = 'set'), a || (a = 'first');
            var s = e(i).serializeArray(),
              n = {};
            e.each(s, function (e, t) {
              n[t.name] = t.value;
            }),
              'add' === r
                ? e(o).jqGrid('addRowData', t, n, a)
                : 'set' === r && e(o).jqGrid('setRowData', t, n);
          }
        });
      },
    });
  })(jQuery),
  (function (e) {
    'use strict';
    e.extend(e.jgrid, {
      template: function (t) {
        var i,
          r = e.makeArray(arguments).slice(1),
          a = r.length;
        return (
          null == t && (t = ''),
          t.replace(
            /\{([\w\-]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?\}/g,
            function (t, o) {
              if (!isNaN(parseInt(o, 10))) return r[parseInt(o, 10)];
              for (i = 0; a > i; i++)
                if (e.isArray(r[i]))
                  for (var s = r[i], n = s.length; n--; )
                    if (o === s[n].nm) return s[n].v;
            }
          )
        );
      },
    }),
      e.jgrid.extend({
        groupingSetup: function () {
          return this.each(function () {
            var t,
              i,
              r,
              a = this,
              o = a.p.colModel,
              s = a.p.groupingView;
            if (null === s || ('object' != typeof s && !e.isFunction(s)))
              a.p.grouping = !1;
            else if (s.groupField.length) {
              for (
                void 0 === s.visibiltyOnNextGrouping &&
                  (s.visibiltyOnNextGrouping = []),
                  s.lastvalues = [],
                  s._locgr || (s.groups = []),
                  s.counters = [],
                  t = 0;
                t < s.groupField.length;
                t++
              )
                s.groupOrder[t] || (s.groupOrder[t] = 'asc'),
                  s.groupText[t] || (s.groupText[t] = '{0}'),
                  'boolean' != typeof s.groupColumnShow[t] &&
                    (s.groupColumnShow[t] = !0),
                  'boolean' != typeof s.groupSummary[t] &&
                    (s.groupSummary[t] = !1),
                  s.groupSummaryPos[t] || (s.groupSummaryPos[t] = 'footer'),
                  s.groupColumnShow[t] === !0
                    ? ((s.visibiltyOnNextGrouping[t] = !0),
                      e(a).jqGrid('showCol', s.groupField[t]))
                    : ((s.visibiltyOnNextGrouping[t] = e(
                        '#' + e.jgrid.jqID(a.p.id + '_' + s.groupField[t])
                      ).is(':visible')),
                      e(a).jqGrid('hideCol', s.groupField[t]));
              for (
                s.summary = [],
                  s.hideFirstGroupCol &&
                    (s.formatDisplayField[0] = function (e) {
                      return e;
                    }),
                  i = 0,
                  r = o.length;
                r > i;
                i++
              )
                s.hideFirstGroupCol &&
                  (o[i].hidden ||
                    s.groupField[0] !== o[i].name ||
                    (o[i].formatter = function () {
                      return '';
                    })),
                  o[i].summaryType &&
                    s.summary.push(
                      o[i].summaryDivider
                        ? {
                            nm: o[i].name,
                            st: o[i].summaryType,
                            v: '',
                            sd: o[i].summaryDivider,
                            vd: '',
                            sr: o[i].summaryRound,
                            srt: o[i].summaryRoundType || 'round',
                          }
                        : {
                            nm: o[i].name,
                            st: o[i].summaryType,
                            v: '',
                            sr: o[i].summaryRound,
                            srt: o[i].summaryRoundType || 'round',
                          }
                    );
            } else a.p.grouping = !1;
          });
        },
        groupingPrepare: function (t, i) {
          return (
            this.each(function () {
              var r,
                a,
                o,
                s,
                n,
                d = this.p.groupingView,
                l = this,
                p = d.groupField.length,
                c = 0;
              for (r = 0; p > r; r++)
                (a = d.groupField[r]),
                  (s = d.displayField[r]),
                  (o = t[a]),
                  (n = null == s ? null : t[s]),
                  null == n && (n = o),
                  void 0 !== o &&
                    (0 === i
                      ? (d.groups.push({
                          idx: r,
                          dataIndex: a,
                          value: o,
                          displayValue: n,
                          startRow: i,
                          cnt: 1,
                          summary: [],
                        }),
                        (d.lastvalues[r] = o),
                        (d.counters[r] = {
                          cnt: 1,
                          pos: d.groups.length - 1,
                          summary: e.extend(!0, [], d.summary),
                        }),
                        e.each(d.counters[r].summary, function () {
                          e.isFunction(this.st)
                            ? (this.v = this.st.call(l, this.v, this.nm, t))
                            : ((this.v = e(l).jqGrid(
                                'groupingCalculations.handler',
                                this.st,
                                this.v,
                                this.nm,
                                this.sr,
                                this.srt,
                                t
                              )),
                              'avg' === this.st.toLowerCase() &&
                                this.sd &&
                                (this.vd = e(l).jqGrid(
                                  'groupingCalculations.handler',
                                  this.st,
                                  this.vd,
                                  this.sd,
                                  this.sr,
                                  this.srt,
                                  t
                                )));
                        }),
                        (d.groups[d.counters[r].pos].summary =
                          d.counters[r].summary))
                      : 'object' == typeof o ||
                          (e.isArray(d.isInTheSameGroup) &&
                          e.isFunction(d.isInTheSameGroup[r])
                            ? d.isInTheSameGroup[r].call(
                                l,
                                d.lastvalues[r],
                                o,
                                r,
                                d
                              )
                            : d.lastvalues[r] === o)
                        ? 1 === c
                          ? (d.groups.push({
                              idx: r,
                              dataIndex: a,
                              value: o,
                              displayValue: n,
                              startRow: i,
                              cnt: 1,
                              summary: [],
                            }),
                            (d.lastvalues[r] = o),
                            (d.counters[r] = {
                              cnt: 1,
                              pos: d.groups.length - 1,
                              summary: e.extend(!0, [], d.summary),
                            }),
                            e.each(d.counters[r].summary, function () {
                              e.isFunction(this.st)
                                ? (this.v = this.st.call(l, this.v, this.nm, t))
                                : ((this.v = e(l).jqGrid(
                                    'groupingCalculations.handler',
                                    this.st,
                                    this.v,
                                    this.nm,
                                    this.sr,
                                    this.srt,
                                    t
                                  )),
                                  'avg' === this.st.toLowerCase() &&
                                    this.sd &&
                                    (this.vd = e(l).jqGrid(
                                      'groupingCalculations.handler',
                                      this.st,
                                      this.vd,
                                      this.sd,
                                      this.sr,
                                      this.srt,
                                      t
                                    )));
                            }),
                            (d.groups[d.counters[r].pos].summary =
                              d.counters[r].summary))
                          : ((d.counters[r].cnt += 1),
                            (d.groups[d.counters[r].pos].cnt =
                              d.counters[r].cnt),
                            e.each(d.counters[r].summary, function () {
                              e.isFunction(this.st)
                                ? (this.v = this.st.call(l, this.v, this.nm, t))
                                : ((this.v = e(l).jqGrid(
                                    'groupingCalculations.handler',
                                    this.st,
                                    this.v,
                                    this.nm,
                                    this.sr,
                                    this.srt,
                                    t
                                  )),
                                  'avg' === this.st.toLowerCase() &&
                                    this.sd &&
                                    (this.vd = e(l).jqGrid(
                                      'groupingCalculations.handler',
                                      this.st,
                                      this.vd,
                                      this.sd,
                                      this.sr,
                                      this.srt,
                                      t
                                    )));
                            }),
                            (d.groups[d.counters[r].pos].summary =
                              d.counters[r].summary))
                        : (d.groups.push({
                            idx: r,
                            dataIndex: a,
                            value: o,
                            displayValue: n,
                            startRow: i,
                            cnt: 1,
                            summary: [],
                          }),
                          (d.lastvalues[r] = o),
                          (c = 1),
                          (d.counters[r] = {
                            cnt: 1,
                            pos: d.groups.length - 1,
                            summary: e.extend(!0, [], d.summary),
                          }),
                          e.each(d.counters[r].summary, function () {
                            e.isFunction(this.st)
                              ? (this.v = this.st.call(l, this.v, this.nm, t))
                              : ((this.v = e(l).jqGrid(
                                  'groupingCalculations.handler',
                                  this.st,
                                  this.v,
                                  this.nm,
                                  this.sr,
                                  this.srt,
                                  t
                                )),
                                'avg' === this.st.toLowerCase() &&
                                  this.sd &&
                                  (this.vd = e(l).jqGrid(
                                    'groupingCalculations.handler',
                                    this.st,
                                    this.vd,
                                    this.sd,
                                    this.sr,
                                    this.srt,
                                    t
                                  )));
                          }),
                          (d.groups[d.counters[r].pos].summary =
                            d.counters[r].summary)));
            }),
            this
          );
        },
        groupingToggle: function (t) {
          return (
            this.each(function () {
              var i = this,
                r = i.p.groupingView,
                a = t.split('_'),
                o = parseInt(a[a.length - 2], 10);
              a.splice(a.length - 2, 2);
              var s,
                n,
                d = a.join('_'),
                l = r.minusicon,
                p = r.plusicon,
                c = e('#' + e.jgrid.jqID(t)),
                u = c.length ? c[0].nextSibling : null,
                h = e(
                  '#' + e.jgrid.jqID(t) + ' span.tree-wrap-' + i.p.direction
                ),
                g = function (t) {
                  var i = e.map(t.split(' '), function (e) {
                    return e.substring(0, d.length + 1) === d + '_'
                      ? parseInt(e.substring(d.length + 1), 10)
                      : void 0;
                  });
                  return i.length > 0 ? i[0] : void 0;
                },
                f = !1,
                m = i.p.frozenColumns ? i.p.id + '_frozen' : !1,
                v = m ? e('#' + e.jgrid.jqID(t), '#' + e.jgrid.jqID(m)) : !1,
                j = v && v.length ? v[0].nextSibling : null;
              if (h.hasClass(l)) {
                if (r.showSummaryOnHide) {
                  if (u)
                    for (
                      ;
                      u && ((s = g(u.className)), !(void 0 !== s && o >= s));

                    )
                      e(u).hide(),
                        (u = u.nextSibling),
                        m && (e(j).hide(), (j = j.nextSibling));
                } else if (u)
                  for (
                    ;
                    u && ((s = g(u.className)), !(void 0 !== s && o >= s));

                  )
                    e(u).hide(),
                      (u = u.nextSibling),
                      m && (e(j).hide(), (j = j.nextSibling));
                h.removeClass(l).addClass(p), (f = !0);
              } else {
                if (u)
                  for (n = void 0; u; ) {
                    if (
                      ((s = g(u.className)),
                      void 0 === n && (n = void 0 === s),
                      void 0 !== s)
                    ) {
                      if (o >= s) break;
                      s === o + 1 &&
                        (e(u)
                          .show()
                          .find('>td>span.tree-wrap-' + i.p.direction)
                          .removeClass(l)
                          .addClass(p),
                        m &&
                          e(j)
                            .show()
                            .find('>td>span.tree-wrap-' + i.p.direction)
                            .removeClass(l)
                            .addClass(p));
                    } else n && (e(u).show(), m && e(j).show());
                    (u = u.nextSibling), m && (j = j.nextSibling);
                  }
                h.removeClass(p).addClass(l);
              }
              e(i).triggerHandler('jqGridGroupingClickGroup', [t, f]),
                e.isFunction(i.p.onClickGroup) &&
                  i.p.onClickGroup.call(i, t, f);
            }),
            !1
          );
        },
        groupingRender: function (t, i, r, a) {
          return this.each(function () {
            function o(e, t, i) {
              var r,
                a = !1;
              if (0 === t) a = i[e];
              else {
                var o = i[e].idx;
                if (0 === o) a = i[e];
                else
                  for (r = e; r >= 0; r--)
                    if (i[r].idx === o - t) {
                      a = i[r];
                      break;
                    }
              }
              return a;
            }
            function s(t, r, a, s) {
              var n,
                d,
                l = o(t, r, a),
                c = p.p.colModel,
                u = l.cnt,
                h = '';
              for (d = s; i > d; d++) {
                var g = '<td ' + p.formatCol(d, 1, '') + '>&#160;</td>',
                  f = '{0}';
                e.each(l.summary, function () {
                  if (this.nm === c[d].name) {
                    c[d].summaryTpl && (f = c[d].summaryTpl),
                      'string' == typeof this.st &&
                        'avg' === this.st.toLowerCase() &&
                        (this.sd && this.vd
                          ? (this.v = this.v / this.vd)
                          : this.v && u > 0 && (this.v = this.v / u));
                    try {
                      (this.groupCount = l.cnt),
                        (this.groupIndex = l.dataIndex),
                        (this.groupValue = l.value),
                        (n = p.formatter('', this.v, d, this));
                    } catch (t) {
                      n = this.v;
                    }
                    return (
                      (g =
                        '<td ' +
                        p.formatCol(d, 1, '') +
                        '>' +
                        e.jgrid.format(f, n) +
                        '</td>'),
                      !1
                    );
                  }
                }),
                  (h += g);
              }
              return h;
            }
            var n,
              d,
              l,
              p = this,
              c = p.p.groupingView,
              u = '',
              h = '',
              g = c.groupCollapse ? c.plusicon : c.minusicon,
              f = [],
              m = c.groupField.length;
            (g += ' tree-wrap-' + p.p.direction),
              e.each(p.p.colModel, function (e, t) {
                var i;
                for (i = 0; m > i; i++)
                  if (c.groupField[i] === t.name) {
                    f[i] = e;
                    break;
                  }
              });
            var v,
              j = 0,
              b = e.makeArray(c.groupSummary);
            b.reverse(),
              (v = p.p.multiselect ? ' colspan="2"' : ''),
              e.each(c.groups, function (o, w) {
                if (
                  c._locgr &&
                  !(w.startRow + w.cnt > (r - 1) * a && w.startRow < r * a)
                )
                  return !0;
                j++,
                  (d = p.p.id + 'ghead_' + w.idx),
                  (n = d + '_' + o),
                  (h =
                    "<span style='cursor:pointer;' class='ui-icon " +
                    g +
                    "' onclick=\"jQuery('#" +
                    e.jgrid.jqID(p.p.id) +
                    "').jqGrid('groupingToggle','" +
                    n +
                    '\');return false;"></span>');
                try {
                  e.isArray(c.formatDisplayField) &&
                  e.isFunction(c.formatDisplayField[w.idx])
                    ? ((w.displayValue = c.formatDisplayField[w.idx].call(
                        p,
                        w.displayValue,
                        w.value,
                        p.p.colModel[f[w.idx]],
                        w.idx,
                        c
                      )),
                      (l = w.displayValue))
                    : (l = p.formatter(n, w.displayValue, f[w.idx], w.value));
                } catch (y) {
                  l = w.displayValue;
                }
                'header' === c.groupSummaryPos[w.idx]
                  ? ((u +=
                      '<tr id="' +
                      n +
                      '"' +
                      (c.groupCollapse && w.idx > 0
                        ? ' style="display:none;" '
                        : ' ') +
                      'role="row" class= "ui-widget-content jqgroup ui-row-' +
                      p.p.direction +
                      ' ' +
                      d +
                      '"><td style="padding-left:' +
                      12 * w.idx +
                      'px;"' +
                      v +
                      '>' +
                      h +
                      e.jgrid.template(
                        c.groupText[w.idx],
                        l,
                        w.cnt,
                        w.summary
                      ) +
                      '</td>'),
                    (u += s(
                      o,
                      0,
                      c.groups,
                      c.groupColumnShow[w.idx] === !1
                        ? '' === v
                          ? 2
                          : 3
                        : '' === v
                          ? 1
                          : 2
                    )),
                    (u += '</tr>'))
                  : (u +=
                      '<tr id="' +
                      n +
                      '"' +
                      (c.groupCollapse && w.idx > 0
                        ? ' style="display:none;" '
                        : ' ') +
                      'role="row" class= "ui-widget-content jqgroup ui-row-' +
                      p.p.direction +
                      ' ' +
                      d +
                      '"><td style="padding-left:' +
                      12 * w.idx +
                      'px;" colspan="' +
                      (c.groupColumnShow[w.idx] === !1 ? i - 1 : i) +
                      '">' +
                      h +
                      e.jgrid.template(
                        c.groupText[w.idx],
                        l,
                        w.cnt,
                        w.summary
                      ) +
                      '</td></tr>');
                var x = m - 1 === w.idx;
                if (x) {
                  var q,
                    D,
                    $ = c.groups[o + 1],
                    _ = 0,
                    C = w.startRow,
                    G =
                      void 0 !== $
                        ? $.startRow
                        : c.groups[o].startRow + c.groups[o].cnt;
                  for (
                    c._locgr && ((_ = (r - 1) * a), _ > w.startRow && (C = _)),
                      q = C;
                    G > q && t[q - _];
                    q++
                  )
                    u += t[q - _].join('');
                  if ('header' !== c.groupSummaryPos[w.idx]) {
                    var I;
                    if (void 0 !== $) {
                      for (
                        I = 0;
                        I < c.groupField.length &&
                        $.dataIndex !== c.groupField[I];
                        I++
                      );
                      j = c.groupField.length - I;
                    }
                    for (D = 0; j > D; D++)
                      if (b[D]) {
                        var F = '';
                        c.groupCollapse &&
                          !c.showSummaryOnHide &&
                          (F = ' style="display:none;"'),
                          (u +=
                            '<tr' +
                            F +
                            ' jqfootlevel="' +
                            (w.idx - D) +
                            '" role="row" class="ui-widget-content jqfoot ui-row-' +
                            p.p.direction +
                            '">'),
                          (u += s(o, D, c.groups, 0)),
                          (u += '</tr>');
                      }
                    j = I;
                  }
                }
              }),
              e('#' + e.jgrid.jqID(p.p.id) + ' tbody:first').append(u),
              (u = null);
          });
        },
        groupingGroupBy: function (t, i) {
          return this.each(function () {
            var r = this;
            'string' == typeof t && (t = [t]);
            var a = r.p.groupingView;
            (r.p.grouping = !0),
              (a._locgr = !1),
              void 0 === a.visibiltyOnNextGrouping &&
                (a.visibiltyOnNextGrouping = []);
            var o;
            for (o = 0; o < a.groupField.length; o++)
              !a.groupColumnShow[o] &&
                a.visibiltyOnNextGrouping[o] &&
                e(r).jqGrid('showCol', a.groupField[o]);
            for (o = 0; o < t.length; o++)
              a.visibiltyOnNextGrouping[o] = e(
                '#' + e.jgrid.jqID(r.p.id) + '_' + e.jgrid.jqID(t[o])
              ).is(':visible');
            (r.p.groupingView = e.extend(r.p.groupingView, i || {})),
              (a.groupField = t),
              e(r).trigger('reloadGrid');
          });
        },
        groupingRemove: function (t) {
          return this.each(function () {
            var i = this;
            if ((void 0 === t && (t = !0), (i.p.grouping = !1), t === !0)) {
              var r,
                a = i.p.groupingView;
              for (r = 0; r < a.groupField.length; r++)
                !a.groupColumnShow[r] &&
                  a.visibiltyOnNextGrouping[r] &&
                  e(i).jqGrid('showCol', a.groupField);
              e(
                'tr.jqgroup, tr.jqfoot',
                '#' + e.jgrid.jqID(i.p.id) + ' tbody:first'
              ).remove(),
                e(
                  'tr.jqgrow:hidden',
                  '#' + e.jgrid.jqID(i.p.id) + ' tbody:first'
                ).show();
            } else e(i).trigger('reloadGrid');
          });
        },
        groupingCalculations: {
          handler: function (e, t, i, r, a, o) {
            var s = {
              sum: function () {
                return parseFloat(t || 0) + parseFloat(o[i] || 0);
              },
              min: function () {
                return '' === t
                  ? parseFloat(o[i] || 0)
                  : Math.min(parseFloat(t), parseFloat(o[i] || 0));
              },
              max: function () {
                return '' === t
                  ? parseFloat(o[i] || 0)
                  : Math.max(parseFloat(t), parseFloat(o[i] || 0));
              },
              count: function () {
                return '' === t && (t = 0), o.hasOwnProperty(i) ? t + 1 : 0;
              },
              avg: function () {
                return s.sum();
              },
            };
            if (!s[e]) throw 'jqGrid Grouping No such method: ' + e;
            var n = s[e]();
            if (null != r)
              if ('fixed' === a) n = n.toFixed(r);
              else {
                var d = Math.pow(10, r);
                n = Math.round(n * d) / d;
              }
            return n;
          },
        },
      });
  })(jQuery),
  (function (e) {
    'use strict';
    e.jgrid.extend({
      jqGridImport: function (t) {
        return (
          (t = e.extend(
            {
              imptype: 'xml',
              impstring: '',
              impurl: '',
              mtype: 'GET',
              impData: {},
              xmlGrid: { config: 'roots>grid', data: 'roots>rows' },
              jsonGrid: { config: 'grid', data: 'data' },
              ajaxOptions: {},
            },
            t || {}
          )),
          this.each(function () {
            var i = this,
              r = function (t, r) {
                var a,
                  o,
                  s,
                  n = e(r.xmlGrid.config, t)[0],
                  d = e(r.xmlGrid.data, t)[0];
                if (xmlJsonClass.xml2json && e.jgrid.parse) {
                  (a = xmlJsonClass.xml2json(n, ' ')), (a = e.jgrid.parse(a));
                  for (s in a) a.hasOwnProperty(s) && (o = a[s]);
                  if (d) {
                    var l = a.grid.datatype;
                    (a.grid.datatype = 'xmlstring'),
                      (a.grid.datastr = t),
                      e(i).jqGrid(o).jqGrid('setGridParam', { datatype: l });
                  } else e(i).jqGrid(o);
                  (a = null), (o = null);
                } else alert('xml2json or parse are not present');
              },
              a = function (t, r) {
                if (t && 'string' == typeof t) {
                  var a = !1;
                  e.jgrid.useJSON && ((e.jgrid.useJSON = !1), (a = !0));
                  var o = e.jgrid.parse(t);
                  a && (e.jgrid.useJSON = !0);
                  var s = o[r.jsonGrid.config],
                    n = o[r.jsonGrid.data];
                  if (n) {
                    var d = s.datatype;
                    (s.datatype = 'jsonstring'),
                      (s.datastr = n),
                      e(i).jqGrid(s).jqGrid('setGridParam', { datatype: d });
                  } else e(i).jqGrid(s);
                }
              };
            switch (t.imptype) {
              case 'xml':
                e.ajax(
                  e.extend(
                    {
                      url: t.impurl,
                      type: t.mtype,
                      data: t.impData,
                      dataType: 'xml',
                      complete: function (a, o) {
                        'success' === o &&
                          (r(a.responseXML, t),
                          e(i).triggerHandler('jqGridImportComplete', [a, t]),
                          e.isFunction(t.importComplete) &&
                            t.importComplete(a)),
                          (a = null);
                      },
                    },
                    t.ajaxOptions
                  )
                );
                break;
              case 'xmlstring':
                if (t.impstring && 'string' == typeof t.impstring) {
                  var o = e.parseXML(t.impstring);
                  o &&
                    (r(o, t),
                    e(i).triggerHandler('jqGridImportComplete', [o, t]),
                    e.isFunction(t.importComplete) && t.importComplete(o),
                    (t.impstring = null)),
                    (o = null);
                }
                break;
              case 'json':
                e.ajax(
                  e.extend(
                    {
                      url: t.impurl,
                      type: t.mtype,
                      data: t.impData,
                      dataType: 'json',
                      complete: function (r) {
                        try {
                          a(r.responseText, t),
                            e(i).triggerHandler('jqGridImportComplete', [r, t]),
                            e.isFunction(t.importComplete) &&
                              t.importComplete(r);
                        } catch (o) {}
                        r = null;
                      },
                    },
                    t.ajaxOptions
                  )
                );
                break;
              case 'jsonstring':
                t.impstring &&
                  'string' == typeof t.impstring &&
                  (a(t.impstring, t),
                  e(i).triggerHandler('jqGridImportComplete', [t.impstring, t]),
                  e.isFunction(t.importComplete) &&
                    t.importComplete(t.impstring),
                  (t.impstring = null));
            }
          })
        );
      },
      jqGridExport: function (t) {
        t = e.extend(
          { exptype: 'xmlstring', root: 'grid', ident: '	' },
          t || {}
        );
        var i = null;
        return (
          this.each(function () {
            if (this.grid) {
              var r,
                a = e.extend(!0, {}, e(this).jqGrid('getGridParam'));
              if (
                (a.rownumbers &&
                  (a.colNames.splice(0, 1), a.colModel.splice(0, 1)),
                a.multiselect &&
                  (a.colNames.splice(0, 1), a.colModel.splice(0, 1)),
                a.subGrid && (a.colNames.splice(0, 1), a.colModel.splice(0, 1)),
                (a.knv = null),
                a.treeGrid)
              )
                for (r in a.treeReader)
                  a.treeReader.hasOwnProperty(r) &&
                    (a.colNames.splice(a.colNames.length - 1),
                    a.colModel.splice(a.colModel.length - 1));
              switch (t.exptype) {
                case 'xmlstring':
                  i =
                    '<' +
                    t.root +
                    '>' +
                    xmlJsonClass.json2xml(a, t.ident) +
                    '</' +
                    t.root +
                    '>';
                  break;
                case 'jsonstring':
                  (i = '{' + xmlJsonClass.toJson(a, t.root, t.ident, !1) + '}'),
                    void 0 !== a.postData.filters &&
                      ((i = i.replace(/filters":"/, 'filters":')),
                      (i = i.replace(/}]}"/, '}]}')));
              }
            }
          }),
          i
        );
      },
      excelExport: function (t) {
        return (
          (t = e.extend(
            {
              exptype: 'remote',
              url: null,
              oper: 'oper',
              tag: 'excel',
              exportOptions: {},
            },
            t || {}
          )),
          this.each(function () {
            if (this.grid) {
              var i;
              if ('remote' === t.exptype) {
                var r = e.extend({}, this.p.postData);
                r[t.oper] = t.tag;
                var a = jQuery.param(r);
                (i =
                  -1 !== t.url.indexOf('?')
                    ? t.url + '&' + a
                    : t.url + '?' + a),
                  (window.location = i);
              }
            }
          })
        );
      },
    });
  })(jQuery),
  (function (e) {
    'use strict';
    (e.jgrid.inlineEdit = e.jgrid.inlineEdit || {}),
      e.jgrid.extend({
        editRow: function (t, i, r, a, o, s, n, d, l) {
          var p = {},
            c = e.makeArray(arguments).slice(1);
          return (
            'object' === e.type(c[0])
              ? (p = c[0])
              : (void 0 !== i && (p.keys = i),
                e.isFunction(r) && (p.oneditfunc = r),
                e.isFunction(a) && (p.successfunc = a),
                void 0 !== o && (p.url = o),
                void 0 !== s && (p.extraparam = s),
                e.isFunction(n) && (p.aftersavefunc = n),
                e.isFunction(d) && (p.errorfunc = d),
                e.isFunction(l) && (p.afterrestorefunc = l)),
            (p = e.extend(
              !0,
              {
                keys: !1,
                oneditfunc: null,
                successfunc: null,
                url: null,
                extraparam: {},
                aftersavefunc: null,
                errorfunc: null,
                afterrestorefunc: null,
                restoreAfterError: !0,
                mtype: 'POST',
                focusField: !0,
              },
              e.jgrid.inlineEdit,
              p
            )),
            this.each(function () {
              var i,
                r,
                a,
                o,
                s,
                n,
                d = this,
                l = 0,
                c = null,
                u = {};
              d.grid &&
                ((o = e(d).jqGrid('getInd', t, !0)),
                o !== !1 &&
                  ((n = e.isFunction(p.beforeEditRow)
                    ? p.beforeEditRow.call(d, p, t)
                    : void 0),
                  void 0 === n && (n = !0),
                  n &&
                    ((a = e(o).attr('editable') || '0'),
                    '0' !== a ||
                      e(o).hasClass('not-editable-row') ||
                      ((s = d.p.colModel),
                      e('td[role="gridcell"]', o).each(function (a) {
                        i = s[a].name;
                        var o = d.p.treeGrid === !0 && i === d.p.ExpandColumn;
                        if (o) r = e('span:first', this).html();
                        else
                          try {
                            r = e.unformat.call(
                              d,
                              this,
                              { rowId: t, colModel: s[a] },
                              a
                            );
                          } catch (n) {
                            r =
                              s[a].edittype && 'textarea' === s[a].edittype
                                ? e(this).text()
                                : e(this).html();
                          }
                        if (
                          'cb' !== i &&
                          'subgrid' !== i &&
                          'rn' !== i &&
                          (d.p.autoencode && (r = e.jgrid.htmlDecode(r)),
                          (u[i] = r),
                          s[a].editable === !0)
                        ) {
                          null === c && (c = a),
                            o
                              ? e('span:first', this).html('')
                              : e(this).html('');
                          var p = e.extend({}, s[a].editoptions || {}, {
                            id: t + '_' + i,
                            name: i,
                            rowId: t,
                          });
                          s[a].edittype || (s[a].edittype = 'text'),
                            ('&nbsp;' === r ||
                              '&#160;' === r ||
                              (1 === r.length && 160 === r.charCodeAt(0))) &&
                              (r = '');
                          var h = e.jgrid.createEl.call(
                            d,
                            s[a].edittype,
                            p,
                            r,
                            !0,
                            e.extend(
                              {},
                              e.jgrid.ajaxOptions,
                              d.p.ajaxSelectOptions || {}
                            )
                          );
                          e(h).addClass('editable'),
                            o
                              ? e('span:first', this).append(h)
                              : e(this).append(h),
                            e.jgrid.bindEv.call(d, h, p),
                            'select' === s[a].edittype &&
                              void 0 !== s[a].editoptions &&
                              s[a].editoptions.multiple === !0 &&
                              void 0 === s[a].editoptions.dataUrl &&
                              e.jgrid.msie &&
                              e(h).width(e(h).width()),
                            l++;
                        }
                      }),
                      l > 0 &&
                        ((u.id = t),
                        d.p.savedRow.push(u),
                        e(o).attr('editable', '1'),
                        p.focusField &&
                          ('number' == typeof p.focusField &&
                            parseInt(p.focusField, 10) <= s.length &&
                            (c = p.focusField),
                          setTimeout(function () {
                            var t = e('td:eq(' + c + ') :input:visible', o).not(
                              ':disabled'
                            );
                            t.length > 0 && t.focus();
                          }, 0)),
                        p.keys === !0 &&
                          e(o).bind('keydown', function (i) {
                            if (27 === i.keyCode) {
                              if (
                                (e(d).jqGrid(
                                  'restoreRow',
                                  t,
                                  p.afterrestorefunc
                                ),
                                d.p._inlinenav)
                              )
                                try {
                                  e(d).jqGrid('showAddEditButtons');
                                } catch (r) {}
                              return !1;
                            }
                            if (13 === i.keyCode) {
                              var a = i.target;
                              if ('TEXTAREA' === a.tagName) return !0;
                              if (
                                e(d).jqGrid('saveRow', t, p) &&
                                d.p._inlinenav
                              )
                                try {
                                  e(d).jqGrid('showAddEditButtons');
                                } catch (o) {}
                              return !1;
                            }
                          }),
                        e(d).triggerHandler('jqGridInlineEditRow', [t, p]),
                        e.isFunction(p.oneditfunc) &&
                          p.oneditfunc.call(d, t))))));
            })
          );
        },
        saveRow: function (t, i, r, a, o, s, n) {
          var d = e.makeArray(arguments).slice(1),
            l = {};
          'object' === e.type(d[0])
            ? (l = d[0])
            : (e.isFunction(i) && (l.successfunc = i),
              void 0 !== r && (l.url = r),
              void 0 !== a && (l.extraparam = a),
              e.isFunction(o) && (l.aftersavefunc = o),
              e.isFunction(s) && (l.errorfunc = s),
              e.isFunction(n) && (l.afterrestorefunc = n)),
            (l = e.extend(
              !0,
              {
                successfunc: null,
                url: null,
                extraparam: {},
                aftersavefunc: null,
                errorfunc: null,
                afterrestorefunc: null,
                restoreAfterError: !0,
                mtype: 'POST',
                saveui: 'enable',
                savetext: e.jgrid.defaults.savetext || 'Saving...',
              },
              e.jgrid.inlineEdit,
              l
            ));
          var p,
            c,
            u,
            h,
            g,
            f = !1,
            m = this[0],
            v = {},
            j = {},
            b = {};
          if (!m.grid) return f;
          if (((g = e(m).jqGrid('getInd', t, !0)), g === !1)) return f;
          var w = e.isFunction(l.beforeSaveRow)
            ? l.beforeSaveRow.call(m, l, t)
            : void 0;
          if ((void 0 === w && (w = !0), w)) {
            if (
              ((c = e(g).attr('editable')),
              (l.url = l.url || m.p.editurl),
              '1' === c)
            ) {
              var y;
              if (
                (e('td[role="gridcell"]', g).each(function (t) {
                  if (
                    ((y = m.p.colModel[t]),
                    (p = y.name),
                    'cb' !== p &&
                      'subgrid' !== p &&
                      y.editable === !0 &&
                      'rn' !== p &&
                      !e(this).hasClass('not-editable-cell'))
                  ) {
                    switch (y.edittype) {
                      case 'checkbox':
                        var i = ['Yes', 'No'];
                        y.editoptions && (i = y.editoptions.value.split(':')),
                          (v[p] = e('input', this).is(':checked')
                            ? i[0]
                            : i[1]);
                        break;
                      case 'text':
                      case 'password':
                      case 'textarea':
                      case 'button':
                        v[p] = e('input, textarea', this).val();
                        break;
                      case 'select':
                        if (y.editoptions.multiple) {
                          var r = e('select', this),
                            a = [];
                          (v[p] = e(r).val()),
                            (v[p] = v[p] ? v[p].join(',') : ''),
                            e('select option:selected', this).each(
                              function (t, i) {
                                a[t] = e(i).text();
                              }
                            ),
                            (j[p] = a.join(','));
                        } else
                          (v[p] = e('select option:selected', this).val()),
                            (j[p] = e('select option:selected', this).text());
                        y.formatter && 'select' === y.formatter && (j = {});
                        break;
                      case 'custom':
                        try {
                          if (
                            !y.editoptions ||
                            !e.isFunction(y.editoptions.custom_value)
                          )
                            throw 'e1';
                          if (
                            ((v[p] = y.editoptions.custom_value.call(
                              m,
                              e('.customelement', this),
                              'get'
                            )),
                            void 0 === v[p])
                          )
                            throw 'e2';
                        } catch (o) {
                          'e1' === o &&
                            e.jgrid.info_dialog(
                              e.jgrid.errors.errcap,
                              "function 'custom_value' " +
                                e.jgrid.edit.msg.nodefined,
                              e.jgrid.edit.bClose
                            ),
                            'e2' === o
                              ? e.jgrid.info_dialog(
                                  e.jgrid.errors.errcap,
                                  "function 'custom_value' " +
                                    e.jgrid.edit.msg.novalue,
                                  e.jgrid.edit.bClose
                                )
                              : e.jgrid.info_dialog(
                                  e.jgrid.errors.errcap,
                                  o.message,
                                  e.jgrid.edit.bClose
                                );
                        }
                    }
                    if (
                      ((h = e.jgrid.checkValues.call(m, v[p], t)), h[0] === !1)
                    )
                      return !1;
                    m.p.autoencode && (v[p] = e.jgrid.htmlEncode(v[p])),
                      'clientArray' !== l.url &&
                        y.editoptions &&
                        y.editoptions.NullIfEmpty === !0 &&
                        '' === v[p] &&
                        (b[p] = 'null');
                  }
                }),
                h[0] === !1)
              ) {
                try {
                  var x = e(m).jqGrid('getGridRowById', t),
                    q = e.jgrid.findPos(x);
                  e.jgrid.info_dialog(
                    e.jgrid.errors.errcap,
                    h[1],
                    e.jgrid.edit.bClose,
                    { left: q[0], top: q[1] + e(x).outerHeight() }
                  );
                } catch (D) {
                  alert(h[1]);
                }
                return f;
              }
              var $,
                _ = m.p.prmNames,
                C = t;
              if ((($ = m.p.keyName === !1 ? _.id : m.p.keyName), v)) {
                if (((v[_.oper] = _.editoper), void 0 === v[$] || '' === v[$]))
                  v[$] = t;
                else if (g.id !== m.p.idPrefix + v[$]) {
                  var G = e.jgrid.stripPref(m.p.idPrefix, t);
                  if (
                    (void 0 !== m.p._index[G] &&
                      ((m.p._index[v[$]] = m.p._index[G]),
                      delete m.p._index[G]),
                    (t = m.p.idPrefix + v[$]),
                    e(g).attr('id', t),
                    m.p.selrow === C && (m.p.selrow = t),
                    e.isArray(m.p.selarrrow))
                  ) {
                    var I = e.inArray(C, m.p.selarrrow);
                    I >= 0 && (m.p.selarrrow[I] = t);
                  }
                  if (m.p.multiselect) {
                    var F = 'jqg_' + m.p.id + '_' + t;
                    e('input.cbox', g).attr('id', F).attr('name', F);
                  }
                }
                void 0 === m.p.inlineData && (m.p.inlineData = {}),
                  (v = e.extend({}, v, m.p.inlineData, l.extraparam));
              }
              if ('clientArray' === l.url) {
                (v = e.extend({}, v, j)),
                  m.p.autoencode &&
                    e.each(v, function (t, i) {
                      v[t] = e.jgrid.htmlDecode(i);
                    });
                var S,
                  k = e(m).jqGrid('setRowData', t, v);
                for (
                  e(g).attr('editable', '0'), S = 0;
                  S < m.p.savedRow.length;
                  S++
                )
                  if (String(m.p.savedRow[S].id) === String(C)) {
                    u = S;
                    break;
                  }
                u >= 0 && m.p.savedRow.splice(u, 1),
                  e(m).triggerHandler('jqGridInlineAfterSaveRow', [t, k, v, l]),
                  e.isFunction(l.aftersavefunc) &&
                    l.aftersavefunc.call(m, t, k, v, l),
                  (f = !0),
                  e(g).removeClass('jqgrid-new-row').unbind('keydown');
              } else
                e(m).jqGrid('progressBar', {
                  method: 'show',
                  loadtype: l.saveui,
                  htmlcontent: l.savetext,
                }),
                  (b = e.extend({}, v, b)),
                  (b[$] = e.jgrid.stripPref(m.p.idPrefix, b[$])),
                  e.ajax(
                    e.extend(
                      {
                        url: l.url,
                        data: e.isFunction(m.p.serializeRowData)
                          ? m.p.serializeRowData.call(m, b)
                          : b,
                        type: l.mtype,
                        async: !1,
                        complete: function (i, r) {
                          if (
                            (e(m).jqGrid('progressBar', {
                              method: 'hide',
                              loadtype: l.saveui,
                              htmlcontent: l.savetext,
                            }),
                            'success' === r)
                          ) {
                            var a,
                              o,
                              s = !0;
                            if (
                              ((a = e(m).triggerHandler(
                                'jqGridInlineSuccessSaveRow',
                                [i, t, l]
                              )),
                              e.isArray(a) || (a = [!0, v]),
                              a[0] &&
                                e.isFunction(l.successfunc) &&
                                (a = l.successfunc.call(m, i)),
                              e.isArray(a)
                                ? ((s = a[0]), (v = a[1] || v))
                                : (s = a),
                              s === !0)
                            ) {
                              for (
                                m.p.autoencode &&
                                  e.each(v, function (t, i) {
                                    v[t] = e.jgrid.htmlDecode(i);
                                  }),
                                  v = e.extend({}, v, j),
                                  e(m).jqGrid('setRowData', t, v),
                                  e(g).attr('editable', '0'),
                                  o = 0;
                                o < m.p.savedRow.length;
                                o++
                              )
                                if (String(m.p.savedRow[o].id) === String(t)) {
                                  u = o;
                                  break;
                                }
                              u >= 0 && m.p.savedRow.splice(u, 1),
                                e(m).triggerHandler(
                                  'jqGridInlineAfterSaveRow',
                                  [t, i, v, l]
                                ),
                                e.isFunction(l.aftersavefunc) &&
                                  l.aftersavefunc.call(m, t, i, v, l),
                                (f = !0),
                                e(g)
                                  .removeClass('jqgrid-new-row')
                                  .unbind('keydown');
                            } else
                              e(m).triggerHandler('jqGridInlineErrorSaveRow', [
                                t,
                                i,
                                r,
                                null,
                                l,
                              ]),
                                e.isFunction(l.errorfunc) &&
                                  l.errorfunc.call(m, t, i, r, null),
                                l.restoreAfterError === !0 &&
                                  e(m).jqGrid(
                                    'restoreRow',
                                    t,
                                    l.afterrestorefunc
                                  );
                          }
                        },
                        error: function (i, r, a) {
                          if (
                            (e('#lui_' + e.jgrid.jqID(m.p.id)).hide(),
                            e(m).triggerHandler('jqGridInlineErrorSaveRow', [
                              t,
                              i,
                              r,
                              a,
                              l,
                            ]),
                            e.isFunction(l.errorfunc))
                          )
                            l.errorfunc.call(m, t, i, r, a);
                          else {
                            var o = i.responseText || i.statusText;
                            try {
                              e.jgrid.info_dialog(
                                e.jgrid.errors.errcap,
                                '<div class="ui-state-error">' + o + '</div>',
                                e.jgrid.edit.bClose,
                                { buttonalign: 'right' }
                              );
                            } catch (s) {
                              alert(o);
                            }
                          }
                          l.restoreAfterError === !0 &&
                            e(m).jqGrid('restoreRow', t, l.afterrestorefunc);
                        },
                      },
                      e.jgrid.ajaxOptions,
                      m.p.ajaxRowOptions || {}
                    )
                  );
            }
            return f;
          }
        },
        restoreRow: function (t, i) {
          var r = e.makeArray(arguments).slice(1),
            a = {};
          return (
            'object' === e.type(r[0])
              ? (a = r[0])
              : e.isFunction(i) && (a.afterrestorefunc = i),
            (a = e.extend(!0, {}, e.jgrid.inlineEdit, a)),
            this.each(function () {
              var i,
                r,
                o = this,
                s = -1,
                n = {};
              if (o.grid && ((i = e(o).jqGrid('getInd', t, !0)), i !== !1)) {
                var d = e.isFunction(a.beforeCancelRow)
                  ? a.beforeCancelRow.call(o, a, t)
                  : void 0;
                if ((void 0 === d && (d = !0), d)) {
                  for (r = 0; r < o.p.savedRow.length; r++)
                    if (String(o.p.savedRow[r].id) === String(t)) {
                      s = r;
                      break;
                    }
                  if (s >= 0) {
                    if (e.isFunction(e.fn.datepicker))
                      try {
                        e(
                          'input.hasDatepicker',
                          '#' + e.jgrid.jqID(i.id)
                        ).datepicker('hide');
                      } catch (l) {}
                    e.each(o.p.colModel, function () {
                      this.editable === !0 &&
                        o.p.savedRow[s].hasOwnProperty(this.name) &&
                        (n[this.name] = o.p.savedRow[s][this.name]);
                    }),
                      e(o).jqGrid('setRowData', t, n),
                      e(i).attr('editable', '0').unbind('keydown'),
                      o.p.savedRow.splice(s, 1),
                      e(
                        '#' + e.jgrid.jqID(t),
                        '#' + e.jgrid.jqID(o.p.id)
                      ).hasClass('jqgrid-new-row') &&
                        setTimeout(function () {
                          e(o).jqGrid('delRowData', t),
                            e(o).jqGrid('showAddEditButtons');
                        }, 0);
                  }
                  e(o).triggerHandler('jqGridInlineAfterRestoreRow', [t]),
                    e.isFunction(a.afterrestorefunc) &&
                      a.afterrestorefunc.call(o, t);
                }
              }
            })
          );
        },
        addRow: function (t) {
          return (
            (t = e.extend(
              !0,
              {
                rowID: null,
                initdata: {},
                position: 'first',
                useDefValues: !0,
                useFormatter: !1,
                addRowParams: { extraparam: {} },
              },
              t || {}
            )),
            this.each(function () {
              if (this.grid) {
                var i = this,
                  r = e.isFunction(t.beforeAddRow)
                    ? t.beforeAddRow.call(i, t.addRowParams)
                    : void 0;
                if ((void 0 === r && (r = !0), r))
                  if (
                    ((t.rowID = e.isFunction(t.rowID)
                      ? t.rowID.call(i, t)
                      : null != t.rowID
                        ? t.rowID
                        : e.jgrid.randId()),
                    t.useDefValues === !0 &&
                      e(i.p.colModel).each(function () {
                        if (this.editoptions && this.editoptions.defaultValue) {
                          var r = this.editoptions.defaultValue,
                            a = e.isFunction(r) ? r.call(i) : r;
                          t.initdata[this.name] = a;
                        }
                      }),
                    e(i).jqGrid('addRowData', t.rowID, t.initdata, t.position),
                    (t.rowID = i.p.idPrefix + t.rowID),
                    e(
                      '#' + e.jgrid.jqID(t.rowID),
                      '#' + e.jgrid.jqID(i.p.id)
                    ).addClass('jqgrid-new-row'),
                    t.useFormatter)
                  )
                    e(
                      '#' + e.jgrid.jqID(t.rowID) + ' .ui-inline-edit',
                      '#' + e.jgrid.jqID(i.p.id)
                    ).click();
                  else {
                    var a = i.p.prmNames,
                      o = a.oper;
                    (t.addRowParams.extraparam[o] = a.addoper),
                      e(i).jqGrid('editRow', t.rowID, t.addRowParams),
                      e(i).jqGrid('setSelection', t.rowID);
                  }
              }
            })
          );
        },
        inlineNav: function (t, i) {
          return (
            (i = e.extend(
              !0,
              {
                edit: !0,
                editicon: 'ui-icon-pencil',
                add: !0,
                addicon: 'ui-icon-plus',
                save: !0,
                saveicon: 'ui-icon-disk',
                cancel: !0,
                cancelicon: 'ui-icon-cancel',
                addParams: { addRowParams: { extraparam: {} } },
                editParams: {},
                restoreAfterSelect: !0,
              },
              e.jgrid.nav,
              i || {}
            )),
            this.each(function () {
              if (this.grid) {
                var r,
                  a = this,
                  o = e.jgrid.jqID(a.p.id);
                if (((a.p._inlinenav = !0), i.addParams.useFormatter === !0)) {
                  var s,
                    n = a.p.colModel;
                  for (s = 0; s < n.length; s++)
                    if (n[s].formatter && 'actions' === n[s].formatter) {
                      if (n[s].formatoptions) {
                        var d = {
                            keys: !1,
                            onEdit: null,
                            onSuccess: null,
                            afterSave: null,
                            onError: null,
                            afterRestore: null,
                            extraparam: {},
                            url: null,
                          },
                          l = e.extend(d, n[s].formatoptions);
                        i.addParams.addRowParams = {
                          keys: l.keys,
                          oneditfunc: l.onEdit,
                          successfunc: l.onSuccess,
                          url: l.url,
                          extraparam: l.extraparam,
                          aftersavefunc: l.afterSave,
                          errorfunc: l.onError,
                          afterrestorefunc: l.afterRestore,
                        };
                      }
                      break;
                    }
                }
                i.add &&
                  e(a).jqGrid('navButtonAdd', t, {
                    caption: i.addtext,
                    title: i.addtitle,
                    buttonicon: i.addicon,
                    id: a.p.id + '_iladd',
                    onClickButton: function () {
                      e(a).jqGrid('addRow', i.addParams),
                        i.addParams.useFormatter ||
                          (e('#' + o + '_ilsave').removeClass(
                            'ui-state-disabled'
                          ),
                          e('#' + o + '_ilcancel').removeClass(
                            'ui-state-disabled'
                          ),
                          e('#' + o + '_iladd').addClass('ui-state-disabled'),
                          e('#' + o + '_iledit').addClass('ui-state-disabled'));
                    },
                  }),
                  i.edit &&
                    e(a).jqGrid('navButtonAdd', t, {
                      caption: i.edittext,
                      title: i.edittitle,
                      buttonicon: i.editicon,
                      id: a.p.id + '_iledit',
                      onClickButton: function () {
                        var t = e(a).jqGrid('getGridParam', 'selrow');
                        t
                          ? (e(a).jqGrid('editRow', t, i.editParams),
                            e('#' + o + '_ilsave').removeClass(
                              'ui-state-disabled'
                            ),
                            e('#' + o + '_ilcancel').removeClass(
                              'ui-state-disabled'
                            ),
                            e('#' + o + '_iladd').addClass('ui-state-disabled'),
                            e('#' + o + '_iledit').addClass(
                              'ui-state-disabled'
                            ))
                          : (e.jgrid.viewModal('#alertmod', {
                              gbox: '#gbox_' + o,
                              jqm: !0,
                            }),
                            e('#jqg_alrt').focus());
                      },
                    }),
                  i.save &&
                    (e(a).jqGrid('navButtonAdd', t, {
                      caption: i.savetext || '',
                      title: i.savetitle || 'Save row',
                      buttonicon: i.saveicon,
                      id: a.p.id + '_ilsave',
                      onClickButton: function () {
                        var t = a.p.savedRow[0].id;
                        if (t) {
                          var r = a.p.prmNames,
                            s = r.oper,
                            n = i.editParams;
                          e('#' + e.jgrid.jqID(t), '#' + o).hasClass(
                            'jqgrid-new-row'
                          )
                            ? ((i.addParams.addRowParams.extraparam[s] =
                                r.addoper),
                              (n = i.addParams.addRowParams))
                            : (i.editParams.extraparam ||
                                (i.editParams.extraparam = {}),
                              (i.editParams.extraparam[s] = r.editoper)),
                            e(a).jqGrid('saveRow', t, n) &&
                              e(a).jqGrid('showAddEditButtons');
                        } else
                          e.jgrid.viewModal('#alertmod', {
                            gbox: '#gbox_' + o,
                            jqm: !0,
                          }),
                            e('#jqg_alrt').focus();
                      },
                    }),
                    e('#' + o + '_ilsave').addClass('ui-state-disabled')),
                  i.cancel &&
                    (e(a).jqGrid('navButtonAdd', t, {
                      caption: i.canceltext || '',
                      title: i.canceltitle || 'Cancel row editing',
                      buttonicon: i.cancelicon,
                      id: a.p.id + '_ilcancel',
                      onClickButton: function () {
                        var t = a.p.savedRow[0].id,
                          r = i.editParams;
                        t
                          ? (e('#' + e.jgrid.jqID(t), '#' + o).hasClass(
                              'jqgrid-new-row'
                            ) && (r = i.addParams.addRowParams),
                            e(a).jqGrid('restoreRow', t, r),
                            e(a).jqGrid('showAddEditButtons'))
                          : (e.jgrid.viewModal('#alertmod', {
                              gbox: '#gbox_' + o,
                              jqm: !0,
                            }),
                            e('#jqg_alrt').focus());
                      },
                    }),
                    e('#' + o + '_ilcancel').addClass('ui-state-disabled')),
                  i.restoreAfterSelect === !0 &&
                    ((r = e.isFunction(a.p.beforeSelectRow)
                      ? a.p.beforeSelectRow
                      : !1),
                    (a.p.beforeSelectRow = function (t, o) {
                      var s = !0;
                      return (
                        a.p.savedRow.length > 0 &&
                          a.p._inlinenav === !0 &&
                          t !== a.p.selrow &&
                          null !== a.p.selrow &&
                          (a.p.selrow === i.addParams.rowID
                            ? e(a).jqGrid('delRowData', a.p.selrow)
                            : e(a).jqGrid(
                                'restoreRow',
                                a.p.selrow,
                                i.editParams
                              ),
                          e(a).jqGrid('showAddEditButtons')),
                        r && (s = r.call(a, t, o)),
                        s
                      );
                    }));
              }
            })
          );
        },
        showAddEditButtons: function () {
          return this.each(function () {
            if (this.grid) {
              var t = e.jgrid.jqID(this.p.id);
              e('#' + t + '_ilsave').addClass('ui-state-disabled'),
                e('#' + t + '_ilcancel').addClass('ui-state-disabled'),
                e('#' + t + '_iladd').removeClass('ui-state-disabled'),
                e('#' + t + '_iledit').removeClass('ui-state-disabled');
            }
          });
        },
      });
  })(jQuery),
  (function ($) {
    'use strict';
    if (
      ($.jgrid.msie &&
        8 === $.jgrid.msiever() &&
        ($.expr[':'].hidden = function (e) {
          return (
            0 === e.offsetWidth ||
            0 === e.offsetHeight ||
            'none' === e.style.display
          );
        }),
      ($.jgrid._multiselect = !1),
      $.ui && $.ui.multiselect)
    ) {
      if ($.ui.multiselect.prototype._setSelected) {
        var setSelected = $.ui.multiselect.prototype._setSelected;
        $.ui.multiselect.prototype._setSelected = function (e, t) {
          var i = setSelected.call(this, e, t);
          if (t && this.selectedList) {
            var r = this.element;
            this.selectedList.find('li').each(function () {
              $(this).data('optionLink') &&
                $(this).data('optionLink').remove().appendTo(r);
            });
          }
          return i;
        };
      }
      $.ui.multiselect.prototype.destroy &&
        ($.ui.multiselect.prototype.destroy = function () {
          this.element.show(),
            this.container.remove(),
            void 0 === $.Widget
              ? $.widget.prototype.destroy.apply(this, arguments)
              : $.Widget.prototype.destroy.apply(this, arguments);
        }),
        ($.jgrid._multiselect = !0);
    }
    $.jgrid.extend({
      sortableColumns: function (e) {
        return this.each(function () {
          function t() {
            i.p.disableClick = !0;
          }
          var i = this,
            r = $.jgrid.jqID(i.p.id),
            a = {
              tolerance: 'pointer',
              axis: 'x',
              scrollSensitivity: '1',
              items:
                '>th:not(:has(#jqgh_' +
                r +
                '_cb,#jqgh_' +
                r +
                '_rn,#jqgh_' +
                r +
                '_subgrid),:hidden)',
              placeholder: {
                element: function (e) {
                  var t = $(document.createElement(e[0].nodeName))
                    .addClass(
                      e[0].className +
                        ' ui-sortable-placeholder ui-state-highlight'
                    )
                    .removeClass('ui-sortable-helper')[0];
                  return t;
                },
                update: function (e, t) {
                  t.height(
                    e.currentItem.innerHeight() -
                      parseInt(e.currentItem.css('paddingTop') || 0, 10) -
                      parseInt(e.currentItem.css('paddingBottom') || 0, 10)
                  ),
                    t.width(
                      e.currentItem.innerWidth() -
                        parseInt(e.currentItem.css('paddingLeft') || 0, 10) -
                        parseInt(e.currentItem.css('paddingRight') || 0, 10)
                    );
                },
              },
              update: function (e, t) {
                var r = $(t.item).parent(),
                  a = $('>th', r),
                  o = i.p.colModel,
                  s = {},
                  n = i.p.id + '_';
                $.each(o, function (e) {
                  s[this.name] = e;
                });
                var d = [];
                a.each(function () {
                  var e = $('>div', this)
                    .get(0)
                    .id.replace(/^jqgh_/, '')
                    .replace(n, '');
                  s.hasOwnProperty(e) && d.push(s[e]);
                }),
                  $(i).jqGrid('remapColumns', d, !0, !0),
                  $.isFunction(i.p.sortable.update) && i.p.sortable.update(d),
                  setTimeout(function () {
                    i.p.disableClick = !1;
                  }, 50);
              },
            };
          if (
            (i.p.sortable.options
              ? $.extend(a, i.p.sortable.options)
              : $.isFunction(i.p.sortable) &&
                (i.p.sortable = { update: i.p.sortable }),
            a.start)
          ) {
            var o = a.start;
            a.start = function (e, i) {
              t(), o.call(this, e, i);
            };
          } else a.start = t;
          i.p.sortable.exclude &&
            (a.items += ':not(' + i.p.sortable.exclude + ')');
          var s = e.sortable(a),
            n = s.data('sortable') || s.data('uiSortable');
          null != n && (n.data('sortable').floating = !0);
        });
      },
      columnChooser: function (e) {
        function t(e, t, i) {
          var r, a;
          return t >= 0
            ? ((r = e.slice()),
              (a = r.splice(t, Math.max(e.length - t, t))),
              t > e.length && (t = e.length),
              (r[t] = i),
              r.concat(a))
            : e;
        }
        function i(e, t) {
          e &&
            ('string' == typeof e
              ? $.fn[e] && $.fn[e].apply(t, $.makeArray(arguments).slice(2))
              : $.isFunction(e) && e.apply(t, $.makeArray(arguments).slice(2)));
        }
        var r,
          a,
          o,
          s,
          n,
          d,
          l,
          p = this,
          c = {},
          u = [],
          h = p.jqGrid('getGridParam', 'colModel'),
          g = p.jqGrid('getGridParam', 'colNames'),
          f = function (e) {
            return (
              ($.ui.multiselect.prototype &&
                e.data(
                  $.ui.multiselect.prototype.widgetFullName ||
                    $.ui.multiselect.prototype.widgetName
                )) ||
              e.data('ui-multiselect') ||
              e.data('multiselect')
            );
          };
        if (!$('#colchooser_' + $.jgrid.jqID(p[0].p.id)).length) {
          if (
            ((r = $(
              '<div id="colchooser_' +
                p[0].p.id +
                '" style="position:relative;overflow:hidden"><div><select multiple="multiple"></select></div></div>'
            )),
            (a = $('select', r)),
            (e = $.extend(
              {
                width: 400,
                height: 240,
                classname: null,
                done: function (e) {
                  e && p.jqGrid('remapColumns', e, !0);
                },
                msel: 'multiselect',
                dlog: 'dialog',
                dialog_opts: { minWidth: 470, dialogClass: 'ui-jqdialog' },
                dlog_opts: function (e) {
                  var t = {};
                  return (
                    (t[e.bSubmit] = function () {
                      e.apply_perm(), e.cleanup(!1);
                    }),
                    (t[e.bCancel] = function () {
                      e.cleanup(!0);
                    }),
                    $.extend(
                      !0,
                      {
                        buttons: t,
                        close: function () {
                          e.cleanup(!0);
                        },
                        modal: e.modal || !1,
                        resizable: e.resizable || !0,
                        width: e.width + 70,
                        resize: function () {
                          var e = f(a),
                            t = e.container.closest('.ui-dialog-content');
                          t.length > 0 && 'object' == typeof t[0].style
                            ? (t[0].style.width = '')
                            : t.css('width', ''),
                            e.selectedList.height(
                              Math.max(
                                e.selectedContainer.height() -
                                  e.selectedActions.outerHeight() -
                                  1,
                                1
                              )
                            ),
                            e.availableList.height(
                              Math.max(
                                e.availableContainer.height() -
                                  e.availableActions.outerHeight() -
                                  1,
                                1
                              )
                            );
                        },
                      },
                      e.dialog_opts || {}
                    )
                  );
                },
                apply_perm: function () {
                  var i = [];
                  $('option', a).each(function () {
                    $(this).is('[selected]')
                      ? p.jqGrid('showCol', h[this.value].name)
                      : p.jqGrid('hideCol', h[this.value].name);
                  }),
                    $('option[selected]', a).each(function () {
                      i.push(parseInt(this.value, 10));
                    }),
                    $.each(i, function () {
                      delete c[h[parseInt(this, 10)].name];
                    }),
                    $.each(c, function () {
                      var e = parseInt(this, 10);
                      i = t(i, e, e);
                    }),
                    e.done && e.done.call(p, i),
                    p.jqGrid(
                      'setGridWidth',
                      p[0].p.tblwidth,
                      p[0].p.shrinkToFit
                    );
                },
                cleanup: function (t) {
                  i(e.dlog, r, 'destroy'),
                    i(e.msel, a, 'destroy'),
                    r.remove(),
                    t && e.done && e.done.call(p);
                },
                msel_opts: {},
              },
              $.jgrid.col,
              e || {}
            )),
            $.ui && $.ui.multiselect && $.ui.multiselect.defaults)
          ) {
            if (!$.jgrid._multiselect)
              return void alert(
                'Multiselect plugin loaded after jqGrid. Please load the plugin before the jqGrid!'
              );
            e.msel_opts = $.extend($.ui.multiselect.defaults, e.msel_opts);
          }
          e.caption && r.attr('title', e.caption),
            e.classname && (r.addClass(e.classname), a.addClass(e.classname)),
            e.width &&
              ($('>div', r).css({ width: e.width, margin: '0 auto' }),
              a.css('width', e.width)),
            e.height &&
              ($('>div', r).css('height', e.height),
              a.css('height', e.height - 10)),
            a.empty(),
            $.each(h, function (e) {
              return (
                (c[this.name] = e),
                this.hidedlg
                  ? void (this.hidden || u.push(e))
                  : void a.append(
                      "<option value='" +
                        e +
                        "' " +
                        (this.hidden ? '' : "selected='selected'") +
                        '>' +
                        $.jgrid.stripHtml(g[e]) +
                        '</option>'
                    )
              );
            }),
            (o = $.isFunction(e.dlog_opts)
              ? e.dlog_opts.call(p, e)
              : e.dlog_opts),
            i(e.dlog, r, o),
            (s = $.isFunction(e.msel_opts)
              ? e.msel_opts.call(p, e)
              : e.msel_opts),
            i(e.msel, a, s),
            (n = $('#colchooser_' + $.jgrid.jqID(p[0].p.id))),
            n.css({ margin: 'auto' }),
            n
              .find('>div')
              .css({ width: '100%', height: '100%', margin: 'auto' }),
            (d = f(a)),
            d.container.css({ width: '100%', height: '100%', margin: 'auto' }),
            d.selectedContainer.css({
              width: 100 * d.options.dividerLocation + '%',
              height: '100%',
              margin: 'auto',
              boxSizing: 'border-box',
            }),
            d.availableContainer.css({
              width: 100 - 100 * d.options.dividerLocation + '%',
              height: '100%',
              margin: 'auto',
              boxSizing: 'border-box',
            }),
            d.selectedList.css('height', 'auto'),
            d.availableList.css('height', 'auto'),
            (l = Math.max(d.selectedList.height(), d.availableList.height())),
            (l = Math.min(l, $(window).height())),
            d.selectedList.css('height', l),
            d.availableList.css('height', l);
        }
      },
      sortableRows: function (e) {
        return this.each(function () {
          var t = this;
          t.grid &&
            (t.p.treeGrid ||
              ($.fn.sortable &&
                ((e = $.extend(
                  { cursor: 'move', axis: 'y', items: '.jqgrow' },
                  e || {}
                )),
                e.start && $.isFunction(e.start)
                  ? ((e._start_ = e.start), delete e.start)
                  : (e._start_ = !1),
                e.update && $.isFunction(e.update)
                  ? ((e._update_ = e.update), delete e.update)
                  : (e._update_ = !1),
                (e.start = function (i, r) {
                  if (
                    ($(r.item).css('border-width', '0'),
                    $('td', r.item).each(function (e) {
                      this.style.width = t.grid.cols[e].style.width;
                    }),
                    t.p.subGrid)
                  ) {
                    var a = $(r.item).attr('id');
                    try {
                      $(t).jqGrid('collapseSubGridRow', a);
                    } catch (o) {}
                  }
                  e._start_ && e._start_.apply(this, [i, r]);
                }),
                (e.update = function (i, r) {
                  $(r.item).css('border-width', ''),
                    t.p.rownumbers === !0 &&
                      $('td.jqgrid-rownum', t.rows).each(function (e) {
                        $(this).html(
                          e +
                            1 +
                            (parseInt(t.p.page, 10) - 1) *
                              parseInt(t.p.rowNum, 10)
                        );
                      }),
                    e._update_ && e._update_.apply(this, [i, r]);
                }),
                $('tbody:first', t).sortable(e),
                $('tbody:first', t).disableSelection())));
        });
      },
      gridDnD: function (e) {
        return this.each(function () {
          function t() {
            var e = $.data(a, 'dnd');
            $('tr.jqgrow:not(.ui-draggable)', a).draggable(
              $.isFunction(e.drag) ? e.drag.call($(a), e) : e.drag
            );
          }
          var i,
            r,
            a = this;
          if (a.grid && !a.p.treeGrid && $.fn.draggable && $.fn.droppable) {
            var o = "<table id='jqgrid_dnd' class='ui-jqgrid-dnd'></table>";
            if (
              (void 0 === $('#jqgrid_dnd')[0] && $('body').append(o),
              'string' == typeof e && 'updateDnD' === e && a.p.jqgdnd === !0)
            )
              return void t();
            if (
              ((e = $.extend(
                {
                  drag: function (e) {
                    return $.extend(
                      {
                        start: function (t, i) {
                          var r, o;
                          if (a.p.subGrid) {
                            o = $(i.helper).attr('id');
                            try {
                              $(a).jqGrid('collapseSubGridRow', o);
                            } catch (s) {}
                          }
                          for (
                            r = 0;
                            r < $.data(a, 'dnd').connectWith.length;
                            r++
                          )
                            0 ===
                              $($.data(a, 'dnd').connectWith[r]).jqGrid(
                                'getGridParam',
                                'reccount'
                              ) &&
                              $($.data(a, 'dnd').connectWith[r]).jqGrid(
                                'addRowData',
                                'jqg_empty_row',
                                {}
                              );
                          i.helper.addClass('ui-state-highlight'),
                            $('td', i.helper).each(function (e) {
                              this.style.width = a.grid.headers[e].width + 'px';
                            }),
                            e.onstart &&
                              $.isFunction(e.onstart) &&
                              e.onstart.call($(a), t, i);
                        },
                        stop: function (t, i) {
                          var r, o;
                          for (
                            i.helper.dropped &&
                              !e.dragcopy &&
                              ((o = $(i.helper).attr('id')),
                              void 0 === o && (o = $(this).attr('id')),
                              $(a).jqGrid('delRowData', o)),
                              r = 0;
                            r < $.data(a, 'dnd').connectWith.length;
                            r++
                          )
                            $($.data(a, 'dnd').connectWith[r]).jqGrid(
                              'delRowData',
                              'jqg_empty_row'
                            );
                          e.onstop &&
                            $.isFunction(e.onstop) &&
                            e.onstop.call($(a), t, i);
                        },
                      },
                      e.drag_opts || {}
                    );
                  },
                  drop: function (e) {
                    return $.extend(
                      {
                        accept: function (e) {
                          if (!$(e).hasClass('jqgrow')) return e;
                          var t = $(e).closest('table.ui-jqgrid-btable');
                          if (t.length > 0 && void 0 !== $.data(t[0], 'dnd')) {
                            var i = $.data(t[0], 'dnd').connectWith;
                            return -1 !==
                              $.inArray('#' + $.jgrid.jqID(this.id), i)
                              ? !0
                              : !1;
                          }
                          return !1;
                        },
                        drop: function (t, i) {
                          if ($(i.draggable).hasClass('jqgrow')) {
                            var r = $(i.draggable).attr('id'),
                              o = i.draggable
                                .parent()
                                .parent()
                                .jqGrid('getRowData', r);
                            if (!e.dropbyname) {
                              var s,
                                n,
                                d = 0,
                                l = {},
                                p = $('#' + $.jgrid.jqID(this.id)).jqGrid(
                                  'getGridParam',
                                  'colModel'
                                );
                              try {
                                for (n in o)
                                  o.hasOwnProperty(n) &&
                                    ((s = p[d].name),
                                    'cb' !== s &&
                                      'rn' !== s &&
                                      'subgrid' !== s &&
                                      o.hasOwnProperty(n) &&
                                      p[d] &&
                                      (l[s] = o[n]),
                                    d++);
                                o = l;
                              } catch (c) {}
                            }
                            if (
                              ((i.helper.dropped = !0),
                              e.beforedrop && $.isFunction(e.beforedrop))
                            ) {
                              var u = e.beforedrop.call(
                                this,
                                t,
                                i,
                                o,
                                $('#' + $.jgrid.jqID(a.p.id)),
                                $(this)
                              );
                              void 0 !== u &&
                                null !== u &&
                                'object' == typeof u &&
                                (o = u);
                            }
                            if (i.helper.dropped) {
                              var h;
                              e.autoid &&
                                ($.isFunction(e.autoid)
                                  ? (h = e.autoid.call(this, o))
                                  : ((h = Math.ceil(1e3 * Math.random())),
                                    (h = e.autoidprefix + h))),
                                $('#' + $.jgrid.jqID(this.id)).jqGrid(
                                  'addRowData',
                                  h,
                                  o,
                                  e.droppos
                                );
                            }
                            e.ondrop &&
                              $.isFunction(e.ondrop) &&
                              e.ondrop.call(this, t, i, o);
                          }
                        },
                      },
                      e.drop_opts || {}
                    );
                  },
                  onstart: null,
                  onstop: null,
                  beforedrop: null,
                  ondrop: null,
                  drop_opts: {
                    activeClass: 'ui-state-active',
                    hoverClass: 'ui-state-hover',
                  },
                  drag_opts: {
                    revert: 'invalid',
                    helper: 'clone',
                    cursor: 'move',
                    appendTo: '#jqgrid_dnd',
                    zIndex: 5e3,
                  },
                  dragcopy: !1,
                  dropbyname: !1,
                  droppos: 'first',
                  autoid: !0,
                  autoidprefix: 'dnd_',
                },
                e || {}
              )),
              e.connectWith)
            )
              for (
                e.connectWith = e.connectWith.split(','),
                  e.connectWith = $.map(e.connectWith, function (e) {
                    return $.trim(e);
                  }),
                  $.data(a, 'dnd', e),
                  0 === a.p.reccount || a.p.jqgdnd || t(),
                  a.p.jqgdnd = !0,
                  i = 0;
                i < e.connectWith.length;
                i++
              )
                (r = e.connectWith[i]),
                  $(r).droppable(
                    $.isFunction(e.drop) ? e.drop.call($(a), e) : e.drop
                  );
          }
        });
      },
      gridResize: function (opts) {
        return this.each(function () {
          var $t = this,
            gID = $.jgrid.jqID($t.p.id);
          if ($t.grid && $.fn.resizable) {
            if (
              ((opts = $.extend({}, opts || {})),
              opts.alsoResize
                ? ((opts._alsoResize_ = opts.alsoResize),
                  delete opts.alsoResize)
                : (opts._alsoResize_ = !1),
              opts.stop && $.isFunction(opts.stop)
                ? ((opts._stop_ = opts.stop), delete opts.stop)
                : (opts._stop_ = !1),
              (opts.stop = function (e, t) {
                $($t).jqGrid('setGridParam', {
                  height: $('#gview_' + gID + ' .ui-jqgrid-bdiv').height(),
                }),
                  $($t).jqGrid('setGridWidth', t.size.width, opts.shrinkToFit),
                  opts._stop_ && opts._stop_.call($t, e, t);
              }),
              opts._alsoResize_)
            ) {
              var optstest =
                "{'#gview_" +
                gID +
                " .ui-jqgrid-bdiv':true,'" +
                opts._alsoResize_ +
                "':true}";
              opts.alsoResize = eval('(' + optstest + ')');
            } else opts.alsoResize = $('.ui-jqgrid-bdiv', '#gview_' + gID);
            delete opts._alsoResize_, $('#gbox_' + gID).resizable(opts);
          }
        });
      },
    });
  })(jQuery),
  (function (e) {
    'use strict';
    function t(e, t) {
      var i,
        r,
        a,
        o = [];
      if (!this || 'function' != typeof e || e instanceof RegExp)
        throw new TypeError();
      for (a = this.length, i = 0; a > i; i++)
        if (this.hasOwnProperty(i) && ((r = this[i]), e.call(t, r, i, this))) {
          o.push(r);
          break;
        }
      return o;
    }
    (e.assocArraySize = function (e) {
      var t,
        i = 0;
      for (t in e) e.hasOwnProperty(t) && i++;
      return i;
    }),
      e.jgrid.extend({
        pivotSetup: function (i, r) {
          var a = [],
            o = [],
            s = [],
            n = [],
            d = [],
            l = {
              grouping: !0,
              groupingView: {
                groupField: [],
                groupSummary: [],
                groupSummaryPos: [],
              },
            },
            p = [],
            c = e.extend(
              {
                rowTotals: !1,
                rowTotalsText: 'Total',
                colTotals: !1,
                groupSummary: !0,
                groupSummaryPos: 'header',
                frozenStaticCols: !1,
              },
              r || {}
            );
          return (
            this.each(function () {
              function r(e, i, r) {
                var a;
                return (a = t.call(e, i, r)), a.length > 0 ? a[0] : null;
              }
              function u(e, t) {
                var i,
                  r = 0,
                  a = !0;
                for (i in e) {
                  if (e[i] != this[r]) {
                    a = !1;
                    break;
                  }
                  if ((r++, r >= this.length)) break;
                }
                return a && (v = t), a;
              }
              function h(e, t, i, r) {
                var a;
                switch (e) {
                  case 'sum':
                    a = parseFloat(t || 0) + parseFloat(r[i] || 0);
                    break;
                  case 'count':
                    ('' === t || null == t) && (t = 0),
                      (a = r.hasOwnProperty(i) ? t + 1 : 0);
                    break;
                  case 'min':
                    a =
                      '' === t || null == t
                        ? parseFloat(r[i] || 0)
                        : Math.min(parseFloat(t), parseFloat(r[i] || 0));
                    break;
                  case 'max':
                    a =
                      '' === t || null == t
                        ? parseFloat(r[i] || 0)
                        : Math.max(parseFloat(t), parseFloat(r[i] || 0));
                }
                return a;
              }
              function g(t, i, r, a) {
                var o,
                  s,
                  l,
                  p,
                  c = i.length,
                  u = '',
                  g = [];
                for (
                  e.isArray(r)
                    ? ((p = r.length), (g = r))
                    : ((p = 1), (g[0] = r)),
                    n = [],
                    d = [],
                    n.root = 0,
                    l = 0;
                  p > l;
                  l++
                ) {
                  var f,
                    m = [];
                  for (o = 0; c > o; o++) {
                    if (null == r)
                      (s = e.trim(i[o].member) + '_' + i[o].aggregator),
                        (f = s),
                        (g[0] = f);
                    else {
                      f = r[l].replace(/\s+/g, '');
                      try {
                        s =
                          1 === c
                            ? u + f
                            : u + f + '_' + i[o].aggregator + '_' + String(o);
                      } catch (v) {}
                    }
                    (s = isNaN(parseInt(s, 10)) ? s : s + ' '),
                      (a[s] = m[s] = h(i[o].aggregator, a[s], i[o].member, t)),
                      1 >= l && '_r_Totals' !== f && '' === u && (u = f);
                  }
                  (n[s] = m), (d[s] = g[l]);
                }
                return a;
              }
              function f(e) {
                var t, i, r, o, s;
                for (r in e)
                  if (e.hasOwnProperty(r)) {
                    if ('object' != typeof e[r]) {
                      if ('level' === r) {
                        if (
                          (void 0 === A[e.level] &&
                            ((A[e.level] = ''),
                            e.level > 0 &&
                              '_r_Totals' !== e.text &&
                              (p[e.level - 1] = {
                                useColSpanStyle: !1,
                                groupHeaders: [],
                              })),
                          A[e.level] !== e.text &&
                            e.children.length &&
                            '_r_Totals' !== e.text &&
                            e.level > 0)
                        ) {
                          p[e.level - 1].groupHeaders.push({
                            titleText: e.label,
                            numberOfColumns: 0,
                          });
                          var n = p[e.level - 1].groupHeaders.length - 1,
                            d = 0 === n ? E : P + y;
                          if (e.level - 1 === (c.rowTotals ? 1 : 0) && n > 0) {
                            var l =
                              p[e.level - 1].groupHeaders[n - 1]
                                .numberOfColumns;
                            l && (d = l + 1 + c.aggregates.length);
                          }
                          (p[e.level - 1].groupHeaders[n].startColumnName =
                            a[d].name),
                            (p[e.level - 1].groupHeaders[n].numberOfColumns =
                              a.length - d),
                            (P = a.length);
                        }
                        A[e.level] = e.text;
                      }
                      if (e.level === w && 'level' === r && w > 0)
                        if (y > 1) {
                          var u = 1;
                          for (t in e.fields)
                            1 === u &&
                              p[w - 1].groupHeaders.push({
                                startColumnName: t,
                                numberOfColumns: 1,
                                titleText: e.text,
                              }),
                              u++;
                          p[w - 1].groupHeaders[
                            p[w - 1].groupHeaders.length - 1
                          ].numberOfColumns = u - 1;
                        } else p.splice(w - 1, 1);
                    }
                    if (
                      (null != e[r] && 'object' == typeof e[r] && f(e[r]),
                      'level' === r && e.level > 0)
                    ) {
                      i = 0;
                      for (t in e.fields)
                        if (e.fields.hasOwnProperty(t)) {
                          s = {};
                          for (o in c.aggregates[i])
                            if (c.aggregates[i].hasOwnProperty(o))
                              switch (o) {
                                case 'member':
                                case 'label':
                                case 'aggregator':
                                  break;
                                default:
                                  s[o] = c.aggregates[i][o];
                              }
                          y > 1
                            ? ((s.name = t),
                              (s.label = c.aggregates[i].label || e.label))
                            : ((s.name = e.text),
                              (s.label =
                                '_r_Totals' === e.text
                                  ? c.rowTotalsText
                                  : e.label)),
                            a.push(s),
                            i++;
                        }
                    }
                  }
              }
              var m,
                v,
                j,
                b,
                w,
                y,
                x,
                q,
                D = i.length,
                $ = 0;
              if (c.rowTotals && c.yDimension.length > 0) {
                var _ = c.yDimension[0].dataName;
                c.yDimension.splice(0, 0, { dataName: _ }),
                  (c.yDimension[0].converter = function () {
                    return '_r_Totals';
                  });
              }
              if (
                ((b = e.isArray(c.xDimension) ? c.xDimension.length : 0),
                (w = c.yDimension.length),
                (y = e.isArray(c.aggregates) ? c.aggregates.length : 0),
                0 === b || 0 === y)
              )
                throw 'xDimension or aggregates optiona are not set!';
              var C;
              for (j = 0; b > j; j++)
                (C = {
                  name: c.xDimension[j].dataName,
                  frozen: c.frozenStaticCols,
                }),
                  null == c.xDimension[j].isGroupField &&
                    (c.xDimension[j].isGroupField = !0),
                  (C = e.extend(!0, C, c.xDimension[j])),
                  a.push(C);
              for (var G = b - 1, I = {}; D > $; ) {
                m = i[$];
                var F = [],
                  S = [];
                (x = {}), (j = 0);
                do
                  (F[j] = e.trim(m[c.xDimension[j].dataName])),
                    (x[c.xDimension[j].dataName] = F[j]),
                    j++;
                while (b > j);
                var k = 0;
                if (((v = -1), (q = r(o, u, F)))) {
                  if (v >= 0) {
                    if (((k = 0), w >= 1)) {
                      for (k = 0; w > k; k++)
                        (S[k] = e.trim(m[c.yDimension[k].dataName])),
                          c.yDimension[k].converter &&
                            e.isFunction(c.yDimension[k].converter) &&
                            (S[k] = c.yDimension[k].converter.call(
                              this,
                              S[k],
                              F,
                              S
                            ));
                      q = g(m, c.aggregates, S, q);
                    } else 0 === w && (q = g(m, c.aggregates, null, q));
                    o[v] = q;
                  }
                } else {
                  if (((k = 0), w >= 1)) {
                    for (k = 0; w > k; k++)
                      (S[k] = e.trim(m[c.yDimension[k].dataName])),
                        c.yDimension[k].converter &&
                          e.isFunction(c.yDimension[k].converter) &&
                          (S[k] = c.yDimension[k].converter.call(
                            this,
                            S[k],
                            F,
                            S
                          ));
                    x = g(m, c.aggregates, S, x);
                  } else 0 === w && (x = g(m, c.aggregates, null, x));
                  o.push(x);
                }
                var R,
                  M = 0,
                  N = null,
                  O = null;
                for (R in n)
                  if (n.hasOwnProperty(R)) {
                    if (0 === M)
                      (I.children && void 0 !== I.children) ||
                        (I = { text: R, level: 0, children: [], label: R }),
                        (N = I.children);
                    else {
                      for (O = null, j = 0; j < N.length; j++)
                        if (N[j].text === R) {
                          O = N[j];
                          break;
                        }
                      O
                        ? (N = O.children)
                        : (N.push({
                            children: [],
                            text: R,
                            level: M,
                            fields: n[R],
                            label: d[R],
                          }),
                          (N = N[N.length - 1].children));
                    }
                    M++;
                  }
                $++;
              }
              var A = [],
                P = a.length,
                E = P;
              w > 0 && (p[w - 1] = { useColSpanStyle: !1, groupHeaders: [] }),
                f(I);
              var T;
              if (c.colTotals)
                for (var z = o.length; z--; )
                  for (j = b; j < a.length; j++)
                    (T = a[j].name),
                      s[T]
                        ? (s[T] += parseFloat(o[z][T] || 0))
                        : (s[T] = parseFloat(o[z][T] || 0));
              if (G > 0)
                for (j = 0; G > j; j++)
                  a[j].isGroupField &&
                    (l.groupingView.groupField.push(a[j].name),
                    l.groupingView.groupSummary.push(c.groupSummary),
                    l.groupingView.groupSummaryPos.push(c.groupSummaryPos));
              else l.grouping = !1;
              (l.sortname = a[G].name), (l.groupingView.hideFirstGroupCol = !0);
            }),
            {
              colModel: a,
              rows: o,
              groupOptions: l,
              groupHeaders: p,
              summary: s,
            }
          );
        },
        jqPivot: function (t, i, r, a) {
          return this.each(function () {
            function o(t) {
              var a,
                o = jQuery(s).jqGrid('pivotSetup', t, i),
                n = e.assocArraySize(o.summary) > 0 ? !0 : !1,
                d = e.jgrid.from(o.rows);
              for (
                a = 0;
                a < o.groupOptions.groupingView.groupField.length;
                a++
              )
                d.orderBy(
                  o.groupOptions.groupingView.groupField[a],
                  'a',
                  'text',
                  ''
                );
              jQuery(s).jqGrid(
                e.extend(
                  !0,
                  {
                    datastr: e.extend(
                      d.select(),
                      n ? { userdata: o.summary } : {}
                    ),
                    datatype: 'jsonstring',
                    footerrow: n,
                    userDataOnFooter: n,
                    colModel: o.colModel,
                    viewrecords: !0,
                    sortname: i.xDimension[0].dataName,
                  },
                  o.groupOptions,
                  r || {}
                )
              );
              var l = o.groupHeaders;
              if (l.length)
                for (a = 0; a < l.length; a++)
                  l[a] &&
                    l[a].groupHeaders.length &&
                    jQuery(s).jqGrid('setGroupHeaders', l[a]);
              i.frozenStaticCols && jQuery(s).jqGrid('setFrozenColumns');
            }
            var s = this;
            'string' == typeof t
              ? e.ajax(
                  e.extend(
                    {
                      url: t,
                      dataType: 'json',
                      success: function (t) {
                        o(
                          e.jgrid.getAccessor(
                            t,
                            a && a.reader ? a.reader : 'rows'
                          )
                        );
                      },
                    },
                    a || {}
                  )
                )
              : o(t);
          });
        },
      });
  })(jQuery),
  (function (e) {
    'use strict';
    e.jgrid.extend({
      setSubGrid: function () {
        return this.each(function () {
          var t,
            i,
            r = this,
            a = {
              plusicon: 'ui-icon-plus',
              minusicon: 'ui-icon-minus',
              openicon: 'ui-icon-carat-1-sw',
              expandOnLoad: !1,
              delayOnLoad: 50,
              selectOnExpand: !1,
              selectOnCollapse: !1,
              reloadOnExpand: !0,
            };
          if (
            ((r.p.subGridOptions = e.extend(a, r.p.subGridOptions || {})),
            r.p.colNames.unshift(''),
            r.p.colModel.unshift({
              name: 'subgrid',
              width: e.jgrid.cell_width
                ? r.p.subGridWidth + r.p.cellLayout
                : r.p.subGridWidth,
              sortable: !1,
              resizable: !1,
              hidedlg: !0,
              search: !1,
              fixed: !0,
            }),
            (t = r.p.subGridModel),
            t[0])
          )
            for (
              t[0].align = e.extend([], t[0].align || []), i = 0;
              i < t[0].name.length;
              i++
            )
              t[0].align[i] = t[0].align[i] || 'left';
        });
      },
      addSubGridCell: function (e, t) {
        var i,
          r,
          a = '';
        return (
          this.each(function () {
            (a = this.formatCol(e, t)),
              (r = this.p.id),
              (i = this.p.subGridOptions.plusicon);
          }),
          '<td role="gridcell" aria-describedby="' +
            r +
            '_subgrid" class="ui-sgcollapsed sgcollapsed" ' +
            a +
            "><a style='cursor:pointer;'><span class='ui-icon " +
            i +
            "'></span></a></td>"
        );
      },
      addSubGrid: function (t, i) {
        return this.each(function () {
          var r = this;
          if (r.grid) {
            var a,
              o,
              s,
              n,
              d,
              l = function (t, i, a) {
                var o = e(
                  "<td align='" + r.p.subGridModel[0].align[a] + "'></td>"
                ).html(i);
                e(t).append(o);
              },
              p = function (t, i) {
                var a,
                  o,
                  s,
                  n = e(
                    "<table cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>"
                  ),
                  d = e('<tr></tr>');
                for (o = 0; o < r.p.subGridModel[0].name.length; o++)
                  (a = e(
                    "<th class='ui-state-default ui-th-subgrid ui-th-column ui-th-" +
                      r.p.direction +
                      "'></th>"
                  )),
                    e(a).html(r.p.subGridModel[0].name[o]),
                    e(a).width(r.p.subGridModel[0].width[o]),
                    e(d).append(a);
                e(n).append(d),
                  t &&
                    ((s = r.p.xmlReader.subgrid),
                    e(s.root + ' ' + s.row, t).each(function () {
                      if (
                        ((d = e(
                          "<tr class='ui-widget-content ui-subtblcell'></tr>"
                        )),
                        s.repeatitems === !0)
                      )
                        e(s.cell, this).each(function (t) {
                          l(d, e(this).text() || '&#160;', t);
                        });
                      else {
                        var t =
                          r.p.subGridModel[0].mapping ||
                          r.p.subGridModel[0].name;
                        if (t)
                          for (o = 0; o < t.length; o++)
                            l(d, e(t[o], this).text() || '&#160;', o);
                      }
                      e(n).append(d);
                    }));
                var p = e('table:first', r.grid.bDiv).attr('id') + '_';
                return (
                  e('#' + e.jgrid.jqID(p + i)).append(n),
                  (r.grid.hDiv.loading = !1),
                  e('#load_' + e.jgrid.jqID(r.p.id)).hide(),
                  !1
                );
              },
              c = function (t, i) {
                var a,
                  o,
                  s,
                  n,
                  d,
                  p,
                  c = e(
                    "<table cellspacing='0' cellpadding='0' border='0'><tbody></tbody></table>"
                  ),
                  u = e('<tr></tr>');
                for (s = 0; s < r.p.subGridModel[0].name.length; s++)
                  (a = e(
                    "<th class='ui-state-default ui-th-subgrid ui-th-column ui-th-" +
                      r.p.direction +
                      "'></th>"
                  )),
                    e(a).html(r.p.subGridModel[0].name[s]),
                    e(a).width(r.p.subGridModel[0].width[s]),
                    e(u).append(a);
                if (
                  (e(c).append(u),
                  t &&
                    ((d = r.p.jsonReader.subgrid),
                    (o = e.jgrid.getAccessor(t, d.root)),
                    void 0 !== o))
                )
                  for (s = 0; s < o.length; s++) {
                    if (
                      ((n = o[s]),
                      (u = e(
                        "<tr class='ui-widget-content ui-subtblcell'></tr>"
                      )),
                      d.repeatitems === !0)
                    )
                      for (d.cell && (n = n[d.cell]), p = 0; p < n.length; p++)
                        l(u, n[p] || '&#160;', p);
                    else {
                      var h =
                        r.p.subGridModel[0].mapping || r.p.subGridModel[0].name;
                      if (h.length)
                        for (p = 0; p < h.length; p++)
                          l(u, n[h[p]] || '&#160;', p);
                    }
                    e(c).append(u);
                  }
                var g = e('table:first', r.grid.bDiv).attr('id') + '_';
                return (
                  e('#' + e.jgrid.jqID(g + i)).append(c),
                  (r.grid.hDiv.loading = !1),
                  e('#load_' + e.jgrid.jqID(r.p.id)).hide(),
                  !1
                );
              },
              u = function (t) {
                var i, a, o, s;
                if (
                  ((i = e(t).attr('id')),
                  (a = { nd_: new Date().getTime() }),
                  (a[r.p.prmNames.subgridid] = i),
                  !r.p.subGridModel[0])
                )
                  return !1;
                if (r.p.subGridModel[0].params)
                  for (s = 0; s < r.p.subGridModel[0].params.length; s++)
                    for (o = 0; o < r.p.colModel.length; o++)
                      r.p.colModel[o].name === r.p.subGridModel[0].params[s] &&
                        (a[r.p.colModel[o].name] = e('td:eq(' + o + ')', t)
                          .text()
                          .replace(/\&#160\;/gi, ''));
                if (!r.grid.hDiv.loading)
                  switch (
                    ((r.grid.hDiv.loading = !0),
                    e('#load_' + e.jgrid.jqID(r.p.id)).show(),
                    r.p.subgridtype || (r.p.subgridtype = r.p.datatype),
                    e.isFunction(r.p.subgridtype)
                      ? r.p.subgridtype.call(r, a)
                      : (r.p.subgridtype = r.p.subgridtype.toLowerCase()),
                    r.p.subgridtype)
                  ) {
                    case 'xml':
                    case 'json':
                      e.ajax(
                        e.extend(
                          {
                            type: r.p.mtype,
                            url: e.isFunction(r.p.subGridUrl)
                              ? r.p.subGridUrl.call(r, a)
                              : r.p.subGridUrl,
                            dataType: r.p.subgridtype,
                            data: e.isFunction(r.p.serializeSubGridData)
                              ? r.p.serializeSubGridData.call(r, a)
                              : a,
                            complete: function (t) {
                              'xml' === r.p.subgridtype
                                ? p(t.responseXML, i)
                                : c(e.jgrid.parse(t.responseText), i),
                                (t = null);
                            },
                          },
                          e.jgrid.ajaxOptions,
                          r.p.ajaxSubgridOptions || {}
                        )
                      );
                  }
                return !1;
              },
              h = 0;
            e.each(r.p.colModel, function () {
              (this.hidden === !0 ||
                'rn' === this.name ||
                'cb' === this.name) &&
                h++;
            });
            var g = r.rows.length,
              f = 1;
            for (void 0 !== i && i > 0 && ((f = i), (g = i + 1)); g > f; )
              e(r.rows[f]).hasClass('jqgrow') &&
                (r.p.scroll && e(r.rows[f].cells[t]).unbind('click'),
                e(r.rows[f].cells[t]).bind('click', function () {
                  var i = e(this).parent('tr')[0];
                  if (((d = i.nextSibling), e(this).hasClass('sgcollapsed'))) {
                    if (
                      ((o = r.p.id),
                      (a = i.id),
                      r.p.subGridOptions.reloadOnExpand === !0 ||
                        (r.p.subGridOptions.reloadOnExpand === !1 &&
                          !e(d).hasClass('ui-subgrid')))
                    ) {
                      if (
                        ((s =
                          t >= 1 ? "<td colspan='" + t + "'>&#160;</td>" : ''),
                        (n = e(r).triggerHandler('jqGridSubGridBeforeExpand', [
                          o + '_' + a,
                          a,
                        ])),
                        (n = n === !1 || 'stop' === n ? !1 : !0),
                        n &&
                          e.isFunction(r.p.subGridBeforeExpand) &&
                          (n = r.p.subGridBeforeExpand.call(r, o + '_' + a, a)),
                        n === !1)
                      )
                        return !1;
                      e(i).after(
                        "<tr role='row' class='ui-subgrid'>" +
                          s +
                          "<td class='ui-widget-content subgrid-cell'><span class='ui-icon " +
                          r.p.subGridOptions.openicon +
                          "'></span></td><td colspan='" +
                          parseInt(r.p.colNames.length - 1 - h, 10) +
                          "' class='ui-widget-content subgrid-data'><div id=" +
                          o +
                          '_' +
                          a +
                          " class='tablediv'></div></td></tr>"
                      ),
                        e(r).triggerHandler('jqGridSubGridRowExpanded', [
                          o + '_' + a,
                          a,
                        ]),
                        e.isFunction(r.p.subGridRowExpanded)
                          ? r.p.subGridRowExpanded.call(r, o + '_' + a, a)
                          : u(i);
                    } else e(d).show();
                    e(this)
                      .html(
                        "<a style='cursor:pointer;'><span class='ui-icon " +
                          r.p.subGridOptions.minusicon +
                          "'></span></a>"
                      )
                      .removeClass('sgcollapsed')
                      .addClass('sgexpanded'),
                      r.p.subGridOptions.selectOnExpand &&
                        e(r).jqGrid('setSelection', a);
                  } else if (e(this).hasClass('sgexpanded')) {
                    if (
                      ((n = e(r).triggerHandler('jqGridSubGridRowColapsed', [
                        o + '_' + a,
                        a,
                      ])),
                      (n = n === !1 || 'stop' === n ? !1 : !0),
                      (a = i.id),
                      n &&
                        e.isFunction(r.p.subGridRowColapsed) &&
                        (n = r.p.subGridRowColapsed.call(r, o + '_' + a, a)),
                      n === !1)
                    )
                      return !1;
                    r.p.subGridOptions.reloadOnExpand === !0
                      ? e(d).remove('.ui-subgrid')
                      : e(d).hasClass('ui-subgrid') && e(d).hide(),
                      e(this)
                        .html(
                          "<a style='cursor:pointer;'><span class='ui-icon " +
                            r.p.subGridOptions.plusicon +
                            "'></span></a>"
                        )
                        .removeClass('sgexpanded')
                        .addClass('sgcollapsed'),
                      r.p.subGridOptions.selectOnCollapse &&
                        e(r).jqGrid('setSelection', a);
                  }
                  return !1;
                })),
                f++;
            r.p.subGridOptions.expandOnLoad === !0 &&
              e(r.rows)
                .filter('.jqgrow')
                .each(function (t, i) {
                  e(i.cells[0]).click();
                }),
              (r.subGridXml = function (e, t) {
                p(e, t);
              }),
              (r.subGridJson = function (e, t) {
                c(e, t);
              });
          }
        });
      },
      expandSubGridRow: function (t) {
        return this.each(function () {
          var i = this;
          if ((i.grid || t) && i.p.subGrid === !0) {
            var r = e(this).jqGrid('getInd', t, !0);
            if (r) {
              var a = e('td.sgcollapsed', r)[0];
              a && e(a).trigger('click');
            }
          }
        });
      },
      collapseSubGridRow: function (t) {
        return this.each(function () {
          var i = this;
          if ((i.grid || t) && i.p.subGrid === !0) {
            var r = e(this).jqGrid('getInd', t, !0);
            if (r) {
              var a = e('td.sgexpanded', r)[0];
              a && e(a).trigger('click');
            }
          }
        });
      },
      toggleSubGridRow: function (t) {
        return this.each(function () {
          var i = this;
          if ((i.grid || t) && i.p.subGrid === !0) {
            var r = e(this).jqGrid('getInd', t, !0);
            if (r) {
              var a = e('td.sgcollapsed', r)[0];
              a
                ? e(a).trigger('click')
                : ((a = e('td.sgexpanded', r)[0]), a && e(a).trigger('click'));
            }
          }
        });
      },
    });
  })(jQuery),
  (function (e) {
    'use strict';
    e.jgrid.extend({
      setTreeNode: function (t, i) {
        return this.each(function () {
          var r = this;
          if (r.grid && r.p.treeGrid)
            for (
              var a,
                o,
                s,
                n,
                d,
                l,
                p,
                c,
                u = r.p.expColInd,
                h = r.p.treeReader.expanded_field,
                g = r.p.treeReader.leaf_field,
                f = r.p.treeReader.level_field,
                m = r.p.treeReader.icon_field,
                v = r.p.treeReader.loaded;
              i > t;

            ) {
              var j,
                b = e.jgrid.stripPref(r.p.idPrefix, r.rows[t].id),
                w = r.p._index[b];
              if (
                ((p = r.p.data[w]),
                'nested' === r.p.treeGridModel &&
                  (p[g] ||
                    ((a = parseInt(p[r.p.treeReader.left_field], 10)),
                    (o = parseInt(p[r.p.treeReader.right_field], 10)),
                    (p[g] = o === a + 1 ? 'true' : 'false'),
                    (r.rows[t].cells[r.p._treeleafpos].innerHTML = p[g]))),
                (s = parseInt(p[f], 10)),
                0 === r.p.tree_root_level
                  ? ((n = s + 1), (d = s))
                  : ((n = s), (d = s - 1)),
                (l =
                  "<div class='tree-wrap tree-wrap-" +
                  r.p.direction +
                  "' style='width:" +
                  18 * n +
                  "px;'>"),
                (l +=
                  "<div style='" +
                  ('rtl' === r.p.direction ? 'right:' : 'left:') +
                  18 * d +
                  "px;' class='ui-icon "),
                void 0 !== p[v] &&
                  (p[v] = 'true' === p[v] || p[v] === !0 ? !0 : !1),
                'true' === p[g] || p[g] === !0
                  ? ((l +=
                      (void 0 !== p[m] && '' !== p[m]
                        ? p[m]
                        : r.p.treeIcons.leaf) + ' tree-leaf treeclick'),
                    (p[g] = !0),
                    (c = 'leaf'))
                  : ((p[g] = !1), (c = '')),
                (p[h] =
                  ('true' === p[h] || p[h] === !0 ? !0 : !1) &&
                  (p[v] || void 0 === p[v])),
                (l +=
                  p[h] === !1
                    ? p[g] === !0
                      ? "'"
                      : r.p.treeIcons.plus + " tree-plus treeclick'"
                    : p[g] === !0
                      ? "'"
                      : r.p.treeIcons.minus + " tree-minus treeclick'"),
                (l += '></div></div>'),
                e(r.rows[t].cells[u])
                  .wrapInner("<span class='cell-wrapper" + c + "'></span>")
                  .prepend(l),
                s !== parseInt(r.p.tree_root_level, 10))
              ) {
                var y = e(r).jqGrid('getNodeParent', p);
                (j = y && y.hasOwnProperty(h) ? y[h] : !0),
                  j || e(r.rows[t]).css('display', 'none');
              }
              e(r.rows[t].cells[u])
                .find('div.treeclick')
                .bind('click', function (t) {
                  var i = t.target || t.srcElement,
                    a = e.jgrid.stripPref(
                      r.p.idPrefix,
                      e(i, r.rows).closest('tr.jqgrow')[0].id
                    ),
                    o = r.p._index[a];
                  return (
                    r.p.data[o][g] ||
                      (r.p.data[o][h]
                        ? (e(r).jqGrid('collapseRow', r.p.data[o]),
                          e(r).jqGrid('collapseNode', r.p.data[o]))
                        : (e(r).jqGrid('expandRow', r.p.data[o]),
                          e(r).jqGrid('expandNode', r.p.data[o]))),
                    !1
                  );
                }),
                r.p.ExpandColClick === !0 &&
                  e(r.rows[t].cells[u])
                    .find('span.cell-wrapper')
                    .css('cursor', 'pointer')
                    .bind('click', function (t) {
                      var i = t.target || t.srcElement,
                        a = e.jgrid.stripPref(
                          r.p.idPrefix,
                          e(i, r.rows).closest('tr.jqgrow')[0].id
                        ),
                        o = r.p._index[a];
                      return (
                        r.p.data[o][g] ||
                          (r.p.data[o][h]
                            ? (e(r).jqGrid('collapseRow', r.p.data[o]),
                              e(r).jqGrid('collapseNode', r.p.data[o]))
                            : (e(r).jqGrid('expandRow', r.p.data[o]),
                              e(r).jqGrid('expandNode', r.p.data[o]))),
                        e(r).jqGrid('setSelection', a),
                        !1
                      );
                    }),
                t++;
            }
        });
      },
      setTreeGrid: function () {
        return this.each(function () {
          var t,
            i,
            r,
            a,
            o = this,
            s = 0,
            n = !1,
            d = [];
          if (o.p.treeGrid) {
            o.p.treedatatype || e.extend(o.p, { treedatatype: o.p.datatype }),
              (o.p.subGrid = !1),
              (o.p.altRows = !1),
              (o.p.pgbuttons = !1),
              (o.p.pginput = !1),
              (o.p.gridview = !0),
              null === o.p.rowTotal && (o.p.rowNum = 1e4),
              (o.p.multiselect = !1),
              (o.p.rowList = []),
              (o.p.expColInd = 0),
              (t =
                'ui-icon-triangle-1-' + ('rtl' === o.p.direction ? 'w' : 'e')),
              (o.p.treeIcons = e.extend(
                {
                  plus: t,
                  minus: 'ui-icon-triangle-1-s',
                  leaf: 'ui-icon-radio-off',
                },
                o.p.treeIcons || {}
              )),
              'nested' === o.p.treeGridModel
                ? (o.p.treeReader = e.extend(
                    {
                      level_field: 'level',
                      left_field: 'lft',
                      right_field: 'rgt',
                      leaf_field: 'isLeaf',
                      expanded_field: 'expanded',
                      loaded: 'loaded',
                      icon_field: 'icon',
                    },
                    o.p.treeReader
                  ))
                : 'adjacency' === o.p.treeGridModel &&
                  (o.p.treeReader = e.extend(
                    {
                      level_field: 'level',
                      parent_id_field: 'parent',
                      leaf_field: 'isLeaf',
                      expanded_field: 'expanded',
                      loaded: 'loaded',
                      icon_field: 'icon',
                    },
                    o.p.treeReader
                  ));
            for (r in o.p.colModel)
              if (o.p.colModel.hasOwnProperty(r)) {
                (i = o.p.colModel[r].name),
                  i !== o.p.ExpandColumn ||
                    n ||
                    ((n = !0), (o.p.expColInd = s)),
                  s++;
                for (a in o.p.treeReader)
                  o.p.treeReader.hasOwnProperty(a) &&
                    o.p.treeReader[a] === i &&
                    d.push(i);
              }
            e.each(o.p.treeReader, function (t, i) {
              i &&
                -1 === e.inArray(i, d) &&
                ('leaf_field' === t && (o.p._treeleafpos = s),
                s++,
                o.p.colNames.push(i),
                o.p.colModel.push({
                  name: i,
                  width: 1,
                  hidden: !0,
                  sortable: !1,
                  resizable: !1,
                  hidedlg: !0,
                  editable: !0,
                  search: !1,
                }));
            });
          }
        });
      },
      expandRow: function (t) {
        this.each(function () {
          var i = this;
          if (i.grid && i.p.treeGrid) {
            var r = e(i).jqGrid('getNodeChildren', t),
              a = i.p.treeReader.expanded_field;
            e(r).each(function () {
              var t =
                i.p.idPrefix + e.jgrid.getAccessor(this, i.p.localReader.id);
              e(e(i).jqGrid('getGridRowById', t)).css('display', ''),
                this[a] && e(i).jqGrid('expandRow', this);
            });
          }
        });
      },
      collapseRow: function (t) {
        this.each(function () {
          var i = this;
          if (i.grid && i.p.treeGrid) {
            var r = e(i).jqGrid('getNodeChildren', t),
              a = i.p.treeReader.expanded_field;
            e(r).each(function () {
              var t =
                i.p.idPrefix + e.jgrid.getAccessor(this, i.p.localReader.id);
              e(e(i).jqGrid('getGridRowById', t)).css('display', 'none'),
                this[a] && e(i).jqGrid('collapseRow', this);
            });
          }
        });
      },
      getRootNodes: function () {
        var t = [];
        return (
          this.each(function () {
            var i = this;
            if (i.grid && i.p.treeGrid)
              switch (i.p.treeGridModel) {
                case 'nested':
                  var r = i.p.treeReader.level_field;
                  e(i.p.data).each(function () {
                    parseInt(this[r], 10) ===
                      parseInt(i.p.tree_root_level, 10) && t.push(this);
                  });
                  break;
                case 'adjacency':
                  var a = i.p.treeReader.parent_id_field;
                  e(i.p.data).each(function () {
                    (null === this[a] ||
                      'null' === String(this[a]).toLowerCase()) &&
                      t.push(this);
                  });
              }
          }),
          t
        );
      },
      getNodeDepth: function (t) {
        var i = null;
        return (
          this.each(function () {
            if (this.grid && this.p.treeGrid) {
              var r = this;
              switch (r.p.treeGridModel) {
                case 'nested':
                  var a = r.p.treeReader.level_field;
                  i = parseInt(t[a], 10) - parseInt(r.p.tree_root_level, 10);
                  break;
                case 'adjacency':
                  i = e(r).jqGrid('getNodeAncestors', t).length;
              }
            }
          }),
          i
        );
      },
      getNodeParent: function (t) {
        var i = null;
        return (
          this.each(function () {
            var r = this;
            if (r.grid && r.p.treeGrid)
              switch (r.p.treeGridModel) {
                case 'nested':
                  var a = r.p.treeReader.left_field,
                    o = r.p.treeReader.right_field,
                    s = r.p.treeReader.level_field,
                    n = parseInt(t[a], 10),
                    d = parseInt(t[o], 10),
                    l = parseInt(t[s], 10);
                  e(this.p.data).each(function () {
                    return parseInt(this[s], 10) === l - 1 &&
                      parseInt(this[a], 10) < n &&
                      parseInt(this[o], 10) > d
                      ? ((i = this), !1)
                      : void 0;
                  });
                  break;
                case 'adjacency':
                  for (
                    var p = r.p.treeReader.parent_id_field,
                      c = r.p.localReader.id,
                      u = t[c],
                      h = r.p._index[u];
                    h--;

                  )
                    if (
                      r.p.data[h][c] === e.jgrid.stripPref(r.p.idPrefix, t[p])
                    ) {
                      i = r.p.data[h];
                      break;
                    }
              }
          }),
          i
        );
      },
      getNodeChildren: function (t) {
        var i = [];
        return (
          this.each(function () {
            var r = this;
            if (r.grid && r.p.treeGrid)
              switch (r.p.treeGridModel) {
                case 'nested':
                  var a = r.p.treeReader.left_field,
                    o = r.p.treeReader.right_field,
                    s = r.p.treeReader.level_field,
                    n = parseInt(t[a], 10),
                    d = parseInt(t[o], 10),
                    l = parseInt(t[s], 10);
                  e(this.p.data).each(function () {
                    parseInt(this[s], 10) === l + 1 &&
                      parseInt(this[a], 10) > n &&
                      parseInt(this[o], 10) < d &&
                      i.push(this);
                  });
                  break;
                case 'adjacency':
                  var p = r.p.treeReader.parent_id_field,
                    c = r.p.localReader.id;
                  e(this.p.data).each(function () {
                    this[p] == e.jgrid.stripPref(r.p.idPrefix, t[c]) &&
                      i.push(this);
                  });
              }
          }),
          i
        );
      },
      getFullTreeNode: function (t) {
        var i = [];
        return (
          this.each(function () {
            var r,
              a = this;
            if (a.grid && a.p.treeGrid)
              switch (a.p.treeGridModel) {
                case 'nested':
                  var o = a.p.treeReader.left_field,
                    s = a.p.treeReader.right_field,
                    n = a.p.treeReader.level_field,
                    d = parseInt(t[o], 10),
                    l = parseInt(t[s], 10),
                    p = parseInt(t[n], 10);
                  e(this.p.data).each(function () {
                    parseInt(this[n], 10) >= p &&
                      parseInt(this[o], 10) >= d &&
                      parseInt(this[o], 10) <= l &&
                      i.push(this);
                  });
                  break;
                case 'adjacency':
                  if (t) {
                    i.push(t);
                    var c = a.p.treeReader.parent_id_field,
                      u = a.p.localReader.id;
                    e(this.p.data).each(function (t) {
                      for (r = i.length, t = 0; r > t; t++)
                        if (
                          e.jgrid.stripPref(a.p.idPrefix, i[t][u]) === this[c]
                        ) {
                          i.push(this);
                          break;
                        }
                    });
                  }
              }
          }),
          i
        );
      },
      getNodeAncestors: function (t) {
        var i = [];
        return (
          this.each(function () {
            if (this.grid && this.p.treeGrid)
              for (var r = e(this).jqGrid('getNodeParent', t); r; )
                i.push(r), (r = e(this).jqGrid('getNodeParent', r));
          }),
          i
        );
      },
      isVisibleNode: function (t) {
        var i = !0;
        return (
          this.each(function () {
            var r = this;
            if (r.grid && r.p.treeGrid) {
              var a = e(r).jqGrid('getNodeAncestors', t),
                o = r.p.treeReader.expanded_field;
              e(a).each(function () {
                return (i = i && this[o]), i ? void 0 : !1;
              });
            }
          }),
          i
        );
      },
      isNodeLoaded: function (t) {
        var i;
        return (
          this.each(function () {
            var r = this;
            if (r.grid && r.p.treeGrid) {
              var a = r.p.treeReader.leaf_field,
                o = r.p.treeReader.loaded;
              i =
                void 0 !== t
                  ? void 0 !== t[o]
                    ? t[o]
                    : t[a] || e(r).jqGrid('getNodeChildren', t).length > 0
                      ? !0
                      : !1
                  : !1;
            }
          }),
          i
        );
      },
      expandNode: function (t) {
        return this.each(function () {
          if (this.grid && this.p.treeGrid) {
            var i = this.p.treeReader.expanded_field,
              r = this.p.treeReader.parent_id_field,
              a = this.p.treeReader.loaded,
              o = this.p.treeReader.level_field,
              s = this.p.treeReader.left_field,
              n = this.p.treeReader.right_field;
            if (!t[i]) {
              var d = e.jgrid.getAccessor(t, this.p.localReader.id),
                l = e(
                  '#' + this.p.idPrefix + e.jgrid.jqID(d),
                  this.grid.bDiv
                )[0],
                p = this.p._index[d];
              e(this).jqGrid('isNodeLoaded', this.p.data[p])
                ? ((t[i] = !0),
                  e('div.treeclick', l)
                    .removeClass(this.p.treeIcons.plus + ' tree-plus')
                    .addClass(this.p.treeIcons.minus + ' tree-minus'))
                : this.grid.hDiv.loading ||
                  ((t[i] = !0),
                  e('div.treeclick', l)
                    .removeClass(this.p.treeIcons.plus + ' tree-plus')
                    .addClass(this.p.treeIcons.minus + ' tree-minus'),
                  (this.p.treeANode = l.rowIndex),
                  (this.p.datatype = this.p.treedatatype),
                  'nested' === this.p.treeGridModel
                    ? e(this).jqGrid('setGridParam', {
                        postData: {
                          nodeid: d,
                          n_left: t[s],
                          n_right: t[n],
                          n_level: t[o],
                        },
                      })
                    : e(this).jqGrid('setGridParam', {
                        postData: { nodeid: d, parentid: t[r], n_level: t[o] },
                      }),
                  e(this).trigger('reloadGrid'),
                  (t[a] = !0),
                  'nested' === this.p.treeGridModel
                    ? e(this).jqGrid('setGridParam', {
                        postData: {
                          nodeid: '',
                          n_left: '',
                          n_right: '',
                          n_level: '',
                        },
                      })
                    : e(this).jqGrid('setGridParam', {
                        postData: { nodeid: '', parentid: '', n_level: '' },
                      }));
            }
          }
        });
      },
      collapseNode: function (t) {
        return this.each(function () {
          if (this.grid && this.p.treeGrid) {
            var i = this.p.treeReader.expanded_field;
            if (t[i]) {
              t[i] = !1;
              var r = e.jgrid.getAccessor(t, this.p.localReader.id),
                a = e(
                  '#' + this.p.idPrefix + e.jgrid.jqID(r),
                  this.grid.bDiv
                )[0];
              e('div.treeclick', a)
                .removeClass(this.p.treeIcons.minus + ' tree-minus')
                .addClass(this.p.treeIcons.plus + ' tree-plus');
            }
          }
        });
      },
      SortTree: function (t, i, r, a) {
        return this.each(function () {
          if (this.grid && this.p.treeGrid) {
            var o,
              s,
              n,
              d,
              l,
              p = [],
              c = this,
              u = e(this).jqGrid('getRootNodes');
            for (
              d = e.jgrid.from(u),
                d.orderBy(t, i, r, a),
                l = d.select(),
                o = 0,
                s = l.length;
              s > o;
              o++
            )
              (n = l[o]),
                p.push(n),
                e(this).jqGrid('collectChildrenSortTree', p, n, t, i, r, a);
            e.each(p, function (t) {
              var i = e.jgrid.getAccessor(this, c.p.localReader.id);
              e('#' + e.jgrid.jqID(c.p.id) + ' tbody tr:eq(' + t + ')').after(
                e('tr#' + e.jgrid.jqID(i), c.grid.bDiv)
              );
            }),
              (d = null),
              (l = null),
              (p = null);
          }
        });
      },
      collectChildrenSortTree: function (t, i, r, a, o, s) {
        return this.each(function () {
          if (this.grid && this.p.treeGrid) {
            var n, d, l, p, c, u;
            for (
              p = e(this).jqGrid('getNodeChildren', i),
                c = e.jgrid.from(p),
                c.orderBy(r, a, o, s),
                u = c.select(),
                n = 0,
                d = u.length;
              d > n;
              n++
            )
              (l = u[n]),
                t.push(l),
                e(this).jqGrid('collectChildrenSortTree', t, l, r, a, o, s);
          }
        });
      },
      setTreeRow: function (t, i) {
        var r = !1;
        return (
          this.each(function () {
            var a = this;
            a.grid && a.p.treeGrid && (r = e(a).jqGrid('setRowData', t, i));
          }),
          r
        );
      },
      delTreeNode: function (t) {
        return this.each(function () {
          var i,
            r,
            a,
            o,
            s,
            n = this,
            d = n.p.localReader.id,
            l = n.p.treeReader.left_field,
            p = n.p.treeReader.right_field;
          if (n.grid && n.p.treeGrid) {
            var c = n.p._index[t];
            if (void 0 !== c) {
              (r = parseInt(n.p.data[c][p], 10)),
                (a = r - parseInt(n.p.data[c][l], 10) + 1);
              var u = e(n).jqGrid('getFullTreeNode', n.p.data[c]);
              if (u.length > 0)
                for (i = 0; i < u.length; i++)
                  e(n).jqGrid('delRowData', u[i][d]);
              if ('nested' === n.p.treeGridModel) {
                if (
                  ((o = e.jgrid
                    .from(n.p.data)
                    .greater(l, r, { stype: 'integer' })
                    .select()),
                  o.length)
                )
                  for (s in o)
                    o.hasOwnProperty(s) &&
                      (o[s][l] = parseInt(o[s][l], 10) - a);
                if (
                  ((o = e.jgrid
                    .from(n.p.data)
                    .greater(p, r, { stype: 'integer' })
                    .select()),
                  o.length)
                )
                  for (s in o)
                    o.hasOwnProperty(s) &&
                      (o[s][p] = parseInt(o[s][p], 10) - a);
              }
            }
          }
        });
      },
      addChildNode: function (t, i, r, a) {
        var o = this[0];
        if (r) {
          var s,
            n,
            d,
            l,
            p,
            c,
            u,
            h,
            g = o.p.treeReader.expanded_field,
            f = o.p.treeReader.leaf_field,
            m = o.p.treeReader.level_field,
            v = o.p.treeReader.parent_id_field,
            j = o.p.treeReader.left_field,
            b = o.p.treeReader.right_field,
            w = o.p.treeReader.loaded,
            y = 0,
            x = i;
          if ((void 0 === a && (a = !1), null == t)) {
            if (((p = o.p.data.length - 1), p >= 0))
              for (; p >= 0; )
                (y = Math.max(
                  y,
                  parseInt(o.p.data[p][o.p.localReader.id], 10)
                )),
                  p--;
            t = y + 1;
          }
          var q = e(o).jqGrid('getInd', i);
          if (((u = !1), void 0 === i || null === i || '' === i))
            (i = null),
              (x = null),
              (s = 'last'),
              (l = o.p.tree_root_level),
              (p = o.p.data.length + 1);
          else {
            (s = 'after'),
              (n = o.p._index[i]),
              (d = o.p.data[n]),
              (i = d[o.p.localReader.id]),
              (l = parseInt(d[m], 10) + 1);
            var D = e(o).jqGrid('getFullTreeNode', d);
            D.length
              ? ((p = D[D.length - 1][o.p.localReader.id]),
                (x = p),
                (p = e(o).jqGrid('getInd', x) + 1))
              : (p = e(o).jqGrid('getInd', i) + 1),
              d[f] &&
                ((u = !0),
                (d[g] = !0),
                e(o.rows[q])
                  .find('span.cell-wrapperleaf')
                  .removeClass('cell-wrapperleaf')
                  .addClass('cell-wrapper')
                  .end()
                  .find('div.tree-leaf')
                  .removeClass(o.p.treeIcons.leaf + ' tree-leaf')
                  .addClass(o.p.treeIcons.minus + ' tree-minus'),
                (o.p.data[n][f] = !1),
                (d[w] = !0));
          }
          if (
            ((c = p + 1),
            void 0 === r[g] && (r[g] = !1),
            void 0 === r[w] && (r[w] = !1),
            (r[m] = l),
            void 0 === r[f] && (r[f] = !0),
            'adjacency' === o.p.treeGridModel && (r[v] = i),
            'nested' === o.p.treeGridModel)
          ) {
            var $, _, C;
            if (null !== i) {
              if (
                ((h = parseInt(d[b], 10)),
                ($ = e.jgrid.from(o.p.data)),
                ($ = $.greaterOrEquals(b, h, { stype: 'integer' })),
                (_ = $.select()),
                _.length)
              )
                for (C in _)
                  _.hasOwnProperty(C) &&
                    ((_[C][j] =
                      _[C][j] > h ? parseInt(_[C][j], 10) + 2 : _[C][j]),
                    (_[C][b] =
                      _[C][b] >= h ? parseInt(_[C][b], 10) + 2 : _[C][b]));
              (r[j] = h), (r[b] = h + 1);
            } else {
              if (
                ((h = parseInt(e(o).jqGrid('getCol', b, !1, 'max'), 10)),
                (_ = e.jgrid
                  .from(o.p.data)
                  .greater(j, h, { stype: 'integer' })
                  .select()),
                _.length)
              )
                for (C in _)
                  _.hasOwnProperty(C) && (_[C][j] = parseInt(_[C][j], 10) + 2);
              if (
                ((_ = e.jgrid
                  .from(o.p.data)
                  .greater(b, h, { stype: 'integer' })
                  .select()),
                _.length)
              )
                for (C in _)
                  _.hasOwnProperty(C) && (_[C][b] = parseInt(_[C][b], 10) + 2);
              (r[j] = h + 1), (r[b] = h + 2);
            }
          }
          (null === i || e(o).jqGrid('isNodeLoaded', d) || u) &&
            (e(o).jqGrid('addRowData', t, r, s, x),
            e(o).jqGrid('setTreeNode', p, c)),
            d && !d[g] && a && e(o.rows[q]).find('div.treeclick').click();
        }
      },
    });
  })(jQuery),
  (function (e) {
    (e.fn.jqDrag = function (e) {
      return s(this, e, 'd');
    }),
      (e.fn.jqResize = function (e, t) {
        return s(this, e, 'r', t);
      }),
      (e.jqDnR = {
        dnr: {},
        e: 0,
        drag: function (e) {
          return (
            'd' == a.k
              ? o.css({ left: a.X + e.pageX - a.pX, top: a.Y + e.pageY - a.pY })
              : (o.css({
                  width: Math.max(e.pageX - a.pX + a.W, 0),
                  height: Math.max(e.pageY - a.pY + a.H, 0),
                }),
                i &&
                  t.css({
                    width: Math.max(e.pageX - i.pX + i.W, 0),
                    height: Math.max(e.pageY - i.pY + i.H, 0),
                  })),
            !1
          );
        },
        stop: function () {
          e(document).unbind('mousemove', r.drag).unbind('mouseup', r.stop);
        },
      });
    var t,
      i,
      r = e.jqDnR,
      a = r.dnr,
      o = r.e,
      s = function (r, s, l, p) {
        return r.each(function () {
          (s = s ? e(s, r) : r),
            s.bind('mousedown', { e: r, k: l }, function (r) {
              var s = r.data,
                l = {};
              if (
                ((o = s.e),
                (t = p ? e(p) : !1),
                'relative' != o.css('position'))
              )
                try {
                  o.position(l);
                } catch (c) {}
              if (
                ((a = {
                  X: l.left || n('left') || 0,
                  Y: l.top || n('top') || 0,
                  W: n('width') || o[0].scrollWidth || 0,
                  H: n('height') || o[0].scrollHeight || 0,
                  pX: r.pageX,
                  pY: r.pageY,
                  k: s.k,
                }),
                (i =
                  t && 'd' != s.k
                    ? {
                        X: l.left || d('left') || 0,
                        Y: l.top || d('top') || 0,
                        W: t[0].offsetWidth || d('width') || 0,
                        H: t[0].offsetHeight || d('height') || 0,
                        pX: r.pageX,
                        pY: r.pageY,
                        k: s.k,
                      }
                    : !1),
                e('input.hasDatepicker', o[0])[0])
              )
                try {
                  e('input.hasDatepicker', o[0]).datepicker('hide');
                } catch (u) {}
              return (
                e(document).mousemove(e.jqDnR.drag).mouseup(e.jqDnR.stop), !1
              );
            });
        });
      },
      n = function (e) {
        return parseInt(o.css(e), 10) || !1;
      },
      d = function (e) {
        return parseInt(t.css(e), 10) || !1;
      };
  })(jQuery),
  (function (e) {
    (e.fn.jqm = function (r) {
      var o = {
        overlay: 50,
        closeoverlay: !0,
        overlayClass: 'jqmOverlay',
        closeClass: 'jqmClose',
        trigger: '.jqModal',
        ajax: a,
        ajaxText: '',
        target: a,
        modal: a,
        toTop: a,
        onShow: a,
        onHide: a,
        onLoad: a,
      };
      return this.each(function () {
        return this._jqm
          ? (i[this._jqm].c = e.extend({}, i[this._jqm].c, r))
          : (t++,
            (this._jqm = t),
            (i[t] = {
              c: e.extend(o, e.jqm.params, r),
              a: a,
              w: e(this).addClass('jqmID' + t),
              s: t,
            }),
            void (o.trigger && e(this).jqmAddTrigger(o.trigger)));
      });
    }),
      (e.fn.jqmAddClose = function (e) {
        return l(this, e, 'jqmHide');
      }),
      (e.fn.jqmAddTrigger = function (e) {
        return l(this, e, 'jqmShow');
      }),
      (e.fn.jqmShow = function (t) {
        return this.each(function () {
          e.jqm.open(this._jqm, t);
        });
      }),
      (e.fn.jqmHide = function (t) {
        return this.each(function () {
          e.jqm.close(this._jqm, t);
        });
      }),
      (e.jqm = {
        hash: {},
        open: function (t, s) {
          var d = i[t],
            l = d.c,
            p = '.' + l.closeClass,
            c = parseInt(d.w.css('z-index'));
          c = c > 0 ? c : 3e3;
          var u = e('<div></div>').css({
            height: '100%',
            width: '100%',
            position: 'fixed',
            left: 0,
            top: 0,
            'z-index': c - 1,
            opacity: l.overlay / 100,
          });
          if (d.a) return a;
          if (
            ((d.t = s),
            (d.a = !0),
            d.w.css('z-index', c),
            l.modal
              ? (r[0] ||
                  setTimeout(function () {
                    n('bind');
                  }, 1),
                r.push(t))
              : l.overlay > 0
                ? l.closeoverlay && d.w.jqmAddClose(u)
                : (u = a),
            (d.o = u ? u.addClass(l.overlayClass).prependTo('body') : a),
            l.ajax)
          ) {
            var h = l.target || d.w,
              g = l.ajax;
            (h = 'string' == typeof h ? e(h, d.w) : e(h)),
              (g = '@' == g.substr(0, 1) ? e(s).attr(g.substring(1)) : g),
              h.html(l.ajaxText).load(g, function () {
                l.onLoad && l.onLoad.call(this, d),
                  p && d.w.jqmAddClose(e(p, d.w)),
                  o(d);
              });
          } else p && d.w.jqmAddClose(e(p, d.w));
          return (
            l.toTop &&
              d.o &&
              d.w
                .before('<span id="jqmP' + d.w[0]._jqm + '"></span>')
                .insertAfter(d.o),
            l.onShow ? l.onShow(d) : d.w.show(),
            o(d),
            a
          );
        },
        close: function (t) {
          var o = i[t];
          return o.a
            ? ((o.a = a),
              r[0] && (r.pop(), r[0] || n('unbind')),
              o.c.toTop &&
                o.o &&
                e('#jqmP' + o.w[0]._jqm)
                  .after(o.w)
                  .remove(),
              o.c.onHide ? o.c.onHide(o) : (o.w.hide(), o.o && o.o.remove()),
              a)
            : a;
        },
        params: {},
      });
    var t = 0,
      i = e.jqm.hash,
      r = [],
      a = !1,
      o = function (e) {
        s(e);
      },
      s = function (t) {
        try {
          e(':input:visible', t.w)[0].focus();
        } catch (i) {}
      },
      n = function (t) {
        e(document)[t]('keypress', d)[t]('keydown', d)[t]('mousedown', d);
      },
      d = function (t) {
        var a = i[r[r.length - 1]],
          o = !e(t.target).parents('.jqmID' + a.s)[0];
        return (
          o &&
            (e('.jqmID' + a.s).each(function () {
              var i = e(this),
                r = i.offset();
              return r.top <= t.pageY &&
                t.pageY <= r.top + i.height() &&
                r.left <= t.pageX &&
                t.pageX <= r.left + i.width()
                ? ((o = !1), !1)
                : void 0;
            }),
            s(a)),
          !o
        );
      },
      l = function (t, r, o) {
        return t.each(function () {
          var t = this._jqm;
          e(r).each(function () {
            this[o] ||
              ((this[o] = []),
              e(this).click(function () {
                for (var e in { jqmShow: 1, jqmHide: 1 })
                  for (var t in this[e])
                    i[this[e][t]] && i[this[e][t]].w[e](this);
                return a;
              })),
              this[o].push(t);
          });
        });
      };
  })(jQuery),
  (function (e) {
    'use strict';
    (e.fmatter = {}),
      e.extend(e.fmatter, {
        isBoolean: function (e) {
          return 'boolean' == typeof e;
        },
        isObject: function (t) {
          return (t && ('object' == typeof t || e.isFunction(t))) || !1;
        },
        isString: function (e) {
          return 'string' == typeof e;
        },
        isNumber: function (e) {
          return 'number' == typeof e && isFinite(e);
        },
        isValue: function (e) {
          return (
            this.isObject(e) ||
            this.isString(e) ||
            this.isNumber(e) ||
            this.isBoolean(e)
          );
        },
        isEmpty: function (t) {
          return !this.isString(t) && this.isValue(t)
            ? !1
            : this.isValue(t)
              ? ((t = e
                  .trim(t)
                  .replace(/\&nbsp\;/gi, '')
                  .replace(/\&#160\;/gi, '')),
                '' === t)
              : !0;
        },
      }),
      (e.fn.fmatter = function (t, i, r, a, o) {
        var s = i;
        r = e.extend({}, e.jgrid.formatter, r);
        try {
          s = e.fn.fmatter[t].call(this, i, r, a, o);
        } catch (n) {}
        return s;
      }),
      (e.fmatter.util = {
        NumberFormat: function (t, i) {
          if ((e.fmatter.isNumber(t) || (t *= 1), e.fmatter.isNumber(t))) {
            var r,
              a = 0 > t,
              o = String(t),
              s = i.decimalSeparator || '.';
            if (e.fmatter.isNumber(i.decimalPlaces)) {
              var n = i.decimalPlaces,
                d = Math.pow(10, n);
              if (
                ((o = String(Math.round(t * d) / d)),
                (r = o.lastIndexOf('.')),
                n > 0)
              )
                for (
                  0 > r
                    ? ((o += s), (r = o.length - 1))
                    : '.' !== s && (o = o.replace('.', s));
                  o.length - 1 - r < n;

                )
                  o += '0';
            }
            if (i.thousandsSeparator) {
              var l = i.thousandsSeparator;
              (r = o.lastIndexOf(s)), (r = r > -1 ? r : o.length);
              var p,
                c = o.substring(r),
                u = -1;
              for (p = r; p > 0; p--)
                u++,
                  u % 3 === 0 && p !== r && (!a || p > 1) && (c = l + c),
                  (c = o.charAt(p - 1) + c);
              o = c;
            }
            return (
              (o = i.prefix ? i.prefix + o : o),
              (o = i.suffix ? o + i.suffix : o)
            );
          }
          return t;
        },
      }),
      (e.fn.fmatter.defaultFormat = function (t, i) {
        return e.fmatter.isValue(t) && '' !== t
          ? t
          : i.defaultValue || '&#160;';
      }),
      (e.fn.fmatter.email = function (t, i) {
        return e.fmatter.isEmpty(t)
          ? e.fn.fmatter.defaultFormat(t, i)
          : '<a href="mailto:' + t + '">' + t + '</a>';
      }),
      (e.fn.fmatter.checkbox = function (t, i) {
        var r,
          a = e.extend({}, i.checkbox);
        void 0 !== i.colModel &&
          void 0 !== i.colModel.formatoptions &&
          (a = e.extend({}, a, i.colModel.formatoptions)),
          (r = a.disabled === !0 ? 'disabled="disabled"' : ''),
          (e.fmatter.isEmpty(t) || void 0 === t) &&
            (t = e.fn.fmatter.defaultFormat(t, a)),
          (t = String(t)),
          (t = (t + '').toLowerCase());
        var o =
          t.search(/(false|f|0|no|n|off|undefined)/i) < 0
            ? " checked='checked' "
            : '';
        return (
          '<input type="checkbox" ' +
          o +
          ' value="' +
          t +
          '" offval="no" ' +
          r +
          '/>'
        );
      }),
      (e.fn.fmatter.link = function (t, i) {
        var r = { target: i.target },
          a = '';
        return (
          void 0 !== i.colModel &&
            void 0 !== i.colModel.formatoptions &&
            (r = e.extend({}, r, i.colModel.formatoptions)),
          r.target && (a = 'target=' + r.target),
          e.fmatter.isEmpty(t)
            ? e.fn.fmatter.defaultFormat(t, i)
            : '<a ' + a + ' href="' + t + '">' + t + '</a>'
        );
      }),
      (e.fn.fmatter.showlink = function (t, i) {
        var r,
          a = {
            baseLinkUrl: i.baseLinkUrl,
            showAction: i.showAction,
            addParam: i.addParam || '',
            target: i.target,
            idName: i.idName,
          },
          o = '';
        return (
          void 0 !== i.colModel &&
            void 0 !== i.colModel.formatoptions &&
            (a = e.extend({}, a, i.colModel.formatoptions)),
          a.target && (o = 'target=' + a.target),
          (r =
            a.baseLinkUrl +
            a.showAction +
            '?' +
            a.idName +
            '=' +
            i.rowId +
            a.addParam),
          e.fmatter.isString(t) || e.fmatter.isNumber(t)
            ? '<a ' + o + ' href="' + r + '">' + t + '</a>'
            : e.fn.fmatter.defaultFormat(t, i)
        );
      }),
      (e.fn.fmatter.integer = function (t, i) {
        var r = e.extend({}, i.integer);
        return (
          void 0 !== i.colModel &&
            void 0 !== i.colModel.formatoptions &&
            (r = e.extend({}, r, i.colModel.formatoptions)),
          e.fmatter.isEmpty(t)
            ? r.defaultValue
            : e.fmatter.util.NumberFormat(t, r)
        );
      }),
      (e.fn.fmatter.number = function (t, i) {
        var r = e.extend({}, i.number);
        return (
          void 0 !== i.colModel &&
            void 0 !== i.colModel.formatoptions &&
            (r = e.extend({}, r, i.colModel.formatoptions)),
          e.fmatter.isEmpty(t)
            ? r.defaultValue
            : e.fmatter.util.NumberFormat(t, r)
        );
      }),
      (e.fn.fmatter.currency = function (t, i) {
        var r = e.extend({}, i.currency);
        return (
          void 0 !== i.colModel &&
            void 0 !== i.colModel.formatoptions &&
            (r = e.extend({}, r, i.colModel.formatoptions)),
          e.fmatter.isEmpty(t)
            ? r.defaultValue
            : e.fmatter.util.NumberFormat(t, r)
        );
      }),
      (e.fn.fmatter.date = function (t, i, r, a) {
        var o = e.extend({}, i.date);
        return (
          void 0 !== i.colModel &&
            void 0 !== i.colModel.formatoptions &&
            (o = e.extend({}, o, i.colModel.formatoptions)),
          o.reformatAfterEdit || 'edit' !== a
            ? e.fmatter.isEmpty(t)
              ? e.fn.fmatter.defaultFormat(t, i)
              : e.jgrid.parseDate(o.srcformat, t, o.newformat, o)
            : e.fn.fmatter.defaultFormat(t, i)
        );
      }),
      (e.fn.fmatter.select = function (t, i) {
        t = String(t);
        var r,
          a,
          o = !1,
          s = [];
        if (
          (void 0 !== i.colModel.formatoptions
            ? ((o = i.colModel.formatoptions.value),
              (r =
                void 0 === i.colModel.formatoptions.separator
                  ? ':'
                  : i.colModel.formatoptions.separator),
              (a =
                void 0 === i.colModel.formatoptions.delimiter
                  ? ';'
                  : i.colModel.formatoptions.delimiter))
            : void 0 !== i.colModel.editoptions &&
              ((o = i.colModel.editoptions.value),
              (r =
                void 0 === i.colModel.editoptions.separator
                  ? ':'
                  : i.colModel.editoptions.separator),
              (a =
                void 0 === i.colModel.editoptions.delimiter
                  ? ';'
                  : i.colModel.editoptions.delimiter)),
          o)
        ) {
          var n,
            d =
              (null != i.colModel.editoptions &&
                i.colModel.editoptions.multiple === !0) == !0
                ? !0
                : !1,
            l = [];
          if (
            (d &&
              ((l = t.split(',')),
              (l = e.map(l, function (t) {
                return e.trim(t);
              }))),
            e.fmatter.isString(o))
          ) {
            var p,
              c = o.split(a),
              u = 0;
            for (p = 0; p < c.length; p++)
              if (
                ((n = c[p].split(r)),
                n.length > 2 &&
                  (n[1] = e
                    .map(n, function (e, t) {
                      return t > 0 ? e : void 0;
                    })
                    .join(r)),
                d)
              )
                e.inArray(n[0], l) > -1 && ((s[u] = n[1]), u++);
              else if (e.trim(n[0]) === e.trim(t)) {
                s[0] = n[1];
                break;
              }
          } else
            e.fmatter.isObject(o) &&
              (d
                ? (s = e.map(l, function (e) {
                    return o[e];
                  }))
                : (s[0] = o[t] || ''));
        }
        return (
          (t = s.join(', ')), '' === t ? e.fn.fmatter.defaultFormat(t, i) : t
        );
      }),
      (e.fn.fmatter.rowactions = function (t) {
        var i = e(this).closest('tr.jqgrow'),
          r = i.attr('id'),
          a = e(this)
            .closest('table.ui-jqgrid-btable')
            .attr('id')
            .replace(/_frozen([^_]*)$/, '$1'),
          o = e('#' + a),
          s = o[0],
          n = s.p,
          d = n.colModel[e.jgrid.getCellIndex(this)],
          l = d.frozen
            ? e(
                'tr#' + r + ' td:eq(' + e.jgrid.getCellIndex(this) + ') > div',
                o
              )
            : e(this).parent(),
          p = { extraparam: {} },
          c = function (t, i) {
            e.isFunction(p.afterSave) && p.afterSave.call(s, t, i),
              l.find('div.ui-inline-edit,div.ui-inline-del').show(),
              l.find('div.ui-inline-save,div.ui-inline-cancel').hide();
          },
          u = function (t) {
            e.isFunction(p.afterRestore) && p.afterRestore.call(s, t),
              l.find('div.ui-inline-edit,div.ui-inline-del').show(),
              l.find('div.ui-inline-save,div.ui-inline-cancel').hide();
          };
        void 0 !== d.formatoptions && (p = e.extend(p, d.formatoptions)),
          void 0 !== n.editOptions && (p.editOptions = n.editOptions),
          void 0 !== n.delOptions && (p.delOptions = n.delOptions),
          i.hasClass('jqgrid-new-row') &&
            (p.extraparam[n.prmNames.oper] = n.prmNames.addoper);
        var h = {
          keys: p.keys,
          oneditfunc: p.onEdit,
          successfunc: p.onSuccess,
          url: p.url,
          extraparam: p.extraparam,
          aftersavefunc: c,
          errorfunc: p.onError,
          afterrestorefunc: u,
          restoreAfterError: p.restoreAfterError,
          mtype: p.mtype,
        };
        switch (t) {
          case 'edit':
            o.jqGrid('editRow', r, h),
              l.find('div.ui-inline-edit,div.ui-inline-del').hide(),
              l.find('div.ui-inline-save,div.ui-inline-cancel').show(),
              o.triggerHandler('jqGridAfterGridComplete');
            break;
          case 'save':
            o.jqGrid('saveRow', r, h) &&
              (l.find('div.ui-inline-edit,div.ui-inline-del').show(),
              l.find('div.ui-inline-save,div.ui-inline-cancel').hide(),
              o.triggerHandler('jqGridAfterGridComplete'));
            break;
          case 'cancel':
            o.jqGrid('restoreRow', r, u),
              l.find('div.ui-inline-edit,div.ui-inline-del').show(),
              l.find('div.ui-inline-save,div.ui-inline-cancel').hide(),
              o.triggerHandler('jqGridAfterGridComplete');
            break;
          case 'del':
            o.jqGrid('delGridRow', r, p.delOptions);
            break;
          case 'formedit':
            o.jqGrid('setSelection', r),
              o.jqGrid('editGridRow', r, p.editOptions);
        }
      }),
      (e.fn.fmatter.actions = function (t, i) {
        var r,
          a = { keys: !1, editbutton: !0, delbutton: !0, editformbutton: !1 },
          o = i.rowId,
          s = '';
        return (
          void 0 !== i.colModel.formatoptions &&
            (a = e.extend(a, i.colModel.formatoptions)),
          void 0 === o || e.fmatter.isEmpty(o)
            ? ''
            : (a.editformbutton
                ? ((r =
                    "id='jEditButton_" +
                    o +
                    "' onclick=jQuery.fn.fmatter.rowactions.call(this,'formedit'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); "),
                  (s +=
                    "<div title='" +
                    e.jgrid.nav.edittitle +
                    "' style='float:left;cursor:pointer;' class='ui-pg-div ui-inline-edit' " +
                    r +
                    "><span class='ui-icon ui-icon-pencil'></span></div>"))
                : a.editbutton &&
                  ((r =
                    "id='jEditButton_" +
                    o +
                    "' onclick=jQuery.fn.fmatter.rowactions.call(this,'edit'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover') "),
                  (s +=
                    "<div title='" +
                    e.jgrid.nav.edittitle +
                    "' style='float:left;cursor:pointer;' class='ui-pg-div ui-inline-edit' " +
                    r +
                    "><span class='ui-icon ui-icon-pencil'></span></div>")),
              a.delbutton &&
                ((r =
                  "id='jDeleteButton_" +
                  o +
                  "' onclick=jQuery.fn.fmatter.rowactions.call(this,'del'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); "),
                (s +=
                  "<div title='" +
                  e.jgrid.nav.deltitle +
                  "' style='float:left;margin-left:5px;' class='ui-pg-div ui-inline-del' " +
                  r +
                  "><span class='ui-icon ui-icon-trash'></span></div>")),
              (r =
                "id='jSaveButton_" +
                o +
                "' onclick=jQuery.fn.fmatter.rowactions.call(this,'save'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); "),
              (s +=
                "<div title='" +
                e.jgrid.edit.bSubmit +
                "' style='float:left;display:none' class='ui-pg-div ui-inline-save' " +
                r +
                "><span class='ui-icon ui-icon-disk'></span></div>"),
              (r =
                "id='jCancelButton_" +
                o +
                "' onclick=jQuery.fn.fmatter.rowactions.call(this,'cancel'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); "),
              (s +=
                "<div title='" +
                e.jgrid.edit.bCancel +
                "' style='float:left;display:none;margin-left:5px;' class='ui-pg-div ui-inline-cancel' " +
                r +
                "><span class='ui-icon ui-icon-cancel'></span></div>"),
              "<div style='margin-left:8px;'>" + s + '</div>')
        );
      }),
      (e.unformat = function (t, i, r, a) {
        var o,
          s,
          n = i.colModel.formatter,
          d = i.colModel.formatoptions || {},
          l = /([\.\*\_\'\(\)\{\}\+\?\\])/g,
          p =
            i.colModel.unformat ||
            (e.fn.fmatter[n] && e.fn.fmatter[n].unformat);
        if (void 0 !== p && e.isFunction(p))
          o = p.call(this, e(t).text(), i, t);
        else if (void 0 !== n && e.fmatter.isString(n)) {
          var c,
            u = e.jgrid.formatter || {};
          switch (n) {
            case 'integer':
              (d = e.extend({}, u.integer, d)),
                (s = d.thousandsSeparator.replace(l, '\\$1')),
                (c = new RegExp(s, 'g')),
                (o = e(t).text().replace(c, ''));
              break;
            case 'number':
              (d = e.extend({}, u.number, d)),
                (s = d.thousandsSeparator.replace(l, '\\$1')),
                (c = new RegExp(s, 'g')),
                (o = e(t)
                  .text()
                  .replace(c, '')
                  .replace(d.decimalSeparator, '.'));
              break;
            case 'currency':
              (d = e.extend({}, u.currency, d)),
                (s = d.thousandsSeparator.replace(l, '\\$1')),
                (c = new RegExp(s, 'g')),
                (o = e(t).text()),
                d.prefix && d.prefix.length && (o = o.substr(d.prefix.length)),
                d.suffix &&
                  d.suffix.length &&
                  (o = o.substr(0, o.length - d.suffix.length)),
                (o = o.replace(c, '').replace(d.decimalSeparator, '.'));
              break;
            case 'checkbox':
              var h = i.colModel.editoptions
                ? i.colModel.editoptions.value.split(':')
                : ['Yes', 'No'];
              o = e('input', t).is(':checked') ? h[0] : h[1];
              break;
            case 'select':
              o = e.unformat.select(t, i, r, a);
              break;
            case 'actions':
              return '';
            default:
              o = e(t).text();
          }
        }
        return void 0 !== o
          ? o
          : a === !0
            ? e(t).text()
            : e.jgrid.htmlDecode(e(t).html());
      }),
      (e.unformat.select = function (t, i, r, a) {
        var o = [],
          s = e(t).text();
        if (a === !0) return s;
        var n = e.extend(
            {},
            void 0 !== i.colModel.formatoptions
              ? i.colModel.formatoptions
              : i.colModel.editoptions
          ),
          d = void 0 === n.separator ? ':' : n.separator,
          l = void 0 === n.delimiter ? ';' : n.delimiter;
        if (n.value) {
          var p,
            c = n.value,
            u = n.multiple === !0 ? !0 : !1,
            h = [];
          if (
            (u &&
              ((h = s.split(',')),
              (h = e.map(h, function (t) {
                return e.trim(t);
              }))),
            e.fmatter.isString(c))
          ) {
            var g,
              f = c.split(l),
              m = 0;
            for (g = 0; g < f.length; g++)
              if (
                ((p = f[g].split(d)),
                p.length > 2 &&
                  (p[1] = e
                    .map(p, function (e, t) {
                      return t > 0 ? e : void 0;
                    })
                    .join(d)),
                u)
              )
                e.inArray(p[1], h) > -1 && ((o[m] = p[0]), m++);
              else if (e.trim(p[1]) === e.trim(s)) {
                o[0] = p[0];
                break;
              }
          } else
            (e.fmatter.isObject(c) || e.isArray(c)) &&
              (u || (h[0] = s),
              (o = e.map(h, function (t) {
                var i;
                return (
                  e.each(c, function (e, r) {
                    return r === t ? ((i = e), !1) : void 0;
                  }),
                  void 0 !== i ? i : void 0
                );
              })));
          return o.join(', ');
        }
        return s || '';
      }),
      (e.unformat.date = function (t, i) {
        var r = e.jgrid.formatter.date || {};
        return (
          void 0 !== i.formatoptions && (r = e.extend({}, r, i.formatoptions)),
          e.fmatter.isEmpty(t)
            ? e.fn.fmatter.defaultFormat(t, i)
            : e.jgrid.parseDate(r.newformat, t, r.srcformat, r)
        );
      });
  })(jQuery);
var xmlJsonClass = {
  xml2json: function (e, t) {
    9 === e.nodeType && (e = e.documentElement);
    var i = this.removeWhite(e),
      r = this.toObj(i),
      a = this.toJson(r, e.nodeName, '	');
    return (
      '{\n' + t + (t ? a.replace(/\t/g, t) : a.replace(/\t|\n/g, '')) + '\n}'
    );
  },
  json2xml: function (e, t) {
    var i,
      r = function (e, t, i) {
        var a,
          o,
          s = '';
        if (e instanceof Array)
          if (0 === e.length)
            s += i + '<' + t + '>__EMPTY_ARRAY_</' + t + '>\n';
          else
            for (a = 0, o = e.length; o > a; a += 1) {
              var n = i + r(e[a], t, i + '	') + '\n';
              s += n;
            }
        else if ('object' == typeof e) {
          var d = !1;
          s += i + '<' + t;
          var l;
          for (l in e)
            e.hasOwnProperty(l) &&
              ('@' === l.charAt(0)
                ? (s += ' ' + l.substr(1) + '="' + e[l].toString() + '"')
                : (d = !0));
          if (((s += d ? '>' : '/>'), d)) {
            for (l in e)
              e.hasOwnProperty(l) &&
                ('#text' === l
                  ? (s += e[l])
                  : '#cdata' === l
                    ? (s += '<![CDATA[' + e[l] + ']]>')
                    : '@' !== l.charAt(0) && (s += r(e[l], l, i + '	')));
            s += ('\n' === s.charAt(s.length - 1) ? i : '') + '</' + t + '>';
          }
        } else
          'function' == typeof e
            ? (s += i + '<' + t + '><![CDATA[' + e + ']]></' + t + '>')
            : (void 0 === e && (e = ''),
              (s +=
                '""' === e.toString() || 0 === e.toString().length
                  ? i + '<' + t + '>__EMPTY_STRING_</' + t + '>'
                  : i + '<' + t + '>' + e.toString() + '</' + t + '>'));
        return s;
      },
      a = '';
    for (i in e) e.hasOwnProperty(i) && (a += r(e[i], i, ''));
    return t ? a.replace(/\t/g, t) : a.replace(/\t|\n/g, '');
  },
  toObj: function (e) {
    var t = {},
      i = /function/i;
    if (1 === e.nodeType) {
      if (e.attributes.length) {
        var r;
        for (r = 0; r < e.attributes.length; r += 1)
          t['@' + e.attributes[r].nodeName] = (
            e.attributes[r].nodeValue || ''
          ).toString();
      }
      if (e.firstChild) {
        var a,
          o = 0,
          s = 0,
          n = !1;
        for (a = e.firstChild; a; a = a.nextSibling)
          1 === a.nodeType
            ? (n = !0)
            : 3 === a.nodeType && a.nodeValue.match(/[^ \f\n\r\t\v]/)
              ? (o += 1)
              : 4 === a.nodeType && (s += 1);
        if (n)
          if (2 > o && 2 > s)
            for (this.removeWhite(e), a = e.firstChild; a; a = a.nextSibling)
              3 === a.nodeType
                ? (t['#text'] = this.escape(a.nodeValue))
                : 4 === a.nodeType
                  ? i.test(a.nodeValue)
                    ? (t[a.nodeName] = [t[a.nodeName], a.nodeValue])
                    : (t['#cdata'] = this.escape(a.nodeValue))
                  : t[a.nodeName]
                    ? t[a.nodeName] instanceof Array
                      ? (t[a.nodeName][t[a.nodeName].length] = this.toObj(a))
                      : (t[a.nodeName] = [t[a.nodeName], this.toObj(a)])
                    : (t[a.nodeName] = this.toObj(a));
          else
            e.attributes.length
              ? (t['#text'] = this.escape(this.innerXml(e)))
              : (t = this.escape(this.innerXml(e)));
        else if (o)
          e.attributes.length
            ? (t['#text'] = this.escape(this.innerXml(e)))
            : ((t = this.escape(this.innerXml(e))),
              '__EMPTY_ARRAY_' === t
                ? (t = '[]')
                : '__EMPTY_STRING_' === t && (t = ''));
        else if (s)
          if (s > 1) t = this.escape(this.innerXml(e));
          else
            for (a = e.firstChild; a; a = a.nextSibling) {
              if (i.test(e.firstChild.nodeValue)) {
                t = e.firstChild.nodeValue;
                break;
              }
              t['#cdata'] = this.escape(a.nodeValue);
            }
      }
      e.attributes.length || e.firstChild || (t = null);
    } else
      9 === e.nodeType
        ? (t = this.toObj(e.documentElement))
        : alert('unhandled node type: ' + e.nodeType);
    return t;
  },
  toJson: function (e, t, i, r) {
    void 0 === r && (r = !0);
    var a = t ? '"' + t + '"' : '',
      o = '	',
      s = '\n';
    if ((r || ((o = ''), (s = '')), '[]' === e)) a += t ? ':[]' : '[]';
    else if (e instanceof Array) {
      var n,
        d,
        l = [];
      for (d = 0, n = e.length; n > d; d += 1)
        l[d] = this.toJson(e[d], '', i + o, r);
      a +=
        (t ? ':[' : '[') +
        (l.length > 1
          ? s + i + o + l.join(',' + s + i + o) + s + i
          : l.join('')) +
        ']';
    } else if (null === e) a += (t && ':') + 'null';
    else if ('object' == typeof e) {
      var p,
        c = [];
      for (p in e)
        e.hasOwnProperty(p) && (c[c.length] = this.toJson(e[p], p, i + o, r));
      a +=
        (t ? ':{' : '{') +
        (c.length > 1
          ? s + i + o + c.join(',' + s + i + o) + s + i
          : c.join('')) +
        '}';
    } else
      a +=
        'string' == typeof e
          ? (t && ':') +
            '"' +
            e.replace(/\\/g, '\\\\').replace(/\"/g, '\\"') +
            '"'
          : (t && ':') + e.toString();
    return a;
  },
  innerXml: function (e) {
    var t = '';
    if ('innerHTML' in e) t = e.innerHTML;
    else
      for (
        var i = function (e) {
            var t,
              r = '';
            if (1 === e.nodeType) {
              for (
                r += '<' + e.nodeName, t = 0;
                t < e.attributes.length;
                t += 1
              )
                r +=
                  ' ' +
                  e.attributes[t].nodeName +
                  '="' +
                  (e.attributes[t].nodeValue || '').toString() +
                  '"';
              if (e.firstChild) {
                r += '>';
                for (var a = e.firstChild; a; a = a.nextSibling) r += i(a);
                r += '</' + e.nodeName + '>';
              } else r += '/>';
            } else
              3 === e.nodeType
                ? (r += e.nodeValue)
                : 4 === e.nodeType && (r += '<![CDATA[' + e.nodeValue + ']]>');
            return r;
          },
          r = e.firstChild;
        r;
        r = r.nextSibling
      )
        t += i(r);
    return t;
  },
  escape: function (e) {
    return e
      .replace(/[\\]/g, '\\\\')
      .replace(/[\"]/g, '\\"')
      .replace(/[\n]/g, '\\n')
      .replace(/[\r]/g, '\\r');
  },
  removeWhite: function (e) {
    e.normalize();
    var t;
    for (t = e.firstChild; t; )
      if (3 === t.nodeType)
        if (t.nodeValue.match(/[^ \f\n\r\t\v]/)) t = t.nextSibling;
        else {
          var i = t.nextSibling;
          e.removeChild(t), (t = i);
        }
      else
        1 === t.nodeType
          ? (this.removeWhite(t), (t = t.nextSibling))
          : (t = t.nextSibling);
    return e;
  },
};
