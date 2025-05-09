!(function (e) {
  'function' == typeof define && define.amd
    ? define(['jquery', './effect'], e)
    : e(jQuery);
})(function (e) {
  return (e.effects.effect.explode = function (i, t) {
    function o() {
      M.push(this), M.length === l * p && s();
    }
    function s() {
      u.css({ visibility: 'visible' }), e(M).remove(), v || u.hide(), t();
    }
    var f,
      n,
      d,
      c,
      a,
      h,
      l = i.pieces ? Math.round(Math.sqrt(i.pieces)) : 3,
      p = l,
      u = e(this),
      r = e.effects.setMode(u, i.mode || 'hide'),
      v = 'show' === r,
      y = u.show().css('visibility', 'hidden').offset(),
      b = Math.ceil(u.outerWidth() / p),
      w = Math.ceil(u.outerHeight() / l),
      M = [];
    for (f = 0; l > f; f++)
      for (c = y.top + f * w, h = f - (l - 1) / 2, n = 0; p > n; n++)
        (d = y.left + n * b),
          (a = n - (p - 1) / 2),
          u
            .clone()
            .appendTo('body')
            .wrap('<div></div>')
            .css({
              position: 'absolute',
              visibility: 'visible',
              left: -n * b,
              top: -f * w,
            })
            .parent()
            .addClass('ui-effects-explode')
            .css({
              position: 'absolute',
              overflow: 'hidden',
              width: b,
              height: w,
              left: d + (v ? a * b : 0),
              top: c + (v ? h * w : 0),
              opacity: v ? 0 : 1,
            })
            .animate(
              {
                left: d + (v ? 0 : a * b),
                top: c + (v ? 0 : h * w),
                opacity: v ? 1 : 0,
              },
              i.duration || 500,
              i.easing,
              o
            );
  });
});
