!(function (e) {
  'function' == typeof define && define.amd
    ? define(['jquery', './effect'], e)
    : e(jQuery);
})(function (e) {
  return (e.effects.effect.transfer = function (t, i) {
    var n = e(this),
      f = e(t.to),
      o = 'fixed' === f.css('position'),
      s = e('body'),
      d = o ? s.scrollTop() : 0,
      r = o ? s.scrollLeft() : 0,
      c = f.offset(),
      a = {
        top: c.top - d,
        left: c.left - r,
        height: f.innerHeight(),
        width: f.innerWidth(),
      },
      l = n.offset(),
      u = e("<div class='ui-effects-transfer'></div>")
        .appendTo(document.body)
        .addClass(t.className)
        .css({
          top: l.top - d,
          left: l.left - r,
          height: n.innerHeight(),
          width: n.innerWidth(),
          position: o ? 'fixed' : 'absolute',
        })
        .animate(a, t.duration, t.easing, function () {
          u.remove(), i();
        });
  });
});
