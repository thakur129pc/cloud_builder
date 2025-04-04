!(function (e, t, n) {
  '$:nomunge';
  function i(n) {
    u === !0 && (u = n || 1);
    for (var s = r.length - 1; s >= 0; s--) {
      var c = e(r[s]);
      if (c[0] == t || c.is(':visible')) {
        var d = c.width(),
          f = c.height(),
          g = c.data(m);
        !g ||
          (d === g.w && f === g.h) ||
          (c.trigger(h, [(g.w = d), (g.h = f)]), (u = n || !0));
      } else (g = c.data(m)), (g.w = 0), (g.h = 0);
    }
    null !== a &&
      (u && (null == n || 1e3 > n - u)
        ? (a = t.requestAnimationFrame(i))
        : ((a = setTimeout(i, o[l])), (u = !1)));
  }
  var a,
    r = [],
    o = (e.resize = e.extend(e.resize, {})),
    u = !1,
    s = 'setTimeout',
    h = 'resize',
    m = h + '-special-event',
    l = 'pendingDelay',
    c = 'activeDelay',
    d = 'throttleWindow';
  (o[l] = 200),
    (o[c] = 20),
    (o[d] = !0),
    (e.event.special[h] = {
      setup: function () {
        if (!o[d] && this[s]) return !1;
        var t = e(this);
        r.push(this),
          t.data(m, { w: t.width(), h: t.height() }),
          1 === r.length && ((a = n), i());
      },
      teardown: function () {
        if (!o[d] && this[s]) return !1;
        for (var t = e(this), n = r.length - 1; n >= 0; n--)
          if (r[n] == this) {
            r.splice(n, 1);
            break;
          }
        t.removeData(m),
          r.length ||
            (u ? cancelAnimationFrame(a) : clearTimeout(a), (a = null));
      },
      add: function (t) {
        function i(t, i, r) {
          var o = e(this),
            u = o.data(m) || {};
          (u.w = i !== n ? i : o.width()),
            (u.h = r !== n ? r : o.height()),
            a.apply(this, arguments);
        }
        if (!o[d] && this[s]) return !1;
        var a;
        return e.isFunction(t)
          ? ((a = t), i)
          : ((a = t.handler), void (t.handler = i));
      },
    }),
    t.requestAnimationFrame ||
      (t.requestAnimationFrame = (function () {
        return (
          t.webkitRequestAnimationFrame ||
          t.mozRequestAnimationFrame ||
          t.oRequestAnimationFrame ||
          t.msRequestAnimationFrame ||
          function (e) {
            return t.setTimeout(function () {
              e(new Date().getTime());
            }, o[c]);
          }
        );
      })()),
    t.cancelAnimationFrame ||
      (t.cancelAnimationFrame = (function () {
        return (
          t.webkitCancelRequestAnimationFrame ||
          t.mozCancelRequestAnimationFrame ||
          t.oCancelRequestAnimationFrame ||
          t.msCancelRequestAnimationFrame ||
          clearTimeout
        );
      })());
})(jQuery, this),
  (function (e) {
    function t(e) {
      function t() {
        var t = e.getPlaceholder();
        0 != t.width() &&
          0 != t.height() &&
          (e.resize(), e.setupGrid(), e.draw());
      }
      function n(e) {
        e.getPlaceholder().resize(t);
      }
      function i(e) {
        e.getPlaceholder().unbind('resize', t);
      }
      e.hooks.bindEvents.push(n), e.hooks.shutdown.push(i);
    }
    var n = {};
    e.plot.plugins.push({
      init: t,
      options: n,
      name: 'resize',
      version: '1.0',
    });
  })(jQuery);
