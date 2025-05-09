!(function (e) {
  'function' == typeof define && define.amd
    ? define(['jquery', './widget'], e)
    : e(jQuery);
})(function (e) {
  var t = !1;
  return (
    e(document).mouseup(function () {
      t = !1;
    }),
    e.widget('ui.mouse', {
      version: '1.11.3',
      options: {
        cancel: 'input,textarea,button,select,option',
        distance: 1,
        delay: 0,
      },
      _mouseInit: function () {
        var t = this;
        this.element
          .bind('mousedown.' + this.widgetName, function (e) {
            return t._mouseDown(e);
          })
          .bind('click.' + this.widgetName, function (s) {
            return !0 === e.data(s.target, t.widgetName + '.preventClickEvent')
              ? (e.removeData(s.target, t.widgetName + '.preventClickEvent'),
                s.stopImmediatePropagation(),
                !1)
              : void 0;
          }),
          (this.started = !1);
      },
      _mouseDestroy: function () {
        this.element.unbind('.' + this.widgetName),
          this._mouseMoveDelegate &&
            this.document
              .unbind('mousemove.' + this.widgetName, this._mouseMoveDelegate)
              .unbind('mouseup.' + this.widgetName, this._mouseUpDelegate);
      },
      _mouseDown: function (s) {
        if (!t) {
          (this._mouseMoved = !1),
            this._mouseStarted && this._mouseUp(s),
            (this._mouseDownEvent = s);
          var i = this,
            o = 1 === s.which,
            u =
              'string' == typeof this.options.cancel && s.target.nodeName
                ? e(s.target).closest(this.options.cancel).length
                : !1;
          return o && !u && this._mouseCapture(s)
            ? ((this.mouseDelayMet = !this.options.delay),
              this.mouseDelayMet ||
                (this._mouseDelayTimer = setTimeout(function () {
                  i.mouseDelayMet = !0;
                }, this.options.delay)),
              this._mouseDistanceMet(s) &&
              this._mouseDelayMet(s) &&
              ((this._mouseStarted = this._mouseStart(s) !== !1),
              !this._mouseStarted)
                ? (s.preventDefault(), !0)
                : (!0 ===
                    e.data(s.target, this.widgetName + '.preventClickEvent') &&
                    e.removeData(
                      s.target,
                      this.widgetName + '.preventClickEvent'
                    ),
                  (this._mouseMoveDelegate = function (e) {
                    return i._mouseMove(e);
                  }),
                  (this._mouseUpDelegate = function (e) {
                    return i._mouseUp(e);
                  }),
                  this.document
                    .bind(
                      'mousemove.' + this.widgetName,
                      this._mouseMoveDelegate
                    )
                    .bind('mouseup.' + this.widgetName, this._mouseUpDelegate),
                  s.preventDefault(),
                  (t = !0),
                  !0))
            : !0;
        }
      },
      _mouseMove: function (t) {
        if (this._mouseMoved) {
          if (
            e.ui.ie &&
            (!document.documentMode || document.documentMode < 9) &&
            !t.button
          )
            return this._mouseUp(t);
          if (!t.which) return this._mouseUp(t);
        }
        return (
          (t.which || t.button) && (this._mouseMoved = !0),
          this._mouseStarted
            ? (this._mouseDrag(t), t.preventDefault())
            : (this._mouseDistanceMet(t) &&
                this._mouseDelayMet(t) &&
                ((this._mouseStarted =
                  this._mouseStart(this._mouseDownEvent, t) !== !1),
                this._mouseStarted ? this._mouseDrag(t) : this._mouseUp(t)),
              !this._mouseStarted)
        );
      },
      _mouseUp: function (s) {
        return (
          this.document
            .unbind('mousemove.' + this.widgetName, this._mouseMoveDelegate)
            .unbind('mouseup.' + this.widgetName, this._mouseUpDelegate),
          this._mouseStarted &&
            ((this._mouseStarted = !1),
            s.target === this._mouseDownEvent.target &&
              e.data(s.target, this.widgetName + '.preventClickEvent', !0),
            this._mouseStop(s)),
          (t = !1),
          !1
        );
      },
      _mouseDistanceMet: function (e) {
        return (
          Math.max(
            Math.abs(this._mouseDownEvent.pageX - e.pageX),
            Math.abs(this._mouseDownEvent.pageY - e.pageY)
          ) >= this.options.distance
        );
      },
      _mouseDelayMet: function () {
        return this.mouseDelayMet;
      },
      _mouseStart: function () {},
      _mouseDrag: function () {},
      _mouseStop: function () {},
      _mouseCapture: function () {
        return !0;
      },
    })
  );
});
