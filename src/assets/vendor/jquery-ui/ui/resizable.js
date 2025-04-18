!(function (t) {
  'function' == typeof define && define.amd
    ? define(['jquery', './core', './mouse', './widget'], t)
    : t(jQuery);
})(function (t) {
  return (
    t.widget('ui.resizable', t.ui.mouse, {
      version: '1.11.3',
      widgetEventPrefix: 'resize',
      options: {
        alsoResize: !1,
        animate: !1,
        animateDuration: 'slow',
        animateEasing: 'swing',
        aspectRatio: !1,
        autoHide: !1,
        containment: !1,
        ghost: !1,
        grid: !1,
        handles: 'e,s,se',
        helper: !1,
        maxHeight: null,
        maxWidth: null,
        minHeight: 10,
        minWidth: 10,
        zIndex: 90,
        resize: null,
        start: null,
        stop: null,
      },
      _num: function (t) {
        return parseInt(t, 10) || 0;
      },
      _isNumber: function (t) {
        return !isNaN(parseInt(t, 10));
      },
      _hasScroll: function (e, i) {
        if ('hidden' === t(e).css('overflow')) return !1;
        var s = i && 'left' === i ? 'scrollLeft' : 'scrollTop',
          h = !1;
        return e[s] > 0 ? !0 : ((e[s] = 1), (h = e[s] > 0), (e[s] = 0), h);
      },
      _create: function () {
        var e,
          i,
          s,
          h,
          n,
          o = this,
          a = this.options;
        if (
          (this.element.addClass('ui-resizable'),
          t.extend(this, {
            _aspectRatio: !!a.aspectRatio,
            aspectRatio: a.aspectRatio,
            originalElement: this.element,
            _proportionallyResizeElements: [],
            _helper:
              a.helper || a.ghost || a.animate
                ? a.helper || 'ui-resizable-helper'
                : null,
          }),
          this.element[0].nodeName.match(
            /^(canvas|textarea|input|select|button|img)$/i
          ) &&
            (this.element.wrap(
              t("<div class='ui-wrapper' style='overflow: hidden;'></div>").css(
                {
                  position: this.element.css('position'),
                  width: this.element.outerWidth(),
                  height: this.element.outerHeight(),
                  top: this.element.css('top'),
                  left: this.element.css('left'),
                }
              )
            ),
            (this.element = this.element
              .parent()
              .data('ui-resizable', this.element.resizable('instance'))),
            (this.elementIsWrapper = !0),
            this.element.css({
              marginLeft: this.originalElement.css('marginLeft'),
              marginTop: this.originalElement.css('marginTop'),
              marginRight: this.originalElement.css('marginRight'),
              marginBottom: this.originalElement.css('marginBottom'),
            }),
            this.originalElement.css({
              marginLeft: 0,
              marginTop: 0,
              marginRight: 0,
              marginBottom: 0,
            }),
            (this.originalResizeStyle = this.originalElement.css('resize')),
            this.originalElement.css('resize', 'none'),
            this._proportionallyResizeElements.push(
              this.originalElement.css({
                position: 'static',
                zoom: 1,
                display: 'block',
              })
            ),
            this.originalElement.css({
              margin: this.originalElement.css('margin'),
            }),
            this._proportionallyResize()),
          (this.handles =
            a.handles ||
            (t('.ui-resizable-handle', this.element).length
              ? {
                  n: '.ui-resizable-n',
                  e: '.ui-resizable-e',
                  s: '.ui-resizable-s',
                  w: '.ui-resizable-w',
                  se: '.ui-resizable-se',
                  sw: '.ui-resizable-sw',
                  ne: '.ui-resizable-ne',
                  nw: '.ui-resizable-nw',
                }
              : 'e,s,se')),
          this.handles.constructor === String)
        )
          for (
            'all' === this.handles && (this.handles = 'n,e,s,w,se,sw,ne,nw'),
              e = this.handles.split(','),
              this.handles = {},
              i = 0;
            i < e.length;
            i++
          )
            (s = t.trim(e[i])),
              (n = 'ui-resizable-' + s),
              (h = t("<div class='ui-resizable-handle " + n + "'></div>")),
              h.css({ zIndex: a.zIndex }),
              'se' === s && h.addClass('ui-icon ui-icon-gripsmall-diagonal-se'),
              (this.handles[s] = '.ui-resizable-' + s),
              this.element.append(h);
        (this._renderAxis = function (e) {
          var i, s, h, n;
          e = e || this.element;
          for (i in this.handles)
            this.handles[i].constructor === String &&
              (this.handles[i] = this.element
                .children(this.handles[i])
                .first()
                .show()),
              this.elementIsWrapper &&
                this.originalElement[0].nodeName.match(
                  /^(textarea|input|select|button)$/i
                ) &&
                ((s = t(this.handles[i], this.element)),
                (n = /sw|ne|nw|se|n|s/.test(i)
                  ? s.outerHeight()
                  : s.outerWidth()),
                (h = [
                  'padding',
                  /ne|nw|n/.test(i)
                    ? 'Top'
                    : /se|sw|s/.test(i)
                      ? 'Bottom'
                      : /^e$/.test(i)
                        ? 'Right'
                        : 'Left',
                ].join('')),
                e.css(h, n),
                this._proportionallyResize()),
              t(this.handles[i]).length;
        }),
          this._renderAxis(this.element),
          (this._handles = t(
            '.ui-resizable-handle',
            this.element
          ).disableSelection()),
          this._handles.mouseover(function () {
            o.resizing ||
              (this.className &&
                (h = this.className.match(
                  /ui-resizable-(se|sw|ne|nw|n|e|s|w)/i
                )),
              (o.axis = h && h[1] ? h[1] : 'se'));
          }),
          a.autoHide &&
            (this._handles.hide(),
            t(this.element)
              .addClass('ui-resizable-autohide')
              .mouseenter(function () {
                a.disabled ||
                  (t(this).removeClass('ui-resizable-autohide'),
                  o._handles.show());
              })
              .mouseleave(function () {
                a.disabled ||
                  o.resizing ||
                  (t(this).addClass('ui-resizable-autohide'),
                  o._handles.hide());
              })),
          this._mouseInit();
      },
      _destroy: function () {
        this._mouseDestroy();
        var e,
          i = function (e) {
            t(e)
              .removeClass(
                'ui-resizable ui-resizable-disabled ui-resizable-resizing'
              )
              .removeData('resizable')
              .removeData('ui-resizable')
              .unbind('.resizable')
              .find('.ui-resizable-handle')
              .remove();
          };
        return (
          this.elementIsWrapper &&
            (i(this.element),
            (e = this.element),
            this.originalElement
              .css({
                position: e.css('position'),
                width: e.outerWidth(),
                height: e.outerHeight(),
                top: e.css('top'),
                left: e.css('left'),
              })
              .insertAfter(e),
            e.remove()),
          this.originalElement.css('resize', this.originalResizeStyle),
          i(this.originalElement),
          this
        );
      },
      _mouseCapture: function (e) {
        var i,
          s,
          h = !1;
        for (i in this.handles)
          (s = t(this.handles[i])[0]),
            (s === e.target || t.contains(s, e.target)) && (h = !0);
        return !this.options.disabled && h;
      },
      _mouseStart: function (e) {
        var i,
          s,
          h,
          n = this.options,
          o = this.element;
        return (
          (this.resizing = !0),
          this._renderProxy(),
          (i = this._num(this.helper.css('left'))),
          (s = this._num(this.helper.css('top'))),
          n.containment &&
            ((i += t(n.containment).scrollLeft() || 0),
            (s += t(n.containment).scrollTop() || 0)),
          (this.offset = this.helper.offset()),
          (this.position = { left: i, top: s }),
          (this.size = this._helper
            ? { width: this.helper.width(), height: this.helper.height() }
            : { width: o.width(), height: o.height() }),
          (this.originalSize = this._helper
            ? { width: o.outerWidth(), height: o.outerHeight() }
            : { width: o.width(), height: o.height() }),
          (this.sizeDiff = {
            width: o.outerWidth() - o.width(),
            height: o.outerHeight() - o.height(),
          }),
          (this.originalPosition = { left: i, top: s }),
          (this.originalMousePosition = { left: e.pageX, top: e.pageY }),
          (this.aspectRatio =
            'number' == typeof n.aspectRatio
              ? n.aspectRatio
              : this.originalSize.width / this.originalSize.height || 1),
          (h = t('.ui-resizable-' + this.axis).css('cursor')),
          t('body').css('cursor', 'auto' === h ? this.axis + '-resize' : h),
          o.addClass('ui-resizable-resizing'),
          this._propagate('start', e),
          !0
        );
      },
      _mouseDrag: function (e) {
        var i,
          s,
          h = this.originalMousePosition,
          n = this.axis,
          o = e.pageX - h.left || 0,
          a = e.pageY - h.top || 0,
          l = this._change[n];
        return (
          this._updatePrevProperties(),
          l
            ? ((i = l.apply(this, [e, o, a])),
              this._updateVirtualBoundaries(e.shiftKey),
              (this._aspectRatio || e.shiftKey) &&
                (i = this._updateRatio(i, e)),
              (i = this._respectSize(i, e)),
              this._updateCache(i),
              this._propagate('resize', e),
              (s = this._applyChanges()),
              !this._helper &&
                this._proportionallyResizeElements.length &&
                this._proportionallyResize(),
              t.isEmptyObject(s) ||
                (this._updatePrevProperties(),
                this._trigger('resize', e, this.ui()),
                this._applyChanges()),
              !1)
            : !1
        );
      },
      _mouseStop: function (e) {
        this.resizing = !1;
        var i,
          s,
          h,
          n,
          o,
          a,
          l,
          r = this.options,
          p = this;
        return (
          this._helper &&
            ((i = this._proportionallyResizeElements),
            (s = i.length && /textarea/i.test(i[0].nodeName)),
            (h = s && this._hasScroll(i[0], 'left') ? 0 : p.sizeDiff.height),
            (n = s ? 0 : p.sizeDiff.width),
            (o = {
              width: p.helper.width() - n,
              height: p.helper.height() - h,
            }),
            (a =
              parseInt(p.element.css('left'), 10) +
                (p.position.left - p.originalPosition.left) || null),
            (l =
              parseInt(p.element.css('top'), 10) +
                (p.position.top - p.originalPosition.top) || null),
            r.animate || this.element.css(t.extend(o, { top: l, left: a })),
            p.helper.height(p.size.height),
            p.helper.width(p.size.width),
            this._helper && !r.animate && this._proportionallyResize()),
          t('body').css('cursor', 'auto'),
          this.element.removeClass('ui-resizable-resizing'),
          this._propagate('stop', e),
          this._helper && this.helper.remove(),
          !1
        );
      },
      _updatePrevProperties: function () {
        (this.prevPosition = {
          top: this.position.top,
          left: this.position.left,
        }),
          (this.prevSize = {
            width: this.size.width,
            height: this.size.height,
          });
      },
      _applyChanges: function () {
        var t = {};
        return (
          this.position.top !== this.prevPosition.top &&
            (t.top = this.position.top + 'px'),
          this.position.left !== this.prevPosition.left &&
            (t.left = this.position.left + 'px'),
          this.size.width !== this.prevSize.width &&
            (t.width = this.size.width + 'px'),
          this.size.height !== this.prevSize.height &&
            (t.height = this.size.height + 'px'),
          this.helper.css(t),
          t
        );
      },
      _updateVirtualBoundaries: function (t) {
        var e,
          i,
          s,
          h,
          n,
          o = this.options;
        (n = {
          minWidth: this._isNumber(o.minWidth) ? o.minWidth : 0,
          maxWidth: this._isNumber(o.maxWidth) ? o.maxWidth : 1 / 0,
          minHeight: this._isNumber(o.minHeight) ? o.minHeight : 0,
          maxHeight: this._isNumber(o.maxHeight) ? o.maxHeight : 1 / 0,
        }),
          (this._aspectRatio || t) &&
            ((e = n.minHeight * this.aspectRatio),
            (s = n.minWidth / this.aspectRatio),
            (i = n.maxHeight * this.aspectRatio),
            (h = n.maxWidth / this.aspectRatio),
            e > n.minWidth && (n.minWidth = e),
            s > n.minHeight && (n.minHeight = s),
            i < n.maxWidth && (n.maxWidth = i),
            h < n.maxHeight && (n.maxHeight = h)),
          (this._vBoundaries = n);
      },
      _updateCache: function (t) {
        (this.offset = this.helper.offset()),
          this._isNumber(t.left) && (this.position.left = t.left),
          this._isNumber(t.top) && (this.position.top = t.top),
          this._isNumber(t.height) && (this.size.height = t.height),
          this._isNumber(t.width) && (this.size.width = t.width);
      },
      _updateRatio: function (t) {
        var e = this.position,
          i = this.size,
          s = this.axis;
        return (
          this._isNumber(t.height)
            ? (t.width = t.height * this.aspectRatio)
            : this._isNumber(t.width) &&
              (t.height = t.width / this.aspectRatio),
          'sw' === s &&
            ((t.left = e.left + (i.width - t.width)), (t.top = null)),
          'nw' === s &&
            ((t.top = e.top + (i.height - t.height)),
            (t.left = e.left + (i.width - t.width))),
          t
        );
      },
      _respectSize: function (t) {
        var e = this._vBoundaries,
          i = this.axis,
          s = this._isNumber(t.width) && e.maxWidth && e.maxWidth < t.width,
          h = this._isNumber(t.height) && e.maxHeight && e.maxHeight < t.height,
          n = this._isNumber(t.width) && e.minWidth && e.minWidth > t.width,
          o = this._isNumber(t.height) && e.minHeight && e.minHeight > t.height,
          a = this.originalPosition.left + this.originalSize.width,
          l = this.position.top + this.size.height,
          r = /sw|nw|w/.test(i),
          p = /nw|ne|n/.test(i);
        return (
          n && (t.width = e.minWidth),
          o && (t.height = e.minHeight),
          s && (t.width = e.maxWidth),
          h && (t.height = e.maxHeight),
          n && r && (t.left = a - e.minWidth),
          s && r && (t.left = a - e.maxWidth),
          o && p && (t.top = l - e.minHeight),
          h && p && (t.top = l - e.maxHeight),
          t.width || t.height || t.left || !t.top
            ? t.width || t.height || t.top || !t.left || (t.left = null)
            : (t.top = null),
          t
        );
      },
      _getPaddingPlusBorderDimensions: function (t) {
        for (
          var e = 0,
            i = [],
            s = [
              t.css('borderTopWidth'),
              t.css('borderRightWidth'),
              t.css('borderBottomWidth'),
              t.css('borderLeftWidth'),
            ],
            h = [
              t.css('paddingTop'),
              t.css('paddingRight'),
              t.css('paddingBottom'),
              t.css('paddingLeft'),
            ];
          4 > e;
          e++
        )
          (i[e] = parseInt(s[e], 10) || 0), (i[e] += parseInt(h[e], 10) || 0);
        return { height: i[0] + i[2], width: i[1] + i[3] };
      },
      _proportionallyResize: function () {
        if (this._proportionallyResizeElements.length)
          for (
            var t, e = 0, i = this.helper || this.element;
            e < this._proportionallyResizeElements.length;
            e++
          )
            (t = this._proportionallyResizeElements[e]),
              this.outerDimensions ||
                (this.outerDimensions =
                  this._getPaddingPlusBorderDimensions(t)),
              t.css({
                height: i.height() - this.outerDimensions.height || 0,
                width: i.width() - this.outerDimensions.width || 0,
              });
      },
      _renderProxy: function () {
        var e = this.element,
          i = this.options;
        (this.elementOffset = e.offset()),
          this._helper
            ? ((this.helper =
                this.helper || t("<div style='overflow:hidden;'></div>")),
              this.helper.addClass(this._helper).css({
                width: this.element.outerWidth() - 1,
                height: this.element.outerHeight() - 1,
                position: 'absolute',
                left: this.elementOffset.left + 'px',
                top: this.elementOffset.top + 'px',
                zIndex: ++i.zIndex,
              }),
              this.helper.appendTo('body').disableSelection())
            : (this.helper = this.element);
      },
      _change: {
        e: function (t, e) {
          return { width: this.originalSize.width + e };
        },
        w: function (t, e) {
          var i = this.originalSize,
            s = this.originalPosition;
          return { left: s.left + e, width: i.width - e };
        },
        n: function (t, e, i) {
          var s = this.originalSize,
            h = this.originalPosition;
          return { top: h.top + i, height: s.height - i };
        },
        s: function (t, e, i) {
          return { height: this.originalSize.height + i };
        },
        se: function (e, i, s) {
          return t.extend(
            this._change.s.apply(this, arguments),
            this._change.e.apply(this, [e, i, s])
          );
        },
        sw: function (e, i, s) {
          return t.extend(
            this._change.s.apply(this, arguments),
            this._change.w.apply(this, [e, i, s])
          );
        },
        ne: function (e, i, s) {
          return t.extend(
            this._change.n.apply(this, arguments),
            this._change.e.apply(this, [e, i, s])
          );
        },
        nw: function (e, i, s) {
          return t.extend(
            this._change.n.apply(this, arguments),
            this._change.w.apply(this, [e, i, s])
          );
        },
      },
      _propagate: function (e, i) {
        t.ui.plugin.call(this, e, [i, this.ui()]),
          'resize' !== e && this._trigger(e, i, this.ui());
      },
      plugins: {},
      ui: function () {
        return {
          originalElement: this.originalElement,
          element: this.element,
          helper: this.helper,
          position: this.position,
          size: this.size,
          originalSize: this.originalSize,
          originalPosition: this.originalPosition,
        };
      },
    }),
    t.ui.plugin.add('resizable', 'animate', {
      stop: function (e) {
        var i = t(this).resizable('instance'),
          s = i.options,
          h = i._proportionallyResizeElements,
          n = h.length && /textarea/i.test(h[0].nodeName),
          o = n && i._hasScroll(h[0], 'left') ? 0 : i.sizeDiff.height,
          a = n ? 0 : i.sizeDiff.width,
          l = { width: i.size.width - a, height: i.size.height - o },
          r =
            parseInt(i.element.css('left'), 10) +
              (i.position.left - i.originalPosition.left) || null,
          p =
            parseInt(i.element.css('top'), 10) +
              (i.position.top - i.originalPosition.top) || null;
        i.element.animate(t.extend(l, p && r ? { top: p, left: r } : {}), {
          duration: s.animateDuration,
          easing: s.animateEasing,
          step: function () {
            var s = {
              width: parseInt(i.element.css('width'), 10),
              height: parseInt(i.element.css('height'), 10),
              top: parseInt(i.element.css('top'), 10),
              left: parseInt(i.element.css('left'), 10),
            };
            h && h.length && t(h[0]).css({ width: s.width, height: s.height }),
              i._updateCache(s),
              i._propagate('resize', e);
          },
        });
      },
    }),
    t.ui.plugin.add('resizable', 'containment', {
      start: function () {
        var e,
          i,
          s,
          h,
          n,
          o,
          a,
          l = t(this).resizable('instance'),
          r = l.options,
          p = l.element,
          d = r.containment,
          g =
            d instanceof t
              ? d.get(0)
              : /parent/.test(d)
                ? p.parent().get(0)
                : d;
        g &&
          ((l.containerElement = t(g)),
          /document/.test(d) || d === document
            ? ((l.containerOffset = { left: 0, top: 0 }),
              (l.containerPosition = { left: 0, top: 0 }),
              (l.parentData = {
                element: t(document),
                left: 0,
                top: 0,
                width: t(document).width(),
                height:
                  t(document).height() || document.body.parentNode.scrollHeight,
              }))
            : ((e = t(g)),
              (i = []),
              t(['Top', 'Right', 'Left', 'Bottom']).each(function (t, s) {
                i[t] = l._num(e.css('padding' + s));
              }),
              (l.containerOffset = e.offset()),
              (l.containerPosition = e.position()),
              (l.containerSize = {
                height: e.innerHeight() - i[3],
                width: e.innerWidth() - i[1],
              }),
              (s = l.containerOffset),
              (h = l.containerSize.height),
              (n = l.containerSize.width),
              (o = l._hasScroll(g, 'left') ? g.scrollWidth : n),
              (a = l._hasScroll(g) ? g.scrollHeight : h),
              (l.parentData = {
                element: g,
                left: s.left,
                top: s.top,
                width: o,
                height: a,
              })));
      },
      resize: function (e) {
        var i,
          s,
          h,
          n,
          o = t(this).resizable('instance'),
          a = o.options,
          l = o.containerOffset,
          r = o.position,
          p = o._aspectRatio || e.shiftKey,
          d = { top: 0, left: 0 },
          g = o.containerElement,
          u = !0;
        g[0] !== document && /static/.test(g.css('position')) && (d = l),
          r.left < (o._helper ? l.left : 0) &&
            ((o.size.width =
              o.size.width +
              (o._helper
                ? o.position.left - l.left
                : o.position.left - d.left)),
            p && ((o.size.height = o.size.width / o.aspectRatio), (u = !1)),
            (o.position.left = a.helper ? l.left : 0)),
          r.top < (o._helper ? l.top : 0) &&
            ((o.size.height =
              o.size.height +
              (o._helper ? o.position.top - l.top : o.position.top)),
            p && ((o.size.width = o.size.height * o.aspectRatio), (u = !1)),
            (o.position.top = o._helper ? l.top : 0)),
          (h = o.containerElement.get(0) === o.element.parent().get(0)),
          (n = /relative|absolute/.test(o.containerElement.css('position'))),
          h && n
            ? ((o.offset.left = o.parentData.left + o.position.left),
              (o.offset.top = o.parentData.top + o.position.top))
            : ((o.offset.left = o.element.offset().left),
              (o.offset.top = o.element.offset().top)),
          (i = Math.abs(
            o.sizeDiff.width +
              (o._helper ? o.offset.left - d.left : o.offset.left - l.left)
          )),
          (s = Math.abs(
            o.sizeDiff.height +
              (o._helper ? o.offset.top - d.top : o.offset.top - l.top)
          )),
          i + o.size.width >= o.parentData.width &&
            ((o.size.width = o.parentData.width - i),
            p && ((o.size.height = o.size.width / o.aspectRatio), (u = !1))),
          s + o.size.height >= o.parentData.height &&
            ((o.size.height = o.parentData.height - s),
            p && ((o.size.width = o.size.height * o.aspectRatio), (u = !1))),
          u ||
            ((o.position.left = o.prevPosition.left),
            (o.position.top = o.prevPosition.top),
            (o.size.width = o.prevSize.width),
            (o.size.height = o.prevSize.height));
      },
      stop: function () {
        var e = t(this).resizable('instance'),
          i = e.options,
          s = e.containerOffset,
          h = e.containerPosition,
          n = e.containerElement,
          o = t(e.helper),
          a = o.offset(),
          l = o.outerWidth() - e.sizeDiff.width,
          r = o.outerHeight() - e.sizeDiff.height;
        e._helper &&
          !i.animate &&
          /relative/.test(n.css('position')) &&
          t(this).css({ left: a.left - h.left - s.left, width: l, height: r }),
          e._helper &&
            !i.animate &&
            /static/.test(n.css('position')) &&
            t(this).css({
              left: a.left - h.left - s.left,
              width: l,
              height: r,
            });
      },
    }),
    t.ui.plugin.add('resizable', 'alsoResize', {
      start: function () {
        var e = t(this).resizable('instance'),
          i = e.options,
          s = function (e) {
            t(e).each(function () {
              var e = t(this);
              e.data('ui-resizable-alsoresize', {
                width: parseInt(e.width(), 10),
                height: parseInt(e.height(), 10),
                left: parseInt(e.css('left'), 10),
                top: parseInt(e.css('top'), 10),
              });
            });
          };
        'object' != typeof i.alsoResize || i.alsoResize.parentNode
          ? s(i.alsoResize)
          : i.alsoResize.length
            ? ((i.alsoResize = i.alsoResize[0]), s(i.alsoResize))
            : t.each(i.alsoResize, function (t) {
                s(t);
              });
      },
      resize: function (e, i) {
        var s = t(this).resizable('instance'),
          h = s.options,
          n = s.originalSize,
          o = s.originalPosition,
          a = {
            height: s.size.height - n.height || 0,
            width: s.size.width - n.width || 0,
            top: s.position.top - o.top || 0,
            left: s.position.left - o.left || 0,
          },
          l = function (e, s) {
            t(e).each(function () {
              var e = t(this),
                h = t(this).data('ui-resizable-alsoresize'),
                n = {},
                o =
                  s && s.length
                    ? s
                    : e.parents(i.originalElement[0]).length
                      ? ['width', 'height']
                      : ['width', 'height', 'top', 'left'];
              t.each(o, function (t, e) {
                var i = (h[e] || 0) + (a[e] || 0);
                i && i >= 0 && (n[e] = i || null);
              }),
                e.css(n);
            });
          };
        'object' != typeof h.alsoResize || h.alsoResize.nodeType
          ? l(h.alsoResize)
          : t.each(h.alsoResize, function (t, e) {
              l(t, e);
            });
      },
      stop: function () {
        t(this).removeData('resizable-alsoresize');
      },
    }),
    t.ui.plugin.add('resizable', 'ghost', {
      start: function () {
        var e = t(this).resizable('instance'),
          i = e.options,
          s = e.size;
        (e.ghost = e.originalElement.clone()),
          e.ghost
            .css({
              opacity: 0.25,
              display: 'block',
              position: 'relative',
              height: s.height,
              width: s.width,
              margin: 0,
              left: 0,
              top: 0,
            })
            .addClass('ui-resizable-ghost')
            .addClass('string' == typeof i.ghost ? i.ghost : ''),
          e.ghost.appendTo(e.helper);
      },
      resize: function () {
        var e = t(this).resizable('instance');
        e.ghost &&
          e.ghost.css({
            position: 'relative',
            height: e.size.height,
            width: e.size.width,
          });
      },
      stop: function () {
        var e = t(this).resizable('instance');
        e.ghost && e.helper && e.helper.get(0).removeChild(e.ghost.get(0));
      },
    }),
    t.ui.plugin.add('resizable', 'grid', {
      resize: function () {
        var e,
          i = t(this).resizable('instance'),
          s = i.options,
          h = i.size,
          n = i.originalSize,
          o = i.originalPosition,
          a = i.axis,
          l = 'number' == typeof s.grid ? [s.grid, s.grid] : s.grid,
          r = l[0] || 1,
          p = l[1] || 1,
          d = Math.round((h.width - n.width) / r) * r,
          g = Math.round((h.height - n.height) / p) * p,
          u = n.width + d,
          f = n.height + g,
          m = s.maxWidth && s.maxWidth < u,
          c = s.maxHeight && s.maxHeight < f,
          z = s.minWidth && s.minWidth > u,
          w = s.minHeight && s.minHeight > f;
        (s.grid = l),
          z && (u += r),
          w && (f += p),
          m && (u -= r),
          c && (f -= p),
          /^(se|s|e)$/.test(a)
            ? ((i.size.width = u), (i.size.height = f))
            : /^(ne)$/.test(a)
              ? ((i.size.width = u),
                (i.size.height = f),
                (i.position.top = o.top - g))
              : /^(sw)$/.test(a)
                ? ((i.size.width = u),
                  (i.size.height = f),
                  (i.position.left = o.left - d))
                : ((0 >= f - p || 0 >= u - r) &&
                    (e = i._getPaddingPlusBorderDimensions(this)),
                  f - p > 0
                    ? ((i.size.height = f), (i.position.top = o.top - g))
                    : ((f = p - e.height),
                      (i.size.height = f),
                      (i.position.top = o.top + n.height - f)),
                  u - r > 0
                    ? ((i.size.width = u), (i.position.left = o.left - d))
                    : ((u = r - e.width),
                      (i.size.width = u),
                      (i.position.left = o.left + n.width - u)));
      },
    }),
    t.ui.resizable
  );
});
