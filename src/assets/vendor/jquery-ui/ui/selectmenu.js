!(function (e) {
  'function' == typeof define && define.amd
    ? define(['jquery', './core', './widget', './position', './menu'], e)
    : e(jQuery);
})(function (e) {
  return e.widget('ui.selectmenu', {
    version: '1.11.3',
    defaultElement: '<select>',
    options: {
      appendTo: null,
      disabled: null,
      icons: { button: 'ui-icon-triangle-1-s' },
      position: { my: 'left top', at: 'left bottom', collision: 'none' },
      width: null,
      change: null,
      close: null,
      focus: null,
      open: null,
      select: null,
    },
    _create: function () {
      var e = this.element.uniqueId().attr('id');
      (this.ids = { element: e, button: e + '-button', menu: e + '-menu' }),
        this._drawButton(),
        this._drawMenu(),
        this.options.disabled && this.disable();
    },
    _drawButton: function () {
      var t = this;
      (this.label = e("label[for='" + this.ids.element + "']").attr(
        'for',
        this.ids.button
      )),
        this._on(this.label, {
          click: function (e) {
            this.button.focus(), e.preventDefault();
          },
        }),
        this.element.hide(),
        (this.button = e('<span>', {
          class:
            'ui-selectmenu-button ui-widget ui-state-default ui-corner-all',
          tabindex: this.options.disabled ? -1 : 0,
          id: this.ids.button,
          role: 'combobox',
          'aria-expanded': 'false',
          'aria-autocomplete': 'list',
          'aria-owns': this.ids.menu,
          'aria-haspopup': 'true',
        }).insertAfter(this.element)),
        e('<span>', {
          class: 'ui-icon ' + this.options.icons.button,
        }).prependTo(this.button),
        (this.buttonText = e('<span>', {
          class: 'ui-selectmenu-text',
        }).appendTo(this.button)),
        this._setText(
          this.buttonText,
          this.element.find('option:selected').text()
        ),
        this._resizeButton(),
        this._on(this.button, this._buttonEvents),
        this.button.one('focusin', function () {
          t.menuItems || t._refreshMenu();
        }),
        this._hoverable(this.button),
        this._focusable(this.button);
    },
    _drawMenu: function () {
      var t = this;
      (this.menu = e('<ul>', {
        'aria-hidden': 'true',
        'aria-labelledby': this.ids.button,
        id: this.ids.menu,
      })),
        (this.menuWrap = e('<div>', { class: 'ui-selectmenu-menu ui-front' })
          .append(this.menu)
          .appendTo(this._appendTo())),
        (this.menuInstance = this.menu
          .menu({
            role: 'listbox',
            select: function (e, i) {
              e.preventDefault(),
                t._setSelection(),
                t._select(i.item.data('ui-selectmenu-item'), e);
            },
            focus: function (e, i) {
              var n = i.item.data('ui-selectmenu-item');
              null != t.focusIndex &&
                n.index !== t.focusIndex &&
                (t._trigger('focus', e, { item: n }),
                t.isOpen || t._select(n, e)),
                (t.focusIndex = n.index),
                t.button.attr(
                  'aria-activedescendant',
                  t.menuItems.eq(n.index).attr('id')
                );
            },
          })
          .menu('instance')),
        this.menu.addClass('ui-corner-bottom').removeClass('ui-corner-all'),
        this.menuInstance._off(this.menu, 'mouseleave'),
        (this.menuInstance._closeOnDocumentClick = function () {
          return !1;
        }),
        (this.menuInstance._isDivider = function () {
          return !1;
        });
    },
    refresh: function () {
      this._refreshMenu(),
        this._setText(this.buttonText, this._getSelectedItem().text()),
        this.options.width || this._resizeButton();
    },
    _refreshMenu: function () {
      this.menu.empty();
      var e,
        t = this.element.find('option');
      t.length &&
        (this._parseOptions(t),
        this._renderMenu(this.menu, this.items),
        this.menuInstance.refresh(),
        (this.menuItems = this.menu.find('li').not('.ui-selectmenu-optgroup')),
        (e = this._getSelectedItem()),
        this.menuInstance.focus(null, e),
        this._setAria(e.data('ui-selectmenu-item')),
        this._setOption('disabled', this.element.prop('disabled')));
    },
    open: function (e) {
      this.options.disabled ||
        (this.menuItems
          ? (this.menu.find('.ui-state-focus').removeClass('ui-state-focus'),
            this.menuInstance.focus(null, this._getSelectedItem()))
          : this._refreshMenu(),
        (this.isOpen = !0),
        this._toggleAttr(),
        this._resizeMenu(),
        this._position(),
        this._on(this.document, this._documentClick),
        this._trigger('open', e));
    },
    _position: function () {
      this.menuWrap.position(
        e.extend({ of: this.button }, this.options.position)
      );
    },
    close: function (e) {
      this.isOpen &&
        ((this.isOpen = !1),
        this._toggleAttr(),
        (this.range = null),
        this._off(this.document),
        this._trigger('close', e));
    },
    widget: function () {
      return this.button;
    },
    menuWidget: function () {
      return this.menu;
    },
    _renderMenu: function (t, i) {
      var n = this,
        s = '';
      e.each(i, function (i, o) {
        o.optgroup !== s &&
          (e('<li>', {
            class:
              'ui-selectmenu-optgroup ui-menu-divider' +
              (o.element.parent('optgroup').prop('disabled')
                ? ' ui-state-disabled'
                : ''),
            text: o.optgroup,
          }).appendTo(t),
          (s = o.optgroup)),
          n._renderItemData(t, o);
      });
    },
    _renderItemData: function (e, t) {
      return this._renderItem(e, t).data('ui-selectmenu-item', t);
    },
    _renderItem: function (t, i) {
      var n = e('<li>');
      return (
        i.disabled && n.addClass('ui-state-disabled'),
        this._setText(n, i.label),
        n.appendTo(t)
      );
    },
    _setText: function (e, t) {
      t ? e.text(t) : e.html('&#160;');
    },
    _move: function (e, t) {
      var i,
        n,
        s = '.ui-menu-item';
      this.isOpen
        ? (i = this.menuItems.eq(this.focusIndex))
        : ((i = this.menuItems.eq(this.element[0].selectedIndex)),
          (s += ':not(.ui-state-disabled)')),
        (n =
          'first' === e || 'last' === e
            ? i['first' === e ? 'prevAll' : 'nextAll'](s).eq(-1)
            : i[e + 'All'](s).eq(0)),
        n.length && this.menuInstance.focus(t, n);
    },
    _getSelectedItem: function () {
      return this.menuItems.eq(this.element[0].selectedIndex);
    },
    _toggle: function (e) {
      this[this.isOpen ? 'close' : 'open'](e);
    },
    _setSelection: function () {
      var e;
      this.range &&
        (window.getSelection
          ? ((e = window.getSelection()),
            e.removeAllRanges(),
            e.addRange(this.range))
          : this.range.select(),
        this.button.focus());
    },
    _documentClick: {
      mousedown: function (t) {
        this.isOpen &&
          (e(t.target).closest('.ui-selectmenu-menu, #' + this.ids.button)
            .length ||
            this.close(t));
      },
    },
    _buttonEvents: {
      mousedown: function () {
        var e;
        window.getSelection
          ? ((e = window.getSelection()),
            e.rangeCount && (this.range = e.getRangeAt(0)))
          : (this.range = document.selection.createRange());
      },
      click: function (e) {
        this._setSelection(), this._toggle(e);
      },
      keydown: function (t) {
        var i = !0;
        switch (t.keyCode) {
          case e.ui.keyCode.TAB:
          case e.ui.keyCode.ESCAPE:
            this.close(t), (i = !1);
            break;
          case e.ui.keyCode.ENTER:
            this.isOpen && this._selectFocusedItem(t);
            break;
          case e.ui.keyCode.UP:
            t.altKey ? this._toggle(t) : this._move('prev', t);
            break;
          case e.ui.keyCode.DOWN:
            t.altKey ? this._toggle(t) : this._move('next', t);
            break;
          case e.ui.keyCode.SPACE:
            this.isOpen ? this._selectFocusedItem(t) : this._toggle(t);
            break;
          case e.ui.keyCode.LEFT:
            this._move('prev', t);
            break;
          case e.ui.keyCode.RIGHT:
            this._move('next', t);
            break;
          case e.ui.keyCode.HOME:
          case e.ui.keyCode.PAGE_UP:
            this._move('first', t);
            break;
          case e.ui.keyCode.END:
          case e.ui.keyCode.PAGE_DOWN:
            this._move('last', t);
            break;
          default:
            this.menu.trigger(t), (i = !1);
        }
        i && t.preventDefault();
      },
    },
    _selectFocusedItem: function (e) {
      var t = this.menuItems.eq(this.focusIndex);
      t.hasClass('ui-state-disabled') ||
        this._select(t.data('ui-selectmenu-item'), e);
    },
    _select: function (e, t) {
      var i = this.element[0].selectedIndex;
      (this.element[0].selectedIndex = e.index),
        this._setText(this.buttonText, e.label),
        this._setAria(e),
        this._trigger('select', t, { item: e }),
        e.index !== i && this._trigger('change', t, { item: e }),
        this.close(t);
    },
    _setAria: function (e) {
      var t = this.menuItems.eq(e.index).attr('id');
      this.button.attr({ 'aria-labelledby': t, 'aria-activedescendant': t }),
        this.menu.attr('aria-activedescendant', t);
    },
    _setOption: function (e, t) {
      'icons' === e &&
        this.button
          .find('span.ui-icon')
          .removeClass(this.options.icons.button)
          .addClass(t.button),
        this._super(e, t),
        'appendTo' === e && this.menuWrap.appendTo(this._appendTo()),
        'disabled' === e &&
          (this.menuInstance.option('disabled', t),
          this.button
            .toggleClass('ui-state-disabled', t)
            .attr('aria-disabled', t),
          this.element.prop('disabled', t),
          t
            ? (this.button.attr('tabindex', -1), this.close())
            : this.button.attr('tabindex', 0)),
        'width' === e && this._resizeButton();
    },
    _appendTo: function () {
      var t = this.options.appendTo;
      return (
        t && (t = t.jquery || t.nodeType ? e(t) : this.document.find(t).eq(0)),
        (t && t[0]) || (t = this.element.closest('.ui-front')),
        t.length || (t = this.document[0].body),
        t
      );
    },
    _toggleAttr: function () {
      this.button
        .toggleClass('ui-corner-top', this.isOpen)
        .toggleClass('ui-corner-all', !this.isOpen)
        .attr('aria-expanded', this.isOpen),
        this.menuWrap.toggleClass('ui-selectmenu-open', this.isOpen),
        this.menu.attr('aria-hidden', !this.isOpen);
    },
    _resizeButton: function () {
      var e = this.options.width;
      e || ((e = this.element.show().outerWidth()), this.element.hide()),
        this.button.outerWidth(e);
    },
    _resizeMenu: function () {
      this.menu.outerWidth(
        Math.max(this.button.outerWidth(), this.menu.width('').outerWidth() + 1)
      );
    },
    _getCreateOptions: function () {
      return { disabled: this.element.prop('disabled') };
    },
    _parseOptions: function (t) {
      var i = [];
      t.each(function (t, n) {
        var s = e(n),
          o = s.parent('optgroup');
        i.push({
          element: s,
          index: t,
          value: s.val(),
          label: s.text(),
          optgroup: o.attr('label') || '',
          disabled: o.prop('disabled') || s.prop('disabled'),
        });
      }),
        (this.items = i);
    },
    _destroy: function () {
      this.menuWrap.remove(),
        this.button.remove(),
        this.element.show(),
        this.element.removeUniqueId(),
        this.label.attr('for', this.ids.element);
    },
  });
});
