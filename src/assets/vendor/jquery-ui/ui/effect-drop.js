!(function (e) {
  'function' == typeof define && define.amd
    ? define(['jquery', './effect'], e)
    : e(jQuery);
})(function (e) {
  return (e.effects.effect.drop = function (t, o) {
    var i,
      f = e(this),
      n = [
        'position',
        'top',
        'bottom',
        'left',
        'right',
        'opacity',
        'height',
        'width',
      ],
      s = e.effects.setMode(f, t.mode || 'hide'),
      c = 'show' === s,
      p = t.direction || 'left',
      r = 'up' === p || 'down' === p ? 'top' : 'left',
      d = 'up' === p || 'left' === p ? 'pos' : 'neg',
      a = { opacity: c ? 1 : 0 };
    e.effects.save(f, n),
      f.show(),
      e.effects.createWrapper(f),
      (i = t.distance || f['top' === r ? 'outerHeight' : 'outerWidth'](!0) / 2),
      c && f.css('opacity', 0).css(r, 'pos' === d ? -i : i),
      (a[r] =
        (c ? ('pos' === d ? '+=' : '-=') : 'pos' === d ? '-=' : '+=') + i),
      f.animate(a, {
        queue: !1,
        duration: t.duration,
        easing: t.easing,
        complete: function () {
          'hide' === s && f.hide(),
            e.effects.restore(f, n),
            e.effects.removeWrapper(f),
            o();
        },
      });
  });
});
