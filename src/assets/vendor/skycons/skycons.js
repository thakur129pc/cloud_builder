!(function (t) {
  'use strict';
  function n(t, n, i, e) {
    t.beginPath(), t.arc(n, i, e, 0, p, !1), t.fill();
  }
  function i(t, n, i, e, a) {
    t.beginPath(), t.moveTo(n, i), t.lineTo(e, a), t.stroke();
  }
  function e(t, i, e, a, o, r, l, s) {
    var h = Math.cos(i * p),
      c = Math.sin(i * p);
    (s -= l), n(t, e - c * o, a + h * r + 0.5 * s, l + (1 - 0.5 * h) * s);
  }
  function a(t, n, i, a, o, r, l, s) {
    var h;
    for (h = 5; h--; ) e(t, n + h / 5, i, a, o, r, l, s);
  }
  function o(t, n, i, e, o, r, l) {
    n /= 3e4;
    var s = 0.21 * o,
      h = 0.12 * o,
      c = 0.24 * o,
      u = 0.28 * o;
    (t.fillStyle = l),
      a(t, n, i, e, s, h, c, u),
      (t.globalCompositeOperation = 'destination-out'),
      a(t, n, i, e, s, h, c - r, u - r),
      (t.globalCompositeOperation = 'source-over');
  }
  function r(t, n, e, a, o, r, l) {
    n /= 12e4;
    var s,
      h,
      c,
      u,
      f = 0.25 * o - 0.5 * r,
      v = 0.32 * o + 0.5 * r,
      d = 0.5 * o - 0.5 * r;
    for (
      t.strokeStyle = l,
        t.lineWidth = r,
        t.lineCap = 'round',
        t.lineJoin = 'round',
        t.beginPath(),
        t.arc(e, a, f, 0, p, !1),
        t.stroke(),
        s = 8;
      s--;

    )
      (h = (n + s / 8) * p),
        (c = Math.cos(h)),
        (u = Math.sin(h)),
        i(t, e + c * v, a + u * v, e + c * d, a + u * d);
  }
  function l(t, n, i, e, a, o, r) {
    n /= 15e3;
    var l = 0.29 * a - 0.5 * o,
      s = 0.05 * a,
      h = Math.cos(n * p),
      c = (h * p) / -16;
    (t.strokeStyle = r),
      (t.lineWidth = o),
      (t.lineCap = 'round'),
      (t.lineJoin = 'round'),
      (i += h * s),
      t.beginPath(),
      t.arc(i, e, l, c + p / 8, c + (7 * p) / 8, !1),
      t.arc(
        i + Math.cos(c) * l * C,
        e + Math.sin(c) * l * C,
        l,
        c + (5 * p) / 8,
        c + (3 * p) / 8,
        !0
      ),
      t.closePath(),
      t.stroke();
  }
  function s(t, n, i, e, a, o, r) {
    n /= 1350;
    var l,
      s,
      h,
      c,
      u = 0.16 * a,
      f = (11 * p) / 12,
      v = (7 * p) / 12;
    for (t.fillStyle = r, l = 4; l--; )
      (s = (n + l / 4) % 1),
        (h = i + ((l - 1.5) / 1.5) * (1 === l || 2 === l ? -1 : 1) * u),
        (c = e + s * s * a),
        t.beginPath(),
        t.moveTo(h, c - 1.5 * o),
        t.arc(h, c, 0.75 * o, f, v, !1),
        t.fill();
  }
  function h(t, n, e, a, o, r, l) {
    n /= 750;
    var s,
      h,
      c,
      u,
      f = 0.1875 * o;
    for (
      t.strokeStyle = l,
        t.lineWidth = 0.5 * r,
        t.lineCap = 'round',
        t.lineJoin = 'round',
        s = 4;
      s--;

    )
      (h = (n + s / 4) % 1),
        (c =
          Math.floor(
            e + ((s - 1.5) / 1.5) * (1 === s || 2 === s ? -1 : 1) * f
          ) + 0.5),
        (u = a + h * o),
        i(t, c, u - 1.5 * r, c, u + 1.5 * r);
  }
  function c(t, n, e, a, o, r, l) {
    n /= 3e3;
    var s,
      h,
      c,
      u,
      f = 0.16 * o,
      v = 0.75 * r,
      d = n * p * 0.7,
      m = Math.cos(d) * v,
      g = Math.sin(d) * v,
      M = d + p / 3,
      C = Math.cos(M) * v,
      w = Math.sin(M) * v,
      y = d + (2 * p) / 3,
      b = Math.cos(y) * v,
      k = Math.sin(y) * v;
    for (
      t.strokeStyle = l,
        t.lineWidth = 0.5 * r,
        t.lineCap = 'round',
        t.lineJoin = 'round',
        s = 4;
      s--;

    )
      (h = (n + s / 4) % 1),
        (c = e + Math.sin((h + s / 4) * p) * f),
        (u = a + h * o),
        i(t, c - m, u - g, c + m, u + g),
        i(t, c - C, u - w, c + C, u + w),
        i(t, c - b, u - k, c + b, u + k);
  }
  function u(t, n, i, e, o, r, l) {
    n /= 3e4;
    var s = 0.21 * o,
      h = 0.06 * o,
      c = 0.21 * o,
      u = 0.28 * o;
    (t.fillStyle = l),
      a(t, n, i, e, s, h, c, u),
      (t.globalCompositeOperation = 'destination-out'),
      a(t, n, i, e, s, h, c - r, u - r),
      (t.globalCompositeOperation = 'source-over');
  }
  function f(t, n, i, e, a, o, r) {
    var l = a / 8,
      s = l / 3,
      h = 2 * s,
      c = (n % 1) * p,
      u = Math.cos(c),
      f = Math.sin(c);
    (t.fillStyle = r),
      (t.strokeStyle = r),
      (t.lineWidth = o),
      (t.lineCap = 'round'),
      (t.lineJoin = 'round'),
      t.beginPath(),
      t.arc(i, e, l, c, c + Math.PI, !1),
      t.arc(i - s * u, e - s * f, h, c + Math.PI, c, !1),
      t.arc(i + h * u, e + h * f, s, c + Math.PI, c, !0),
      (t.globalCompositeOperation = 'destination-out'),
      t.fill(),
      (t.globalCompositeOperation = 'source-over'),
      t.stroke();
  }
  function v(t, n, i, e, a, o, r, l, s) {
    n /= 2500;
    var h,
      c,
      u,
      v,
      d = w[r],
      m = (n + r - y[r].start) % l,
      g = (n + r - y[r].end) % l,
      M = (n + r) % l;
    if (
      ((t.strokeStyle = s),
      (t.lineWidth = o),
      (t.lineCap = 'round'),
      (t.lineJoin = 'round'),
      1 > m)
    ) {
      if (
        (t.beginPath(),
        (m *= d.length / 2 - 1),
        (h = Math.floor(m)),
        (m -= h),
        (h *= 2),
        (h += 2),
        t.moveTo(
          i + (d[h - 2] * (1 - m) + d[h] * m) * a,
          e + (d[h - 1] * (1 - m) + d[h + 1] * m) * a
        ),
        1 > g)
      ) {
        for (
          g *= d.length / 2 - 1,
            c = Math.floor(g),
            g -= c,
            c *= 2,
            c += 2,
            v = h;
          v !== c;
          v += 2
        )
          t.lineTo(i + d[v] * a, e + d[v + 1] * a);
        t.lineTo(
          i + (d[c - 2] * (1 - g) + d[c] * g) * a,
          e + (d[c - 1] * (1 - g) + d[c + 1] * g) * a
        );
      } else
        for (v = h; v !== d.length; v += 2)
          t.lineTo(i + d[v] * a, e + d[v + 1] * a);
      t.stroke();
    } else if (1 > g) {
      for (
        t.beginPath(),
          g *= d.length / 2 - 1,
          c = Math.floor(g),
          g -= c,
          c *= 2,
          c += 2,
          t.moveTo(i + d[0] * a, e + d[1] * a),
          v = 2;
        v !== c;
        v += 2
      )
        t.lineTo(i + d[v] * a, e + d[v + 1] * a);
      t.lineTo(
        i + (d[c - 2] * (1 - g) + d[c] * g) * a,
        e + (d[c - 1] * (1 - g) + d[c + 1] * g) * a
      ),
        t.stroke();
    }
    1 > M &&
      ((M *= d.length / 2 - 1),
      (u = Math.floor(M)),
      (M -= u),
      (u *= 2),
      (u += 2),
      f(
        t,
        n,
        i + (d[u - 2] * (1 - M) + d[u] * M) * a,
        e + (d[u - 1] * (1 - M) + d[u + 1] * M) * a,
        a,
        o,
        s
      ));
  }
  var d, m;
  !(function () {
    var n =
        t.requestAnimationFrame ||
        t.webkitRequestAnimationFrame ||
        t.mozRequestAnimationFrame ||
        t.oRequestAnimationFrame ||
        t.msRequestAnimationFrame,
      i =
        t.cancelAnimationFrame ||
        t.webkitCancelAnimationFrame ||
        t.mozCancelAnimationFrame ||
        t.oCancelAnimationFrame ||
        t.msCancelAnimationFrame;
    n && i
      ? ((d = function (t) {
          function i() {
            (e.value = n(i)), t();
          }
          var e = { value: null };
          return i(), e;
        }),
        (m = function (t) {
          i(t.value);
        }))
      : ((d = setInterval), (m = clearInterval));
  })();
  var g = 500,
    M = 0.08,
    p = 2 * Math.PI,
    C = 2 / Math.sqrt(2),
    w = [
      [
        -0.75, -0.18, -0.7219, -0.1527, -0.6971, -0.1225, -0.6739, -0.091,
        -0.6516, -0.0588, -0.6298, -0.0262, -0.6083, 0.0065, -0.5868, 0.0396,
        -0.5643, 0.0731, -0.5372, 0.1041, -0.5033, 0.1259, -0.4662, 0.1406,
        -0.4275, 0.1493, -0.3881, 0.153, -0.3487, 0.1526, -0.3095, 0.1488,
        -0.2708, 0.1421, -0.2319, 0.1342, -0.1943, 0.1217, -0.16, 0.1025,
        -0.129, 0.0785, -0.1012, 0.0509, -0.0764, 0.0206, -0.0547, -0.012,
        -0.0378, -0.0472, -0.0324, -0.0857, -0.0389, -0.1241, -0.0546, -0.1599,
        -0.0814, -0.1876, -0.1193, -0.1964, -0.1582, -0.1935, -0.1931, -0.1769,
        -0.2157, -0.1453, -0.229, -0.1085, -0.2327, -0.0697, -0.224, -0.0317,
        -0.2064, 0.0033, -0.1853, 0.0362, -0.1613, 0.0672, -0.135, 0.0961,
        -0.1051, 0.1213, -0.0706, 0.1397, -0.0332, 0.1512, 0.0053, 0.158,
        0.0442, 0.1624, 0.0833, 0.1636, 0.1224, 0.1615, 0.1613, 0.1565, 0.1999,
        0.15, 0.2378, 0.1402, 0.2749, 0.1279, 0.3118, 0.1147, 0.3487, 0.1015,
        0.3858, 0.0892, 0.4236, 0.0787, 0.4621, 0.0715, 0.5012, 0.0702, 0.5398,
        0.0766, 0.5768, 0.089, 0.6123, 0.1055, 0.6466, 0.1244, 0.6805, 0.144,
        0.7147, 0.163, 0.75, 0.18,
      ],
      [
        -0.75, 0, -0.7033, 0.0195, -0.6569, 0.0399, -0.6104, 0.06, -0.5634,
        0.0789, -0.5155, 0.0954, -0.4667, 0.1089, -0.4174, 0.1206, -0.3676,
        0.1299, -0.3174, 0.1365, -0.2669, 0.1398, -0.2162, 0.1391, -0.1658,
        0.1347, -0.1157, 0.1271, -0.0661, 0.1169, -0.017, 0.1046, 0.0316,
        0.0903, 0.0791, 0.0728, 0.1259, 0.0534, 0.1723, 0.0331, 0.2188, 0.0129,
        0.2656, -0.0064, 0.3122, -0.0263, 0.3586, -0.0466, 0.4052, -0.0665,
        0.4525, -0.0847, 0.5007, -0.1002, 0.5497, -0.113, 0.5991, -0.124,
        0.6491, -0.1325, 0.6994, -0.138, 0.75, -0.14,
      ],
    ],
    y = [
      { start: 0.36, end: 0.11 },
      { start: 0.56, end: 0.16 },
    ],
    b = function (t) {
      (this.list = []),
        (this.interval = null),
        (this.color = t && t.color ? t.color : 'black'),
        (this.resizeClear = !(!t || !t.resizeClear));
    };
  (b.CLEAR_DAY = function (t, n, i) {
    var e = t.canvas.width,
      a = t.canvas.height,
      o = Math.min(e, a);
    r(t, n, 0.5 * e, 0.5 * a, o, o * M, i);
  }),
    (b.CLEAR_NIGHT = function (t, n, i) {
      var e = t.canvas.width,
        a = t.canvas.height,
        o = Math.min(e, a);
      l(t, n, 0.5 * e, 0.5 * a, o, o * M, i);
    }),
    (b.PARTLY_CLOUDY_DAY = function (t, n, i) {
      var e = t.canvas.width,
        a = t.canvas.height,
        l = Math.min(e, a);
      r(t, n, 0.625 * e, 0.375 * a, 0.75 * l, l * M, i),
        o(t, n, 0.375 * e, 0.625 * a, 0.75 * l, l * M, i);
    }),
    (b.PARTLY_CLOUDY_NIGHT = function (t, n, i) {
      var e = t.canvas.width,
        a = t.canvas.height,
        r = Math.min(e, a);
      l(t, n, 0.667 * e, 0.375 * a, 0.75 * r, r * M, i),
        o(t, n, 0.375 * e, 0.625 * a, 0.75 * r, r * M, i);
    }),
    (b.CLOUDY = function (t, n, i) {
      var e = t.canvas.width,
        a = t.canvas.height,
        r = Math.min(e, a);
      o(t, n, 0.5 * e, 0.5 * a, r, r * M, i);
    }),
    (b.RAIN = function (t, n, i) {
      var e = t.canvas.width,
        a = t.canvas.height,
        r = Math.min(e, a);
      s(t, n, 0.5 * e, 0.37 * a, 0.9 * r, r * M, i),
        o(t, n, 0.5 * e, 0.37 * a, 0.9 * r, r * M, i);
    }),
    (b.SLEET = function (t, n, i) {
      var e = t.canvas.width,
        a = t.canvas.height,
        r = Math.min(e, a);
      h(t, n, 0.5 * e, 0.37 * a, 0.9 * r, r * M, i),
        o(t, n, 0.5 * e, 0.37 * a, 0.9 * r, r * M, i);
    }),
    (b.SNOW = function (t, n, i) {
      var e = t.canvas.width,
        a = t.canvas.height,
        r = Math.min(e, a);
      c(t, n, 0.5 * e, 0.37 * a, 0.9 * r, r * M, i),
        o(t, n, 0.5 * e, 0.37 * a, 0.9 * r, r * M, i);
    }),
    (b.WIND = function (t, n, i) {
      var e = t.canvas.width,
        a = t.canvas.height,
        o = Math.min(e, a);
      v(t, n, 0.5 * e, 0.5 * a, o, o * M, 0, 2, i),
        v(t, n, 0.5 * e, 0.5 * a, o, o * M, 1, 2, i);
    }),
    (b.FOG = function (t, n, e) {
      var a = t.canvas.width,
        o = t.canvas.height,
        r = Math.min(a, o),
        l = r * M;
      u(t, n, 0.5 * a, 0.32 * o, 0.75 * r, l, e), (n /= 5e3);
      var s = Math.cos(n * p) * r * 0.02,
        h = Math.cos((n + 0.25) * p) * r * 0.02,
        c = Math.cos((n + 0.5) * p) * r * 0.02,
        f = Math.cos((n + 0.75) * p) * r * 0.02,
        v = 0.936 * o,
        d = Math.floor(v - 0.5 * l) + 0.5,
        m = Math.floor(v - 2.5 * l) + 0.5;
      (t.strokeStyle = e),
        (t.lineWidth = l),
        (t.lineCap = 'round'),
        (t.lineJoin = 'round'),
        i(t, s + 0.2 * a + 0.5 * l, d, h + 0.8 * a - 0.5 * l, d),
        i(t, c + 0.2 * a + 0.5 * l, m, f + 0.8 * a - 0.5 * l, m);
    }),
    (b.prototype = {
      _determineDrawingFunction: function (t) {
        return (
          'string' == typeof t &&
            (t = b[t.toUpperCase().replace(/-/g, '_')] || null),
          t
        );
      },
      add: function (t, n) {
        var i;
        'string' == typeof t && (t = document.getElementById(t)),
          null !== t &&
            ((n = this._determineDrawingFunction(n)),
            'function' == typeof n &&
              ((i = { element: t, context: t.getContext('2d'), drawing: n }),
              this.list.push(i),
              this.draw(i, g)));
      },
      set: function (t, n) {
        var i;
        for (
          'string' == typeof t && (t = document.getElementById(t)),
            i = this.list.length;
          i--;

        )
          if (this.list[i].element === t)
            return (
              (this.list[i].drawing = this._determineDrawingFunction(n)),
              void this.draw(this.list[i], g)
            );
        this.add(t, n);
      },
      remove: function (t) {
        var n;
        for (
          'string' == typeof t && (t = document.getElementById(t)),
            n = this.list.length;
          n--;

        )
          if (this.list[n].element === t) return void this.list.splice(n, 1);
      },
      draw: function (t, n) {
        var i = t.context.canvas;
        this.resizeClear
          ? (i.width = i.width)
          : t.context.clearRect(0, 0, i.width, i.height),
          t.drawing(t.context, n, this.color);
      },
      play: function () {
        var t = this;
        this.pause(),
          (this.interval = d(function () {
            var n,
              i = Date.now();
            for (n = t.list.length; n--; ) t.draw(t.list[n], i);
          }, 1e3 / 60));
      },
      pause: function () {
        this.interval && (m(this.interval), (this.interval = null));
      },
    }),
    (t.Skycons = b);
})(this);
