!(function (i) {
  'function' == typeof define && define.amd
    ? define(
        [
          'jquery',
          './core',
          './widget',
          './button',
          './draggable',
          './mouse',
          './position',
          './resizable',
        ],
        i
      )
    : i(jQuery);
})(function (i) {
  return i.widget('ui.dialog', {
    version: '1.11.3',
    options: {
      appendTo: 'body',
      autoOpen: !0,
      buttons: [],
      closeOnEscape: !0,
      closeText: 'Close',
      dialogClass: '',
      draggable: !0,
      hide: null,
      height: 'auto',
      maxHeight: null,
      maxWidth: null,
      minHeight: 150,
      minWidth: 150,
      modal: !1,
      position: {
        my: 'center',
        at: 'center',
        of: window,
        collision: 'fit',
        using: function (t) {
          var e = i(this).css(t).offset().top;
          0 > e && i(this).css('top', t.top - e);
        },
      },
      resizable: !0,
      show: null,
      title: null,
      width: 300,
      beforeClose: null,
      close: null,
      drag: null,
      dragStart: null,
      dragStop: null,
      focus: null,
      open: null,
      resize: null,
      resizeStart: null,
      resizeStop: null,
    },
    sizeRelatedOptions: {
      buttons: !0,
      height: !0,
      maxHeight: !0,
      maxWidth: !0,
      minHeight: !0,
      minWidth: !0,
      width: !0,
    },
    resizableRelatedOptions: {
      maxHeight: !0,
      maxWidth: !0,
      minHeight: !0,
      minWidth: !0,
    },
    _create: function () {
      (this.originalCss = {
        display: this.element[0].style.display,
        width: this.element[0].style.width,
        minHeight: this.element[0].style.minHeight,
        maxHeight: this.element[0].style.maxHeight,
        height: this.element[0].style.height,
      }),
        (this.originalPosition = {
          parent: this.element.parent(),
          index: this.element.parent().children().index(this.element),
        }),
        (this.originalTitle = this.element.attr('title')),
        (this.options.title = this.options.title || this.originalTitle),
        this._createWrapper(),
        this.element
          .show()
          .removeAttr('title')
          .addClass('ui-dialog-content ui-widget-content')
          .appendTo(this.uiDialog),
        this._createTitlebar(),
        this._createButtonPane(),
        this.options.draggable && i.fn.draggable && this._makeDraggable(),
        this.options.resizable && i.fn.resizable && this._makeResizable(),
        (this._isOpen = !1),
        this._trackFocus();
    },
    _init: function () {
      this.options.autoOpen && this.open();
    },
    _appendTo: function () {
      var t = this.options.appendTo;
      return t && (t.jquery || t.nodeType)
        ? i(t)
        : this.document.find(t || 'body').eq(0);
    },
    _destroy: function () {
      var i,
        t = this.originalPosition;
      this._destroyOverlay(),
        this.element
          .removeUniqueId()
          .removeClass('ui-dialog-content ui-widget-content')
          .css(this.originalCss)
          .detach(),
        this.uiDialog.stop(!0, !0).remove(),
        this.originalTitle && this.element.attr('title', this.originalTitle),
        (i = t.parent.children().eq(t.index)),
        i.length && i[0] !== this.element[0]
          ? i.before(this.element)
          : t.parent.append(this.element);
    },
    widget: function () {
      return this.uiDialog;
    },
    disable: i.noop,
    enable: i.noop,
    close: function (t) {
      var e,
        o = this;
      if (this._isOpen && this._trigger('beforeClose', t) !== !1) {
        if (
          ((this._isOpen = !1),
          (this._focusedElement = null),
          this._destroyOverlay(),
          this._untrackInstance(),
          !this.opener.filter(':focusable').focus().length)
        )
          try {
            (e = this.document[0].activeElement),
              e && 'body' !== e.nodeName.toLowerCase() && i(e).blur();
          } catch (s) {}
        this._hide(this.uiDialog, this.options.hide, function () {
          o._trigger('close', t);
        });
      }
    },
    isOpen: function () {
      return this._isOpen;
    },
    moveToTop: function () {
      this._moveToTop();
    },
    _moveToTop: function (t, e) {
      var o = !1,
        s = this.uiDialog
          .siblings('.ui-front:visible')
          .map(function () {
            return +i(this).css('z-index');
          })
          .get(),
        n = Math.max.apply(null, s);
      return (
        n >= +this.uiDialog.css('z-index') &&
          (this.uiDialog.css('z-index', n + 1), (o = !0)),
        o && !e && this._trigger('focus', t),
        o
      );
    },
    open: function () {
      var t = this;
      return this._isOpen
        ? void (this._moveToTop() && this._focusTabbable())
        : ((this._isOpen = !0),
          (this.opener = i(this.document[0].activeElement)),
          this._size(),
          this._position(),
          this._createOverlay(),
          this._moveToTop(null, !0),
          this.overlay &&
            this.overlay.css('z-index', this.uiDialog.css('z-index') - 1),
          this._show(this.uiDialog, this.options.show, function () {
            t._focusTabbable(), t._trigger('focus');
          }),
          this._makeFocusTarget(),
          void this._trigger('open'));
    },
    _focusTabbable: function () {
      var i = this._focusedElement;
      i || (i = this.element.find('[autofocus]')),
        i.length || (i = this.element.find(':tabbable')),
        i.length || (i = this.uiDialogButtonPane.find(':tabbable')),
        i.length || (i = this.uiDialogTitlebarClose.filter(':tabbable')),
        i.length || (i = this.uiDialog),
        i.eq(0).focus();
    },
    _keepFocus: function (t) {
      function e() {
        var t = this.document[0].activeElement,
          e = this.uiDialog[0] === t || i.contains(this.uiDialog[0], t);
        e || this._focusTabbable();
      }
      t.preventDefault(), e.call(this), this._delay(e);
    },
    _createWrapper: function () {
      (this.uiDialog = i('<div>')
        .addClass(
          'ui-dialog ui-widget ui-widget-content ui-corner-all ui-front ' +
            this.options.dialogClass
        )
        .hide()
        .attr({ tabIndex: -1, role: 'dialog' })
        .appendTo(this._appendTo())),
        this._on(this.uiDialog, {
          keydown: function (t) {
            if (
              this.options.closeOnEscape &&
              !t.isDefaultPrevented() &&
              t.keyCode &&
              t.keyCode === i.ui.keyCode.ESCAPE
            )
              return t.preventDefault(), void this.close(t);
            if (t.keyCode === i.ui.keyCode.TAB && !t.isDefaultPrevented()) {
              var e = this.uiDialog.find(':tabbable'),
                o = e.filter(':first'),
                s = e.filter(':last');
              (t.target !== s[0] && t.target !== this.uiDialog[0]) || t.shiftKey
                ? (t.target !== o[0] && t.target !== this.uiDialog[0]) ||
                  !t.shiftKey ||
                  (this._delay(function () {
                    s.focus();
                  }),
                  t.preventDefault())
                : (this._delay(function () {
                    o.focus();
                  }),
                  t.preventDefault());
            }
          },
          mousedown: function (i) {
            this._moveToTop(i) && this._focusTabbable();
          },
        }),
        this.element.find('[aria-describedby]').length ||
          this.uiDialog.attr({
            'aria-describedby': this.element.uniqueId().attr('id'),
          });
    },
    _createTitlebar: function () {
      var t;
      (this.uiDialogTitlebar = i('<div>')
        .addClass(
          'ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix'
        )
        .prependTo(this.uiDialog)),
        this._on(this.uiDialogTitlebar, {
          mousedown: function (t) {
            i(t.target).closest('.ui-dialog-titlebar-close') ||
              this.uiDialog.focus();
          },
        }),
        (this.uiDialogTitlebarClose = i("<button type='button'></button>")
          .button({
            label: this.options.closeText,
            icons: { primary: 'ui-icon-closethick' },
            text: !1,
          })
          .addClass('ui-dialog-titlebar-close')
          .appendTo(this.uiDialogTitlebar)),
        this._on(this.uiDialogTitlebarClose, {
          click: function (i) {
            i.preventDefault(), this.close(i);
          },
        }),
        (t = i('<span>')
          .uniqueId()
          .addClass('ui-dialog-title')
          .prependTo(this.uiDialogTitlebar)),
        this._title(t),
        this.uiDialog.attr({ 'aria-labelledby': t.attr('id') });
    },
    _title: function (i) {
      this.options.title || i.html('&#160;'), i.text(this.options.title);
    },
    _createButtonPane: function () {
      (this.uiDialogButtonPane = i('<div>').addClass(
        'ui-dialog-buttonpane ui-widget-content ui-helper-clearfix'
      )),
        (this.uiButtonSet = i('<div>')
          .addClass('ui-dialog-buttonset')
          .appendTo(this.uiDialogButtonPane)),
        this._createButtons();
    },
    _createButtons: function () {
      var t = this,
        e = this.options.buttons;
      return (
        this.uiDialogButtonPane.remove(),
        this.uiButtonSet.empty(),
        i.isEmptyObject(e) || (i.isArray(e) && !e.length)
          ? void this.uiDialog.removeClass('ui-dialog-buttons')
          : (i.each(e, function (e, o) {
              var s, n;
              (o = i.isFunction(o) ? { click: o, text: e } : o),
                (o = i.extend({ type: 'button' }, o)),
                (s = o.click),
                (o.click = function () {
                  s.apply(t.element[0], arguments);
                }),
                (n = { icons: o.icons, text: o.showText }),
                delete o.icons,
                delete o.showText,
                i('<button></button>', o).button(n).appendTo(t.uiButtonSet);
            }),
            this.uiDialog.addClass('ui-dialog-buttons'),
            void this.uiDialogButtonPane.appendTo(this.uiDialog))
      );
    },
    _makeDraggable: function () {
      function t(i) {
        return { position: i.position, offset: i.offset };
      }
      var e = this,
        o = this.options;
      this.uiDialog.draggable({
        cancel: '.ui-dialog-content, .ui-dialog-titlebar-close',
        handle: '.ui-dialog-titlebar',
        containment: 'document',
        start: function (o, s) {
          i(this).addClass('ui-dialog-dragging'),
            e._blockFrames(),
            e._trigger('dragStart', o, t(s));
        },
        drag: function (i, o) {
          e._trigger('drag', i, t(o));
        },
        stop: function (s, n) {
          var a = n.offset.left - e.document.scrollLeft(),
            l = n.offset.top - e.document.scrollTop();
          (o.position = {
            my: 'left top',
            at:
              'left' +
              (a >= 0 ? '+' : '') +
              a +
              ' top' +
              (l >= 0 ? '+' : '') +
              l,
            of: e.window,
          }),
            i(this).removeClass('ui-dialog-dragging'),
            e._unblockFrames(),
            e._trigger('dragStop', s, t(n));
        },
      });
    },
    _makeResizable: function () {
      function t(i) {
        return {
          originalPosition: i.originalPosition,
          originalSize: i.originalSize,
          position: i.position,
          size: i.size,
        };
      }
      var e = this,
        o = this.options,
        s = o.resizable,
        n = this.uiDialog.css('position'),
        a = 'string' == typeof s ? s : 'n,e,s,w,se,sw,ne,nw';
      this.uiDialog
        .resizable({
          cancel: '.ui-dialog-content',
          containment: 'document',
          alsoResize: this.element,
          maxWidth: o.maxWidth,
          maxHeight: o.maxHeight,
          minWidth: o.minWidth,
          minHeight: this._minHeight(),
          handles: a,
          start: function (o, s) {
            i(this).addClass('ui-dialog-resizing'),
              e._blockFrames(),
              e._trigger('resizeStart', o, t(s));
          },
          resize: function (i, o) {
            e._trigger('resize', i, t(o));
          },
          stop: function (s, n) {
            var a = e.uiDialog.offset(),
              l = a.left - e.document.scrollLeft(),
              h = a.top - e.document.scrollTop();
            (o.height = e.uiDialog.height()),
              (o.width = e.uiDialog.width()),
              (o.position = {
                my: 'left top',
                at:
                  'left' +
                  (l >= 0 ? '+' : '') +
                  l +
                  ' top' +
                  (h >= 0 ? '+' : '') +
                  h,
                of: e.window,
              }),
              i(this).removeClass('ui-dialog-resizing'),
              e._unblockFrames(),
              e._trigger('resizeStop', s, t(n));
          },
        })
        .css('position', n);
    },
    _trackFocus: function () {
      this._on(this.widget(), {
        focusin: function (t) {
          this._makeFocusTarget(), (this._focusedElement = i(t.target));
        },
      });
    },
    _makeFocusTarget: function () {
      this._untrackInstance(), this._trackingInstances().unshift(this);
    },
    _untrackInstance: function () {
      var t = this._trackingInstances(),
        e = i.inArray(this, t);
      -1 !== e && t.splice(e, 1);
    },
    _trackingInstances: function () {
      var i = this.document.data('ui-dialog-instances');
      return i || ((i = []), this.document.data('ui-dialog-instances', i)), i;
    },
    _minHeight: function () {
      var i = this.options;
      return 'auto' === i.height
        ? i.minHeight
        : Math.min(i.minHeight, i.height);
    },
    _position: function () {
      var i = this.uiDialog.is(':visible');
      i || this.uiDialog.show(),
        this.uiDialog.position(this.options.position),
        i || this.uiDialog.hide();
    },
    _setOptions: function (t) {
      var e = this,
        o = !1,
        s = {};
      i.each(t, function (i, t) {
        e._setOption(i, t),
          i in e.sizeRelatedOptions && (o = !0),
          i in e.resizableRelatedOptions && (s[i] = t);
      }),
        o && (this._size(), this._position()),
        this.uiDialog.is(':data(ui-resizable)') &&
          this.uiDialog.resizable('option', s);
    },
    _setOption: function (i, t) {
      var e,
        o,
        s = this.uiDialog;
      'dialogClass' === i &&
        s.removeClass(this.options.dialogClass).addClass(t),
        'disabled' !== i &&
          (this._super(i, t),
          'appendTo' === i && this.uiDialog.appendTo(this._appendTo()),
          'buttons' === i && this._createButtons(),
          'closeText' === i &&
            this.uiDialogTitlebarClose.button({ label: '' + t }),
          'draggable' === i &&
            ((e = s.is(':data(ui-draggable)')),
            e && !t && s.draggable('destroy'),
            !e && t && this._makeDraggable()),
          'position' === i && this._position(),
          'resizable' === i &&
            ((o = s.is(':data(ui-resizable)')),
            o && !t && s.resizable('destroy'),
            o && 'string' == typeof t && s.resizable('option', 'handles', t),
            o || t === !1 || this._makeResizable()),
          'title' === i &&
            this._title(this.uiDialogTitlebar.find('.ui-dialog-title')));
    },
    _size: function () {
      var i,
        t,
        e,
        o = this.options;
      this.element
        .show()
        .css({ width: 'auto', minHeight: 0, maxHeight: 'none', height: 0 }),
        o.minWidth > o.width && (o.width = o.minWidth),
        (i = this.uiDialog
          .css({ height: 'auto', width: o.width })
          .outerHeight()),
        (t = Math.max(0, o.minHeight - i)),
        (e =
          'number' == typeof o.maxHeight
            ? Math.max(0, o.maxHeight - i)
            : 'none'),
        'auto' === o.height
          ? this.element.css({ minHeight: t, maxHeight: e, height: 'auto' })
          : this.element.height(Math.max(0, o.height - i)),
        this.uiDialog.is(':data(ui-resizable)') &&
          this.uiDialog.resizable('option', 'minHeight', this._minHeight());
    },
    _blockFrames: function () {
      this.iframeBlocks = this.document.find('iframe').map(function () {
        var t = i(this);
        return i('<div>')
          .css({
            position: 'absolute',
            width: t.outerWidth(),
            height: t.outerHeight(),
          })
          .appendTo(t.parent())
          .offset(t.offset())[0];
      });
    },
    _unblockFrames: function () {
      this.iframeBlocks &&
        (this.iframeBlocks.remove(), delete this.iframeBlocks);
    },
    _allowInteraction: function (t) {
      return i(t.target).closest('.ui-dialog').length
        ? !0
        : !!i(t.target).closest('.ui-datepicker').length;
    },
    _createOverlay: function () {
      if (this.options.modal) {
        var t = !0;
        this._delay(function () {
          t = !1;
        }),
          this.document.data('ui-dialog-overlays') ||
            this._on(this.document, {
              focusin: function (i) {
                t ||
                  this._allowInteraction(i) ||
                  (i.preventDefault(),
                  this._trackingInstances()[0]._focusTabbable());
              },
            }),
          (this.overlay = i('<div>')
            .addClass('ui-widget-overlay ui-front')
            .appendTo(this._appendTo())),
          this._on(this.overlay, { mousedown: '_keepFocus' }),
          this.document.data(
            'ui-dialog-overlays',
            (this.document.data('ui-dialog-overlays') || 0) + 1
          );
      }
    },
    _destroyOverlay: function () {
      if (this.options.modal && this.overlay) {
        var i = this.document.data('ui-dialog-overlays') - 1;
        i
          ? this.document.data('ui-dialog-overlays', i)
          : this.document.unbind('focusin').removeData('ui-dialog-overlays'),
          this.overlay.remove(),
          (this.overlay = null);
      }
    },
  });
});
