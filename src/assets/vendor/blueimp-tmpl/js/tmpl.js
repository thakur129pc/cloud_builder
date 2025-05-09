!(function (e) {
  'use strict';
  var n = function (e, t) {
    var c = /[^\w\-\.:]/.test(e)
      ? new Function(
          n.arg + ',tmpl',
          'var _e=tmpl.encode' +
            n.helper +
            ",_s='" +
            e.replace(n.regexp, n.func) +
            "';return _s;"
        )
      : (n.cache[e] = n.cache[e] || n(n.load(e)));
    return t
      ? c(t, n)
      : function (e) {
          return c(e, n);
        };
  };
  (n.cache = {}),
    (n.load = function (e) {
      return document.getElementById(e).innerHTML;
    }),
    (n.regexp =
      /([\s'\\])(?!(?:[^{]|\{(?!%))*%\})|(?:\{%(=|#)([\s\S]+?)%\})|(\{%)|(%\})/g),
    (n.func = function (e, n, t, c, r, u) {
      return n
        ? { '\n': '\\n', '\r': '\\r', '	': '\\t', ' ': ' ' }[n] || '\\' + n
        : t
          ? '=' === t
            ? "'+_e(" + c + ")+'"
            : "'+(" + c + "==null?'':" + c + ")+'"
          : r
            ? "';"
            : u
              ? "_s+='"
              : void 0;
    }),
    (n.encReg = /[<>&"'\x00]/g),
    (n.encMap = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      "'": '&#39;',
    }),
    (n.encode = function (e) {
      return (null == e ? '' : '' + e).replace(n.encReg, function (e) {
        return n.encMap[e] || '';
      });
    }),
    (n.arg = 'o'),
    (n.helper =
      ",print=function(s,e){_s+=e?(s==null?'':s):_e(s);},include=function(s,d){_s+=tmpl(s,d);}"),
    'function' == typeof define && define.amd
      ? define(function () {
          return n;
        })
      : (e.tmpl = n);
})(this);
