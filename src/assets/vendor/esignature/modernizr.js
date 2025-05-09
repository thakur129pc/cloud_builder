/* Modernizr 2.5.2 (Custom Build) | MIT & BSD
 * Build: http://www.modernizr.com/download/#-borderradius-csscolumns-canvas-touch-mq-cssclasses-addtest-teststyles-testprop-testallprops-prefixes-domprefixes-fullscreen_api
 */
(window.Modernizr = (function (a, b, c) {
  function A(a) {
    j.cssText = a;
  }
  function B(a, b) {
    return A(m.join(a + ';') + (b || ''));
  }
  function C(a, b) {
    return typeof a === b;
  }
  function D(a, b) {
    return !!~('' + a).indexOf(b);
  }
  function E(a, b) {
    for (var d in a) if (j[a[d]] !== c) return b == 'pfx' ? a[d] : !0;
    return !1;
  }
  function F(a, b, d) {
    for (var e in a) {
      var f = b[a[e]];
      if (f !== c)
        return d === !1 ? a[e] : C(f, 'function') ? f.bind(d || b) : f;
    }
    return !1;
  }
  function G(a, b, c) {
    var d = a.charAt(0).toUpperCase() + a.substr(1),
      e = (a + ' ' + o.join(d + ' ') + d).split(' ');
    return C(b, 'string') || C(b, 'undefined')
      ? E(e, b)
      : ((e = (a + ' ' + p.join(d + ' ') + d).split(' ')), F(e, b, c));
  }
  var d = '2.5.2',
    e = {},
    f = !0,
    g = b.documentElement,
    h = 'modernizr',
    i = b.createElement(h),
    j = i.style,
    k,
    l = {}.toString,
    m = ' -webkit- -moz- -o- -ms- '.split(' '),
    n = 'Webkit Moz O ms',
    o = n.split(' '),
    p = n.toLowerCase().split(' '),
    q = {},
    r = {},
    s = {},
    t = [],
    u = t.slice,
    v,
    w = function (a, c, d, e) {
      var f,
        i,
        j,
        k = b.createElement('div'),
        l = b.body,
        m = l ? l : b.createElement('body');
      if (parseInt(d, 10))
        while (d--)
          (j = b.createElement('div')),
            (j.id = e ? e[d] : h + (d + 1)),
            k.appendChild(j);
      return (
        (f = ['&#173;', '<style>', a, '</style>'].join('')),
        (k.id = h),
        (m.innerHTML += f),
        m.appendChild(k),
        l || g.appendChild(m),
        (i = c(k, a)),
        l ? k.parentNode.removeChild(k) : m.parentNode.removeChild(m),
        !!i
      );
    },
    x = function (b) {
      var c = a.matchMedia || a.msMatchMedia;
      if (c) return c(b).matches;
      var d;
      return (
        w(
          '@media ' + b + ' { #' + h + ' { position: absolute; } }',
          function (b) {
            d =
              (a.getComputedStyle ? getComputedStyle(b, null) : b.currentStyle)[
                'position'
              ] == 'absolute';
          }
        ),
        d
      );
    },
    y = {}.hasOwnProperty,
    z;
  !C(y, 'undefined') && !C(y.call, 'undefined')
    ? (z = function (a, b) {
        return y.call(a, b);
      })
    : (z = function (a, b) {
        return b in a && C(a.constructor.prototype[b], 'undefined');
      }),
    Function.prototype.bind ||
      (Function.prototype.bind = function (b) {
        var c = this;
        if (typeof c != 'function') throw new TypeError();
        var d = u.call(arguments, 1),
          e = function () {
            if (this instanceof e) {
              var a = function () {};
              a.prototype = c.prototype;
              var f = new a(),
                g = c.apply(f, d.concat(u.call(arguments)));
              return Object(g) === g ? g : f;
            }
            return c.apply(b, d.concat(u.call(arguments)));
          };
        return e;
      });
  var H = (function (c, d) {
    var f = c.join(''),
      g = d.length;
    w(
      f,
      function (c, d) {
        var f = b.styleSheets[b.styleSheets.length - 1],
          h = f
            ? f.cssRules && f.cssRules[0]
              ? f.cssRules[0].cssText
              : f.cssText || ''
            : '',
          i = c.childNodes,
          j = {};
        while (g--) j[i[g].id] = i[g];
        e.touch =
          'ontouchstart' in a ||
          (a.DocumentTouch && b instanceof DocumentTouch) ||
          (j.touch && j.touch.offsetTop) === 9;
      },
      g,
      d
    );
  })(
    [
      ,
      [
        '@media (',
        m.join('touch-enabled),('),
        h,
        ')',
        '{#touch{top:9px;position:absolute}}',
      ].join(''),
    ],
    [, 'touch']
  );
  (q.canvas = function () {
    var a = b.createElement('canvas');
    return !!a.getContext && !!a.getContext('2d');
  }),
    (q.touch = function () {
      return e.touch;
    }),
    (q.borderradius = function () {
      return G('borderRadius');
    }),
    (q.csscolumns = function () {
      return G('columnCount');
    });
  for (var I in q)
    z(q, I) &&
      ((v = I.toLowerCase()), (e[v] = q[I]()), t.push((e[v] ? '' : 'no-') + v));
  return (
    (e.addTest = function (a, b) {
      if (typeof a == 'object') for (var d in a) z(a, d) && e.addTest(d, a[d]);
      else {
        a = a.toLowerCase();
        if (e[a] !== c) return e;
        (b = typeof b == 'function' ? b() : b),
          (g.className += ' ' + (b ? '' : 'no-') + a),
          (e[a] = b);
      }
      return e;
    }),
    A(''),
    (i = k = null),
    (e._version = d),
    (e._prefixes = m),
    (e._domPrefixes = p),
    (e._cssomPrefixes = o),
    (e.mq = x),
    (e.testProp = function (a) {
      return E([a]);
    }),
    (e.testAllProps = G),
    (e.testStyles = w),
    (g.className =
      g.className.replace(/(^|\s)no-js(\s|$)/, '$1$2') +
      (f ? ' js ' + t.join(' ') : '')),
    e
  );
})(this, this.document)),
  Modernizr.addTest('fullscreen', function () {
    for (var a = 0; a < Modernizr._domPrefixes.length; a++)
      if (
        document[Modernizr._domPrefixes[a].toLowerCase() + 'CancelFullScreen']
      )
        return !0;
    return !!document.cancelFullScreen || !1;
  });
