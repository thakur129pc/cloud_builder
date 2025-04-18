!(function (e) {
  'function' == typeof define && define.amd
    ? define(['jquery'], e)
    : e('object' == typeof exports ? require('jquery') : jQuery);
})(function (e) {
  function t(t) {
    var r,
      n,
      i,
      o = arguments.length,
      s = window[t],
      a = arguments,
      u = a[1];
    if (2 > o) throw new Error('Minimum 2 arguments must be given');
    if (e.isArray(u)) {
      n = {};
      for (var f in u) {
        r = u[f];
        try {
          n[r] = JSON.parse(s.getItem(r));
        } catch (c) {
          n[r] = s.getItem(r);
        }
      }
      return n;
    }
    if (2 != o) {
      try {
        n = JSON.parse(s.getItem(u));
      } catch (c) {
        throw new ReferenceError(u + ' is not defined in this storage');
      }
      for (var f = 2; o - 1 > f; f++)
        if (((n = n[a[f]]), void 0 === n))
          throw new ReferenceError(
            [].slice.call(a, 1, f + 1).join('.') +
              ' is not defined in this storage'
          );
      if (e.isArray(a[f])) {
        (i = n), (n = {});
        for (var m in a[f]) n[a[f][m]] = i[a[f][m]];
        return n;
      }
      return n[a[f]];
    }
    try {
      return JSON.parse(s.getItem(u));
    } catch (c) {
      return s.getItem(u);
    }
  }
  function r(t) {
    var r,
      n,
      i = arguments.length,
      o = window[t],
      s = arguments,
      a = s[1],
      u = s[2],
      f = {};
    if (2 > i || (!e.isPlainObject(a) && 3 > i))
      throw new Error(
        'Minimum 3 arguments must be given or second parameter must be an object'
      );
    if (e.isPlainObject(a)) {
      for (var c in a)
        (r = a[c]),
          e.isPlainObject(r)
            ? o.setItem(c, JSON.stringify(r))
            : o.setItem(c, r);
      return a;
    }
    if (3 == i)
      return (
        'object' == typeof u
          ? o.setItem(a, JSON.stringify(u))
          : o.setItem(a, u),
        u
      );
    try {
      (n = o.getItem(a)), null != n && (f = JSON.parse(n));
    } catch (m) {}
    n = f;
    for (var c = 2; i - 2 > c; c++)
      (r = s[c]), (n[r] && e.isPlainObject(n[r])) || (n[r] = {}), (n = n[r]);
    return (n[s[c]] = s[c + 1]), o.setItem(a, JSON.stringify(f)), f;
  }
  function n(t) {
    var r,
      n,
      i = arguments.length,
      o = window[t],
      s = arguments,
      a = s[1];
    if (2 > i) throw new Error('Minimum 2 arguments must be given');
    if (e.isArray(a)) {
      for (var u in a) o.removeItem(a[u]);
      return !0;
    }
    if (2 == i) return o.removeItem(a), !0;
    try {
      r = n = JSON.parse(o.getItem(a));
    } catch (f) {
      throw new ReferenceError(a + ' is not defined in this storage');
    }
    for (var u = 2; i - 1 > u; u++)
      if (((n = n[s[u]]), void 0 === n))
        throw new ReferenceError(
          [].slice.call(s, 1, u).join('.') + ' is not defined in this storage'
        );
    if (e.isArray(s[u])) for (var c in s[u]) delete n[s[u][c]];
    else delete n[s[u]];
    return o.setItem(a, JSON.stringify(r)), !0;
  }
  function i(t, r) {
    var i = a(t);
    for (var o in i) n(t, i[o]);
    if (r) for (var o in e.namespaceStorages) u(o);
  }
  function o(r) {
    var n = arguments.length,
      i = arguments,
      s = (window[r], i[1]);
    if (1 == n) return 0 == a(r).length;
    if (e.isArray(s)) {
      for (var u = 0; u < s.length; u++) if (!o(r, s[u])) return !1;
      return !0;
    }
    try {
      var f = t.apply(this, arguments);
      e.isArray(i[n - 1]) || (f = { totest: f });
      for (var u in f)
        if (
          !(
            (e.isPlainObject(f[u]) && e.isEmptyObject(f[u])) ||
            (e.isArray(f[u]) && !f[u].length)
          ) &&
          f[u]
        )
          return !1;
      return !0;
    } catch (c) {
      return !0;
    }
  }
  function s(r) {
    var n = arguments.length,
      i = arguments,
      o = (window[r], i[1]);
    if (2 > n) throw new Error('Minimum 2 arguments must be given');
    if (e.isArray(o)) {
      for (var a = 0; a < o.length; a++) if (!s(r, o[a])) return !1;
      return !0;
    }
    try {
      var u = t.apply(this, arguments);
      e.isArray(i[n - 1]) || (u = { totest: u });
      for (var a in u) if (void 0 === u[a] || null === u[a]) return !1;
      return !0;
    } catch (f) {
      return !1;
    }
  }
  function a(r) {
    var n = arguments.length,
      i = window[r],
      o = arguments,
      s = (o[1], []),
      a = {};
    if (((a = n > 1 ? t.apply(this, o) : i), a._cookie))
      for (var u in e.cookie()) '' != u && s.push(u.replace(a._prefix, ''));
    else for (var f in a) s.push(f);
    return s;
  }
  function u(t) {
    if (!t || 'string' != typeof t)
      throw new Error('First parameter must be a string');
    g
      ? (window.localStorage.getItem(t) || window.localStorage.setItem(t, '{}'),
        window.sessionStorage.getItem(t) ||
          window.sessionStorage.setItem(t, '{}'))
      : (window.localCookieStorage.getItem(t) ||
          window.localCookieStorage.setItem(t, '{}'),
        window.sessionCookieStorage.getItem(t) ||
          window.sessionCookieStorage.setItem(t, '{}'));
    var r = {
      localStorage: e.extend({}, e.localStorage, { _ns: t }),
      sessionStorage: e.extend({}, e.sessionStorage, { _ns: t }),
    };
    return (
      e.cookie &&
        (window.cookieStorage.getItem(t) ||
          window.cookieStorage.setItem(t, '{}'),
        (r.cookieStorage = e.extend({}, e.cookieStorage, { _ns: t }))),
      (e.namespaceStorages[t] = r),
      r
    );
  }
  function f(e) {
    if (!window[e]) return !1;
    var t = 'jsapi';
    try {
      return window[e].setItem(t, t), window[e].removeItem(t), !0;
    } catch (r) {
      return !1;
    }
  }
  var c = 'ls_',
    m = 'ss_',
    g = f('localStorage'),
    h = {
      _type: '',
      _ns: '',
      _callMethod: function (e, t) {
        var r = [this._type],
          t = Array.prototype.slice.call(t),
          n = t[0];
        return (
          this._ns && r.push(this._ns),
          'string' == typeof n &&
            -1 !== n.indexOf('.') &&
            (t.shift(), [].unshift.apply(t, n.split('.'))),
          [].push.apply(r, t),
          e.apply(this, r)
        );
      },
      get: function () {
        return this._callMethod(t, arguments);
      },
      set: function () {
        var t = arguments.length,
          n = arguments,
          i = n[0];
        if (1 > t || (!e.isPlainObject(i) && 2 > t))
          throw new Error(
            'Minimum 2 arguments must be given or first parameter must be an object'
          );
        if (e.isPlainObject(i) && this._ns) {
          for (var o in i) r(this._type, this._ns, o, i[o]);
          return i;
        }
        var s = this._callMethod(r, n);
        return this._ns ? s[i.split('.')[0]] : s;
      },
      remove: function () {
        if (arguments.length < 1)
          throw new Error('Minimum 1 argument must be given');
        return this._callMethod(n, arguments);
      },
      removeAll: function (e) {
        return this._ns ? (r(this._type, this._ns, {}), !0) : i(this._type, e);
      },
      isEmpty: function () {
        return this._callMethod(o, arguments);
      },
      isSet: function () {
        if (arguments.length < 1)
          throw new Error('Minimum 1 argument must be given');
        return this._callMethod(s, arguments);
      },
      keys: function () {
        return this._callMethod(a, arguments);
      },
    };
  if (e.cookie) {
    window.name || (window.name = Math.floor(1e8 * Math.random()));
    var l = {
      _cookie: !0,
      _prefix: '',
      _expires: null,
      _path: null,
      _domain: null,
      setItem: function (t, r) {
        e.cookie(this._prefix + t, r, {
          expires: this._expires,
          path: this._path,
          domain: this._domain,
        });
      },
      getItem: function (t) {
        return e.cookie(this._prefix + t);
      },
      removeItem: function (t) {
        return e.removeCookie(this._prefix + t);
      },
      clear: function () {
        for (var t in e.cookie())
          '' != t &&
            ((!this._prefix && -1 === t.indexOf(c) && -1 === t.indexOf(m)) ||
              (this._prefix && 0 === t.indexOf(this._prefix))) &&
            e.removeCookie(t);
      },
      setExpires: function (e) {
        return (this._expires = e), this;
      },
      setPath: function (e) {
        return (this._path = e), this;
      },
      setDomain: function (e) {
        return (this._domain = e), this;
      },
      setConf: function (e) {
        return (
          e.path && (this._path = e.path),
          e.domain && (this._domain = e.domain),
          e.expires && (this._expires = e.expires),
          this
        );
      },
      setDefaultConf: function () {
        this._path = this._domain = this._expires = null;
      },
    };
    g ||
      ((window.localCookieStorage = e.extend({}, l, {
        _prefix: c,
        _expires: 3650,
      })),
      (window.sessionCookieStorage = e.extend({}, l, {
        _prefix: m + window.name + '_',
      }))),
      (window.cookieStorage = e.extend({}, l)),
      (e.cookieStorage = e.extend({}, h, {
        _type: 'cookieStorage',
        setExpires: function (e) {
          return window.cookieStorage.setExpires(e), this;
        },
        setPath: function (e) {
          return window.cookieStorage.setPath(e), this;
        },
        setDomain: function (e) {
          return window.cookieStorage.setDomain(e), this;
        },
        setConf: function (e) {
          return window.cookieStorage.setConf(e), this;
        },
        setDefaultConf: function () {
          return window.cookieStorage.setDefaultConf(), this;
        },
      }));
  }
  (e.initNamespaceStorage = function (e) {
    return u(e);
  }),
    g
      ? ((e.localStorage = e.extend({}, h, { _type: 'localStorage' })),
        (e.sessionStorage = e.extend({}, h, { _type: 'sessionStorage' })))
      : ((e.localStorage = e.extend({}, h, { _type: 'localCookieStorage' })),
        (e.sessionStorage = e.extend({}, h, {
          _type: 'sessionCookieStorage',
        }))),
    (e.namespaceStorages = {}),
    (e.removeAllStorages = function (t) {
      e.localStorage.removeAll(t),
        e.sessionStorage.removeAll(t),
        e.cookieStorage && e.cookieStorage.removeAll(t),
        t || (e.namespaceStorages = {});
    });
});
