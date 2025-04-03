!(function (e) {
  'function' == typeof define && define.amd
    ? define(['jquery', './core', './widget', './position', './menu'], e)
    : e(jQuery);
})(function (e) {
  return (
    e.widget('ui.autocomplete', {
      version: '1.11.3',
      defaultElement: '<input>',
      options: {
        appendTo: null,
        autoFocus: !1,
        delay: 300,
        minLength: 1,
        position: { my: 'left top', at: 'left bottom', collision: 'none' },
        source: null,
        change: null,
        close: null,
        focus: null,
        open: null,
        response: null,
        search: null,
        select: null,
      },
      requestIndex: 0,
      pending: 0,
      _create: function () {
        var t,
          i,
          s,
          n = this.element[0].nodeName.toLowerCase(),
          o = 'textarea' === n,
          u = 'input' === n;
        (this.isMultiLine = o
          ? !0
          : u
            ? !1
            : this.element.prop('isContentEditable')),
          (this.valueMethod = this.element[o || u ? 'val' : 'text']),
          (this.isNewMenu = !0),
          this.element
            .addClass('ui-autocomplete-input')
            .attr('autocomplete', 'off'),
          this._on(this.element, {
            keydown: function (n) {
              if (this.element.prop('readOnly'))
                return (t = !0), (s = !0), void (i = !0);
              (t = !1), (s = !1), (i = !1);
              var o = e.ui.keyCode;
              switch (n.keyCode) {
                case o.PAGE_UP:
                  (t = !0), this._move('previousPage', n);
                  break;
                case o.PAGE_DOWN:
                  (t = !0), this._move('nextPage', n);
                  break;
                case o.UP:
                  (t = !0), this._keyEvent('previous', n);
                  break;
                case o.DOWN:
                  (t = !0), this._keyEvent('next', n);
                  break;
                case o.ENTER:
                  this.menu.active &&
                    ((t = !0), n.preventDefault(), this.menu.select(n));
                  break;
                case o.TAB:
                  this.menu.active && this.menu.select(n);
                  break;
                case o.ESCAPE:
                  this.menu.element.is(':visible') &&
                    (this.isMultiLine || this._value(this.term),
                    this.close(n),
                    n.preventDefault());
                  break;
                default:
                  (i = !0), this._searchTimeout(n);
              }
            },
            keypress: function (s) {
              if (t)
                return (
                  (t = !1),
                  void (
                    (!this.isMultiLine || this.menu.element.is(':visible')) &&
                    s.preventDefault()
                  )
                );
              if (!i) {
                var n = e.ui.keyCode;
                switch (s.keyCode) {
                  case n.PAGE_UP:
                    this._move('previousPage', s);
                    break;
                  case n.PAGE_DOWN:
                    this._move('nextPage', s);
                    break;
                  case n.UP:
                    this._keyEvent('previous', s);
                    break;
                  case n.DOWN:
                    this._keyEvent('next', s);
                }
              }
            },
            input: function (e) {
              return s
                ? ((s = !1), void e.preventDefault())
                : void this._searchTimeout(e);
            },
            focus: function () {
              (this.selectedItem = null), (this.previous = this._value());
            },
            blur: function (e) {
              return this.cancelBlur
                ? void delete this.cancelBlur
                : (clearTimeout(this.searching),
                  this.close(e),
                  void this._change(e));
            },
          }),
          this._initSource(),
          (this.menu = e('<ul>')
            .addClass('ui-autocomplete ui-front')
            .appendTo(this._appendTo())
            .menu({ role: null })
            .hide()
            .menu('instance')),
          this._on(this.menu.element, {
            mousedown: function (t) {
              t.preventDefault(),
                (this.cancelBlur = !0),
                this._delay(function () {
                  delete this.cancelBlur;
                });
              var i = this.menu.element[0];
              e(t.target).closest('.ui-menu-item').length ||
                this._delay(function () {
                  var t = this;
                  this.document.one('mousedown', function (s) {
                    s.target === t.element[0] ||
                      s.target === i ||
                      e.contains(i, s.target) ||
                      t.close();
                  });
                });
            },
            menufocus: function (t, i) {
              var s, n;
              return this.isNewMenu &&
                ((this.isNewMenu = !1),
                t.originalEvent && /^mouse/.test(t.originalEvent.type))
                ? (this.menu.blur(),
                  void this.document.one('mousemove', function () {
                    e(t.target).trigger(t.originalEvent);
                  }))
                : ((n = i.item.data('ui-autocomplete-item')),
                  !1 !== this._trigger('focus', t, { item: n }) &&
                    t.originalEvent &&
                    /^key/.test(t.originalEvent.type) &&
                    this._value(n.value),
                  (s = i.item.attr('aria-label') || n.value),
                  void (
                    s &&
                    e.trim(s).length &&
                    (this.liveRegion.children().hide(),
                    e('<div>').text(s).appendTo(this.liveRegion))
                  ));
            },
            menuselect: function (e, t) {
              var i = t.item.data('ui-autocomplete-item'),
                s = this.previous;
              this.element[0] !== this.document[0].activeElement &&
                (this.element.focus(),
                (this.previous = s),
                this._delay(function () {
                  (this.previous = s), (this.selectedItem = i);
                })),
                !1 !== this._trigger('select', e, { item: i }) &&
                  this._value(i.value),
                (this.term = this._value()),
                this.close(e),
                (this.selectedItem = i);
            },
          }),
          (this.liveRegion = e('<span>', {
            role: 'status',
            'aria-live': 'assertive',
            'aria-relevant': 'additions',
          })
            .addClass('ui-helper-hidden-accessible')
            .appendTo(this.document[0].body)),
          this._on(this.window, {
            beforeunload: function () {
              this.element.removeAttr('autocomplete');
            },
          });
      },
      _destroy: function () {
        clearTimeout(this.searching),
          this.element
            .removeClass('ui-autocomplete-input')
            .removeAttr('autocomplete'),
          this.menu.element.remove(),
          this.liveRegion.remove();
      },
      _setOption: function (e, t) {
        this._super(e, t),
          'source' === e && this._initSource(),
          'appendTo' === e && this.menu.element.appendTo(this._appendTo()),
          'disabled' === e && t && this.xhr && this.xhr.abort();
      },
      _appendTo: function () {
        var t = this.options.appendTo;
        return (
          t &&
            (t = t.jquery || t.nodeType ? e(t) : this.document.find(t).eq(0)),
          (t && t[0]) || (t = this.element.closest('.ui-front')),
          t.length || (t = this.document[0].body),
          t
        );
      },
      _initSource: function () {
        var t,
          i,
          s = this;
        e.isArray(this.options.source)
          ? ((t = this.options.source),
            (this.source = function (i, s) {
              s(e.ui.autocomplete.filter(t, i.term));
            }))
          : 'string' == typeof this.options.source
            ? ((i = this.options.source),
              (this.source = function (t, n) {
                s.xhr && s.xhr.abort(),
                  (s.xhr = e.ajax({
                    url: i,
                    data: t,
                    dataType: 'json',
                    success: function (e) {
                      n(e);
                    },
                    error: function () {
                      n([]);
                    },
                  }));
              }))
            : (this.source = this.options.source);
      },
      _searchTimeout: function (e) {
        clearTimeout(this.searching),
          (this.searching = this._delay(function () {
            var t = this.term === this._value(),
              i = this.menu.element.is(':visible'),
              s = e.altKey || e.ctrlKey || e.metaKey || e.shiftKey;
            (!t || (t && !i && !s)) &&
              ((this.selectedItem = null), this.search(null, e));
          }, this.options.delay));
      },
      search: function (e, t) {
        return (
          (e = null != e ? e : this._value()),
          (this.term = this._value()),
          e.length < this.options.minLength
            ? this.close(t)
            : this._trigger('search', t) !== !1
              ? this._search(e)
              : void 0
        );
      },
      _search: function (e) {
        this.pending++,
          this.element.addClass('ui-autocomplete-loading'),
          (this.cancelSearch = !1),
          this.source({ term: e }, this._response());
      },
      _response: function () {
        var t = ++this.requestIndex;
        return e.proxy(function (e) {
          t === this.requestIndex && this.__response(e),
            this.pending--,
            this.pending || this.element.removeClass('ui-autocomplete-loading');
        }, this);
      },
      __response: function (e) {
        e && (e = this._normalize(e)),
          this._trigger('response', null, { content: e }),
          !this.options.disabled && e && e.length && !this.cancelSearch
            ? (this._suggest(e), this._trigger('open'))
            : this._close();
      },
      close: function (e) {
        (this.cancelSearch = !0), this._close(e);
      },
      _close: function (e) {
        this.menu.element.is(':visible') &&
          (this.menu.element.hide(),
          this.menu.blur(),
          (this.isNewMenu = !0),
          this._trigger('close', e));
      },
      _change: function (e) {
        this.previous !== this._value() &&
          this._trigger('change', e, { item: this.selectedItem });
      },
      _normalize: function (t) {
        return t.length && t[0].label && t[0].value
          ? t
          : e.map(t, function (t) {
              return 'string' == typeof t
                ? { label: t, value: t }
                : e.extend({}, t, {
                    label: t.label || t.value,
                    value: t.value || t.label,
                  });
            });
      },
      _suggest: function (t) {
        var i = this.menu.element.empty();
        this._renderMenu(i, t),
          (this.isNewMenu = !0),
          this.menu.refresh(),
          i.show(),
          this._resizeMenu(),
          i.position(e.extend({ of: this.element }, this.options.position)),
          this.options.autoFocus && this.menu.next();
      },
      _resizeMenu: function () {
        var e = this.menu.element;
        e.outerWidth(
          Math.max(e.width('').outerWidth() + 1, this.element.outerWidth())
        );
      },
      _renderMenu: function (t, i) {
        var s = this;
        e.each(i, function (e, i) {
          s._renderItemData(t, i);
        });
      },
      _renderItemData: function (e, t) {
        return this._renderItem(e, t).data('ui-autocomplete-item', t);
      },
      _renderItem: function (t, i) {
        return e('<li>').text(i.label).appendTo(t);
      },
      _move: function (e, t) {
        return this.menu.element.is(':visible')
          ? (this.menu.isFirstItem() && /^previous/.test(e)) ||
            (this.menu.isLastItem() && /^next/.test(e))
            ? (this.isMultiLine || this._value(this.term),
              void this.menu.blur())
            : void this.menu[e](t)
          : void this.search(null, t);
      },
      widget: function () {
        return this.menu.element;
      },
      _value: function () {
        return this.valueMethod.apply(this.element, arguments);
      },
      _keyEvent: function (e, t) {
        (!this.isMultiLine || this.menu.element.is(':visible')) &&
          (this._move(e, t), t.preventDefault());
      },
    }),
    e.extend(e.ui.autocomplete, {
      escapeRegex: function (e) {
        return e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
      },
      filter: function (t, i) {
        var s = new RegExp(e.ui.autocomplete.escapeRegex(i), 'i');
        return e.grep(t, function (e) {
          return s.test(e.label || e.value || e);
        });
      },
    }),
    e.widget('ui.autocomplete', e.ui.autocomplete, {
      options: {
        messages: {
          noResults: 'No search results.',
          results: function (e) {
            return (
              e +
              (e > 1 ? ' results are' : ' result is') +
              ' available, use up and down arrow keys to navigate.'
            );
          },
        },
      },
      __response: function (t) {
        var i;
        this._superApply(arguments),
          this.options.disabled ||
            this.cancelSearch ||
            ((i =
              t && t.length
                ? this.options.messages.results(t.length)
                : this.options.messages.noResults),
            this.liveRegion.children().hide(),
            e('<div>').text(i).appendTo(this.liveRegion));
      },
    }),
    e.ui.autocomplete
  );
});
