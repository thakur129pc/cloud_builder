!(function (e) {
  'function' == typeof define && define.amd
    ? define(['jquery', './effect'], e)
    : e(jQuery);
})(function (e) {
  return (e.effects.effect.clip = function (t, i) {
    var f,
      o,
      c,
      n = e(this),
      s = ['position', 'top', 'bottom', 'left', 'right', 'height', 'width'],
      r = e.effects.setMode(n, t.mode || 'hide'),
      a = 'show' === r,
      d = t.direction || 'vertical',
      h = 'vertical' === d,
      u = h ? 'height' : 'width',
      p = h ? 'top' : 'left',
      l = {};
    e.effects.save(n, s),
      n.show(),
      (f = e.effects.createWrapper(n).css({ overflow: 'hidden' })),
      (o = 'IMG' === n[0].tagName ? f : n),
      (c = o[u]()),
      a && (o.css(u, 0), o.css(p, c / 2)),
      (l[u] = a ? c : 0),
      (l[p] = a ? 0 : c / 2),
      o.animate(l, {
        queue: !1,
        duration: t.duration,
        easing: t.easing,
        complete: function () {
          a || n.hide(),
            e.effects.restore(n, s),
            e.effects.removeWrapper(n),
            i();
        },
      });
  });
});
