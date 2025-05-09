!(function (t) {
  'function' == typeof define && define.amd
    ? define(['jquery', './core', './widget', './position'], t)
    : t(jQuery);
})(function (t) {
  return t.widget('ui.tooltip', {
    version: '1.11.3',
    options: {
      content: function () {
        var i = t(this).attr('title') || '';
        return t('<a>').text(i).html();
      },
      hide: !0,
      items: '[title]:not([disabled])',
      position: {
        my: 'left top+15',
        at: 'left bottom',
        collision: 'flipfit flip',
      },
      show: !0,
      tooltipClass: null,
      track: !1,
      close: null,
      open: null,
    },
    _addDescribedBy: function (i, e) {
      var o = (i.attr('aria-describedby') || '').split(/\s+/);
      o.push(e),
        i
          .data('ui-tooltip-id', e)
          .attr('aria-describedby', t.trim(o.join(' ')));
    },
    _removeDescribedBy: function (i) {
      var e = i.data('ui-tooltip-id'),
        o = (i.attr('aria-describedby') || '').split(/\s+/),
        n = t.inArray(e, o);
      -1 !== n && o.splice(n, 1),
        i.removeData('ui-tooltip-id'),
        (o = t.trim(o.join(' '))),
        o ? i.attr('aria-describedby', o) : i.removeAttr('aria-describedby');
    },
    _create: function () {
      this._on({ mouseover: 'open', focusin: 'open' }),
        (this.tooltips = {}),
        (this.parents = {}),
        this.options.disabled && this._disable(),
        (this.liveRegion = t('<div>')
          .attr({
            role: 'log',
            'aria-live': 'assertive',
            'aria-relevant': 'additions',
          })
          .addClass('ui-helper-hidden-accessible')
          .appendTo(this.document[0].body));
    },
    _setOption: function (i, e) {
      var o = this;
      return 'disabled' === i
        ? (this[e ? '_disable' : '_enable'](), void (this.options[i] = e))
        : (this._super(i, e),
          void (
            'content' === i &&
            t.each(this.tooltips, function (t, i) {
              o._updateContent(i.element);
            })
          ));
    },
    _disable: function () {
      var i = this;
      t.each(this.tooltips, function (e, o) {
        var n = t.Event('blur');
        (n.target = n.currentTarget = o.element[0]), i.close(n, !0);
      }),
        this.element
          .find(this.options.items)
          .addBack()
          .each(function () {
            var i = t(this);
            i.is('[title]') &&
              i.data('ui-tooltip-title', i.attr('title')).removeAttr('title');
          });
    },
    _enable: function () {
      this.element
        .find(this.options.items)
        .addBack()
        .each(function () {
          var i = t(this);
          i.data('ui-tooltip-title') &&
            i.attr('title', i.data('ui-tooltip-title'));
        });
    },
    open: function (i) {
      var e = this,
        o = t(i ? i.target : this.element).closest(this.options.items);
      o.length &&
        !o.data('ui-tooltip-id') &&
        (o.attr('title') && o.data('ui-tooltip-title', o.attr('title')),
        o.data('ui-tooltip-open', !0),
        i &&
          'mouseover' === i.type &&
          o.parents().each(function () {
            var i,
              o = t(this);
            o.data('ui-tooltip-open') &&
              ((i = t.Event('blur')),
              (i.target = i.currentTarget = this),
              e.close(i, !0)),
              o.attr('title') &&
                (o.uniqueId(),
                (e.parents[this.id] = {
                  element: this,
                  title: o.attr('title'),
                }),
                o.attr('title', ''));
          }),
        this._updateContent(o, i));
    },
    _updateContent: function (t, i) {
      var e,
        o = this.options.content,
        n = this,
        s = i ? i.type : null;
      return 'string' == typeof o
        ? this._open(i, t, o)
        : ((e = o.call(t[0], function (e) {
            t.data('ui-tooltip-open') &&
              n._delay(function () {
                i && (i.type = s), this._open(i, t, e);
              });
          })),
          void (e && this._open(i, t, e)));
    },
    _open: function (i, e, o) {
      function n(t) {
        (p.of = t), l.is(':hidden') || l.position(p);
      }
      var s,
        l,
        a,
        r,
        d,
        p = t.extend({}, this.options.position);
      if (o) {
        if ((s = this._find(e)))
          return void s.tooltip.find('.ui-tooltip-content').html(o);
        e.is('[title]') &&
          (i && 'mouseover' === i.type
            ? e.attr('title', '')
            : e.removeAttr('title')),
          (s = this._tooltip(e)),
          (l = s.tooltip),
          this._addDescribedBy(e, l.attr('id')),
          l.find('.ui-tooltip-content').html(o),
          this.liveRegion.children().hide(),
          o.clone
            ? ((d = o.clone()),
              d.removeAttr('id').find('[id]').removeAttr('id'))
            : (d = o),
          t('<div>').html(d).appendTo(this.liveRegion),
          this.options.track && i && /^mouse/.test(i.type)
            ? (this._on(this.document, { mousemove: n }), n(i))
            : l.position(t.extend({ of: e }, this.options.position)),
          l.hide(),
          this._show(l, this.options.show),
          this.options.show &&
            this.options.show.delay &&
            (r = this.delayedShow =
              setInterval(function () {
                l.is(':visible') && (n(p.of), clearInterval(r));
              }, t.fx.interval)),
          this._trigger('open', i, { tooltip: l }),
          (a = {
            keyup: function (i) {
              if (i.keyCode === t.ui.keyCode.ESCAPE) {
                var o = t.Event(i);
                (o.currentTarget = e[0]), this.close(o, !0);
              }
            },
          }),
          e[0] !== this.element[0] &&
            (a.remove = function () {
              this._removeTooltip(l);
            }),
          (i && 'mouseover' !== i.type) || (a.mouseleave = 'close'),
          (i && 'focusin' !== i.type) || (a.focusout = 'close'),
          this._on(!0, e, a);
      }
    },
    close: function (i) {
      var e,
        o = this,
        n = t(i ? i.currentTarget : this.element),
        s = this._find(n);
      s &&
        ((e = s.tooltip),
        s.closing ||
          (clearInterval(this.delayedShow),
          n.data('ui-tooltip-title') &&
            !n.attr('title') &&
            n.attr('title', n.data('ui-tooltip-title')),
          this._removeDescribedBy(n),
          (s.hiding = !0),
          e.stop(!0),
          this._hide(e, this.options.hide, function () {
            o._removeTooltip(t(this));
          }),
          n.removeData('ui-tooltip-open'),
          this._off(n, 'mouseleave focusout keyup'),
          n[0] !== this.element[0] && this._off(n, 'remove'),
          this._off(this.document, 'mousemove'),
          i &&
            'mouseleave' === i.type &&
            t.each(this.parents, function (i, e) {
              t(e.element).attr('title', e.title), delete o.parents[i];
            }),
          (s.closing = !0),
          this._trigger('close', i, { tooltip: e }),
          s.hiding || (s.closing = !1)));
    },
    _tooltip: function (i) {
      var e = t('<div>')
          .attr('role', 'tooltip')
          .addClass(
            'ui-tooltip ui-widget ui-corner-all ui-widget-content ' +
              (this.options.tooltipClass || '')
          ),
        o = e.uniqueId().attr('id');
      return (
        t('<div>').addClass('ui-tooltip-content').appendTo(e),
        e.appendTo(this.document[0].body),
        (this.tooltips[o] = { element: i, tooltip: e })
      );
    },
    _find: function (t) {
      var i = t.data('ui-tooltip-id');
      return i ? this.tooltips[i] : null;
    },
    _removeTooltip: function (t) {
      t.remove(), delete this.tooltips[t.attr('id')];
    },
    _destroy: function () {
      var i = this;
      t.each(this.tooltips, function (e, o) {
        var n = t.Event('blur'),
          s = o.element;
        (n.target = n.currentTarget = s[0]),
          i.close(n, !0),
          t('#' + e).remove(),
          s.data('ui-tooltip-title') &&
            (s.attr('title') || s.attr('title', s.data('ui-tooltip-title')),
            s.removeData('ui-tooltip-title'));
      }),
        this.liveRegion.remove();
    },
  });
});
