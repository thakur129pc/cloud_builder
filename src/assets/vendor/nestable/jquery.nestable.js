!(function (t, e, s, i) {
  function a(e, i) {
    (this.w = t(s)),
      (this.el = t(e)),
      (this.options = t.extend({}, n, i)),
      this.init();
  }
  var o = 'ontouchstart' in s,
    l = (function () {
      var t = s.createElement('div'),
        i = s.documentElement;
      if (!('pointerEvents' in t.style)) return !1;
      (t.style.pointerEvents = 'auto'),
        (t.style.pointerEvents = 'x'),
        i.appendChild(t);
      var a =
        e.getComputedStyle &&
        'auto' === e.getComputedStyle(t, '').pointerEvents;
      return i.removeChild(t), !!a;
    })(),
    n = {
      listNodeName: 'ol',
      itemNodeName: 'li',
      rootClass: 'dd',
      listClass: 'dd-list',
      itemClass: 'dd-item',
      dragClass: 'dd-dragel',
      handleClass: 'dd-handle',
      collapsedClass: 'dd-collapsed',
      placeClass: 'dd-placeholder',
      noDragClass: 'dd-nodrag',
      emptyClass: 'dd-empty',
      expandBtnHTML:
        '<button data-action="expand" type="button">Expand</button>',
      collapseBtnHTML:
        '<button data-action="collapse" type="button">Collapse</button>',
      group: 0,
      maxDepth: 5,
      threshold: 20,
    };
  (a.prototype = {
    init: function () {
      var s = this;
      s.reset(),
        s.el.data('nestable-group', this.options.group),
        (s.placeEl = t('<div class="' + s.options.placeClass + '"/>')),
        t.each(this.el.find(s.options.itemNodeName), function (e, i) {
          s.setParent(t(i));
        }),
        s.el.on('click', 'button', function (e) {
          if (!s.dragEl) {
            var i = t(e.currentTarget),
              a = i.data('action'),
              o = i.parent(s.options.itemNodeName);
            'collapse' === a && s.collapseItem(o),
              'expand' === a && s.expandItem(o);
          }
        });
      var i = function (e) {
          var i = t(e.target);
          if (!i.hasClass(s.options.handleClass)) {
            if (i.closest('.' + s.options.noDragClass).length) return;
            i = i.closest('.' + s.options.handleClass);
          }
          i.length &&
            !s.dragEl &&
            ((s.isTouch = /^touch/.test(e.type)),
            (s.isTouch && 1 !== e.touches.length) ||
              (e.preventDefault(), s.dragStart(e.touches ? e.touches[0] : e)));
        },
        a = function (t) {
          s.dragEl &&
            (t.preventDefault(), s.dragMove(t.touches ? t.touches[0] : t));
        },
        l = function (t) {
          s.dragEl &&
            (t.preventDefault(), s.dragStop(t.touches ? t.touches[0] : t));
        };
      o &&
        (s.el[0].addEventListener('touchstart', i, !1),
        e.addEventListener('touchmove', a, !1),
        e.addEventListener('touchend', l, !1),
        e.addEventListener('touchcancel', l, !1)),
        s.el.on('mousedown', i),
        s.w.on('mousemove', a),
        s.w.on('mouseup', l);
    },
    serialize: function () {
      var e,
        s = 0,
        i = this;
      return (
        (step = function (e, s) {
          var a = [],
            o = e.children(i.options.itemNodeName);
          return (
            o.each(function () {
              var e = t(this),
                o = t.extend({}, e.data()),
                l = e.children(i.options.listNodeName);
              l.length && (o.children = step(l, s + 1)), a.push(o);
            }),
            a
          );
        }),
        (e = step(i.el.find(i.options.listNodeName).first(), s))
      );
    },
    serialise: function () {
      return this.serialize();
    },
    reset: function () {
      (this.mouse = {
        offsetX: 0,
        offsetY: 0,
        startX: 0,
        startY: 0,
        lastX: 0,
        lastY: 0,
        nowX: 0,
        nowY: 0,
        distX: 0,
        distY: 0,
        dirAx: 0,
        dirX: 0,
        dirY: 0,
        lastDirX: 0,
        lastDirY: 0,
        distAxX: 0,
        distAxY: 0,
      }),
        (this.isTouch = !1),
        (this.moving = !1),
        (this.dragEl = null),
        (this.dragRootEl = null),
        (this.dragDepth = 0),
        (this.hasNewRoot = !1),
        (this.pointEl = null);
    },
    expandItem: function (t) {
      t.removeClass(this.options.collapsedClass),
        t.children('[data-action="expand"]').hide(),
        t.children('[data-action="collapse"]').show(),
        t.children(this.options.listNodeName).show();
    },
    collapseItem: function (t) {
      var e = t.children(this.options.listNodeName);
      e.length &&
        (t.addClass(this.options.collapsedClass),
        t.children('[data-action="collapse"]').hide(),
        t.children('[data-action="expand"]').show(),
        t.children(this.options.listNodeName).hide());
    },
    expandAll: function () {
      var e = this;
      e.el.find(e.options.itemNodeName).each(function () {
        e.expandItem(t(this));
      });
    },
    collapseAll: function () {
      var e = this;
      e.el.find(e.options.itemNodeName).each(function () {
        e.collapseItem(t(this));
      });
    },
    setParent: function (e) {
      e.children(this.options.listNodeName).length &&
        (e.prepend(t(this.options.expandBtnHTML)),
        e.prepend(t(this.options.collapseBtnHTML))),
        e.children('[data-action="expand"]').hide();
    },
    unsetParent: function (t) {
      t.removeClass(this.options.collapsedClass),
        t.children('[data-action]').remove(),
        t.children(this.options.listNodeName).remove();
    },
    dragStart: function (e) {
      var a = this.mouse,
        o = t(e.target),
        l = o.closest(this.options.itemNodeName);
      this.placeEl.css('height', l.height()),
        (a.offsetX = e.offsetX !== i ? e.offsetX : e.pageX - o.offset().left),
        (a.offsetY = e.offsetY !== i ? e.offsetY : e.pageY - o.offset().top),
        (a.startX = a.lastX = e.pageX),
        (a.startY = a.lastY = e.pageY),
        (this.dragRootEl = this.el),
        (this.dragEl = t(s.createElement(this.options.listNodeName)).addClass(
          this.options.listClass + ' ' + this.options.dragClass
        )),
        this.dragEl.css('width', l.width()),
        l.after(this.placeEl),
        l[0].parentNode.removeChild(l[0]),
        l.appendTo(this.dragEl),
        t(s.body).append(this.dragEl),
        this.dragEl.css({
          left: e.pageX - a.offsetX,
          top: e.pageY - a.offsetY,
        });
      var n,
        d,
        h = this.dragEl.find(this.options.itemNodeName);
      for (n = 0; n < h.length; n++)
        (d = t(h[n]).parents(this.options.listNodeName).length),
          d > this.dragDepth && (this.dragDepth = d);
    },
    dragStop: function () {
      var t = this.dragEl.children(this.options.itemNodeName).first();
      t[0].parentNode.removeChild(t[0]),
        this.placeEl.replaceWith(t),
        this.dragEl.remove(),
        this.el.trigger('change'),
        this.hasNewRoot && this.dragRootEl.trigger('change'),
        this.reset();
    },
    dragMove: function (i) {
      var a,
        o,
        n,
        d,
        h,
        r = this.options,
        p = this.mouse;
      this.dragEl.css({ left: i.pageX - p.offsetX, top: i.pageY - p.offsetY }),
        (p.lastX = p.nowX),
        (p.lastY = p.nowY),
        (p.nowX = i.pageX),
        (p.nowY = i.pageY),
        (p.distX = p.nowX - p.lastX),
        (p.distY = p.nowY - p.lastY),
        (p.lastDirX = p.dirX),
        (p.lastDirY = p.dirY),
        (p.dirX = 0 === p.distX ? 0 : p.distX > 0 ? 1 : -1),
        (p.dirY = 0 === p.distY ? 0 : p.distY > 0 ? 1 : -1);
      var c = Math.abs(p.distX) > Math.abs(p.distY) ? 1 : 0;
      if (!p.moving) return (p.dirAx = c), void (p.moving = !0);
      p.dirAx !== c
        ? ((p.distAxX = 0), (p.distAxY = 0))
        : ((p.distAxX += Math.abs(p.distX)),
          0 !== p.dirX && p.dirX !== p.lastDirX && (p.distAxX = 0),
          (p.distAxY += Math.abs(p.distY)),
          0 !== p.dirY && p.dirY !== p.lastDirY && (p.distAxY = 0)),
        (p.dirAx = c),
        p.dirAx &&
          p.distAxX >= r.threshold &&
          ((p.distAxX = 0),
          (n = this.placeEl.prev(r.itemNodeName)),
          p.distX > 0 &&
            n.length &&
            !n.hasClass(r.collapsedClass) &&
            ((a = n.find(r.listNodeName).last()),
            (h = this.placeEl.parents(r.listNodeName).length),
            h + this.dragDepth <= r.maxDepth &&
              (a.length
                ? ((a = n.children(r.listNodeName).last()),
                  a.append(this.placeEl))
                : ((a = t('<' + r.listNodeName + '/>').addClass(r.listClass)),
                  a.append(this.placeEl),
                  n.append(a),
                  this.setParent(n)))),
          p.distX < 0 &&
            ((d = this.placeEl.next(r.itemNodeName)),
            d.length ||
              ((o = this.placeEl.parent()),
              this.placeEl.closest(r.itemNodeName).after(this.placeEl),
              o.children().length || this.unsetParent(o.parent()))));
      var g = !1;
      if (
        (l || (this.dragEl[0].style.visibility = 'hidden'),
        (this.pointEl = t(
          s.elementFromPoint(
            i.pageX - s.body.scrollLeft,
            i.pageY - (e.pageYOffset || s.documentElement.scrollTop)
          )
        )),
        l || (this.dragEl[0].style.visibility = 'visible'),
        this.pointEl.hasClass(r.handleClass) &&
          (this.pointEl = this.pointEl.parent(r.itemNodeName)),
        this.pointEl.hasClass(r.emptyClass))
      )
        g = !0;
      else if (!this.pointEl.length || !this.pointEl.hasClass(r.itemClass))
        return;
      var f = this.pointEl.closest('.' + r.rootClass),
        u = this.dragRootEl.data('nestable-id') !== f.data('nestable-id');
      if (!p.dirAx || u || g) {
        if (u && r.group !== f.data('nestable-group')) return;
        if (
          ((h =
            this.dragDepth - 1 + this.pointEl.parents(r.listNodeName).length),
          h > r.maxDepth)
        )
          return;
        var m = i.pageY < this.pointEl.offset().top + this.pointEl.height() / 2;
        (o = this.placeEl.parent()),
          g
            ? ((a = t(s.createElement(r.listNodeName)).addClass(r.listClass)),
              a.append(this.placeEl),
              this.pointEl.replaceWith(a))
            : m
              ? this.pointEl.before(this.placeEl)
              : this.pointEl.after(this.placeEl),
          o.children().length || this.unsetParent(o.parent()),
          this.dragRootEl.find(r.itemNodeName).length ||
            this.dragRootEl.append('<div class="' + r.emptyClass + '"/>'),
          u &&
            ((this.dragRootEl = f),
            (this.hasNewRoot = this.el[0] !== this.dragRootEl[0]));
      }
    },
  }),
    (t.fn.nestable = function (e) {
      var s = this,
        i = this;
      return (
        s.each(function () {
          var s = t(this).data('nestable');
          s
            ? 'string' == typeof e && 'function' == typeof s[e] && (i = s[e]())
            : (t(this).data('nestable', new a(this, e)),
              t(this).data('nestable-id', new Date().getTime()));
        }),
        i || s
      );
    });
})(window.jQuery || window.Zepto, window, document);
