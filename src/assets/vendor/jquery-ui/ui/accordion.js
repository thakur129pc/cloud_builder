!(function (e) {
  'function' == typeof define && define.amd
    ? define(['jquery', './core', './widget'], e)
    : e(jQuery);
})(function (e) {
  return e.widget('ui.accordion', {
    version: '1.11.3',
    options: {
      active: 0,
      animate: {},
      collapsible: !1,
      event: 'click',
      header: '> li > :first-child,> :not(li):even',
      heightStyle: 'auto',
      icons: {
        activeHeader: 'ui-icon-triangle-1-s',
        header: 'ui-icon-triangle-1-e',
      },
      activate: null,
      beforeActivate: null,
    },
    hideProps: {
      borderTopWidth: 'hide',
      borderBottomWidth: 'hide',
      paddingTop: 'hide',
      paddingBottom: 'hide',
      height: 'hide',
    },
    showProps: {
      borderTopWidth: 'show',
      borderBottomWidth: 'show',
      paddingTop: 'show',
      paddingBottom: 'show',
      height: 'show',
    },
    _create: function () {
      var t = this.options;
      (this.prevShow = this.prevHide = e()),
        this.element
          .addClass('ui-accordion ui-widget ui-helper-reset')
          .attr('role', 'tablist'),
        t.collapsible ||
          (t.active !== !1 && null != t.active) ||
          (t.active = 0),
        this._processPanels(),
        t.active < 0 && (t.active += this.headers.length),
        this._refresh();
    },
    _getCreateEventData: function () {
      return {
        header: this.active,
        panel: this.active.length ? this.active.next() : e(),
      };
    },
    _createIcons: function () {
      var t = this.options.icons;
      t &&
        (e('<span>')
          .addClass('ui-accordion-header-icon ui-icon ' + t.header)
          .prependTo(this.headers),
        this.active
          .children('.ui-accordion-header-icon')
          .removeClass(t.header)
          .addClass(t.activeHeader),
        this.headers.addClass('ui-accordion-icons'));
    },
    _destroyIcons: function () {
      this.headers
        .removeClass('ui-accordion-icons')
        .children('.ui-accordion-header-icon')
        .remove();
    },
    _destroy: function () {
      var e;
      this.element
        .removeClass('ui-accordion ui-widget ui-helper-reset')
        .removeAttr('role'),
        this.headers
          .removeClass(
            'ui-accordion-header ui-accordion-header-active ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top'
          )
          .removeAttr('role')
          .removeAttr('aria-expanded')
          .removeAttr('aria-selected')
          .removeAttr('aria-controls')
          .removeAttr('tabIndex')
          .removeUniqueId(),
        this._destroyIcons(),
        (e = this.headers
          .next()
          .removeClass(
            'ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-state-disabled'
          )
          .css('display', '')
          .removeAttr('role')
          .removeAttr('aria-hidden')
          .removeAttr('aria-labelledby')
          .removeUniqueId()),
        'content' !== this.options.heightStyle && e.css('height', '');
    },
    _setOption: function (e, t) {
      return 'active' === e
        ? void this._activate(t)
        : ('event' === e &&
            (this.options.event && this._off(this.headers, this.options.event),
            this._setupEvents(t)),
          this._super(e, t),
          'collapsible' !== e ||
            t ||
            this.options.active !== !1 ||
            this._activate(0),
          'icons' === e && (this._destroyIcons(), t && this._createIcons()),
          void (
            'disabled' === e &&
            (this.element
              .toggleClass('ui-state-disabled', !!t)
              .attr('aria-disabled', t),
            this.headers
              .add(this.headers.next())
              .toggleClass('ui-state-disabled', !!t))
          ));
    },
    _keydown: function (t) {
      if (!t.altKey && !t.ctrlKey) {
        var i = e.ui.keyCode,
          a = this.headers.length,
          s = this.headers.index(t.target),
          n = !1;
        switch (t.keyCode) {
          case i.RIGHT:
          case i.DOWN:
            n = this.headers[(s + 1) % a];
            break;
          case i.LEFT:
          case i.UP:
            n = this.headers[(s - 1 + a) % a];
            break;
          case i.SPACE:
          case i.ENTER:
            this._eventHandler(t);
            break;
          case i.HOME:
            n = this.headers[0];
            break;
          case i.END:
            n = this.headers[a - 1];
        }
        n &&
          (e(t.target).attr('tabIndex', -1),
          e(n).attr('tabIndex', 0),
          n.focus(),
          t.preventDefault());
      }
    },
    _panelKeyDown: function (t) {
      t.keyCode === e.ui.keyCode.UP &&
        t.ctrlKey &&
        e(t.currentTarget).prev().focus();
    },
    refresh: function () {
      var t = this.options;
      this._processPanels(),
        (t.active === !1 && t.collapsible === !0) || !this.headers.length
          ? ((t.active = !1), (this.active = e()))
          : t.active === !1
            ? this._activate(0)
            : this.active.length && !e.contains(this.element[0], this.active[0])
              ? this.headers.length ===
                this.headers.find('.ui-state-disabled').length
                ? ((t.active = !1), (this.active = e()))
                : this._activate(Math.max(0, t.active - 1))
              : (t.active = this.headers.index(this.active)),
        this._destroyIcons(),
        this._refresh();
    },
    _processPanels: function () {
      var e = this.headers,
        t = this.panels;
      (this.headers = this.element
        .find(this.options.header)
        .addClass('ui-accordion-header ui-state-default ui-corner-all')),
        (this.panels = this.headers
          .next()
          .addClass(
            'ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom'
          )
          .filter(':not(.ui-accordion-content-active)')
          .hide()),
        t && (this._off(e.not(this.headers)), this._off(t.not(this.panels)));
    },
    _refresh: function () {
      var t,
        i = this.options,
        a = i.heightStyle,
        s = this.element.parent();
      (this.active = this._findActive(i.active)
        .addClass('ui-accordion-header-active ui-state-active ui-corner-top')
        .removeClass('ui-corner-all')),
        this.active.next().addClass('ui-accordion-content-active').show(),
        this.headers
          .attr('role', 'tab')
          .each(function () {
            var t = e(this),
              i = t.uniqueId().attr('id'),
              a = t.next(),
              s = a.uniqueId().attr('id');
            t.attr('aria-controls', s), a.attr('aria-labelledby', i);
          })
          .next()
          .attr('role', 'tabpanel'),
        this.headers
          .not(this.active)
          .attr({
            'aria-selected': 'false',
            'aria-expanded': 'false',
            tabIndex: -1,
          })
          .next()
          .attr({ 'aria-hidden': 'true' })
          .hide(),
        this.active.length
          ? this.active
              .attr({
                'aria-selected': 'true',
                'aria-expanded': 'true',
                tabIndex: 0,
              })
              .next()
              .attr({ 'aria-hidden': 'false' })
          : this.headers.eq(0).attr('tabIndex', 0),
        this._createIcons(),
        this._setupEvents(i.event),
        'fill' === a
          ? ((t = s.height()),
            this.element.siblings(':visible').each(function () {
              var i = e(this),
                a = i.css('position');
              'absolute' !== a && 'fixed' !== a && (t -= i.outerHeight(!0));
            }),
            this.headers.each(function () {
              t -= e(this).outerHeight(!0);
            }),
            this.headers
              .next()
              .each(function () {
                e(this).height(
                  Math.max(0, t - e(this).innerHeight() + e(this).height())
                );
              })
              .css('overflow', 'auto'))
          : 'auto' === a &&
            ((t = 0),
            this.headers
              .next()
              .each(function () {
                t = Math.max(t, e(this).css('height', '').height());
              })
              .height(t));
    },
    _activate: function (t) {
      var i = this._findActive(t)[0];
      i !== this.active[0] &&
        ((i = i || this.active[0]),
        this._eventHandler({
          target: i,
          currentTarget: i,
          preventDefault: e.noop,
        }));
    },
    _findActive: function (t) {
      return 'number' == typeof t ? this.headers.eq(t) : e();
    },
    _setupEvents: function (t) {
      var i = { keydown: '_keydown' };
      t &&
        e.each(t.split(' '), function (e, t) {
          i[t] = '_eventHandler';
        }),
        this._off(this.headers.add(this.headers.next())),
        this._on(this.headers, i),
        this._on(this.headers.next(), { keydown: '_panelKeyDown' }),
        this._hoverable(this.headers),
        this._focusable(this.headers);
    },
    _eventHandler: function (t) {
      var i = this.options,
        a = this.active,
        s = e(t.currentTarget),
        n = s[0] === a[0],
        r = n && i.collapsible,
        o = r ? e() : s.next(),
        h = a.next(),
        d = { oldHeader: a, oldPanel: h, newHeader: r ? e() : s, newPanel: o };
      t.preventDefault(),
        (n && !i.collapsible) ||
          this._trigger('beforeActivate', t, d) === !1 ||
          ((i.active = r ? !1 : this.headers.index(s)),
          (this.active = n ? e() : s),
          this._toggle(d),
          a.removeClass('ui-accordion-header-active ui-state-active'),
          i.icons &&
            a
              .children('.ui-accordion-header-icon')
              .removeClass(i.icons.activeHeader)
              .addClass(i.icons.header),
          n ||
            (s
              .removeClass('ui-corner-all')
              .addClass(
                'ui-accordion-header-active ui-state-active ui-corner-top'
              ),
            i.icons &&
              s
                .children('.ui-accordion-header-icon')
                .removeClass(i.icons.header)
                .addClass(i.icons.activeHeader),
            s.next().addClass('ui-accordion-content-active')));
    },
    _toggle: function (t) {
      var i = t.newPanel,
        a = this.prevShow.length ? this.prevShow : t.oldPanel;
      this.prevShow.add(this.prevHide).stop(!0, !0),
        (this.prevShow = i),
        (this.prevHide = a),
        this.options.animate
          ? this._animate(i, a, t)
          : (a.hide(), i.show(), this._toggleComplete(t)),
        a.attr({ 'aria-hidden': 'true' }),
        a.prev().attr({ 'aria-selected': 'false', 'aria-expanded': 'false' }),
        i.length && a.length
          ? a.prev().attr({ tabIndex: -1, 'aria-expanded': 'false' })
          : i.length &&
            this.headers
              .filter(function () {
                return 0 === parseInt(e(this).attr('tabIndex'), 10);
              })
              .attr('tabIndex', -1),
        i.attr('aria-hidden', 'false').prev().attr({
          'aria-selected': 'true',
          'aria-expanded': 'true',
          tabIndex: 0,
        });
    },
    _animate: function (e, t, i) {
      var a,
        s,
        n,
        r = this,
        o = 0,
        h = e.length && (!t.length || e.index() < t.index()),
        d = this.options.animate || {},
        c = (h && d.down) || d,
        l = function () {
          r._toggleComplete(i);
        };
      return (
        'number' == typeof c && (n = c),
        'string' == typeof c && (s = c),
        (s = s || c.easing || d.easing),
        (n = n || c.duration || d.duration),
        t.length
          ? e.length
            ? ((a = e.show().outerHeight()),
              t.animate(this.hideProps, {
                duration: n,
                easing: s,
                step: function (e, t) {
                  t.now = Math.round(e);
                },
              }),
              void e.hide().animate(this.showProps, {
                duration: n,
                easing: s,
                complete: l,
                step: function (e, i) {
                  (i.now = Math.round(e)),
                    'height' !== i.prop
                      ? (o += i.now)
                      : 'content' !== r.options.heightStyle &&
                        ((i.now = Math.round(a - t.outerHeight() - o)),
                        (o = 0));
                },
              }))
            : t.animate(this.hideProps, n, s, l)
          : e.animate(this.showProps, n, s, l)
      );
    },
    _toggleComplete: function (e) {
      var t = e.oldPanel;
      t
        .removeClass('ui-accordion-content-active')
        .prev()
        .removeClass('ui-corner-top')
        .addClass('ui-corner-all'),
        t.length && (t.parent()[0].className = t.parent()[0].className),
        this._trigger('activate', null, e);
    },
  });
});
