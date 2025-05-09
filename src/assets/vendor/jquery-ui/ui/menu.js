!(function (e) {
  'function' == typeof define && define.amd
    ? define(['jquery', './core', './widget', './position'], e)
    : e(jQuery);
})(function (e) {
  return e.widget('ui.menu', {
    version: '1.11.3',
    defaultElement: '<ul>',
    delay: 300,
    options: {
      icons: { submenu: 'ui-icon-carat-1-e' },
      items: '> *',
      menus: 'ul',
      position: { my: 'left-1 top', at: 'right top' },
      role: 'menu',
      blur: null,
      focus: null,
      select: null,
    },
    _create: function () {
      (this.activeMenu = this.element),
        (this.mouseHandled = !1),
        this.element
          .uniqueId()
          .addClass('ui-menu ui-widget ui-widget-content')
          .toggleClass('ui-menu-icons', !!this.element.find('.ui-icon').length)
          .attr({ role: this.options.role, tabIndex: 0 }),
        this.options.disabled &&
          this.element
            .addClass('ui-state-disabled')
            .attr('aria-disabled', 'true'),
        this._on({
          'mousedown .ui-menu-item': function (e) {
            e.preventDefault();
          },
          'click .ui-menu-item': function (t) {
            var i = e(t.target);
            !this.mouseHandled &&
              i.not('.ui-state-disabled').length &&
              (this.select(t),
              t.isPropagationStopped() || (this.mouseHandled = !0),
              i.has('.ui-menu').length
                ? this.expand(t)
                : !this.element.is(':focus') &&
                  e(this.document[0].activeElement).closest('.ui-menu')
                    .length &&
                  (this.element.trigger('focus', [!0]),
                  this.active &&
                    1 === this.active.parents('.ui-menu').length &&
                    clearTimeout(this.timer)));
          },
          'mouseenter .ui-menu-item': function (t) {
            if (!this.previousFilter) {
              var i = e(t.currentTarget);
              i.siblings('.ui-state-active').removeClass('ui-state-active'),
                this.focus(t, i);
            }
          },
          mouseleave: 'collapseAll',
          'mouseleave .ui-menu': 'collapseAll',
          focus: function (e, t) {
            var i = this.active || this.element.find(this.options.items).eq(0);
            t || this.focus(e, i);
          },
          blur: function (t) {
            this._delay(function () {
              e.contains(this.element[0], this.document[0].activeElement) ||
                this.collapseAll(t);
            });
          },
          keydown: '_keydown',
        }),
        this.refresh(),
        this._on(this.document, {
          click: function (e) {
            this._closeOnDocumentClick(e) && this.collapseAll(e),
              (this.mouseHandled = !1);
          },
        });
    },
    _destroy: function () {
      this.element
        .removeAttr('aria-activedescendant')
        .find('.ui-menu')
        .addBack()
        .removeClass(
          'ui-menu ui-widget ui-widget-content ui-menu-icons ui-front'
        )
        .removeAttr('role')
        .removeAttr('tabIndex')
        .removeAttr('aria-labelledby')
        .removeAttr('aria-expanded')
        .removeAttr('aria-hidden')
        .removeAttr('aria-disabled')
        .removeUniqueId()
        .show(),
        this.element
          .find('.ui-menu-item')
          .removeClass('ui-menu-item')
          .removeAttr('role')
          .removeAttr('aria-disabled')
          .removeUniqueId()
          .removeClass('ui-state-hover')
          .removeAttr('tabIndex')
          .removeAttr('role')
          .removeAttr('aria-haspopup')
          .children()
          .each(function () {
            var t = e(this);
            t.data('ui-menu-submenu-carat') && t.remove();
          }),
        this.element
          .find('.ui-menu-divider')
          .removeClass('ui-menu-divider ui-widget-content');
    },
    _keydown: function (t) {
      var i,
        s,
        n,
        a,
        u = !0;
      switch (t.keyCode) {
        case e.ui.keyCode.PAGE_UP:
          this.previousPage(t);
          break;
        case e.ui.keyCode.PAGE_DOWN:
          this.nextPage(t);
          break;
        case e.ui.keyCode.HOME:
          this._move('first', 'first', t);
          break;
        case e.ui.keyCode.END:
          this._move('last', 'last', t);
          break;
        case e.ui.keyCode.UP:
          this.previous(t);
          break;
        case e.ui.keyCode.DOWN:
          this.next(t);
          break;
        case e.ui.keyCode.LEFT:
          this.collapse(t);
          break;
        case e.ui.keyCode.RIGHT:
          this.active &&
            !this.active.is('.ui-state-disabled') &&
            this.expand(t);
          break;
        case e.ui.keyCode.ENTER:
        case e.ui.keyCode.SPACE:
          this._activate(t);
          break;
        case e.ui.keyCode.ESCAPE:
          this.collapse(t);
          break;
        default:
          (u = !1),
            (s = this.previousFilter || ''),
            (n = String.fromCharCode(t.keyCode)),
            (a = !1),
            clearTimeout(this.filterTimer),
            n === s ? (a = !0) : (n = s + n),
            (i = this._filterMenuItems(n)),
            (i =
              a && -1 !== i.index(this.active.next())
                ? this.active.nextAll('.ui-menu-item')
                : i),
            i.length ||
              ((n = String.fromCharCode(t.keyCode)),
              (i = this._filterMenuItems(n))),
            i.length
              ? (this.focus(t, i),
                (this.previousFilter = n),
                (this.filterTimer = this._delay(function () {
                  delete this.previousFilter;
                }, 1e3)))
              : delete this.previousFilter;
      }
      u && t.preventDefault();
    },
    _activate: function (e) {
      this.active.is('.ui-state-disabled') ||
        (this.active.is("[aria-haspopup='true']")
          ? this.expand(e)
          : this.select(e));
    },
    refresh: function () {
      var t,
        i,
        s = this,
        n = this.options.icons.submenu,
        a = this.element.find(this.options.menus);
      this.element.toggleClass(
        'ui-menu-icons',
        !!this.element.find('.ui-icon').length
      ),
        a
          .filter(':not(.ui-menu)')
          .addClass('ui-menu ui-widget ui-widget-content ui-front')
          .hide()
          .attr({
            role: this.options.role,
            'aria-hidden': 'true',
            'aria-expanded': 'false',
          })
          .each(function () {
            var t = e(this),
              i = t.parent(),
              s = e('<span>')
                .addClass('ui-menu-icon ui-icon ' + n)
                .data('ui-menu-submenu-carat', !0);
            i.attr('aria-haspopup', 'true').prepend(s),
              t.attr('aria-labelledby', i.attr('id'));
          }),
        (t = a.add(this.element)),
        (i = t.find(this.options.items)),
        i.not('.ui-menu-item').each(function () {
          var t = e(this);
          s._isDivider(t) && t.addClass('ui-widget-content ui-menu-divider');
        }),
        i
          .not('.ui-menu-item, .ui-menu-divider')
          .addClass('ui-menu-item')
          .uniqueId()
          .attr({ tabIndex: -1, role: this._itemRole() }),
        i.filter('.ui-state-disabled').attr('aria-disabled', 'true'),
        this.active &&
          !e.contains(this.element[0], this.active[0]) &&
          this.blur();
    },
    _itemRole: function () {
      return { menu: 'menuitem', listbox: 'option' }[this.options.role];
    },
    _setOption: function (e, t) {
      'icons' === e &&
        this.element
          .find('.ui-menu-icon')
          .removeClass(this.options.icons.submenu)
          .addClass(t.submenu),
        'disabled' === e &&
          this.element
            .toggleClass('ui-state-disabled', !!t)
            .attr('aria-disabled', t),
        this._super(e, t);
    },
    focus: function (e, t) {
      var i, s;
      this.blur(e, e && 'focus' === e.type),
        this._scrollIntoView(t),
        (this.active = t.first()),
        (s = this.active
          .addClass('ui-state-focus')
          .removeClass('ui-state-active')),
        this.options.role &&
          this.element.attr('aria-activedescendant', s.attr('id')),
        this.active
          .parent()
          .closest('.ui-menu-item')
          .addClass('ui-state-active'),
        e && 'keydown' === e.type
          ? this._close()
          : (this.timer = this._delay(function () {
              this._close();
            }, this.delay)),
        (i = t.children('.ui-menu')),
        i.length && e && /^mouse/.test(e.type) && this._startOpening(i),
        (this.activeMenu = t.parent()),
        this._trigger('focus', e, { item: t });
    },
    _scrollIntoView: function (t) {
      var i, s, n, a, u, o;
      this._hasScroll() &&
        ((i = parseFloat(e.css(this.activeMenu[0], 'borderTopWidth')) || 0),
        (s = parseFloat(e.css(this.activeMenu[0], 'paddingTop')) || 0),
        (n = t.offset().top - this.activeMenu.offset().top - i - s),
        (a = this.activeMenu.scrollTop()),
        (u = this.activeMenu.height()),
        (o = t.outerHeight()),
        0 > n
          ? this.activeMenu.scrollTop(a + n)
          : n + o > u && this.activeMenu.scrollTop(a + n - u + o));
    },
    blur: function (e, t) {
      t || clearTimeout(this.timer),
        this.active &&
          (this.active.removeClass('ui-state-focus'),
          (this.active = null),
          this._trigger('blur', e, { item: this.active }));
    },
    _startOpening: function (e) {
      clearTimeout(this.timer),
        'true' === e.attr('aria-hidden') &&
          (this.timer = this._delay(function () {
            this._close(), this._open(e);
          }, this.delay));
    },
    _open: function (t) {
      var i = e.extend({ of: this.active }, this.options.position);
      clearTimeout(this.timer),
        this.element
          .find('.ui-menu')
          .not(t.parents('.ui-menu'))
          .hide()
          .attr('aria-hidden', 'true'),
        t
          .show()
          .removeAttr('aria-hidden')
          .attr('aria-expanded', 'true')
          .position(i);
    },
    collapseAll: function (t, i) {
      clearTimeout(this.timer),
        (this.timer = this._delay(function () {
          var s = i
            ? this.element
            : e(t && t.target).closest(this.element.find('.ui-menu'));
          s.length || (s = this.element),
            this._close(s),
            this.blur(t),
            (this.activeMenu = s);
        }, this.delay));
    },
    _close: function (e) {
      e || (e = this.active ? this.active.parent() : this.element),
        e
          .find('.ui-menu')
          .hide()
          .attr('aria-hidden', 'true')
          .attr('aria-expanded', 'false')
          .end()
          .find('.ui-state-active')
          .not('.ui-state-focus')
          .removeClass('ui-state-active');
    },
    _closeOnDocumentClick: function (t) {
      return !e(t.target).closest('.ui-menu').length;
    },
    _isDivider: function (e) {
      return !/[^\-\u2014\u2013\s]/.test(e.text());
    },
    collapse: function (e) {
      var t =
        this.active &&
        this.active.parent().closest('.ui-menu-item', this.element);
      t && t.length && (this._close(), this.focus(e, t));
    },
    expand: function (e) {
      var t =
        this.active &&
        this.active.children('.ui-menu ').find(this.options.items).first();
      t &&
        t.length &&
        (this._open(t.parent()),
        this._delay(function () {
          this.focus(e, t);
        }));
    },
    next: function (e) {
      this._move('next', 'first', e);
    },
    previous: function (e) {
      this._move('prev', 'last', e);
    },
    isFirstItem: function () {
      return this.active && !this.active.prevAll('.ui-menu-item').length;
    },
    isLastItem: function () {
      return this.active && !this.active.nextAll('.ui-menu-item').length;
    },
    _move: function (e, t, i) {
      var s;
      this.active &&
        (s =
          'first' === e || 'last' === e
            ? this.active['first' === e ? 'prevAll' : 'nextAll'](
                '.ui-menu-item'
              ).eq(-1)
            : this.active[e + 'All']('.ui-menu-item').eq(0)),
        (s && s.length && this.active) ||
          (s = this.activeMenu.find(this.options.items)[t]()),
        this.focus(i, s);
    },
    nextPage: function (t) {
      var i, s, n;
      return this.active
        ? void (
            this.isLastItem() ||
            (this._hasScroll()
              ? ((s = this.active.offset().top),
                (n = this.element.height()),
                this.active.nextAll('.ui-menu-item').each(function () {
                  return (i = e(this)), i.offset().top - s - n < 0;
                }),
                this.focus(t, i))
              : this.focus(
                  t,
                  this.activeMenu
                    .find(this.options.items)
                    [this.active ? 'last' : 'first']()
                ))
          )
        : void this.next(t);
    },
    previousPage: function (t) {
      var i, s, n;
      return this.active
        ? void (
            this.isFirstItem() ||
            (this._hasScroll()
              ? ((s = this.active.offset().top),
                (n = this.element.height()),
                this.active.prevAll('.ui-menu-item').each(function () {
                  return (i = e(this)), i.offset().top - s + n > 0;
                }),
                this.focus(t, i))
              : this.focus(t, this.activeMenu.find(this.options.items).first()))
          )
        : void this.next(t);
    },
    _hasScroll: function () {
      return this.element.outerHeight() < this.element.prop('scrollHeight');
    },
    select: function (t) {
      this.active = this.active || e(t.target).closest('.ui-menu-item');
      var i = { item: this.active };
      this.active.has('.ui-menu').length || this.collapseAll(t, !0),
        this._trigger('select', t, i);
    },
    _filterMenuItems: function (t) {
      var i = t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&'),
        s = new RegExp('^' + i, 'i');
      return this.activeMenu
        .find(this.options.items)
        .filter('.ui-menu-item')
        .filter(function () {
          return s.test(e.trim(e(this).text()));
        });
    },
  });
});
