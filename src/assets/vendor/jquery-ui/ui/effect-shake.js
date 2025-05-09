!(function (e) {
  'function' == typeof define && define.amd
    ? define(['jquery', './effect'], e)
    : e(jQuery);
})(function (e) {
  return (e.effects.effect.shake = function (t, i) {
    var f,
      n = e(this),
      a = ['position', 'top', 'bottom', 'left', 'right', 'height', 'width'],
      o = e.effects.setMode(n, t.mode || 'effect'),
      s = t.direction || 'left',
      c = t.distance || 20,
      r = t.times || 3,
      u = 2 * r + 1,
      d = Math.round(t.duration / u),
      p = 'up' === s || 'down' === s ? 'top' : 'left',
      h = 'up' === s || 'left' === s,
      m = {},
      g = {},
      l = {},
      q = n.queue(),
      y = q.length;
    for (
      e.effects.save(n, a),
        n.show(),
        e.effects.createWrapper(n),
        m[p] = (h ? '-=' : '+=') + c,
        g[p] = (h ? '+=' : '-=') + 2 * c,
        l[p] = (h ? '-=' : '+=') + 2 * c,
        n.animate(m, d, t.easing),
        f = 1;
      r > f;
      f++
    )
      n.animate(g, d, t.easing).animate(l, d, t.easing);
    n
      .animate(g, d, t.easing)
      .animate(m, d / 2, t.easing)
      .queue(function () {
        'hide' === o && n.hide(),
          e.effects.restore(n, a),
          e.effects.removeWrapper(n),
          i();
      }),
      y > 1 && q.splice.apply(q, [1, 0].concat(q.splice(y, u + 1))),
      n.dequeue();
  });
});
