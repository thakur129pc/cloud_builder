!(function (e) {
  'function' == typeof define && define.amd
    ? define(['jquery', './effect'], e)
    : e(jQuery);
})(function (e) {
  return (e.effects.effect.blind = function (t, s) {
    var i,
      o,
      f,
      n = e(this),
      c = /up|down|vertical/,
      r = /up|left|vertical|horizontal/,
      a = ['position', 'top', 'bottom', 'left', 'right', 'height', 'width'],
      p = e.effects.setMode(n, t.mode || 'hide'),
      d = t.direction || 'up',
      u = c.test(d),
      h = u ? 'height' : 'width',
      l = u ? 'top' : 'left',
      m = r.test(d),
      v = {},
      w = 'show' === p;
    n.parent().is('.ui-effects-wrapper')
      ? e.effects.save(n.parent(), a)
      : e.effects.save(n, a),
      n.show(),
      (i = e.effects.createWrapper(n).css({ overflow: 'hidden' })),
      (o = i[h]()),
      (f = parseFloat(i.css(l)) || 0),
      (v[h] = w ? o : 0),
      m ||
        (n
          .css(u ? 'bottom' : 'right', 0)
          .css(u ? 'top' : 'left', 'auto')
          .css({ position: 'absolute' }),
        (v[l] = w ? f : o + f)),
      w && (i.css(h, 0), m || i.css(l, f + o)),
      i.animate(v, {
        duration: t.duration,
        easing: t.easing,
        queue: !1,
        complete: function () {
          'hide' === p && n.hide(),
            e.effects.restore(n, a),
            e.effects.removeWrapper(n),
            s();
        },
      });
  });
});
