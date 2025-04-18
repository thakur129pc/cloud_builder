(jQuery.easing.jswing = jQuery.easing.swing),
  jQuery.extend(jQuery.easing, {
    def: 'easeOutQuad',
    swing: function (n, e, t, u, a) {
      return jQuery.easing[jQuery.easing.def](n, e, t, u, a);
    },
    easeInQuad: function (n, e, t, u, a) {
      return u * (e /= a) * e + t;
    },
    easeOutQuad: function (n, e, t, u, a) {
      return -u * (e /= a) * (e - 2) + t;
    },
    easeInOutQuad: function (n, e, t, u, a) {
      return (e /= a / 2) < 1
        ? (u / 2) * e * e + t
        : (-u / 2) * (--e * (e - 2) - 1) + t;
    },
    easeInCubic: function (n, e, t, u, a) {
      return u * (e /= a) * e * e + t;
    },
    easeOutCubic: function (n, e, t, u, a) {
      return u * ((e = e / a - 1) * e * e + 1) + t;
    },
    easeInOutCubic: function (n, e, t, u, a) {
      return (e /= a / 2) < 1
        ? (u / 2) * e * e * e + t
        : (u / 2) * ((e -= 2) * e * e + 2) + t;
    },
    easeInQuart: function (n, e, t, u, a) {
      return u * (e /= a) * e * e * e + t;
    },
    easeOutQuart: function (n, e, t, u, a) {
      return -u * ((e = e / a - 1) * e * e * e - 1) + t;
    },
    easeInOutQuart: function (n, e, t, u, a) {
      return (e /= a / 2) < 1
        ? (u / 2) * e * e * e * e + t
        : (-u / 2) * ((e -= 2) * e * e * e - 2) + t;
    },
    easeInQuint: function (n, e, t, u, a) {
      return u * (e /= a) * e * e * e * e + t;
    },
    easeOutQuint: function (n, e, t, u, a) {
      return u * ((e = e / a - 1) * e * e * e * e + 1) + t;
    },
    easeInOutQuint: function (n, e, t, u, a) {
      return (e /= a / 2) < 1
        ? (u / 2) * e * e * e * e * e + t
        : (u / 2) * ((e -= 2) * e * e * e * e + 2) + t;
    },
    easeInSine: function (n, e, t, u, a) {
      return -u * Math.cos((e / a) * (Math.PI / 2)) + u + t;
    },
    easeOutSine: function (n, e, t, u, a) {
      return u * Math.sin((e / a) * (Math.PI / 2)) + t;
    },
    easeInOutSine: function (n, e, t, u, a) {
      return (-u / 2) * (Math.cos((Math.PI * e) / a) - 1) + t;
    },
    easeInExpo: function (n, e, t, u, a) {
      return 0 == e ? t : u * Math.pow(2, 10 * (e / a - 1)) + t;
    },
    easeOutExpo: function (n, e, t, u, a) {
      return e == a ? t + u : u * (-Math.pow(2, (-10 * e) / a) + 1) + t;
    },
    easeInOutExpo: function (n, e, t, u, a) {
      return 0 == e
        ? t
        : e == a
          ? t + u
          : (e /= a / 2) < 1
            ? (u / 2) * Math.pow(2, 10 * (e - 1)) + t
            : (u / 2) * (-Math.pow(2, -10 * --e) + 2) + t;
    },
    easeInCirc: function (n, e, t, u, a) {
      return -u * (Math.sqrt(1 - (e /= a) * e) - 1) + t;
    },
    easeOutCirc: function (n, e, t, u, a) {
      return u * Math.sqrt(1 - (e = e / a - 1) * e) + t;
    },
    easeInOutCirc: function (n, e, t, u, a) {
      return (e /= a / 2) < 1
        ? (-u / 2) * (Math.sqrt(1 - e * e) - 1) + t
        : (u / 2) * (Math.sqrt(1 - (e -= 2) * e) + 1) + t;
    },
    easeInElastic: function (n, e, t, u, a) {
      var r = 1.70158,
        i = 0,
        s = u;
      if (0 == e) return t;
      if (1 == (e /= a)) return t + u;
      if ((i || (i = 0.3 * a), s < Math.abs(u))) {
        s = u;
        var r = i / 4;
      } else var r = (i / (2 * Math.PI)) * Math.asin(u / s);
      return (
        -(
          s *
          Math.pow(2, 10 * (e -= 1)) *
          Math.sin((2 * (e * a - r) * Math.PI) / i)
        ) + t
      );
    },
    easeOutElastic: function (n, e, t, u, a) {
      var r = 1.70158,
        i = 0,
        s = u;
      if (0 == e) return t;
      if (1 == (e /= a)) return t + u;
      if ((i || (i = 0.3 * a), s < Math.abs(u))) {
        s = u;
        var r = i / 4;
      } else var r = (i / (2 * Math.PI)) * Math.asin(u / s);
      return (
        s * Math.pow(2, -10 * e) * Math.sin((2 * (e * a - r) * Math.PI) / i) +
        u +
        t
      );
    },
    easeInOutElastic: function (n, e, t, u, a) {
      var r = 1.70158,
        i = 0,
        s = u;
      if (0 == e) return t;
      if (2 == (e /= a / 2)) return t + u;
      if ((i || (i = 0.3 * a * 1.5), s < Math.abs(u))) {
        s = u;
        var r = i / 4;
      } else var r = (i / (2 * Math.PI)) * Math.asin(u / s);
      return 1 > e
        ? -0.5 *
            s *
            Math.pow(2, 10 * (e -= 1)) *
            Math.sin((2 * (e * a - r) * Math.PI) / i) +
            t
        : s *
            Math.pow(2, -10 * (e -= 1)) *
            Math.sin((2 * (e * a - r) * Math.PI) / i) *
            0.5 +
            u +
            t;
    },
    easeInBack: function (n, e, t, u, a, r) {
      return (
        void 0 == r && (r = 1.70158), u * (e /= a) * e * ((r + 1) * e - r) + t
      );
    },
    easeOutBack: function (n, e, t, u, a, r) {
      return (
        void 0 == r && (r = 1.70158),
        u * ((e = e / a - 1) * e * ((r + 1) * e + r) + 1) + t
      );
    },
    easeInOutBack: function (n, e, t, u, a, r) {
      return (
        void 0 == r && (r = 1.70158),
        (e /= a / 2) < 1
          ? (u / 2) * e * e * (((r *= 1.525) + 1) * e - r) + t
          : (u / 2) * ((e -= 2) * e * (((r *= 1.525) + 1) * e + r) + 2) + t
      );
    },
    easeInBounce: function (n, e, t, u, a) {
      return u - jQuery.easing.easeOutBounce(n, a - e, 0, u, a) + t;
    },
    easeOutBounce: function (n, e, t, u, a) {
      return (e /= a) < 1 / 2.75
        ? 7.5625 * u * e * e + t
        : 2 / 2.75 > e
          ? u * (7.5625 * (e -= 1.5 / 2.75) * e + 0.75) + t
          : 2.5 / 2.75 > e
            ? u * (7.5625 * (e -= 2.25 / 2.75) * e + 0.9375) + t
            : u * (7.5625 * (e -= 2.625 / 2.75) * e + 0.984375) + t;
    },
    easeInOutBounce: function (n, e, t, u, a) {
      return a / 2 > e
        ? 0.5 * jQuery.easing.easeInBounce(n, 2 * e, 0, u, a) + t
        : 0.5 * jQuery.easing.easeOutBounce(n, 2 * e - a, 0, u, a) +
            0.5 * u +
            t;
    },
  });
