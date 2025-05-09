!(function (e) {
  'function' == typeof define && define.amd
    ? define(['jquery', './effect'], e)
    : e(jQuery);
})(function (e) {
  return (e.effects.effect.bounce = function (t, i) {
    var o,
      f,
      c,
      n = e(this),
      a = ['position', 'top', 'bottom', 'left', 'right', 'height', 'width'],
      s = e.effects.setMode(n, t.mode || 'effect'),
      p = 'hide' === s,
      u = 'show' === s,
      r = t.direction || 'up',
      d = t.distance,
      h = t.times || 5,
      m = 2 * h + (u || p ? 1 : 0),
      y = t.duration / m,
      l = t.easing,
      g = 'up' === r || 'down' === r ? 'top' : 'left',
      w = 'up' === r || 'left' === r,
      q = n.queue(),
      v = q.length;
    for (
      (u || p) && a.push('opacity'),
        e.effects.save(n, a),
        n.show(),
        e.effects.createWrapper(n),
        d || (d = n['top' === g ? 'outerHeight' : 'outerWidth']() / 3),
        u &&
          ((c = { opacity: 1 }),
          (c[g] = 0),
          n
            .css('opacity', 0)
            .css(g, w ? 2 * -d : 2 * d)
            .animate(c, y, l)),
        p && (d /= Math.pow(2, h - 1)),
        c = {},
        c[g] = 0,
        o = 0;
      h > o;
      o++
    )
      (f = {}),
        (f[g] = (w ? '-=' : '+=') + d),
        n.animate(f, y, l).animate(c, y, l),
        (d = p ? 2 * d : d / 2);
    p &&
      ((f = { opacity: 0 }),
      (f[g] = (w ? '-=' : '+=') + d),
      n.animate(f, y, l)),
      n.queue(function () {
        p && n.hide(), e.effects.restore(n, a), e.effects.removeWrapper(n), i();
      }),
      v > 1 && q.splice.apply(q, [1, 0].concat(q.splice(v, m + 1))),
      n.dequeue();
  });
});
