!(function (e) {
  'function' == typeof define && define.amd
    ? define(['jquery', './core'], e)
    : e(jQuery);
})(function (e) {
  function t(e) {
    for (var t, a; e.length && e[0] !== document; ) {
      if (
        ((t = e.css('position')),
        ('absolute' === t || 'relative' === t || 'fixed' === t) &&
          ((a = parseInt(e.css('zIndex'), 10)), !isNaN(a) && 0 !== a))
      )
        return a;
      e = e.parent();
    }
    return 0;
  }
  function a() {
    (this._curInst = null),
      (this._keyEvent = !1),
      (this._disabledInputs = []),
      (this._datepickerShowing = !1),
      (this._inDialog = !1),
      (this._mainDivId = 'ui-datepicker-div'),
      (this._inlineClass = 'ui-datepicker-inline'),
      (this._appendClass = 'ui-datepicker-append'),
      (this._triggerClass = 'ui-datepicker-trigger'),
      (this._dialogClass = 'ui-datepicker-dialog'),
      (this._disableClass = 'ui-datepicker-disabled'),
      (this._unselectableClass = 'ui-datepicker-unselectable'),
      (this._currentClass = 'ui-datepicker-current-day'),
      (this._dayOverClass = 'ui-datepicker-days-cell-over'),
      (this.regional = []),
      (this.regional[''] = {
        closeText: 'Done',
        prevText: 'Prev',
        nextText: 'Next',
        currentText: 'Today',
        monthNames: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ],
        monthNamesShort: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        dayNames: [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ],
        dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        weekHeader: 'Wk',
        dateFormat: 'mm/dd/yy',
        firstDay: 0,
        isRTL: !1,
        showMonthAfterYear: !1,
        yearSuffix: '',
      }),
      (this._defaults = {
        showOn: 'focus',
        showAnim: 'fadeIn',
        showOptions: {},
        defaultDate: null,
        appendText: '',
        buttonText: '...',
        buttonImage: '',
        buttonImageOnly: !1,
        hideIfNoPrevNext: !1,
        navigationAsDateFormat: !1,
        gotoCurrent: !1,
        changeMonth: !1,
        changeYear: !1,
        yearRange: 'c-10:c+10',
        showOtherMonths: !1,
        selectOtherMonths: !1,
        showWeek: !1,
        calculateWeek: this.iso8601Week,
        shortYearCutoff: '+10',
        minDate: null,
        maxDate: null,
        duration: 'fast',
        beforeShowDay: null,
        beforeShow: null,
        onSelect: null,
        onChangeMonthYear: null,
        onClose: null,
        numberOfMonths: 1,
        showCurrentAtPos: 0,
        stepMonths: 1,
        stepBigMonths: 12,
        altField: '',
        altFormat: '',
        constrainInput: !0,
        showButtonPanel: !1,
        autoSize: !1,
        disabled: !1,
      }),
      e.extend(this._defaults, this.regional['']),
      (this.regional.en = e.extend(!0, {}, this.regional[''])),
      (this.regional['en-US'] = e.extend(!0, {}, this.regional.en)),
      (this.dpDiv = i(
        e(
          "<div id='" +
            this._mainDivId +
            "' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"
        )
      ));
  }
  function i(t) {
    var a =
      'button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a';
    return t
      .delegate(a, 'mouseout', function () {
        e(this).removeClass('ui-state-hover'),
          -1 !== this.className.indexOf('ui-datepicker-prev') &&
            e(this).removeClass('ui-datepicker-prev-hover'),
          -1 !== this.className.indexOf('ui-datepicker-next') &&
            e(this).removeClass('ui-datepicker-next-hover');
      })
      .delegate(a, 'mouseover', s);
  }
  function s() {
    e.datepicker._isDisabledDatepicker(
      n.inline ? n.dpDiv.parent()[0] : n.input[0]
    ) ||
      (e(this)
        .parents('.ui-datepicker-calendar')
        .find('a')
        .removeClass('ui-state-hover'),
      e(this).addClass('ui-state-hover'),
      -1 !== this.className.indexOf('ui-datepicker-prev') &&
        e(this).addClass('ui-datepicker-prev-hover'),
      -1 !== this.className.indexOf('ui-datepicker-next') &&
        e(this).addClass('ui-datepicker-next-hover'));
  }
  function r(t, a) {
    e.extend(t, a);
    for (var i in a) null == a[i] && (t[i] = a[i]);
    return t;
  }
  e.extend(e.ui, { datepicker: { version: '1.11.3' } });
  var n;
  return (
    e.extend(a.prototype, {
      markerClassName: 'hasDatepicker',
      maxRows: 4,
      _widgetDatepicker: function () {
        return this.dpDiv;
      },
      setDefaults: function (e) {
        return r(this._defaults, e || {}), this;
      },
      _attachDatepicker: function (t, a) {
        var i, s, r;
        (i = t.nodeName.toLowerCase()),
          (s = 'div' === i || 'span' === i),
          t.id || ((this.uuid += 1), (t.id = 'dp' + this.uuid)),
          (r = this._newInst(e(t), s)),
          (r.settings = e.extend({}, a || {})),
          'input' === i
            ? this._connectDatepicker(t, r)
            : s && this._inlineDatepicker(t, r);
      },
      _newInst: function (t, a) {
        var s = t[0].id.replace(/([^A-Za-z0-9_\-])/g, '\\\\$1');
        return {
          id: s,
          input: t,
          selectedDay: 0,
          selectedMonth: 0,
          selectedYear: 0,
          drawMonth: 0,
          drawYear: 0,
          inline: a,
          dpDiv: a
            ? i(
                e(
                  "<div class='" +
                    this._inlineClass +
                    " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"
                )
              )
            : this.dpDiv,
        };
      },
      _connectDatepicker: function (t, a) {
        var i = e(t);
        (a.append = e([])),
          (a.trigger = e([])),
          i.hasClass(this.markerClassName) ||
            (this._attachments(i, a),
            i
              .addClass(this.markerClassName)
              .keydown(this._doKeyDown)
              .keypress(this._doKeyPress)
              .keyup(this._doKeyUp),
            this._autoSize(a),
            e.data(t, 'datepicker', a),
            a.settings.disabled && this._disableDatepicker(t));
      },
      _attachments: function (t, a) {
        var i,
          s,
          r,
          n = this._get(a, 'appendText'),
          d = this._get(a, 'isRTL');
        a.append && a.append.remove(),
          n &&
            ((a.append = e(
              "<span class='" + this._appendClass + "'>" + n + '</span>'
            )),
            t[d ? 'before' : 'after'](a.append)),
          t.unbind('focus', this._showDatepicker),
          a.trigger && a.trigger.remove(),
          (i = this._get(a, 'showOn')),
          ('focus' === i || 'both' === i) && t.focus(this._showDatepicker),
          ('button' === i || 'both' === i) &&
            ((s = this._get(a, 'buttonText')),
            (r = this._get(a, 'buttonImage')),
            (a.trigger = e(
              this._get(a, 'buttonImageOnly')
                ? e('<img/>')
                    .addClass(this._triggerClass)
                    .attr({ src: r, alt: s, title: s })
                : e("<button type='button'></button>")
                    .addClass(this._triggerClass)
                    .html(
                      r ? e('<img/>').attr({ src: r, alt: s, title: s }) : s
                    )
            )),
            t[d ? 'before' : 'after'](a.trigger),
            a.trigger.click(function () {
              return (
                e.datepicker._datepickerShowing &&
                e.datepicker._lastInput === t[0]
                  ? e.datepicker._hideDatepicker()
                  : e.datepicker._datepickerShowing &&
                      e.datepicker._lastInput !== t[0]
                    ? (e.datepicker._hideDatepicker(),
                      e.datepicker._showDatepicker(t[0]))
                    : e.datepicker._showDatepicker(t[0]),
                !1
              );
            }));
      },
      _autoSize: function (e) {
        if (this._get(e, 'autoSize') && !e.inline) {
          var t,
            a,
            i,
            s,
            r = new Date(2009, 11, 20),
            n = this._get(e, 'dateFormat');
          n.match(/[DM]/) &&
            ((t = function (e) {
              for (a = 0, i = 0, s = 0; s < e.length; s++)
                e[s].length > a && ((a = e[s].length), (i = s));
              return i;
            }),
            r.setMonth(
              t(this._get(e, n.match(/MM/) ? 'monthNames' : 'monthNamesShort'))
            ),
            r.setDate(
              t(this._get(e, n.match(/DD/) ? 'dayNames' : 'dayNamesShort')) +
                20 -
                r.getDay()
            )),
            e.input.attr('size', this._formatDate(e, r).length);
        }
      },
      _inlineDatepicker: function (t, a) {
        var i = e(t);
        i.hasClass(this.markerClassName) ||
          (i.addClass(this.markerClassName).append(a.dpDiv),
          e.data(t, 'datepicker', a),
          this._setDate(a, this._getDefaultDate(a), !0),
          this._updateDatepicker(a),
          this._updateAlternate(a),
          a.settings.disabled && this._disableDatepicker(t),
          a.dpDiv.css('display', 'block'));
      },
      _dialogDatepicker: function (t, a, i, s, n) {
        var d,
          c,
          o,
          l,
          h,
          u = this._dialogInst;
        return (
          u ||
            ((this.uuid += 1),
            (d = 'dp' + this.uuid),
            (this._dialogInput = e(
              "<input type='text' id='" +
                d +
                "' style='position: absolute; top: -100px; width: 0px;'/>"
            )),
            this._dialogInput.keydown(this._doKeyDown),
            e('body').append(this._dialogInput),
            (u = this._dialogInst = this._newInst(this._dialogInput, !1)),
            (u.settings = {}),
            e.data(this._dialogInput[0], 'datepicker', u)),
          r(u.settings, s || {}),
          (a = a && a.constructor === Date ? this._formatDate(u, a) : a),
          this._dialogInput.val(a),
          (this._pos = n ? (n.length ? n : [n.pageX, n.pageY]) : null),
          this._pos ||
            ((c = document.documentElement.clientWidth),
            (o = document.documentElement.clientHeight),
            (l =
              document.documentElement.scrollLeft || document.body.scrollLeft),
            (h = document.documentElement.scrollTop || document.body.scrollTop),
            (this._pos = [c / 2 - 100 + l, o / 2 - 150 + h])),
          this._dialogInput
            .css('left', this._pos[0] + 20 + 'px')
            .css('top', this._pos[1] + 'px'),
          (u.settings.onSelect = i),
          (this._inDialog = !0),
          this.dpDiv.addClass(this._dialogClass),
          this._showDatepicker(this._dialogInput[0]),
          e.blockUI && e.blockUI(this.dpDiv),
          e.data(this._dialogInput[0], 'datepicker', u),
          this
        );
      },
      _destroyDatepicker: function (t) {
        var a,
          i = e(t),
          s = e.data(t, 'datepicker');
        i.hasClass(this.markerClassName) &&
          ((a = t.nodeName.toLowerCase()),
          e.removeData(t, 'datepicker'),
          'input' === a
            ? (s.append.remove(),
              s.trigger.remove(),
              i
                .removeClass(this.markerClassName)
                .unbind('focus', this._showDatepicker)
                .unbind('keydown', this._doKeyDown)
                .unbind('keypress', this._doKeyPress)
                .unbind('keyup', this._doKeyUp))
            : ('div' === a || 'span' === a) &&
              i.removeClass(this.markerClassName).empty(),
          n === s && (n = null));
      },
      _enableDatepicker: function (t) {
        var a,
          i,
          s = e(t),
          r = e.data(t, 'datepicker');
        s.hasClass(this.markerClassName) &&
          ((a = t.nodeName.toLowerCase()),
          'input' === a
            ? ((t.disabled = !1),
              r.trigger
                .filter('button')
                .each(function () {
                  this.disabled = !1;
                })
                .end()
                .filter('img')
                .css({ opacity: '1.0', cursor: '' }))
            : ('div' === a || 'span' === a) &&
              ((i = s.children('.' + this._inlineClass)),
              i.children().removeClass('ui-state-disabled'),
              i
                .find('select.ui-datepicker-month, select.ui-datepicker-year')
                .prop('disabled', !1)),
          (this._disabledInputs = e.map(this._disabledInputs, function (e) {
            return e === t ? null : e;
          })));
      },
      _disableDatepicker: function (t) {
        var a,
          i,
          s = e(t),
          r = e.data(t, 'datepicker');
        s.hasClass(this.markerClassName) &&
          ((a = t.nodeName.toLowerCase()),
          'input' === a
            ? ((t.disabled = !0),
              r.trigger
                .filter('button')
                .each(function () {
                  this.disabled = !0;
                })
                .end()
                .filter('img')
                .css({ opacity: '0.5', cursor: 'default' }))
            : ('div' === a || 'span' === a) &&
              ((i = s.children('.' + this._inlineClass)),
              i.children().addClass('ui-state-disabled'),
              i
                .find('select.ui-datepicker-month, select.ui-datepicker-year')
                .prop('disabled', !0)),
          (this._disabledInputs = e.map(this._disabledInputs, function (e) {
            return e === t ? null : e;
          })),
          (this._disabledInputs[this._disabledInputs.length] = t));
      },
      _isDisabledDatepicker: function (e) {
        if (!e) return !1;
        for (var t = 0; t < this._disabledInputs.length; t++)
          if (this._disabledInputs[t] === e) return !0;
        return !1;
      },
      _getInst: function (t) {
        try {
          return e.data(t, 'datepicker');
        } catch (a) {
          throw 'Missing instance data for this datepicker';
        }
      },
      _optionDatepicker: function (t, a, i) {
        var s,
          n,
          d,
          c,
          o = this._getInst(t);
        return 2 === arguments.length && 'string' == typeof a
          ? 'defaults' === a
            ? e.extend({}, e.datepicker._defaults)
            : o
              ? 'all' === a
                ? e.extend({}, o.settings)
                : this._get(o, a)
              : null
          : ((s = a || {}),
            'string' == typeof a && ((s = {}), (s[a] = i)),
            void (
              o &&
              (this._curInst === o && this._hideDatepicker(),
              (n = this._getDateDatepicker(t, !0)),
              (d = this._getMinMaxDate(o, 'min')),
              (c = this._getMinMaxDate(o, 'max')),
              r(o.settings, s),
              null !== d &&
                void 0 !== s.dateFormat &&
                void 0 === s.minDate &&
                (o.settings.minDate = this._formatDate(o, d)),
              null !== c &&
                void 0 !== s.dateFormat &&
                void 0 === s.maxDate &&
                (o.settings.maxDate = this._formatDate(o, c)),
              'disabled' in s &&
                (s.disabled
                  ? this._disableDatepicker(t)
                  : this._enableDatepicker(t)),
              this._attachments(e(t), o),
              this._autoSize(o),
              this._setDate(o, n),
              this._updateAlternate(o),
              this._updateDatepicker(o))
            ));
      },
      _changeDatepicker: function (e, t, a) {
        this._optionDatepicker(e, t, a);
      },
      _refreshDatepicker: function (e) {
        var t = this._getInst(e);
        t && this._updateDatepicker(t);
      },
      _setDateDatepicker: function (e, t) {
        var a = this._getInst(e);
        a &&
          (this._setDate(a, t),
          this._updateDatepicker(a),
          this._updateAlternate(a));
      },
      _getDateDatepicker: function (e, t) {
        var a = this._getInst(e);
        return (
          a && !a.inline && this._setDateFromField(a, t),
          a ? this._getDate(a) : null
        );
      },
      _doKeyDown: function (t) {
        var a,
          i,
          s,
          r = e.datepicker._getInst(t.target),
          n = !0,
          d = r.dpDiv.is('.ui-datepicker-rtl');
        if (((r._keyEvent = !0), e.datepicker._datepickerShowing))
          switch (t.keyCode) {
            case 9:
              e.datepicker._hideDatepicker(), (n = !1);
              break;
            case 13:
              return (
                (s = e(
                  'td.' +
                    e.datepicker._dayOverClass +
                    ':not(.' +
                    e.datepicker._currentClass +
                    ')',
                  r.dpDiv
                )),
                s[0] &&
                  e.datepicker._selectDay(
                    t.target,
                    r.selectedMonth,
                    r.selectedYear,
                    s[0]
                  ),
                (a = e.datepicker._get(r, 'onSelect')),
                a
                  ? ((i = e.datepicker._formatDate(r)),
                    a.apply(r.input ? r.input[0] : null, [i, r]))
                  : e.datepicker._hideDatepicker(),
                !1
              );
            case 27:
              e.datepicker._hideDatepicker();
              break;
            case 33:
              e.datepicker._adjustDate(
                t.target,
                t.ctrlKey
                  ? -e.datepicker._get(r, 'stepBigMonths')
                  : -e.datepicker._get(r, 'stepMonths'),
                'M'
              );
              break;
            case 34:
              e.datepicker._adjustDate(
                t.target,
                t.ctrlKey
                  ? +e.datepicker._get(r, 'stepBigMonths')
                  : +e.datepicker._get(r, 'stepMonths'),
                'M'
              );
              break;
            case 35:
              (t.ctrlKey || t.metaKey) && e.datepicker._clearDate(t.target),
                (n = t.ctrlKey || t.metaKey);
              break;
            case 36:
              (t.ctrlKey || t.metaKey) && e.datepicker._gotoToday(t.target),
                (n = t.ctrlKey || t.metaKey);
              break;
            case 37:
              (t.ctrlKey || t.metaKey) &&
                e.datepicker._adjustDate(t.target, d ? 1 : -1, 'D'),
                (n = t.ctrlKey || t.metaKey),
                t.originalEvent.altKey &&
                  e.datepicker._adjustDate(
                    t.target,
                    t.ctrlKey
                      ? -e.datepicker._get(r, 'stepBigMonths')
                      : -e.datepicker._get(r, 'stepMonths'),
                    'M'
                  );
              break;
            case 38:
              (t.ctrlKey || t.metaKey) &&
                e.datepicker._adjustDate(t.target, -7, 'D'),
                (n = t.ctrlKey || t.metaKey);
              break;
            case 39:
              (t.ctrlKey || t.metaKey) &&
                e.datepicker._adjustDate(t.target, d ? -1 : 1, 'D'),
                (n = t.ctrlKey || t.metaKey),
                t.originalEvent.altKey &&
                  e.datepicker._adjustDate(
                    t.target,
                    t.ctrlKey
                      ? +e.datepicker._get(r, 'stepBigMonths')
                      : +e.datepicker._get(r, 'stepMonths'),
                    'M'
                  );
              break;
            case 40:
              (t.ctrlKey || t.metaKey) &&
                e.datepicker._adjustDate(t.target, 7, 'D'),
                (n = t.ctrlKey || t.metaKey);
              break;
            default:
              n = !1;
          }
        else
          36 === t.keyCode && t.ctrlKey
            ? e.datepicker._showDatepicker(this)
            : (n = !1);
        n && (t.preventDefault(), t.stopPropagation());
      },
      _doKeyPress: function (t) {
        var a,
          i,
          s = e.datepicker._getInst(t.target);
        return e.datepicker._get(s, 'constrainInput')
          ? ((a = e.datepicker._possibleChars(
              e.datepicker._get(s, 'dateFormat')
            )),
            (i = String.fromCharCode(
              null == t.charCode ? t.keyCode : t.charCode
            )),
            t.ctrlKey || t.metaKey || ' ' > i || !a || a.indexOf(i) > -1)
          : void 0;
      },
      _doKeyUp: function (t) {
        var a,
          i = e.datepicker._getInst(t.target);
        if (i.input.val() !== i.lastVal)
          try {
            (a = e.datepicker.parseDate(
              e.datepicker._get(i, 'dateFormat'),
              i.input ? i.input.val() : null,
              e.datepicker._getFormatConfig(i)
            )),
              a &&
                (e.datepicker._setDateFromField(i),
                e.datepicker._updateAlternate(i),
                e.datepicker._updateDatepicker(i));
          } catch (s) {}
        return !0;
      },
      _showDatepicker: function (a) {
        if (
          ((a = a.target || a),
          'input' !== a.nodeName.toLowerCase() &&
            (a = e('input', a.parentNode)[0]),
          !e.datepicker._isDisabledDatepicker(a) &&
            e.datepicker._lastInput !== a)
        ) {
          var i, s, n, d, c, o, l;
          (i = e.datepicker._getInst(a)),
            e.datepicker._curInst &&
              e.datepicker._curInst !== i &&
              (e.datepicker._curInst.dpDiv.stop(!0, !0),
              i &&
                e.datepicker._datepickerShowing &&
                e.datepicker._hideDatepicker(e.datepicker._curInst.input[0])),
            (s = e.datepicker._get(i, 'beforeShow')),
            (n = s ? s.apply(a, [a, i]) : {}),
            n !== !1 &&
              (r(i.settings, n),
              (i.lastVal = null),
              (e.datepicker._lastInput = a),
              e.datepicker._setDateFromField(i),
              e.datepicker._inDialog && (a.value = ''),
              e.datepicker._pos ||
                ((e.datepicker._pos = e.datepicker._findPos(a)),
                (e.datepicker._pos[1] += a.offsetHeight)),
              (d = !1),
              e(a)
                .parents()
                .each(function () {
                  return (d |= 'fixed' === e(this).css('position')), !d;
                }),
              (c = { left: e.datepicker._pos[0], top: e.datepicker._pos[1] }),
              (e.datepicker._pos = null),
              i.dpDiv.empty(),
              i.dpDiv.css({
                position: 'absolute',
                display: 'block',
                top: '-1000px',
              }),
              e.datepicker._updateDatepicker(i),
              (c = e.datepicker._checkOffset(i, c, d)),
              i.dpDiv.css({
                position:
                  e.datepicker._inDialog && e.blockUI
                    ? 'static'
                    : d
                      ? 'fixed'
                      : 'absolute',
                display: 'none',
                left: c.left + 'px',
                top: c.top + 'px',
              }),
              i.inline ||
                ((o = e.datepicker._get(i, 'showAnim')),
                (l = e.datepicker._get(i, 'duration')),
                i.dpDiv.css('z-index', t(e(a)) + 1),
                (e.datepicker._datepickerShowing = !0),
                e.effects && e.effects.effect[o]
                  ? i.dpDiv.show(o, e.datepicker._get(i, 'showOptions'), l)
                  : i.dpDiv[o || 'show'](o ? l : null),
                e.datepicker._shouldFocusInput(i) && i.input.focus(),
                (e.datepicker._curInst = i)));
        }
      },
      _updateDatepicker: function (t) {
        (this.maxRows = 4),
          (n = t),
          t.dpDiv.empty().append(this._generateHTML(t)),
          this._attachHandlers(t);
        var a,
          i = this._getNumberOfMonths(t),
          r = i[1],
          d = 17,
          c = t.dpDiv.find('.' + this._dayOverClass + ' a');
        c.length > 0 && s.apply(c.get(0)),
          t.dpDiv
            .removeClass(
              'ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4'
            )
            .width(''),
          r > 1 &&
            t.dpDiv
              .addClass('ui-datepicker-multi-' + r)
              .css('width', d * r + 'em'),
          t.dpDiv[(1 !== i[0] || 1 !== i[1] ? 'add' : 'remove') + 'Class'](
            'ui-datepicker-multi'
          ),
          t.dpDiv[(this._get(t, 'isRTL') ? 'add' : 'remove') + 'Class'](
            'ui-datepicker-rtl'
          ),
          t === e.datepicker._curInst &&
            e.datepicker._datepickerShowing &&
            e.datepicker._shouldFocusInput(t) &&
            t.input.focus(),
          t.yearshtml &&
            ((a = t.yearshtml),
            setTimeout(function () {
              a === t.yearshtml &&
                t.yearshtml &&
                t.dpDiv
                  .find('select.ui-datepicker-year:first')
                  .replaceWith(t.yearshtml),
                (a = t.yearshtml = null);
            }, 0));
      },
      _shouldFocusInput: function (e) {
        return (
          e.input &&
          e.input.is(':visible') &&
          !e.input.is(':disabled') &&
          !e.input.is(':focus')
        );
      },
      _checkOffset: function (t, a, i) {
        var s = t.dpDiv.outerWidth(),
          r = t.dpDiv.outerHeight(),
          n = t.input ? t.input.outerWidth() : 0,
          d = t.input ? t.input.outerHeight() : 0,
          c =
            document.documentElement.clientWidth +
            (i ? 0 : e(document).scrollLeft()),
          o =
            document.documentElement.clientHeight +
            (i ? 0 : e(document).scrollTop());
        return (
          (a.left -= this._get(t, 'isRTL') ? s - n : 0),
          (a.left -=
            i && a.left === t.input.offset().left
              ? e(document).scrollLeft()
              : 0),
          (a.top -=
            i && a.top === t.input.offset().top + d
              ? e(document).scrollTop()
              : 0),
          (a.left -= Math.min(
            a.left,
            a.left + s > c && c > s ? Math.abs(a.left + s - c) : 0
          )),
          (a.top -= Math.min(
            a.top,
            a.top + r > o && o > r ? Math.abs(r + d) : 0
          )),
          a
        );
      },
      _findPos: function (t) {
        for (
          var a, i = this._getInst(t), s = this._get(i, 'isRTL');
          t &&
          ('hidden' === t.type || 1 !== t.nodeType || e.expr.filters.hidden(t));

        )
          t = t[s ? 'previousSibling' : 'nextSibling'];
        return (a = e(t).offset()), [a.left, a.top];
      },
      _hideDatepicker: function (t) {
        var a,
          i,
          s,
          r,
          n = this._curInst;
        !n ||
          (t && n !== e.data(t, 'datepicker')) ||
          (this._datepickerShowing &&
            ((a = this._get(n, 'showAnim')),
            (i = this._get(n, 'duration')),
            (s = function () {
              e.datepicker._tidyDialog(n);
            }),
            e.effects && (e.effects.effect[a] || e.effects[a])
              ? n.dpDiv.hide(a, e.datepicker._get(n, 'showOptions'), i, s)
              : n.dpDiv[
                  'slideDown' === a
                    ? 'slideUp'
                    : 'fadeIn' === a
                      ? 'fadeOut'
                      : 'hide'
                ](a ? i : null, s),
            a || s(),
            (this._datepickerShowing = !1),
            (r = this._get(n, 'onClose')),
            r &&
              r.apply(n.input ? n.input[0] : null, [
                n.input ? n.input.val() : '',
                n,
              ]),
            (this._lastInput = null),
            this._inDialog &&
              (this._dialogInput.css({
                position: 'absolute',
                left: '0',
                top: '-100px',
              }),
              e.blockUI && (e.unblockUI(), e('body').append(this.dpDiv))),
            (this._inDialog = !1)));
      },
      _tidyDialog: function (e) {
        e.dpDiv
          .removeClass(this._dialogClass)
          .unbind('.ui-datepicker-calendar');
      },
      _checkExternalClick: function (t) {
        if (e.datepicker._curInst) {
          var a = e(t.target),
            i = e.datepicker._getInst(a[0]);
          ((a[0].id !== e.datepicker._mainDivId &&
            0 === a.parents('#' + e.datepicker._mainDivId).length &&
            !a.hasClass(e.datepicker.markerClassName) &&
            !a.closest('.' + e.datepicker._triggerClass).length &&
            e.datepicker._datepickerShowing &&
            (!e.datepicker._inDialog || !e.blockUI)) ||
            (a.hasClass(e.datepicker.markerClassName) &&
              e.datepicker._curInst !== i)) &&
            e.datepicker._hideDatepicker();
        }
      },
      _adjustDate: function (t, a, i) {
        var s = e(t),
          r = this._getInst(s[0]);
        this._isDisabledDatepicker(s[0]) ||
          (this._adjustInstDate(
            r,
            a + ('M' === i ? this._get(r, 'showCurrentAtPos') : 0),
            i
          ),
          this._updateDatepicker(r));
      },
      _gotoToday: function (t) {
        var a,
          i = e(t),
          s = this._getInst(i[0]);
        this._get(s, 'gotoCurrent') && s.currentDay
          ? ((s.selectedDay = s.currentDay),
            (s.drawMonth = s.selectedMonth = s.currentMonth),
            (s.drawYear = s.selectedYear = s.currentYear))
          : ((a = new Date()),
            (s.selectedDay = a.getDate()),
            (s.drawMonth = s.selectedMonth = a.getMonth()),
            (s.drawYear = s.selectedYear = a.getFullYear())),
          this._notifyChange(s),
          this._adjustDate(i);
      },
      _selectMonthYear: function (t, a, i) {
        var s = e(t),
          r = this._getInst(s[0]);
        (r['selected' + ('M' === i ? 'Month' : 'Year')] = r[
          'draw' + ('M' === i ? 'Month' : 'Year')
        ] =
          parseInt(a.options[a.selectedIndex].value, 10)),
          this._notifyChange(r),
          this._adjustDate(s);
      },
      _selectDay: function (t, a, i, s) {
        var r,
          n = e(t);
        e(s).hasClass(this._unselectableClass) ||
          this._isDisabledDatepicker(n[0]) ||
          ((r = this._getInst(n[0])),
          (r.selectedDay = r.currentDay = e('a', s).html()),
          (r.selectedMonth = r.currentMonth = a),
          (r.selectedYear = r.currentYear = i),
          this._selectDate(
            t,
            this._formatDate(r, r.currentDay, r.currentMonth, r.currentYear)
          ));
      },
      _clearDate: function (t) {
        var a = e(t);
        this._selectDate(a, '');
      },
      _selectDate: function (t, a) {
        var i,
          s = e(t),
          r = this._getInst(s[0]);
        (a = null != a ? a : this._formatDate(r)),
          r.input && r.input.val(a),
          this._updateAlternate(r),
          (i = this._get(r, 'onSelect')),
          i
            ? i.apply(r.input ? r.input[0] : null, [a, r])
            : r.input && r.input.trigger('change'),
          r.inline
            ? this._updateDatepicker(r)
            : (this._hideDatepicker(),
              (this._lastInput = r.input[0]),
              'object' != typeof r.input[0] && r.input.focus(),
              (this._lastInput = null));
      },
      _updateAlternate: function (t) {
        var a,
          i,
          s,
          r = this._get(t, 'altField');
        r &&
          ((a = this._get(t, 'altFormat') || this._get(t, 'dateFormat')),
          (i = this._getDate(t)),
          (s = this.formatDate(a, i, this._getFormatConfig(t))),
          e(r).each(function () {
            e(this).val(s);
          }));
      },
      noWeekends: function (e) {
        var t = e.getDay();
        return [t > 0 && 6 > t, ''];
      },
      iso8601Week: function (e) {
        var t,
          a = new Date(e.getTime());
        return (
          a.setDate(a.getDate() + 4 - (a.getDay() || 7)),
          (t = a.getTime()),
          a.setMonth(0),
          a.setDate(1),
          Math.floor(Math.round((t - a) / 864e5) / 7) + 1
        );
      },
      parseDate: function (t, a, i) {
        if (null == t || null == a) throw 'Invalid arguments';
        if (((a = 'object' == typeof a ? a.toString() : a + ''), '' === a))
          return null;
        var s,
          r,
          n,
          d,
          c = 0,
          o = (i ? i.shortYearCutoff : null) || this._defaults.shortYearCutoff,
          l =
            'string' != typeof o
              ? o
              : (new Date().getFullYear() % 100) + parseInt(o, 10),
          h = (i ? i.dayNamesShort : null) || this._defaults.dayNamesShort,
          u = (i ? i.dayNames : null) || this._defaults.dayNames,
          p = (i ? i.monthNamesShort : null) || this._defaults.monthNamesShort,
          g = (i ? i.monthNames : null) || this._defaults.monthNames,
          _ = -1,
          k = -1,
          f = -1,
          m = -1,
          D = !1,
          y = function (e) {
            var a = s + 1 < t.length && t.charAt(s + 1) === e;
            return a && s++, a;
          },
          v = function (e) {
            var t = y(e),
              i =
                '@' === e
                  ? 14
                  : '!' === e
                    ? 20
                    : 'y' === e && t
                      ? 4
                      : 'o' === e
                        ? 3
                        : 2,
              s = 'y' === e ? i : 1,
              r = new RegExp('^\\d{' + s + ',' + i + '}'),
              n = a.substring(c).match(r);
            if (!n) throw 'Missing number at position ' + c;
            return (c += n[0].length), parseInt(n[0], 10);
          },
          M = function (t, i, s) {
            var r = -1,
              n = e
                .map(y(t) ? s : i, function (e, t) {
                  return [[t, e]];
                })
                .sort(function (e, t) {
                  return -(e[1].length - t[1].length);
                });
            if (
              (e.each(n, function (e, t) {
                var i = t[1];
                return a.substr(c, i.length).toLowerCase() === i.toLowerCase()
                  ? ((r = t[0]), (c += i.length), !1)
                  : void 0;
              }),
              -1 !== r)
            )
              return r + 1;
            throw 'Unknown name at position ' + c;
          },
          b = function () {
            if (a.charAt(c) !== t.charAt(s))
              throw 'Unexpected literal at position ' + c;
            c++;
          };
        for (s = 0; s < t.length; s++)
          if (D) "'" !== t.charAt(s) || y("'") ? b() : (D = !1);
          else
            switch (t.charAt(s)) {
              case 'd':
                f = v('d');
                break;
              case 'D':
                M('D', h, u);
                break;
              case 'o':
                m = v('o');
                break;
              case 'm':
                k = v('m');
                break;
              case 'M':
                k = M('M', p, g);
                break;
              case 'y':
                _ = v('y');
                break;
              case '@':
                (d = new Date(v('@'))),
                  (_ = d.getFullYear()),
                  (k = d.getMonth() + 1),
                  (f = d.getDate());
                break;
              case '!':
                (d = new Date((v('!') - this._ticksTo1970) / 1e4)),
                  (_ = d.getFullYear()),
                  (k = d.getMonth() + 1),
                  (f = d.getDate());
                break;
              case "'":
                y("'") ? b() : (D = !0);
                break;
              default:
                b();
            }
        if (c < a.length && ((n = a.substr(c)), !/^\s+/.test(n)))
          throw 'Extra/unparsed characters found in date: ' + n;
        if (
          (-1 === _
            ? (_ = new Date().getFullYear())
            : 100 > _ &&
              (_ +=
                new Date().getFullYear() -
                (new Date().getFullYear() % 100) +
                (l >= _ ? 0 : -100)),
          m > -1)
        )
          for (k = 1, f = m; ; ) {
            if (((r = this._getDaysInMonth(_, k - 1)), r >= f)) break;
            k++, (f -= r);
          }
        if (
          ((d = this._daylightSavingAdjust(new Date(_, k - 1, f))),
          d.getFullYear() !== _ || d.getMonth() + 1 !== k || d.getDate() !== f)
        )
          throw 'Invalid date';
        return d;
      },
      ATOM: 'yy-mm-dd',
      COOKIE: 'D, dd M yy',
      ISO_8601: 'yy-mm-dd',
      RFC_822: 'D, d M y',
      RFC_850: 'DD, dd-M-y',
      RFC_1036: 'D, d M y',
      RFC_1123: 'D, d M yy',
      RFC_2822: 'D, d M yy',
      RSS: 'D, d M y',
      TICKS: '!',
      TIMESTAMP: '@',
      W3C: 'yy-mm-dd',
      _ticksTo1970:
        24 *
        (718685 + Math.floor(492.5) - Math.floor(19.7) + Math.floor(4.925)) *
        60 *
        60 *
        1e7,
      formatDate: function (e, t, a) {
        if (!t) return '';
        var i,
          s = (a ? a.dayNamesShort : null) || this._defaults.dayNamesShort,
          r = (a ? a.dayNames : null) || this._defaults.dayNames,
          n = (a ? a.monthNamesShort : null) || this._defaults.monthNamesShort,
          d = (a ? a.monthNames : null) || this._defaults.monthNames,
          c = function (t) {
            var a = i + 1 < e.length && e.charAt(i + 1) === t;
            return a && i++, a;
          },
          o = function (e, t, a) {
            var i = '' + t;
            if (c(e)) for (; i.length < a; ) i = '0' + i;
            return i;
          },
          l = function (e, t, a, i) {
            return c(e) ? i[t] : a[t];
          },
          h = '',
          u = !1;
        if (t)
          for (i = 0; i < e.length; i++)
            if (u)
              "'" !== e.charAt(i) || c("'") ? (h += e.charAt(i)) : (u = !1);
            else
              switch (e.charAt(i)) {
                case 'd':
                  h += o('d', t.getDate(), 2);
                  break;
                case 'D':
                  h += l('D', t.getDay(), s, r);
                  break;
                case 'o':
                  h += o(
                    'o',
                    Math.round(
                      (new Date(
                        t.getFullYear(),
                        t.getMonth(),
                        t.getDate()
                      ).getTime() -
                        new Date(t.getFullYear(), 0, 0).getTime()) /
                        864e5
                    ),
                    3
                  );
                  break;
                case 'm':
                  h += o('m', t.getMonth() + 1, 2);
                  break;
                case 'M':
                  h += l('M', t.getMonth(), n, d);
                  break;
                case 'y':
                  h += c('y')
                    ? t.getFullYear()
                    : (t.getYear() % 100 < 10 ? '0' : '') + (t.getYear() % 100);
                  break;
                case '@':
                  h += t.getTime();
                  break;
                case '!':
                  h += 1e4 * t.getTime() + this._ticksTo1970;
                  break;
                case "'":
                  c("'") ? (h += "'") : (u = !0);
                  break;
                default:
                  h += e.charAt(i);
              }
        return h;
      },
      _possibleChars: function (e) {
        var t,
          a = '',
          i = !1,
          s = function (a) {
            var i = t + 1 < e.length && e.charAt(t + 1) === a;
            return i && t++, i;
          };
        for (t = 0; t < e.length; t++)
          if (i) "'" !== e.charAt(t) || s("'") ? (a += e.charAt(t)) : (i = !1);
          else
            switch (e.charAt(t)) {
              case 'd':
              case 'm':
              case 'y':
              case '@':
                a += '0123456789';
                break;
              case 'D':
              case 'M':
                return null;
              case "'":
                s("'") ? (a += "'") : (i = !0);
                break;
              default:
                a += e.charAt(t);
            }
        return a;
      },
      _get: function (e, t) {
        return void 0 !== e.settings[t] ? e.settings[t] : this._defaults[t];
      },
      _setDateFromField: function (e, t) {
        if (e.input.val() !== e.lastVal) {
          var a = this._get(e, 'dateFormat'),
            i = (e.lastVal = e.input ? e.input.val() : null),
            s = this._getDefaultDate(e),
            r = s,
            n = this._getFormatConfig(e);
          try {
            r = this.parseDate(a, i, n) || s;
          } catch (d) {
            i = t ? '' : i;
          }
          (e.selectedDay = r.getDate()),
            (e.drawMonth = e.selectedMonth = r.getMonth()),
            (e.drawYear = e.selectedYear = r.getFullYear()),
            (e.currentDay = i ? r.getDate() : 0),
            (e.currentMonth = i ? r.getMonth() : 0),
            (e.currentYear = i ? r.getFullYear() : 0),
            this._adjustInstDate(e);
        }
      },
      _getDefaultDate: function (e) {
        return this._restrictMinMax(
          e,
          this._determineDate(e, this._get(e, 'defaultDate'), new Date())
        );
      },
      _determineDate: function (t, a, i) {
        var s = function (e) {
            var t = new Date();
            return t.setDate(t.getDate() + e), t;
          },
          r = function (a) {
            try {
              return e.datepicker.parseDate(
                e.datepicker._get(t, 'dateFormat'),
                a,
                e.datepicker._getFormatConfig(t)
              );
            } catch (i) {}
            for (
              var s =
                  (a.toLowerCase().match(/^c/)
                    ? e.datepicker._getDate(t)
                    : null) || new Date(),
                r = s.getFullYear(),
                n = s.getMonth(),
                d = s.getDate(),
                c = /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,
                o = c.exec(a);
              o;

            ) {
              switch (o[2] || 'd') {
                case 'd':
                case 'D':
                  d += parseInt(o[1], 10);
                  break;
                case 'w':
                case 'W':
                  d += 7 * parseInt(o[1], 10);
                  break;
                case 'm':
                case 'M':
                  (n += parseInt(o[1], 10)),
                    (d = Math.min(d, e.datepicker._getDaysInMonth(r, n)));
                  break;
                case 'y':
                case 'Y':
                  (r += parseInt(o[1], 10)),
                    (d = Math.min(d, e.datepicker._getDaysInMonth(r, n)));
              }
              o = c.exec(a);
            }
            return new Date(r, n, d);
          },
          n =
            null == a || '' === a
              ? i
              : 'string' == typeof a
                ? r(a)
                : 'number' == typeof a
                  ? isNaN(a)
                    ? i
                    : s(a)
                  : new Date(a.getTime());
        return (
          (n = n && 'Invalid Date' === n.toString() ? i : n),
          n &&
            (n.setHours(0),
            n.setMinutes(0),
            n.setSeconds(0),
            n.setMilliseconds(0)),
          this._daylightSavingAdjust(n)
        );
      },
      _daylightSavingAdjust: function (e) {
        return e
          ? (e.setHours(e.getHours() > 12 ? e.getHours() + 2 : 0), e)
          : null;
      },
      _setDate: function (e, t, a) {
        var i = !t,
          s = e.selectedMonth,
          r = e.selectedYear,
          n = this._restrictMinMax(e, this._determineDate(e, t, new Date()));
        (e.selectedDay = e.currentDay = n.getDate()),
          (e.drawMonth = e.selectedMonth = e.currentMonth = n.getMonth()),
          (e.drawYear = e.selectedYear = e.currentYear = n.getFullYear()),
          (s === e.selectedMonth && r === e.selectedYear) ||
            a ||
            this._notifyChange(e),
          this._adjustInstDate(e),
          e.input && e.input.val(i ? '' : this._formatDate(e));
      },
      _getDate: function (e) {
        var t =
          !e.currentYear || (e.input && '' === e.input.val())
            ? null
            : this._daylightSavingAdjust(
                new Date(e.currentYear, e.currentMonth, e.currentDay)
              );
        return t;
      },
      _attachHandlers: function (t) {
        var a = this._get(t, 'stepMonths'),
          i = '#' + t.id.replace(/\\\\/g, '\\');
        t.dpDiv.find('[data-handler]').map(function () {
          var t = {
            prev: function () {
              e.datepicker._adjustDate(i, -a, 'M');
            },
            next: function () {
              e.datepicker._adjustDate(i, +a, 'M');
            },
            hide: function () {
              e.datepicker._hideDatepicker();
            },
            today: function () {
              e.datepicker._gotoToday(i);
            },
            selectDay: function () {
              return (
                e.datepicker._selectDay(
                  i,
                  +this.getAttribute('data-month'),
                  +this.getAttribute('data-year'),
                  this
                ),
                !1
              );
            },
            selectMonth: function () {
              return e.datepicker._selectMonthYear(i, this, 'M'), !1;
            },
            selectYear: function () {
              return e.datepicker._selectMonthYear(i, this, 'Y'), !1;
            },
          };
          e(this).bind(
            this.getAttribute('data-event'),
            t[this.getAttribute('data-handler')]
          );
        });
      },
      _generateHTML: function (e) {
        var t,
          a,
          i,
          s,
          r,
          n,
          d,
          c,
          o,
          l,
          h,
          u,
          p,
          g,
          _,
          k,
          f,
          m,
          D,
          y,
          v,
          M,
          b,
          w,
          C,
          I,
          x,
          Y,
          S,
          N,
          F,
          T,
          A,
          K,
          j,
          O,
          R,
          L,
          W,
          E = new Date(),
          H = this._daylightSavingAdjust(
            new Date(E.getFullYear(), E.getMonth(), E.getDate())
          ),
          P = this._get(e, 'isRTL'),
          U = this._get(e, 'showButtonPanel'),
          z = this._get(e, 'hideIfNoPrevNext'),
          B = this._get(e, 'navigationAsDateFormat'),
          J = this._getNumberOfMonths(e),
          V = this._get(e, 'showCurrentAtPos'),
          q = this._get(e, 'stepMonths'),
          Q = 1 !== J[0] || 1 !== J[1],
          X = this._daylightSavingAdjust(
            e.currentDay
              ? new Date(e.currentYear, e.currentMonth, e.currentDay)
              : new Date(9999, 9, 9)
          ),
          Z = this._getMinMaxDate(e, 'min'),
          $ = this._getMinMaxDate(e, 'max'),
          G = e.drawMonth - V,
          et = e.drawYear;
        if ((0 > G && ((G += 12), et--), $))
          for (
            t = this._daylightSavingAdjust(
              new Date(
                $.getFullYear(),
                $.getMonth() - J[0] * J[1] + 1,
                $.getDate()
              )
            ),
              t = Z && Z > t ? Z : t;
            this._daylightSavingAdjust(new Date(et, G, 1)) > t;

          )
            G--, 0 > G && ((G = 11), et--);
        for (
          e.drawMonth = G,
            e.drawYear = et,
            a = this._get(e, 'prevText'),
            a = B
              ? this.formatDate(
                  a,
                  this._daylightSavingAdjust(new Date(et, G - q, 1)),
                  this._getFormatConfig(e)
                )
              : a,
            i = this._canAdjustMonth(e, -1, et, G)
              ? "<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click' title='" +
                a +
                "'><span class='ui-icon ui-icon-circle-triangle-" +
                (P ? 'e' : 'w') +
                "'>" +
                a +
                '</span></a>'
              : z
                ? ''
                : "<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='" +
                  a +
                  "'><span class='ui-icon ui-icon-circle-triangle-" +
                  (P ? 'e' : 'w') +
                  "'>" +
                  a +
                  '</span></a>',
            s = this._get(e, 'nextText'),
            s = B
              ? this.formatDate(
                  s,
                  this._daylightSavingAdjust(new Date(et, G + q, 1)),
                  this._getFormatConfig(e)
                )
              : s,
            r = this._canAdjustMonth(e, 1, et, G)
              ? "<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click' title='" +
                s +
                "'><span class='ui-icon ui-icon-circle-triangle-" +
                (P ? 'w' : 'e') +
                "'>" +
                s +
                '</span></a>'
              : z
                ? ''
                : "<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='" +
                  s +
                  "'><span class='ui-icon ui-icon-circle-triangle-" +
                  (P ? 'w' : 'e') +
                  "'>" +
                  s +
                  '</span></a>',
            n = this._get(e, 'currentText'),
            d = this._get(e, 'gotoCurrent') && e.currentDay ? X : H,
            n = B ? this.formatDate(n, d, this._getFormatConfig(e)) : n,
            c = e.inline
              ? ''
              : "<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>" +
                this._get(e, 'closeText') +
                '</button>',
            o = U
              ? "<div class='ui-datepicker-buttonpane ui-widget-content'>" +
                (P ? c : '') +
                (this._isInRange(e, d)
                  ? "<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'>" +
                    n +
                    '</button>'
                  : '') +
                (P ? '' : c) +
                '</div>'
              : '',
            l = parseInt(this._get(e, 'firstDay'), 10),
            l = isNaN(l) ? 0 : l,
            h = this._get(e, 'showWeek'),
            u = this._get(e, 'dayNames'),
            p = this._get(e, 'dayNamesMin'),
            g = this._get(e, 'monthNames'),
            _ = this._get(e, 'monthNamesShort'),
            k = this._get(e, 'beforeShowDay'),
            f = this._get(e, 'showOtherMonths'),
            m = this._get(e, 'selectOtherMonths'),
            D = this._getDefaultDate(e),
            y = '',
            M = 0;
          M < J[0];
          M++
        ) {
          for (b = '', this.maxRows = 4, w = 0; w < J[1]; w++) {
            if (
              ((C = this._daylightSavingAdjust(new Date(et, G, e.selectedDay))),
              (I = ' ui-corner-all'),
              (x = ''),
              Q)
            ) {
              if (((x += "<div class='ui-datepicker-group"), J[1] > 1))
                switch (w) {
                  case 0:
                    (x += ' ui-datepicker-group-first'),
                      (I = ' ui-corner-' + (P ? 'right' : 'left'));
                    break;
                  case J[1] - 1:
                    (x += ' ui-datepicker-group-last'),
                      (I = ' ui-corner-' + (P ? 'left' : 'right'));
                    break;
                  default:
                    (x += ' ui-datepicker-group-middle'), (I = '');
                }
              x += "'>";
            }
            for (
              x +=
                "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" +
                I +
                "'>" +
                (/all|left/.test(I) && 0 === M ? (P ? r : i) : '') +
                (/all|right/.test(I) && 0 === M ? (P ? i : r) : '') +
                this._generateMonthYearHeader(
                  e,
                  G,
                  et,
                  Z,
                  $,
                  M > 0 || w > 0,
                  g,
                  _
                ) +
                "</div><table class='ui-datepicker-calendar'><thead><tr>",
                Y = h
                  ? "<th class='ui-datepicker-week-col'>" +
                    this._get(e, 'weekHeader') +
                    '</th>'
                  : '',
                v = 0;
              7 > v;
              v++
            )
              (S = (v + l) % 7),
                (Y +=
                  "<th scope='col'" +
                  ((v + l + 6) % 7 >= 5
                    ? " class='ui-datepicker-week-end'"
                    : '') +
                  "><span title='" +
                  u[S] +
                  "'>" +
                  p[S] +
                  '</span></th>');
            for (
              x += Y + '</tr></thead><tbody>',
                N = this._getDaysInMonth(et, G),
                et === e.selectedYear &&
                  G === e.selectedMonth &&
                  (e.selectedDay = Math.min(e.selectedDay, N)),
                F = (this._getFirstDayOfMonth(et, G) - l + 7) % 7,
                T = Math.ceil((F + N) / 7),
                A = Q && this.maxRows > T ? this.maxRows : T,
                this.maxRows = A,
                K = this._daylightSavingAdjust(new Date(et, G, 1 - F)),
                j = 0;
              A > j;
              j++
            ) {
              for (
                x += '<tr>',
                  O = h
                    ? "<td class='ui-datepicker-week-col'>" +
                      this._get(e, 'calculateWeek')(K) +
                      '</td>'
                    : '',
                  v = 0;
                7 > v;
                v++
              )
                (R = k ? k.apply(e.input ? e.input[0] : null, [K]) : [!0, '']),
                  (L = K.getMonth() !== G),
                  (W = (L && !m) || !R[0] || (Z && Z > K) || ($ && K > $)),
                  (O +=
                    "<td class='" +
                    ((v + l + 6) % 7 >= 5 ? ' ui-datepicker-week-end' : '') +
                    (L ? ' ui-datepicker-other-month' : '') +
                    ((K.getTime() === C.getTime() &&
                      G === e.selectedMonth &&
                      e._keyEvent) ||
                    (D.getTime() === K.getTime() && D.getTime() === C.getTime())
                      ? ' ' + this._dayOverClass
                      : '') +
                    (W
                      ? ' ' + this._unselectableClass + ' ui-state-disabled'
                      : '') +
                    (L && !f
                      ? ''
                      : ' ' +
                        R[1] +
                        (K.getTime() === X.getTime()
                          ? ' ' + this._currentClass
                          : '') +
                        (K.getTime() === H.getTime()
                          ? ' ui-datepicker-today'
                          : '')) +
                    "'" +
                    ((L && !f) || !R[2]
                      ? ''
                      : " title='" + R[2].replace(/'/g, '&#39;') + "'") +
                    (W
                      ? ''
                      : " data-handler='selectDay' data-event='click' data-month='" +
                        K.getMonth() +
                        "' data-year='" +
                        K.getFullYear() +
                        "'") +
                    '>' +
                    (L && !f
                      ? '&#xa0;'
                      : W
                        ? "<span class='ui-state-default'>" +
                          K.getDate() +
                          '</span>'
                        : "<a class='ui-state-default" +
                          (K.getTime() === H.getTime()
                            ? ' ui-state-highlight'
                            : '') +
                          (K.getTime() === X.getTime()
                            ? ' ui-state-active'
                            : '') +
                          (L ? ' ui-priority-secondary' : '') +
                          "' href='#'>" +
                          K.getDate() +
                          '</a>') +
                    '</td>'),
                  K.setDate(K.getDate() + 1),
                  (K = this._daylightSavingAdjust(K));
              x += O + '</tr>';
            }
            G++,
              G > 11 && ((G = 0), et++),
              (x +=
                '</tbody></table>' +
                (Q
                  ? '</div>' +
                    (J[0] > 0 && w === J[1] - 1
                      ? "<div class='ui-datepicker-row-break'></div>"
                      : '')
                  : '')),
              (b += x);
          }
          y += b;
        }
        return (y += o), (e._keyEvent = !1), y;
      },
      _generateMonthYearHeader: function (e, t, a, i, s, r, n, d) {
        var c,
          o,
          l,
          h,
          u,
          p,
          g,
          _,
          k = this._get(e, 'changeMonth'),
          f = this._get(e, 'changeYear'),
          m = this._get(e, 'showMonthAfterYear'),
          D = "<div class='ui-datepicker-title'>",
          y = '';
        if (r || !k)
          y += "<span class='ui-datepicker-month'>" + n[t] + '</span>';
        else {
          for (
            c = i && i.getFullYear() === a,
              o = s && s.getFullYear() === a,
              y +=
                "<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>",
              l = 0;
            12 > l;
            l++
          )
            (!c || l >= i.getMonth()) &&
              (!o || l <= s.getMonth()) &&
              (y +=
                "<option value='" +
                l +
                "'" +
                (l === t ? " selected='selected'" : '') +
                '>' +
                d[l] +
                '</option>');
          y += '</select>';
        }
        if ((m || (D += y + (!r && k && f ? '' : '&#xa0;')), !e.yearshtml))
          if (((e.yearshtml = ''), r || !f))
            D += "<span class='ui-datepicker-year'>" + a + '</span>';
          else {
            for (
              h = this._get(e, 'yearRange').split(':'),
                u = new Date().getFullYear(),
                p = function (e) {
                  var t = e.match(/c[+\-].*/)
                    ? a + parseInt(e.substring(1), 10)
                    : e.match(/[+\-].*/)
                      ? u + parseInt(e, 10)
                      : parseInt(e, 10);
                  return isNaN(t) ? u : t;
                },
                g = p(h[0]),
                _ = Math.max(g, p(h[1] || '')),
                g = i ? Math.max(g, i.getFullYear()) : g,
                _ = s ? Math.min(_, s.getFullYear()) : _,
                e.yearshtml +=
                  "<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";
              _ >= g;
              g++
            )
              e.yearshtml +=
                "<option value='" +
                g +
                "'" +
                (g === a ? " selected='selected'" : '') +
                '>' +
                g +
                '</option>';
            (e.yearshtml += '</select>'),
              (D += e.yearshtml),
              (e.yearshtml = null);
          }
        return (
          (D += this._get(e, 'yearSuffix')),
          m && (D += (!r && k && f ? '' : '&#xa0;') + y),
          (D += '</div>')
        );
      },
      _adjustInstDate: function (e, t, a) {
        var i = e.drawYear + ('Y' === a ? t : 0),
          s = e.drawMonth + ('M' === a ? t : 0),
          r =
            Math.min(e.selectedDay, this._getDaysInMonth(i, s)) +
            ('D' === a ? t : 0),
          n = this._restrictMinMax(
            e,
            this._daylightSavingAdjust(new Date(i, s, r))
          );
        (e.selectedDay = n.getDate()),
          (e.drawMonth = e.selectedMonth = n.getMonth()),
          (e.drawYear = e.selectedYear = n.getFullYear()),
          ('M' === a || 'Y' === a) && this._notifyChange(e);
      },
      _restrictMinMax: function (e, t) {
        var a = this._getMinMaxDate(e, 'min'),
          i = this._getMinMaxDate(e, 'max'),
          s = a && a > t ? a : t;
        return i && s > i ? i : s;
      },
      _notifyChange: function (e) {
        var t = this._get(e, 'onChangeMonthYear');
        t &&
          t.apply(e.input ? e.input[0] : null, [
            e.selectedYear,
            e.selectedMonth + 1,
            e,
          ]);
      },
      _getNumberOfMonths: function (e) {
        var t = this._get(e, 'numberOfMonths');
        return null == t ? [1, 1] : 'number' == typeof t ? [1, t] : t;
      },
      _getMinMaxDate: function (e, t) {
        return this._determineDate(e, this._get(e, t + 'Date'), null);
      },
      _getDaysInMonth: function (e, t) {
        return 32 - this._daylightSavingAdjust(new Date(e, t, 32)).getDate();
      },
      _getFirstDayOfMonth: function (e, t) {
        return new Date(e, t, 1).getDay();
      },
      _canAdjustMonth: function (e, t, a, i) {
        var s = this._getNumberOfMonths(e),
          r = this._daylightSavingAdjust(
            new Date(a, i + (0 > t ? t : s[0] * s[1]), 1)
          );
        return (
          0 > t &&
            r.setDate(this._getDaysInMonth(r.getFullYear(), r.getMonth())),
          this._isInRange(e, r)
        );
      },
      _isInRange: function (e, t) {
        var a,
          i,
          s = this._getMinMaxDate(e, 'min'),
          r = this._getMinMaxDate(e, 'max'),
          n = null,
          d = null,
          c = this._get(e, 'yearRange');
        return (
          c &&
            ((a = c.split(':')),
            (i = new Date().getFullYear()),
            (n = parseInt(a[0], 10)),
            (d = parseInt(a[1], 10)),
            a[0].match(/[+\-].*/) && (n += i),
            a[1].match(/[+\-].*/) && (d += i)),
          (!s || t.getTime() >= s.getTime()) &&
            (!r || t.getTime() <= r.getTime()) &&
            (!n || t.getFullYear() >= n) &&
            (!d || t.getFullYear() <= d)
        );
      },
      _getFormatConfig: function (e) {
        var t = this._get(e, 'shortYearCutoff');
        return (
          (t =
            'string' != typeof t
              ? t
              : (new Date().getFullYear() % 100) + parseInt(t, 10)),
          {
            shortYearCutoff: t,
            dayNamesShort: this._get(e, 'dayNamesShort'),
            dayNames: this._get(e, 'dayNames'),
            monthNamesShort: this._get(e, 'monthNamesShort'),
            monthNames: this._get(e, 'monthNames'),
          }
        );
      },
      _formatDate: function (e, t, a, i) {
        t ||
          ((e.currentDay = e.selectedDay),
          (e.currentMonth = e.selectedMonth),
          (e.currentYear = e.selectedYear));
        var s = t
          ? 'object' == typeof t
            ? t
            : this._daylightSavingAdjust(new Date(i, a, t))
          : this._daylightSavingAdjust(
              new Date(e.currentYear, e.currentMonth, e.currentDay)
            );
        return this.formatDate(
          this._get(e, 'dateFormat'),
          s,
          this._getFormatConfig(e)
        );
      },
    }),
    (e.fn.datepicker = function (t) {
      if (!this.length) return this;
      e.datepicker.initialized ||
        (e(document).mousedown(e.datepicker._checkExternalClick),
        (e.datepicker.initialized = !0)),
        0 === e('#' + e.datepicker._mainDivId).length &&
          e('body').append(e.datepicker.dpDiv);
      var a = Array.prototype.slice.call(arguments, 1);
      return 'string' != typeof t ||
        ('isDisabled' !== t && 'getDate' !== t && 'widget' !== t)
        ? 'option' === t &&
          2 === arguments.length &&
          'string' == typeof arguments[1]
          ? e.datepicker['_' + t + 'Datepicker'].apply(
              e.datepicker,
              [this[0]].concat(a)
            )
          : this.each(function () {
              'string' == typeof t
                ? e.datepicker['_' + t + 'Datepicker'].apply(
                    e.datepicker,
                    [this].concat(a)
                  )
                : e.datepicker._attachDatepicker(this, t);
            })
        : e.datepicker['_' + t + 'Datepicker'].apply(
            e.datepicker,
            [this[0]].concat(a)
          );
    }),
    (e.datepicker = new a()),
    (e.datepicker.initialized = !1),
    (e.datepicker.uuid = new Date().getTime()),
    (e.datepicker.version = '1.11.3'),
    e.datepicker
  );
});
