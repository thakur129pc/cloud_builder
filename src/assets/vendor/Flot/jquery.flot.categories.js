!(function (r) {
  function o(r, o, e, i) {
    var s = 'categories' == o.xaxis.options.mode,
      n = 'categories' == o.yaxis.options.mode;
    if (s || n) {
      var a = i.format;
      if (!a) {
        var t = o;
        if (
          ((a = []),
          a.push({ x: !0, number: !0, required: !0 }),
          a.push({ y: !0, number: !0, required: !0 }),
          t.bars.show || (t.lines.show && t.lines.fill))
        ) {
          var u = !!(
            (t.bars.show && t.bars.zero) ||
            (t.lines.show && t.lines.zero)
          );
          a.push({
            y: !0,
            number: !0,
            required: !1,
            defaultValue: 0,
            autoscale: u,
          }),
            t.bars.horizontal &&
              (delete a[a.length - 1].y, (a[a.length - 1].x = !0));
        }
        i.format = a;
      }
      for (var f = 0; f < a.length; ++f)
        a[f].x && s && (a[f].number = !1), a[f].y && n && (a[f].number = !1);
    }
  }
  function e(r) {
    var o = -1;
    for (var e in r) r[e] > o && (o = r[e]);
    return o + 1;
  }
  function i(r) {
    var o = [];
    for (var e in r.categories) {
      var i = r.categories[e];
      i >= r.min && i <= r.max && o.push([i, e]);
    }
    return (
      o.sort(function (r, o) {
        return r[0] - o[0];
      }),
      o
    );
  }
  function s(o, e, s) {
    if ('categories' == o[e].options.mode) {
      if (!o[e].categories) {
        var a = {},
          t = o[e].options.categories || {};
        if (r.isArray(t)) for (var u = 0; u < t.length; ++u) a[t[u]] = u;
        else for (var f in t) a[f] = t[f];
        o[e].categories = a;
      }
      o[e].options.ticks || (o[e].options.ticks = i), n(s, e, o[e].categories);
    }
  }
  function n(r, o, i) {
    for (
      var s = r.points,
        n = r.pointsize,
        a = r.format,
        t = o.charAt(0),
        u = e(i),
        f = 0;
      f < s.length;
      f += n
    )
      if (null != s[f])
        for (var c = 0; n > c; ++c) {
          var l = s[f + c];
          null != l &&
            a[c][t] &&
            (l in i || ((i[l] = u), ++u), (s[f + c] = i[l]));
        }
  }
  function a(r, o, e) {
    s(o, 'xaxis', e), s(o, 'yaxis', e);
  }
  function t(r) {
    r.hooks.processRawData.push(o), r.hooks.processDatapoints.push(a);
  }
  var u = { xaxis: { categories: null }, yaxis: { categories: null } };
  r.plot.plugins.push({
    init: t,
    options: u,
    name: 'categories',
    version: '1.0',
  });
})(jQuery);
