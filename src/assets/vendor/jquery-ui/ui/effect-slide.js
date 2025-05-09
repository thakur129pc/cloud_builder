!(function (e) {
  'function' == typeof define && define.amd
    ? define(['jquery', './effect'], e)
    : e(jQuery);
})(function (e) {
  return (e.effects.effect.slide = function (t, f) {
    var i,
      o = e(this),
      n = ['position', 'top', 'bottom', 'left', 'right', 'width', 'height'],
      s = e.effects.setMode(o, t.mode || 'show'),
      r = 'show' === s,
      c = t.direction || 'left',
      d = 'up' === c || 'down' === c ? 'top' : 'left',
      u = 'up' === c || 'left' === c,
      a = {};
    e.effects.save(o, n),
      o.show(),
      (i = t.distance || o['top' === d ? 'outerHeight' : 'outerWidth'](!0)),
      e.effects.createWrapper(o).css({ overflow: 'hidden' }),
      r && o.css(d, u ? (isNaN(i) ? '-' + i : -i) : i),
      (a[d] = (r ? (u ? '+=' : '-=') : u ? '-=' : '+=') + i),
      o.animate(a, {
        queue: !1,
        duration: t.duration,
        easing: t.easing,
        complete: function () {
          'hide' === s && o.hide(),
            e.effects.restore(o, n),
            e.effects.removeWrapper(o),
            f();
        },
      });
  });
});
