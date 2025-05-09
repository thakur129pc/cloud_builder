!(function (t, e) {
  function i(e, i, s, n) {
    var o = {
      duration: 1,
      animation: null,
      iterate: 1,
      timing: 'linear',
      keep: !1,
    };
    (this.prefixes = ['', '-moz-', '-o-animation-', '-webkit-']),
      (this.element = t(e)),
      (this.bare = e),
      (this.queue = []),
      (this.listening = !1);
    var a = 'function' == typeof s ? s : n;
    switch (i) {
      case 'blur':
        (o = { amount: 3, duration: 0.5, focusAfter: null }),
          (this.options = t.extend(o, s)),
          this._blur(a);
        break;
      case 'focus':
        this._focus();
        break;
      case 'rotate':
        (o = { degrees: 15, duration: 0.5 }),
          (this.options = t.extend(o, s)),
          this._rotate(a);
        break;
      case 'cleanse':
        this.cleanse();
        break;
      default:
        (this.options = t.extend(o, i)), this.init(a);
    }
  }
  (i.prototype = {
    init: function (e) {
      var i = this;
      '[object Array]' === Object.prototype.toString.call(i.options.animation)
        ? t.merge(i.queue, i.options.animation)
        : i.queue.push(i.options.animation),
        i.cleanse(),
        i.animate(e);
    },
    animate: function (t) {
      this.element.addClass('animated'),
        this.element.addClass(this.queue[0]),
        this.element.data('animo', this.queue[0]);
      for (var e = this.prefixes.length; e--; )
        this.element.css(
          this.prefixes[e] + 'animation-duration',
          this.options.duration + 's'
        ),
          this.element.css(
            this.prefixes[e] + 'animation-iteration-count',
            this.options.iterate
          ),
          this.element.css(
            this.prefixes[e] + 'animation-timing-function',
            this.options.timing
          );
      var i = this,
        s = t;
      i.queue.length > 1 && (s = null),
        this._end(
          'AnimationEnd',
          function () {
            i.element.hasClass(i.queue[0]) &&
              (i.options.keep || i.cleanse(),
              i.queue.shift(),
              i.queue.length && i.animate(t));
          },
          s
        );
    },
    cleanse: function () {
      this.element.removeClass('animated'),
        this.element.removeClass(this.queue[0]),
        this.element.removeClass(this.element.data('animo'));
      for (var t = this.prefixes.length; t--; )
        this.element.css(this.prefixes[t] + 'animation-duration', ''),
          this.element.css(this.prefixes[t] + 'animation-iteration-count', ''),
          this.element.css(this.prefixes[t] + 'animation-timing-function', ''),
          this.element.css(this.prefixes[t] + 'transition', ''),
          this.element.css(this.prefixes[t] + 'transform', ''),
          this.element.css(this.prefixes[t] + 'filter', '');
    },
    _blur: function (i) {
      if (this.element.is('img')) {
        var s =
            'svg_' +
            ((16777216 * (1 + Math.random())) | 0).toString(16).substring(1),
          n =
            'filter_' +
            ((16777216 * (1 + Math.random())) | 0).toString(16).substring(1);
        t('body').append(
          '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" id="' +
            s +
            '" style="height:0;position:absolute;top:-1000px;"><filter id="' +
            n +
            '"><feGaussianBlur stdDeviation="' +
            this.options.amount +
            '" /></filter></svg>'
        );
        for (var o = this.prefixes.length; o--; )
          this.element.css(
            this.prefixes[o] + 'filter',
            'blur(' + this.options.amount + 'px)'
          ),
            this.element.css(
              this.prefixes[o] + 'transition',
              this.options.duration + 's all linear'
            );
        this.element.css('filter', 'url(#' + n + ')'),
          this.element.data('svgid', s);
      } else {
        for (var a = this.element.css('color'), o = this.prefixes.length; o--; )
          this.element.css(
            this.prefixes[o] + 'transition',
            'all ' + this.options.duration + 's linear'
          );
        this.element.css(
          'text-shadow',
          '0 0 ' + this.options.amount + 'px ' + a
        ),
          this.element.css('color', 'transparent');
      }
      this._end('TransitionEnd', null, i);
      var r = this;
      if (this.options.focusAfter)
        var h = e.setTimeout(function () {
          r._focus(), (h = e.clearTimeout(h));
        }, 1e3 * this.options.focusAfter);
    },
    _focus: function () {
      var e = this.prefixes.length;
      if (this.element.is('img')) {
        for (; e--; )
          this.element.css(this.prefixes[e] + 'filter', ''),
            this.element.css(this.prefixes[e] + 'transition', '');
        var i = t('#' + this.element.data('svgid'));
        i.remove();
      } else {
        for (; e--; ) this.element.css(this.prefixes[e] + 'transition', '');
        this.element.css('text-shadow', ''), this.element.css('color', '');
      }
    },
    _rotate: function (t) {
      for (var e = this.prefixes.length; e--; )
        this.element.css(
          this.prefixes[e] + 'transition',
          'all ' + this.options.duration + 's linear'
        ),
          this.element.css(
            this.prefixes[e] + 'transform',
            'rotate(' + this.options.degrees + 'deg)'
          );
      this._end('TransitionEnd', null, t);
    },
    _end: function (t, e, i) {
      var s = this,
        n = t.toLowerCase() + ' webkit' + t + ' o' + t + ' MS' + t;
      this.element.bind(n, function () {
        s.element.unbind(n),
          'function' == typeof e && e(),
          'function' == typeof i && i(s);
      });
    },
  }),
    (t.fn.animo = function (t, e, s) {
      return this.each(function () {
        new i(this, t, e, s);
      });
    });
})(jQuery, window, document);
