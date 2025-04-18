!(function (t) {
  'function' == typeof define && define.amd ? define(['jquery'], t) : t(jQuery);
})(function (t) {
  function e(e, i) {
    var r,
      o,
      u,
      s = e.nodeName.toLowerCase();
    return 'area' === s
      ? ((r = e.parentNode),
        (o = r.name),
        e.href && o && 'map' === r.nodeName.toLowerCase()
          ? ((u = t("img[usemap='#" + o + "']")[0]), !!u && n(u))
          : !1)
      : (/^(input|select|textarea|button|object)$/.test(s)
          ? !e.disabled
          : 'a' === s
            ? e.href || i
            : i) && n(e);
  }
  function n(e) {
    return (
      t.expr.filters.visible(e) &&
      !t(e)
        .parents()
        .addBack()
        .filter(function () {
          return 'hidden' === t.css(this, 'visibility');
        }).length
    );
  }
  (t.ui = t.ui || {}),
    t.extend(t.ui, {
      version: '1.11.3',
      keyCode: {
        BACKSPACE: 8,
        COMMA: 188,
        DELETE: 46,
        DOWN: 40,
        END: 35,
        ENTER: 13,
        ESCAPE: 27,
        HOME: 36,
        LEFT: 37,
        PAGE_DOWN: 34,
        PAGE_UP: 33,
        PERIOD: 190,
        RIGHT: 39,
        SPACE: 32,
        TAB: 9,
        UP: 38,
      },
    }),
    t.fn.extend({
      scrollParent: function (e) {
        var n = this.css('position'),
          i = 'absolute' === n,
          r = e ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
          o = this.parents()
            .filter(function () {
              var e = t(this);
              return i && 'static' === e.css('position')
                ? !1
                : r.test(
                    e.css('overflow') +
                      e.css('overflow-y') +
                      e.css('overflow-x')
                  );
            })
            .eq(0);
        return 'fixed' !== n && o.length
          ? o
          : t(this[0].ownerDocument || document);
      },
      uniqueId: (function () {
        var t = 0;
        return function () {
          return this.each(function () {
            this.id || (this.id = 'ui-id-' + ++t);
          });
        };
      })(),
      removeUniqueId: function () {
        return this.each(function () {
          /^ui-id-\d+$/.test(this.id) && t(this).removeAttr('id');
        });
      },
    }),
    t.extend(t.expr[':'], {
      data: t.expr.createPseudo
        ? t.expr.createPseudo(function (e) {
            return function (n) {
              return !!t.data(n, e);
            };
          })
        : function (e, n, i) {
            return !!t.data(e, i[3]);
          },
      focusable: function (n) {
        return e(n, !isNaN(t.attr(n, 'tabindex')));
      },
      tabbable: function (n) {
        var i = t.attr(n, 'tabindex'),
          r = isNaN(i);
        return (r || i >= 0) && e(n, !r);
      },
    }),
    t('<a>').outerWidth(1).jquery ||
      t.each(['Width', 'Height'], function (e, n) {
        function i(e, n, i, o) {
          return (
            t.each(r, function () {
              (n -= parseFloat(t.css(e, 'padding' + this)) || 0),
                i &&
                  (n -= parseFloat(t.css(e, 'border' + this + 'Width')) || 0),
                o && (n -= parseFloat(t.css(e, 'margin' + this)) || 0);
            }),
            n
          );
        }
        var r = 'Width' === n ? ['Left', 'Right'] : ['Top', 'Bottom'],
          o = n.toLowerCase(),
          u = {
            innerWidth: t.fn.innerWidth,
            innerHeight: t.fn.innerHeight,
            outerWidth: t.fn.outerWidth,
            outerHeight: t.fn.outerHeight,
          };
        (t.fn['inner' + n] = function (e) {
          return void 0 === e
            ? u['inner' + n].call(this)
            : this.each(function () {
                t(this).css(o, i(this, e) + 'px');
              });
        }),
          (t.fn['outer' + n] = function (e, r) {
            return 'number' != typeof e
              ? u['outer' + n].call(this, e)
              : this.each(function () {
                  t(this).css(o, i(this, e, !0, r) + 'px');
                });
          });
      }),
    t.fn.addBack ||
      (t.fn.addBack = function (t) {
        return this.add(
          null == t ? this.prevObject : this.prevObject.filter(t)
        );
      }),
    t('<a>').data('a-b', 'a').removeData('a-b').data('a-b') &&
      (t.fn.removeData = (function (e) {
        return function (n) {
          return arguments.length ? e.call(this, t.camelCase(n)) : e.call(this);
        };
      })(t.fn.removeData)),
    (t.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase())),
    t.fn.extend({
      focus: (function (e) {
        return function (n, i) {
          return 'number' == typeof n
            ? this.each(function () {
                var e = this;
                setTimeout(function () {
                  t(e).focus(), i && i.call(e);
                }, n);
              })
            : e.apply(this, arguments);
        };
      })(t.fn.focus),
      disableSelection: (function () {
        var t =
          'onselectstart' in document.createElement('div')
            ? 'selectstart'
            : 'mousedown';
        return function () {
          return this.bind(t + '.ui-disableSelection', function (t) {
            t.preventDefault();
          });
        };
      })(),
      enableSelection: function () {
        return this.unbind('.ui-disableSelection');
      },
      zIndex: function (e) {
        if (void 0 !== e) return this.css('zIndex', e);
        if (this.length)
          for (var n, i, r = t(this[0]); r.length && r[0] !== document; ) {
            if (
              ((n = r.css('position')),
              ('absolute' === n || 'relative' === n || 'fixed' === n) &&
                ((i = parseInt(r.css('zIndex'), 10)), !isNaN(i) && 0 !== i))
            )
              return i;
            r = r.parent();
          }
        return 0;
      },
    }),
    (t.ui.plugin = {
      add: function (e, n, i) {
        var r,
          o = t.ui[e].prototype;
        for (r in i)
          (o.plugins[r] = o.plugins[r] || []), o.plugins[r].push([n, i[r]]);
      },
      call: function (t, e, n, i) {
        var r,
          o = t.plugins[e];
        if (
          o &&
          (i ||
            (t.element[0].parentNode &&
              11 !== t.element[0].parentNode.nodeType))
        )
          for (r = 0; r < o.length; r++)
            t.options[o[r][0]] && o[r][1].apply(t.element, n);
      },
    });
});
