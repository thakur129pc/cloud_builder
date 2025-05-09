!(function (e) {
  'function' == typeof define && define.amd
    ? define(['jquery', './effect', './effect-size'], e)
    : e(jQuery);
})(function (e) {
  return (e.effects.effect.scale = function (t, i) {
    var o = e(this),
      h = e.extend(!0, {}, t),
      f = e.effects.setMode(o, t.mode || 'effect'),
      r =
        parseInt(t.percent, 10) ||
        (0 === parseInt(t.percent, 10) ? 0 : 'hide' === f ? 0 : 100),
      c = t.direction || 'both',
      d = t.origin,
      n = {
        height: o.height(),
        width: o.width(),
        outerHeight: o.outerHeight(),
        outerWidth: o.outerWidth(),
      },
      u = {
        y: 'horizontal' !== c ? r / 100 : 1,
        x: 'vertical' !== c ? r / 100 : 1,
      };
    (h.effect = 'size'),
      (h.queue = !1),
      (h.complete = i),
      'effect' !== f &&
        ((h.origin = d || ['middle', 'center']), (h.restore = !0)),
      (h.from =
        t.from ||
        ('show' === f
          ? { height: 0, width: 0, outerHeight: 0, outerWidth: 0 }
          : n)),
      (h.to = {
        height: n.height * u.y,
        width: n.width * u.x,
        outerHeight: n.outerHeight * u.y,
        outerWidth: n.outerWidth * u.x,
      }),
      h.fade &&
        ('show' === f && ((h.from.opacity = 0), (h.to.opacity = 1)),
        'hide' === f && ((h.from.opacity = 1), (h.to.opacity = 0))),
      o.effect(h);
  });
});
