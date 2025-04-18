!(function (t) {
  'function' == typeof define && define.amd
    ? define(['jquery', './core', './widget'], t)
    : t(jQuery);
})(function (t) {
  var e,
    i = 'ui-button ui-widget ui-state-default ui-corner-all',
    s =
      'ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only',
    n = function () {
      var e = t(this);
      setTimeout(function () {
        e.find(':ui-button').button('refresh');
      }, 1);
    },
    o = function (e) {
      var i = e.name,
        s = e.form,
        n = t([]);
      return (
        i &&
          ((i = i.replace(/'/g, "\\'")),
          (n = s
            ? t(s).find("[name='" + i + "'][type=radio]")
            : t("[name='" + i + "'][type=radio]", e.ownerDocument).filter(
                function () {
                  return !this.form;
                }
              ))),
        n
      );
    };
  return (
    t.widget('ui.button', {
      version: '1.11.3',
      defaultElement: '<button>',
      options: {
        disabled: null,
        text: !0,
        label: null,
        icons: { primary: null, secondary: null },
      },
      _create: function () {
        this.element
          .closest('form')
          .unbind('reset' + this.eventNamespace)
          .bind('reset' + this.eventNamespace, n),
          'boolean' != typeof this.options.disabled
            ? (this.options.disabled = !!this.element.prop('disabled'))
            : this.element.prop('disabled', this.options.disabled),
          this._determineButtonType(),
          (this.hasTitle = !!this.buttonElement.attr('title'));
        var s = this,
          a = this.options,
          u = 'checkbox' === this.type || 'radio' === this.type,
          r = u ? '' : 'ui-state-active';
        null === a.label &&
          (a.label =
            'input' === this.type
              ? this.buttonElement.val()
              : this.buttonElement.html()),
          this._hoverable(this.buttonElement),
          this.buttonElement
            .addClass(i)
            .attr('role', 'button')
            .bind('mouseenter' + this.eventNamespace, function () {
              a.disabled || (this === e && t(this).addClass('ui-state-active'));
            })
            .bind('mouseleave' + this.eventNamespace, function () {
              a.disabled || t(this).removeClass(r);
            })
            .bind('click' + this.eventNamespace, function (t) {
              a.disabled && (t.preventDefault(), t.stopImmediatePropagation());
            }),
          this._on({
            focus: function () {
              this.buttonElement.addClass('ui-state-focus');
            },
            blur: function () {
              this.buttonElement.removeClass('ui-state-focus');
            },
          }),
          u &&
            this.element.bind('change' + this.eventNamespace, function () {
              s.refresh();
            }),
          'checkbox' === this.type
            ? this.buttonElement.bind(
                'click' + this.eventNamespace,
                function () {
                  return a.disabled ? !1 : void 0;
                }
              )
            : 'radio' === this.type
              ? this.buttonElement.bind(
                  'click' + this.eventNamespace,
                  function () {
                    if (a.disabled) return !1;
                    t(this).addClass('ui-state-active'),
                      s.buttonElement.attr('aria-pressed', 'true');
                    var e = s.element[0];
                    o(e)
                      .not(e)
                      .map(function () {
                        return t(this).button('widget')[0];
                      })
                      .removeClass('ui-state-active')
                      .attr('aria-pressed', 'false');
                  }
                )
              : (this.buttonElement
                  .bind('mousedown' + this.eventNamespace, function () {
                    return a.disabled
                      ? !1
                      : (t(this).addClass('ui-state-active'),
                        (e = this),
                        void s.document.one('mouseup', function () {
                          e = null;
                        }));
                  })
                  .bind('mouseup' + this.eventNamespace, function () {
                    return a.disabled
                      ? !1
                      : void t(this).removeClass('ui-state-active');
                  })
                  .bind('keydown' + this.eventNamespace, function (e) {
                    return a.disabled
                      ? !1
                      : void (
                          (e.keyCode === t.ui.keyCode.SPACE ||
                            e.keyCode === t.ui.keyCode.ENTER) &&
                          t(this).addClass('ui-state-active')
                        );
                  })
                  .bind(
                    'keyup' +
                      this.eventNamespace +
                      ' blur' +
                      this.eventNamespace,
                    function () {
                      t(this).removeClass('ui-state-active');
                    }
                  ),
                this.buttonElement.is('a') &&
                  this.buttonElement.keyup(function (e) {
                    e.keyCode === t.ui.keyCode.SPACE && t(this).click();
                  })),
          this._setOption('disabled', a.disabled),
          this._resetButton();
      },
      _determineButtonType: function () {
        var t, e, i;
        (this.type = this.element.is('[type=checkbox]')
          ? 'checkbox'
          : this.element.is('[type=radio]')
            ? 'radio'
            : this.element.is('input')
              ? 'input'
              : 'button'),
          'checkbox' === this.type || 'radio' === this.type
            ? ((t = this.element.parents().last()),
              (e = "label[for='" + this.element.attr('id') + "']"),
              (this.buttonElement = t.find(e)),
              this.buttonElement.length ||
                ((t = t.length ? t.siblings() : this.element.siblings()),
                (this.buttonElement = t.filter(e)),
                this.buttonElement.length || (this.buttonElement = t.find(e))),
              this.element.addClass('ui-helper-hidden-accessible'),
              (i = this.element.is(':checked')),
              i && this.buttonElement.addClass('ui-state-active'),
              this.buttonElement.prop('aria-pressed', i))
            : (this.buttonElement = this.element);
      },
      widget: function () {
        return this.buttonElement;
      },
      _destroy: function () {
        this.element.removeClass('ui-helper-hidden-accessible'),
          this.buttonElement
            .removeClass(i + ' ui-state-active ' + s)
            .removeAttr('role')
            .removeAttr('aria-pressed')
            .html(this.buttonElement.find('.ui-button-text').html()),
          this.hasTitle || this.buttonElement.removeAttr('title');
      },
      _setOption: function (t, e) {
        return (
          this._super(t, e),
          'disabled' === t
            ? (this.widget().toggleClass('ui-state-disabled', !!e),
              this.element.prop('disabled', !!e),
              void (
                e &&
                this.buttonElement.removeClass(
                  'checkbox' === this.type || 'radio' === this.type
                    ? 'ui-state-focus'
                    : 'ui-state-focus ui-state-active'
                )
              ))
            : void this._resetButton()
        );
      },
      refresh: function () {
        var e = this.element.is('input, button')
          ? this.element.is(':disabled')
          : this.element.hasClass('ui-button-disabled');
        e !== this.options.disabled && this._setOption('disabled', e),
          'radio' === this.type
            ? o(this.element[0]).each(function () {
                t(this).is(':checked')
                  ? t(this)
                      .button('widget')
                      .addClass('ui-state-active')
                      .attr('aria-pressed', 'true')
                  : t(this)
                      .button('widget')
                      .removeClass('ui-state-active')
                      .attr('aria-pressed', 'false');
              })
            : 'checkbox' === this.type &&
              (this.element.is(':checked')
                ? this.buttonElement
                    .addClass('ui-state-active')
                    .attr('aria-pressed', 'true')
                : this.buttonElement
                    .removeClass('ui-state-active')
                    .attr('aria-pressed', 'false'));
      },
      _resetButton: function () {
        if ('input' === this.type)
          return void (
            this.options.label && this.element.val(this.options.label)
          );
        var e = this.buttonElement.removeClass(s),
          i = t('<span></span>', this.document[0])
            .addClass('ui-button-text')
            .html(this.options.label)
            .appendTo(e.empty())
            .text(),
          n = this.options.icons,
          o = n.primary && n.secondary,
          a = [];
        n.primary || n.secondary
          ? (this.options.text &&
              a.push(
                'ui-button-text-icon' +
                  (o ? 's' : n.primary ? '-primary' : '-secondary')
              ),
            n.primary &&
              e.prepend(
                "<span class='ui-button-icon-primary ui-icon " +
                  n.primary +
                  "'></span>"
              ),
            n.secondary &&
              e.append(
                "<span class='ui-button-icon-secondary ui-icon " +
                  n.secondary +
                  "'></span>"
              ),
            this.options.text ||
              (a.push(o ? 'ui-button-icons-only' : 'ui-button-icon-only'),
              this.hasTitle || e.attr('title', t.trim(i))))
          : a.push('ui-button-text-only'),
          e.addClass(a.join(' '));
      },
    }),
    t.widget('ui.buttonset', {
      version: '1.11.3',
      options: {
        items:
          'button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(ui-button)',
      },
      _create: function () {
        this.element.addClass('ui-buttonset');
      },
      _init: function () {
        this.refresh();
      },
      _setOption: function (t, e) {
        'disabled' === t && this.buttons.button('option', t, e),
          this._super(t, e);
      },
      refresh: function () {
        var e = 'rtl' === this.element.css('direction'),
          i = this.element.find(this.options.items),
          s = i.filter(':ui-button');
        i.not(':ui-button').button(),
          s.button('refresh'),
          (this.buttons = i
            .map(function () {
              return t(this).button('widget')[0];
            })
            .removeClass('ui-corner-all ui-corner-left ui-corner-right')
            .filter(':first')
            .addClass(e ? 'ui-corner-right' : 'ui-corner-left')
            .end()
            .filter(':last')
            .addClass(e ? 'ui-corner-left' : 'ui-corner-right')
            .end()
            .end());
      },
      _destroy: function () {
        this.element.removeClass('ui-buttonset'),
          this.buttons
            .map(function () {
              return t(this).button('widget')[0];
            })
            .removeClass('ui-corner-left ui-corner-right')
            .end()
            .button('destroy');
      },
    }),
    t.ui.button
  );
});
