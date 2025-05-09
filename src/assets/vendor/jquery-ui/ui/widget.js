!(function (t) {
  'function' == typeof define && define.amd ? define(['jquery'], t) : t(jQuery);
})(function (t) {
  var e = 0,
    i = Array.prototype.slice;
  return (
    (t.cleanData = (function (e) {
      return function (i) {
        var n, s, o;
        for (o = 0; null != (s = i[o]); o++)
          try {
            (n = t._data(s, 'events')),
              n && n.remove && t(s).triggerHandler('remove');
          } catch (r) {}
        e(i);
      };
    })(t.cleanData)),
    (t.widget = function (e, i, n) {
      var s,
        o,
        r,
        a,
        u = {},
        d = e.split('.')[0];
      return (
        (e = e.split('.')[1]),
        (s = d + '-' + e),
        n || ((n = i), (i = t.Widget)),
        (t.expr[':'][s.toLowerCase()] = function (e) {
          return !!t.data(e, s);
        }),
        (t[d] = t[d] || {}),
        (o = t[d][e]),
        (r = t[d][e] =
          function (t, e) {
            return this._createWidget
              ? void (arguments.length && this._createWidget(t, e))
              : new r(t, e);
          }),
        t.extend(r, o, {
          version: n.version,
          _proto: t.extend({}, n),
          _childConstructors: [],
        }),
        (a = new i()),
        (a.options = t.widget.extend({}, a.options)),
        t.each(n, function (e, n) {
          return t.isFunction(n)
            ? void (u[e] = (function () {
                var t = function () {
                    return i.prototype[e].apply(this, arguments);
                  },
                  s = function (t) {
                    return i.prototype[e].apply(this, t);
                  };
                return function () {
                  var e,
                    i = this._super,
                    o = this._superApply;
                  return (
                    (this._super = t),
                    (this._superApply = s),
                    (e = n.apply(this, arguments)),
                    (this._super = i),
                    (this._superApply = o),
                    e
                  );
                };
              })())
            : void (u[e] = n);
        }),
        (r.prototype = t.widget.extend(
          a,
          { widgetEventPrefix: o ? a.widgetEventPrefix || e : e },
          u,
          { constructor: r, namespace: d, widgetName: e, widgetFullName: s }
        )),
        o
          ? (t.each(o._childConstructors, function (e, i) {
              var n = i.prototype;
              t.widget(n.namespace + '.' + n.widgetName, r, i._proto);
            }),
            delete o._childConstructors)
          : i._childConstructors.push(r),
        t.widget.bridge(e, r),
        r
      );
    }),
    (t.widget.extend = function (e) {
      for (var n, s, o = i.call(arguments, 1), r = 0, a = o.length; a > r; r++)
        for (n in o[r])
          (s = o[r][n]),
            o[r].hasOwnProperty(n) &&
              void 0 !== s &&
              (e[n] = t.isPlainObject(s)
                ? t.isPlainObject(e[n])
                  ? t.widget.extend({}, e[n], s)
                  : t.widget.extend({}, s)
                : s);
      return e;
    }),
    (t.widget.bridge = function (e, n) {
      var s = n.prototype.widgetFullName || e;
      t.fn[e] = function (o) {
        var r = 'string' == typeof o,
          a = i.call(arguments, 1),
          u = this;
        return (
          r
            ? this.each(function () {
                var i,
                  n = t.data(this, s);
                return 'instance' === o
                  ? ((u = n), !1)
                  : n
                    ? t.isFunction(n[o]) && '_' !== o.charAt(0)
                      ? ((i = n[o].apply(n, a)),
                        i !== n && void 0 !== i
                          ? ((u = i && i.jquery ? u.pushStack(i.get()) : i), !1)
                          : void 0)
                      : t.error(
                          "no such method '" +
                            o +
                            "' for " +
                            e +
                            ' widget instance'
                        )
                    : t.error(
                        'cannot call methods on ' +
                          e +
                          " prior to initialization; attempted to call method '" +
                          o +
                          "'"
                      );
              })
            : (a.length && (o = t.widget.extend.apply(null, [o].concat(a))),
              this.each(function () {
                var e = t.data(this, s);
                e
                  ? (e.option(o || {}), e._init && e._init())
                  : t.data(this, s, new n(o, this));
              })),
          u
        );
      };
    }),
    (t.Widget = function () {}),
    (t.Widget._childConstructors = []),
    (t.Widget.prototype = {
      widgetName: 'widget',
      widgetEventPrefix: '',
      defaultElement: '<div>',
      options: { disabled: !1, create: null },
      _createWidget: function (i, n) {
        (n = t(n || this.defaultElement || this)[0]),
          (this.element = t(n)),
          (this.uuid = e++),
          (this.eventNamespace = '.' + this.widgetName + this.uuid),
          (this.bindings = t()),
          (this.hoverable = t()),
          (this.focusable = t()),
          n !== this &&
            (t.data(n, this.widgetFullName, this),
            this._on(!0, this.element, {
              remove: function (t) {
                t.target === n && this.destroy();
              },
            }),
            (this.document = t(n.style ? n.ownerDocument : n.document || n)),
            (this.window = t(
              this.document[0].defaultView || this.document[0].parentWindow
            ))),
          (this.options = t.widget.extend(
            {},
            this.options,
            this._getCreateOptions(),
            i
          )),
          this._create(),
          this._trigger('create', null, this._getCreateEventData()),
          this._init();
      },
      _getCreateOptions: t.noop,
      _getCreateEventData: t.noop,
      _create: t.noop,
      _init: t.noop,
      destroy: function () {
        this._destroy(),
          this.element
            .unbind(this.eventNamespace)
            .removeData(this.widgetFullName)
            .removeData(t.camelCase(this.widgetFullName)),
          this.widget()
            .unbind(this.eventNamespace)
            .removeAttr('aria-disabled')
            .removeClass(this.widgetFullName + '-disabled ui-state-disabled'),
          this.bindings.unbind(this.eventNamespace),
          this.hoverable.removeClass('ui-state-hover'),
          this.focusable.removeClass('ui-state-focus');
      },
      _destroy: t.noop,
      widget: function () {
        return this.element;
      },
      option: function (e, i) {
        var n,
          s,
          o,
          r = e;
        if (0 === arguments.length) return t.widget.extend({}, this.options);
        if ('string' == typeof e)
          if (((r = {}), (n = e.split('.')), (e = n.shift()), n.length)) {
            for (
              s = r[e] = t.widget.extend({}, this.options[e]), o = 0;
              o < n.length - 1;
              o++
            )
              (s[n[o]] = s[n[o]] || {}), (s = s[n[o]]);
            if (((e = n.pop()), 1 === arguments.length))
              return void 0 === s[e] ? null : s[e];
            s[e] = i;
          } else {
            if (1 === arguments.length)
              return void 0 === this.options[e] ? null : this.options[e];
            r[e] = i;
          }
        return this._setOptions(r), this;
      },
      _setOptions: function (t) {
        var e;
        for (e in t) this._setOption(e, t[e]);
        return this;
      },
      _setOption: function (t, e) {
        return (
          (this.options[t] = e),
          'disabled' === t &&
            (this.widget().toggleClass(this.widgetFullName + '-disabled', !!e),
            e &&
              (this.hoverable.removeClass('ui-state-hover'),
              this.focusable.removeClass('ui-state-focus'))),
          this
        );
      },
      enable: function () {
        return this._setOptions({ disabled: !1 });
      },
      disable: function () {
        return this._setOptions({ disabled: !0 });
      },
      _on: function (e, i, n) {
        var s,
          o = this;
        'boolean' != typeof e && ((n = i), (i = e), (e = !1)),
          n
            ? ((i = s = t(i)), (this.bindings = this.bindings.add(i)))
            : ((n = i), (i = this.element), (s = this.widget())),
          t.each(n, function (n, r) {
            function a() {
              return e ||
                (o.options.disabled !== !0 &&
                  !t(this).hasClass('ui-state-disabled'))
                ? ('string' == typeof r ? o[r] : r).apply(o, arguments)
                : void 0;
            }
            'string' != typeof r &&
              (a.guid = r.guid = r.guid || a.guid || t.guid++);
            var u = n.match(/^([\w:-]*)\s*(.*)$/),
              d = u[1] + o.eventNamespace,
              h = u[2];
            h ? s.delegate(h, d, a) : i.bind(d, a);
          });
      },
      _off: function (e, i) {
        (i =
          (i || '').split(' ').join(this.eventNamespace + ' ') +
          this.eventNamespace),
          e.unbind(i).undelegate(i),
          (this.bindings = t(this.bindings.not(e).get())),
          (this.focusable = t(this.focusable.not(e).get())),
          (this.hoverable = t(this.hoverable.not(e).get()));
      },
      _delay: function (t, e) {
        function i() {
          return ('string' == typeof t ? n[t] : t).apply(n, arguments);
        }
        var n = this;
        return setTimeout(i, e || 0);
      },
      _hoverable: function (e) {
        (this.hoverable = this.hoverable.add(e)),
          this._on(e, {
            mouseenter: function (e) {
              t(e.currentTarget).addClass('ui-state-hover');
            },
            mouseleave: function (e) {
              t(e.currentTarget).removeClass('ui-state-hover');
            },
          });
      },
      _focusable: function (e) {
        (this.focusable = this.focusable.add(e)),
          this._on(e, {
            focusin: function (e) {
              t(e.currentTarget).addClass('ui-state-focus');
            },
            focusout: function (e) {
              t(e.currentTarget).removeClass('ui-state-focus');
            },
          });
      },
      _trigger: function (e, i, n) {
        var s,
          o,
          r = this.options[e];
        if (
          ((n = n || {}),
          (i = t.Event(i)),
          (i.type = (
            e === this.widgetEventPrefix ? e : this.widgetEventPrefix + e
          ).toLowerCase()),
          (i.target = this.element[0]),
          (o = i.originalEvent))
        )
          for (s in o) s in i || (i[s] = o[s]);
        return (
          this.element.trigger(i, n),
          !(
            (t.isFunction(r) &&
              r.apply(this.element[0], [i].concat(n)) === !1) ||
            i.isDefaultPrevented()
          )
        );
      },
    }),
    t.each({ show: 'fadeIn', hide: 'fadeOut' }, function (e, i) {
      t.Widget.prototype['_' + e] = function (n, s, o) {
        'string' == typeof s && (s = { effect: s });
        var r,
          a = s ? (s === !0 || 'number' == typeof s ? i : s.effect || i) : e;
        (s = s || {}),
          'number' == typeof s && (s = { duration: s }),
          (r = !t.isEmptyObject(s)),
          (s.complete = o),
          s.delay && n.delay(s.delay),
          r && t.effects && t.effects.effect[a]
            ? n[e](s)
            : a !== e && n[a]
              ? n[a](s.duration, s.easing, o)
              : n.queue(function (i) {
                  t(this)[e](), o && o.call(n[0]), i();
                });
      };
    }),
    t.widget
  );
});
