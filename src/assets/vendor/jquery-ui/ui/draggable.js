!(function (t) {
  'function' == typeof define && define.amd
    ? define(['jquery', './core', './mouse', './widget'], t)
    : t(jQuery);
})(function (t) {
  return (
    t.widget('ui.draggable', t.ui.mouse, {
      version: '1.11.3',
      widgetEventPrefix: 'drag',
      options: {
        addClasses: !0,
        appendTo: 'parent',
        axis: !1,
        connectToSortable: !1,
        containment: !1,
        cursor: 'auto',
        cursorAt: !1,
        grid: !1,
        handle: !1,
        helper: 'original',
        iframeFix: !1,
        opacity: !1,
        refreshPositions: !1,
        revert: !1,
        revertDuration: 500,
        scope: 'default',
        scroll: !0,
        scrollSensitivity: 20,
        scrollSpeed: 20,
        snap: !1,
        snapMode: 'both',
        snapTolerance: 20,
        stack: !1,
        zIndex: !1,
        drag: null,
        start: null,
        stop: null,
      },
      _create: function () {
        'original' === this.options.helper && this._setPositionRelative(),
          this.options.addClasses && this.element.addClass('ui-draggable'),
          this.options.disabled &&
            this.element.addClass('ui-draggable-disabled'),
          this._setHandleClassName(),
          this._mouseInit();
      },
      _setOption: function (t, e) {
        this._super(t, e),
          'handle' === t &&
            (this._removeHandleClassName(), this._setHandleClassName());
      },
      _destroy: function () {
        return (this.helper || this.element).is('.ui-draggable-dragging')
          ? void (this.destroyOnClear = !0)
          : (this.element.removeClass(
              'ui-draggable ui-draggable-dragging ui-draggable-disabled'
            ),
            this._removeHandleClassName(),
            void this._mouseDestroy());
      },
      _mouseCapture: function (e) {
        var s = this.options;
        return (
          this._blurActiveElement(e),
          this.helper ||
          s.disabled ||
          t(e.target).closest('.ui-resizable-handle').length > 0
            ? !1
            : ((this.handle = this._getHandle(e)),
              this.handle
                ? (this._blockFrames(
                    s.iframeFix === !0 ? 'iframe' : s.iframeFix
                  ),
                  !0)
                : !1)
        );
      },
      _blockFrames: function (e) {
        this.iframeBlocks = this.document.find(e).map(function () {
          var e = t(this);
          return t('<div>')
            .css('position', 'absolute')
            .appendTo(e.parent())
            .outerWidth(e.outerWidth())
            .outerHeight(e.outerHeight())
            .offset(e.offset())[0];
        });
      },
      _unblockFrames: function () {
        this.iframeBlocks &&
          (this.iframeBlocks.remove(), delete this.iframeBlocks);
      },
      _blurActiveElement: function (e) {
        var s = this.document[0];
        if (this.handleElement.is(e.target))
          try {
            s.activeElement &&
              'body' !== s.activeElement.nodeName.toLowerCase() &&
              t(s.activeElement).blur();
          } catch (i) {}
      },
      _mouseStart: function (e) {
        var s = this.options;
        return (
          (this.helper = this._createHelper(e)),
          this.helper.addClass('ui-draggable-dragging'),
          this._cacheHelperProportions(),
          t.ui.ddmanager && (t.ui.ddmanager.current = this),
          this._cacheMargins(),
          (this.cssPosition = this.helper.css('position')),
          (this.scrollParent = this.helper.scrollParent(!0)),
          (this.offsetParent = this.helper.offsetParent()),
          (this.hasFixedAncestor =
            this.helper.parents().filter(function () {
              return 'fixed' === t(this).css('position');
            }).length > 0),
          (this.positionAbs = this.element.offset()),
          this._refreshOffsets(e),
          (this.originalPosition = this.position =
            this._generatePosition(e, !1)),
          (this.originalPageX = e.pageX),
          (this.originalPageY = e.pageY),
          s.cursorAt && this._adjustOffsetFromHelper(s.cursorAt),
          this._setContainment(),
          this._trigger('start', e) === !1
            ? (this._clear(), !1)
            : (this._cacheHelperProportions(),
              t.ui.ddmanager &&
                !s.dropBehaviour &&
                t.ui.ddmanager.prepareOffsets(this, e),
              this._normalizeRightBottom(),
              this._mouseDrag(e, !0),
              t.ui.ddmanager && t.ui.ddmanager.dragStart(this, e),
              !0)
        );
      },
      _refreshOffsets: function (t) {
        (this.offset = {
          top: this.positionAbs.top - this.margins.top,
          left: this.positionAbs.left - this.margins.left,
          scroll: !1,
          parent: this._getParentOffset(),
          relative: this._getRelativeOffset(),
        }),
          (this.offset.click = {
            left: t.pageX - this.offset.left,
            top: t.pageY - this.offset.top,
          });
      },
      _mouseDrag: function (e, s) {
        if (
          (this.hasFixedAncestor &&
            (this.offset.parent = this._getParentOffset()),
          (this.position = this._generatePosition(e, !0)),
          (this.positionAbs = this._convertPositionTo('absolute')),
          !s)
        ) {
          var i = this._uiHash();
          if (this._trigger('drag', e, i) === !1) return this._mouseUp({}), !1;
          this.position = i.position;
        }
        return (
          (this.helper[0].style.left = this.position.left + 'px'),
          (this.helper[0].style.top = this.position.top + 'px'),
          t.ui.ddmanager && t.ui.ddmanager.drag(this, e),
          !1
        );
      },
      _mouseStop: function (e) {
        var s = this,
          i = !1;
        return (
          t.ui.ddmanager &&
            !this.options.dropBehaviour &&
            (i = t.ui.ddmanager.drop(this, e)),
          this.dropped && ((i = this.dropped), (this.dropped = !1)),
          ('invalid' === this.options.revert && !i) ||
          ('valid' === this.options.revert && i) ||
          this.options.revert === !0 ||
          (t.isFunction(this.options.revert) &&
            this.options.revert.call(this.element, i))
            ? t(this.helper).animate(
                this.originalPosition,
                parseInt(this.options.revertDuration, 10),
                function () {
                  s._trigger('stop', e) !== !1 && s._clear();
                }
              )
            : this._trigger('stop', e) !== !1 && this._clear(),
          !1
        );
      },
      _mouseUp: function (e) {
        return (
          this._unblockFrames(),
          t.ui.ddmanager && t.ui.ddmanager.dragStop(this, e),
          this.handleElement.is(e.target) && this.element.focus(),
          t.ui.mouse.prototype._mouseUp.call(this, e)
        );
      },
      cancel: function () {
        return (
          this.helper.is('.ui-draggable-dragging')
            ? this._mouseUp({})
            : this._clear(),
          this
        );
      },
      _getHandle: function (e) {
        return this.options.handle
          ? !!t(e.target).closest(this.element.find(this.options.handle)).length
          : !0;
      },
      _setHandleClassName: function () {
        (this.handleElement = this.options.handle
          ? this.element.find(this.options.handle)
          : this.element),
          this.handleElement.addClass('ui-draggable-handle');
      },
      _removeHandleClassName: function () {
        this.handleElement.removeClass('ui-draggable-handle');
      },
      _createHelper: function (e) {
        var s = this.options,
          i = t.isFunction(s.helper),
          o = i
            ? t(s.helper.apply(this.element[0], [e]))
            : 'clone' === s.helper
              ? this.element.clone().removeAttr('id')
              : this.element;
        return (
          o.parents('body').length ||
            o.appendTo(
              'parent' === s.appendTo ? this.element[0].parentNode : s.appendTo
            ),
          i && o[0] === this.element[0] && this._setPositionRelative(),
          o[0] === this.element[0] ||
            /(fixed|absolute)/.test(o.css('position')) ||
            o.css('position', 'absolute'),
          o
        );
      },
      _setPositionRelative: function () {
        /^(?:r|a|f)/.test(this.element.css('position')) ||
          (this.element[0].style.position = 'relative');
      },
      _adjustOffsetFromHelper: function (e) {
        'string' == typeof e && (e = e.split(' ')),
          t.isArray(e) && (e = { left: +e[0], top: +e[1] || 0 }),
          'left' in e && (this.offset.click.left = e.left + this.margins.left),
          'right' in e &&
            (this.offset.click.left =
              this.helperProportions.width - e.right + this.margins.left),
          'top' in e && (this.offset.click.top = e.top + this.margins.top),
          'bottom' in e &&
            (this.offset.click.top =
              this.helperProportions.height - e.bottom + this.margins.top);
      },
      _isRootNode: function (t) {
        return /(html|body)/i.test(t.tagName) || t === this.document[0];
      },
      _getParentOffset: function () {
        var e = this.offsetParent.offset(),
          s = this.document[0];
        return (
          'absolute' === this.cssPosition &&
            this.scrollParent[0] !== s &&
            t.contains(this.scrollParent[0], this.offsetParent[0]) &&
            ((e.left += this.scrollParent.scrollLeft()),
            (e.top += this.scrollParent.scrollTop())),
          this._isRootNode(this.offsetParent[0]) && (e = { top: 0, left: 0 }),
          {
            top:
              e.top +
              (parseInt(this.offsetParent.css('borderTopWidth'), 10) || 0),
            left:
              e.left +
              (parseInt(this.offsetParent.css('borderLeftWidth'), 10) || 0),
          }
        );
      },
      _getRelativeOffset: function () {
        if ('relative' !== this.cssPosition) return { top: 0, left: 0 };
        var t = this.element.position(),
          e = this._isRootNode(this.scrollParent[0]);
        return {
          top:
            t.top -
            (parseInt(this.helper.css('top'), 10) || 0) +
            (e ? 0 : this.scrollParent.scrollTop()),
          left:
            t.left -
            (parseInt(this.helper.css('left'), 10) || 0) +
            (e ? 0 : this.scrollParent.scrollLeft()),
        };
      },
      _cacheMargins: function () {
        this.margins = {
          left: parseInt(this.element.css('marginLeft'), 10) || 0,
          top: parseInt(this.element.css('marginTop'), 10) || 0,
          right: parseInt(this.element.css('marginRight'), 10) || 0,
          bottom: parseInt(this.element.css('marginBottom'), 10) || 0,
        };
      },
      _cacheHelperProportions: function () {
        this.helperProportions = {
          width: this.helper.outerWidth(),
          height: this.helper.outerHeight(),
        };
      },
      _setContainment: function () {
        var e,
          s,
          i,
          o = this.options,
          n = this.document[0];
        return (
          (this.relativeContainer = null),
          o.containment
            ? 'window' === o.containment
              ? void (this.containment = [
                  t(window).scrollLeft() -
                    this.offset.relative.left -
                    this.offset.parent.left,
                  t(window).scrollTop() -
                    this.offset.relative.top -
                    this.offset.parent.top,
                  t(window).scrollLeft() +
                    t(window).width() -
                    this.helperProportions.width -
                    this.margins.left,
                  t(window).scrollTop() +
                    (t(window).height() || n.body.parentNode.scrollHeight) -
                    this.helperProportions.height -
                    this.margins.top,
                ])
              : 'document' === o.containment
                ? void (this.containment = [
                    0,
                    0,
                    t(n).width() -
                      this.helperProportions.width -
                      this.margins.left,
                    (t(n).height() || n.body.parentNode.scrollHeight) -
                      this.helperProportions.height -
                      this.margins.top,
                  ])
                : o.containment.constructor === Array
                  ? void (this.containment = o.containment)
                  : ('parent' === o.containment &&
                      (o.containment = this.helper[0].parentNode),
                    (s = t(o.containment)),
                    (i = s[0]),
                    void (
                      i &&
                      ((e = /(scroll|auto)/.test(s.css('overflow'))),
                      (this.containment = [
                        (parseInt(s.css('borderLeftWidth'), 10) || 0) +
                          (parseInt(s.css('paddingLeft'), 10) || 0),
                        (parseInt(s.css('borderTopWidth'), 10) || 0) +
                          (parseInt(s.css('paddingTop'), 10) || 0),
                        (e
                          ? Math.max(i.scrollWidth, i.offsetWidth)
                          : i.offsetWidth) -
                          (parseInt(s.css('borderRightWidth'), 10) || 0) -
                          (parseInt(s.css('paddingRight'), 10) || 0) -
                          this.helperProportions.width -
                          this.margins.left -
                          this.margins.right,
                        (e
                          ? Math.max(i.scrollHeight, i.offsetHeight)
                          : i.offsetHeight) -
                          (parseInt(s.css('borderBottomWidth'), 10) || 0) -
                          (parseInt(s.css('paddingBottom'), 10) || 0) -
                          this.helperProportions.height -
                          this.margins.top -
                          this.margins.bottom,
                      ]),
                      (this.relativeContainer = s))
                    ))
            : void (this.containment = null)
        );
      },
      _convertPositionTo: function (t, e) {
        e || (e = this.position);
        var s = 'absolute' === t ? 1 : -1,
          i = this._isRootNode(this.scrollParent[0]);
        return {
          top:
            e.top +
            this.offset.relative.top * s +
            this.offset.parent.top * s -
            ('fixed' === this.cssPosition
              ? -this.offset.scroll.top
              : i
                ? 0
                : this.offset.scroll.top) *
              s,
          left:
            e.left +
            this.offset.relative.left * s +
            this.offset.parent.left * s -
            ('fixed' === this.cssPosition
              ? -this.offset.scroll.left
              : i
                ? 0
                : this.offset.scroll.left) *
              s,
        };
      },
      _generatePosition: function (t, e) {
        var s,
          i,
          o,
          n,
          r = this.options,
          l = this._isRootNode(this.scrollParent[0]),
          a = t.pageX,
          h = t.pageY;
        return (
          (l && this.offset.scroll) ||
            (this.offset.scroll = {
              top: this.scrollParent.scrollTop(),
              left: this.scrollParent.scrollLeft(),
            }),
          e &&
            (this.containment &&
              (this.relativeContainer
                ? ((i = this.relativeContainer.offset()),
                  (s = [
                    this.containment[0] + i.left,
                    this.containment[1] + i.top,
                    this.containment[2] + i.left,
                    this.containment[3] + i.top,
                  ]))
                : (s = this.containment),
              t.pageX - this.offset.click.left < s[0] &&
                (a = s[0] + this.offset.click.left),
              t.pageY - this.offset.click.top < s[1] &&
                (h = s[1] + this.offset.click.top),
              t.pageX - this.offset.click.left > s[2] &&
                (a = s[2] + this.offset.click.left),
              t.pageY - this.offset.click.top > s[3] &&
                (h = s[3] + this.offset.click.top)),
            r.grid &&
              ((o = r.grid[1]
                ? this.originalPageY +
                  Math.round((h - this.originalPageY) / r.grid[1]) * r.grid[1]
                : this.originalPageY),
              (h = s
                ? o - this.offset.click.top >= s[1] ||
                  o - this.offset.click.top > s[3]
                  ? o
                  : o - this.offset.click.top >= s[1]
                    ? o - r.grid[1]
                    : o + r.grid[1]
                : o),
              (n = r.grid[0]
                ? this.originalPageX +
                  Math.round((a - this.originalPageX) / r.grid[0]) * r.grid[0]
                : this.originalPageX),
              (a = s
                ? n - this.offset.click.left >= s[0] ||
                  n - this.offset.click.left > s[2]
                  ? n
                  : n - this.offset.click.left >= s[0]
                    ? n - r.grid[0]
                    : n + r.grid[0]
                : n)),
            'y' === r.axis && (a = this.originalPageX),
            'x' === r.axis && (h = this.originalPageY)),
          {
            top:
              h -
              this.offset.click.top -
              this.offset.relative.top -
              this.offset.parent.top +
              ('fixed' === this.cssPosition
                ? -this.offset.scroll.top
                : l
                  ? 0
                  : this.offset.scroll.top),
            left:
              a -
              this.offset.click.left -
              this.offset.relative.left -
              this.offset.parent.left +
              ('fixed' === this.cssPosition
                ? -this.offset.scroll.left
                : l
                  ? 0
                  : this.offset.scroll.left),
          }
        );
      },
      _clear: function () {
        this.helper.removeClass('ui-draggable-dragging'),
          this.helper[0] === this.element[0] ||
            this.cancelHelperRemoval ||
            this.helper.remove(),
          (this.helper = null),
          (this.cancelHelperRemoval = !1),
          this.destroyOnClear && this.destroy();
      },
      _normalizeRightBottom: function () {
        'y' !== this.options.axis &&
          'auto' !== this.helper.css('right') &&
          (this.helper.width(this.helper.width()),
          this.helper.css('right', 'auto')),
          'x' !== this.options.axis &&
            'auto' !== this.helper.css('bottom') &&
            (this.helper.height(this.helper.height()),
            this.helper.css('bottom', 'auto'));
      },
      _trigger: function (e, s, i) {
        return (
          (i = i || this._uiHash()),
          t.ui.plugin.call(this, e, [s, i, this], !0),
          /^(drag|start|stop)/.test(e) &&
            ((this.positionAbs = this._convertPositionTo('absolute')),
            (i.offset = this.positionAbs)),
          t.Widget.prototype._trigger.call(this, e, s, i)
        );
      },
      plugins: {},
      _uiHash: function () {
        return {
          helper: this.helper,
          position: this.position,
          originalPosition: this.originalPosition,
          offset: this.positionAbs,
        };
      },
    }),
    t.ui.plugin.add('draggable', 'connectToSortable', {
      start: function (e, s, i) {
        var o = t.extend({}, s, { item: i.element });
        (i.sortables = []),
          t(i.options.connectToSortable).each(function () {
            var s = t(this).sortable('instance');
            s &&
              !s.options.disabled &&
              (i.sortables.push(s),
              s.refreshPositions(),
              s._trigger('activate', e, o));
          });
      },
      stop: function (e, s, i) {
        var o = t.extend({}, s, { item: i.element });
        (i.cancelHelperRemoval = !1),
          t.each(i.sortables, function () {
            var t = this;
            t.isOver
              ? ((t.isOver = 0),
                (i.cancelHelperRemoval = !0),
                (t.cancelHelperRemoval = !1),
                (t._storedCSS = {
                  position: t.placeholder.css('position'),
                  top: t.placeholder.css('top'),
                  left: t.placeholder.css('left'),
                }),
                t._mouseStop(e),
                (t.options.helper = t.options._helper))
              : ((t.cancelHelperRemoval = !0), t._trigger('deactivate', e, o));
          });
      },
      drag: function (e, s, i) {
        t.each(i.sortables, function () {
          var o = !1,
            n = this;
          (n.positionAbs = i.positionAbs),
            (n.helperProportions = i.helperProportions),
            (n.offset.click = i.offset.click),
            n._intersectsWith(n.containerCache) &&
              ((o = !0),
              t.each(i.sortables, function () {
                return (
                  (this.positionAbs = i.positionAbs),
                  (this.helperProportions = i.helperProportions),
                  (this.offset.click = i.offset.click),
                  this !== n &&
                    this._intersectsWith(this.containerCache) &&
                    t.contains(n.element[0], this.element[0]) &&
                    (o = !1),
                  o
                );
              })),
            o
              ? (n.isOver ||
                  ((n.isOver = 1),
                  (n.currentItem = s.helper
                    .appendTo(n.element)
                    .data('ui-sortable-item', !0)),
                  (n.options._helper = n.options.helper),
                  (n.options.helper = function () {
                    return s.helper[0];
                  }),
                  (e.target = n.currentItem[0]),
                  n._mouseCapture(e, !0),
                  n._mouseStart(e, !0, !0),
                  (n.offset.click.top = i.offset.click.top),
                  (n.offset.click.left = i.offset.click.left),
                  (n.offset.parent.left -=
                    i.offset.parent.left - n.offset.parent.left),
                  (n.offset.parent.top -=
                    i.offset.parent.top - n.offset.parent.top),
                  i._trigger('toSortable', e),
                  (i.dropped = n.element),
                  t.each(i.sortables, function () {
                    this.refreshPositions();
                  }),
                  (i.currentItem = i.element),
                  (n.fromOutside = i)),
                n.currentItem && (n._mouseDrag(e), (s.position = n.position)))
              : n.isOver &&
                ((n.isOver = 0),
                (n.cancelHelperRemoval = !0),
                (n.options._revert = n.options.revert),
                (n.options.revert = !1),
                n._trigger('out', e, n._uiHash(n)),
                n._mouseStop(e, !0),
                (n.options.revert = n.options._revert),
                (n.options.helper = n.options._helper),
                n.placeholder && n.placeholder.remove(),
                i._refreshOffsets(e),
                (s.position = i._generatePosition(e, !0)),
                i._trigger('fromSortable', e),
                (i.dropped = !1),
                t.each(i.sortables, function () {
                  this.refreshPositions();
                }));
        });
      },
    }),
    t.ui.plugin.add('draggable', 'cursor', {
      start: function (e, s, i) {
        var o = t('body'),
          n = i.options;
        o.css('cursor') && (n._cursor = o.css('cursor')),
          o.css('cursor', n.cursor);
      },
      stop: function (e, s, i) {
        var o = i.options;
        o._cursor && t('body').css('cursor', o._cursor);
      },
    }),
    t.ui.plugin.add('draggable', 'opacity', {
      start: function (e, s, i) {
        var o = t(s.helper),
          n = i.options;
        o.css('opacity') && (n._opacity = o.css('opacity')),
          o.css('opacity', n.opacity);
      },
      stop: function (e, s, i) {
        var o = i.options;
        o._opacity && t(s.helper).css('opacity', o._opacity);
      },
    }),
    t.ui.plugin.add('draggable', 'scroll', {
      start: function (t, e, s) {
        s.scrollParentNotHidden ||
          (s.scrollParentNotHidden = s.helper.scrollParent(!1)),
          s.scrollParentNotHidden[0] !== s.document[0] &&
            'HTML' !== s.scrollParentNotHidden[0].tagName &&
            (s.overflowOffset = s.scrollParentNotHidden.offset());
      },
      drag: function (e, s, i) {
        var o = i.options,
          n = !1,
          r = i.scrollParentNotHidden[0],
          l = i.document[0];
        r !== l && 'HTML' !== r.tagName
          ? ((o.axis && 'x' === o.axis) ||
              (i.overflowOffset.top + r.offsetHeight - e.pageY <
              o.scrollSensitivity
                ? (r.scrollTop = n = r.scrollTop + o.scrollSpeed)
                : e.pageY - i.overflowOffset.top < o.scrollSensitivity &&
                  (r.scrollTop = n = r.scrollTop - o.scrollSpeed)),
            (o.axis && 'y' === o.axis) ||
              (i.overflowOffset.left + r.offsetWidth - e.pageX <
              o.scrollSensitivity
                ? (r.scrollLeft = n = r.scrollLeft + o.scrollSpeed)
                : e.pageX - i.overflowOffset.left < o.scrollSensitivity &&
                  (r.scrollLeft = n = r.scrollLeft - o.scrollSpeed)))
          : ((o.axis && 'x' === o.axis) ||
              (e.pageY - t(l).scrollTop() < o.scrollSensitivity
                ? (n = t(l).scrollTop(t(l).scrollTop() - o.scrollSpeed))
                : t(window).height() - (e.pageY - t(l).scrollTop()) <
                    o.scrollSensitivity &&
                  (n = t(l).scrollTop(t(l).scrollTop() + o.scrollSpeed))),
            (o.axis && 'y' === o.axis) ||
              (e.pageX - t(l).scrollLeft() < o.scrollSensitivity
                ? (n = t(l).scrollLeft(t(l).scrollLeft() - o.scrollSpeed))
                : t(window).width() - (e.pageX - t(l).scrollLeft()) <
                    o.scrollSensitivity &&
                  (n = t(l).scrollLeft(t(l).scrollLeft() + o.scrollSpeed)))),
          n !== !1 &&
            t.ui.ddmanager &&
            !o.dropBehaviour &&
            t.ui.ddmanager.prepareOffsets(i, e);
      },
    }),
    t.ui.plugin.add('draggable', 'snap', {
      start: function (e, s, i) {
        var o = i.options;
        (i.snapElements = []),
          t(
            o.snap.constructor !== String
              ? o.snap.items || ':data(ui-draggable)'
              : o.snap
          ).each(function () {
            var e = t(this),
              s = e.offset();
            this !== i.element[0] &&
              i.snapElements.push({
                item: this,
                width: e.outerWidth(),
                height: e.outerHeight(),
                top: s.top,
                left: s.left,
              });
          });
      },
      drag: function (e, s, i) {
        var o,
          n,
          r,
          l,
          a,
          h,
          p,
          c,
          f,
          d,
          g = i.options,
          u = g.snapTolerance,
          m = s.offset.left,
          v = m + i.helperProportions.width,
          _ = s.offset.top,
          P = _ + i.helperProportions.height;
        for (f = i.snapElements.length - 1; f >= 0; f--)
          (a = i.snapElements[f].left - i.margins.left),
            (h = a + i.snapElements[f].width),
            (p = i.snapElements[f].top - i.margins.top),
            (c = p + i.snapElements[f].height),
            a - u > v ||
            m > h + u ||
            p - u > P ||
            _ > c + u ||
            !t.contains(
              i.snapElements[f].item.ownerDocument,
              i.snapElements[f].item
            )
              ? (i.snapElements[f].snapping &&
                  i.options.snap.release &&
                  i.options.snap.release.call(
                    i.element,
                    e,
                    t.extend(i._uiHash(), { snapItem: i.snapElements[f].item })
                  ),
                (i.snapElements[f].snapping = !1))
              : ('inner' !== g.snapMode &&
                  ((o = Math.abs(p - P) <= u),
                  (n = Math.abs(c - _) <= u),
                  (r = Math.abs(a - v) <= u),
                  (l = Math.abs(h - m) <= u),
                  o &&
                    (s.position.top = i._convertPositionTo('relative', {
                      top: p - i.helperProportions.height,
                      left: 0,
                    }).top),
                  n &&
                    (s.position.top = i._convertPositionTo('relative', {
                      top: c,
                      left: 0,
                    }).top),
                  r &&
                    (s.position.left = i._convertPositionTo('relative', {
                      top: 0,
                      left: a - i.helperProportions.width,
                    }).left),
                  l &&
                    (s.position.left = i._convertPositionTo('relative', {
                      top: 0,
                      left: h,
                    }).left)),
                (d = o || n || r || l),
                'outer' !== g.snapMode &&
                  ((o = Math.abs(p - _) <= u),
                  (n = Math.abs(c - P) <= u),
                  (r = Math.abs(a - m) <= u),
                  (l = Math.abs(h - v) <= u),
                  o &&
                    (s.position.top = i._convertPositionTo('relative', {
                      top: p,
                      left: 0,
                    }).top),
                  n &&
                    (s.position.top = i._convertPositionTo('relative', {
                      top: c - i.helperProportions.height,
                      left: 0,
                    }).top),
                  r &&
                    (s.position.left = i._convertPositionTo('relative', {
                      top: 0,
                      left: a,
                    }).left),
                  l &&
                    (s.position.left = i._convertPositionTo('relative', {
                      top: 0,
                      left: h - i.helperProportions.width,
                    }).left)),
                !i.snapElements[f].snapping &&
                  (o || n || r || l || d) &&
                  i.options.snap.snap &&
                  i.options.snap.snap.call(
                    i.element,
                    e,
                    t.extend(i._uiHash(), { snapItem: i.snapElements[f].item })
                  ),
                (i.snapElements[f].snapping = o || n || r || l || d));
      },
    }),
    t.ui.plugin.add('draggable', 'stack', {
      start: function (e, s, i) {
        var o,
          n = i.options,
          r = t.makeArray(t(n.stack)).sort(function (e, s) {
            return (
              (parseInt(t(e).css('zIndex'), 10) || 0) -
              (parseInt(t(s).css('zIndex'), 10) || 0)
            );
          });
        r.length &&
          ((o = parseInt(t(r[0]).css('zIndex'), 10) || 0),
          t(r).each(function (e) {
            t(this).css('zIndex', o + e);
          }),
          this.css('zIndex', o + r.length));
      },
    }),
    t.ui.plugin.add('draggable', 'zIndex', {
      start: function (e, s, i) {
        var o = t(s.helper),
          n = i.options;
        o.css('zIndex') && (n._zIndex = o.css('zIndex')),
          o.css('zIndex', n.zIndex);
      },
      stop: function (e, s, i) {
        var o = i.options;
        o._zIndex && t(s.helper).css('zIndex', o._zIndex);
      },
    }),
    t.ui.draggable
  );
});
