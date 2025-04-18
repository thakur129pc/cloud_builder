!(function (e, n) {
  function t(e, n) {
    h(e).push(n);
  }
  function r(r, a, i) {
    var s = r.children(a.headerTag),
      o = r.children(a.bodyTag);
    s.length > o.length
      ? $(X, 'contents')
      : s.length < o.length && $(X, 'titles');
    var l = a.startIndex;
    if (((i.stepCount = s.length), a.saveState && e.cookie)) {
      var d = e.cookie(R + m(r)),
        u = parseInt(d, 0);
      !isNaN(u) && u < i.stepCount && (l = u);
    }
    (i.currentIndex = l),
      s.each(function (a) {
        var i = e(this),
          s = o.eq(a),
          l = s.data('mode'),
          d =
            null == l
              ? Y.html
              : g(Y, /^\s*$/.test(l) || isNaN(l) ? l : parseInt(l, 0)),
          u = d === Y.html || s.data('url') === n ? '' : s.data('url'),
          c = d !== Y.html && '1' === s.data('loaded'),
          f = e.extend({}, nn, {
            title: i.html(),
            content: d === Y.html ? s.html() : '',
            contentUrl: u,
            contentMode: d,
            contentLoaded: c,
          });
        t(r, f);
      });
  }
  function a(e) {
    e.triggerHandler('canceled');
  }
  function i(e, n) {
    return e.currentIndex - n;
  }
  function s(n, t) {
    var r = l(n);
    n
      .unbind(r)
      .removeData('uid')
      .removeData('options')
      .removeData('state')
      .removeData('steps')
      .removeData('eventNamespace')
      .find('.actions a')
      .unbind(r),
      n.removeClass(t.clearFixCssClass + ' vertical');
    var a = n.find('.content > *');
    a.removeData('loaded').removeData('mode').removeData('url'),
      a
        .removeAttr('id')
        .removeAttr('role')
        .removeAttr('tabindex')
        .removeAttr('class')
        .removeAttr('style')
        ._removeAria('labelledby')
        ._removeAria('hidden'),
      n
        .find(".content > [data-mode='async'],.content > [data-mode='iframe']")
        .empty();
    var i = e(
        '<{0} class="{1}"></{0}>'.format(n.get(0).tagName, n.attr('class'))
      ),
      s = n._id();
    return (
      null != s && '' !== s && i._id(s),
      i.html(n.find('.content').html()),
      n.after(i),
      n.remove(),
      i
    );
  }
  function o(e, n) {
    var t = e.find('.steps li').eq(n.currentIndex);
    e.triggerHandler('finishing', [n.currentIndex])
      ? (t.addClass('done').removeClass('error'),
        e.triggerHandler('finished', [n.currentIndex]))
      : t.addClass('error');
  }
  function l(e) {
    var n = e.data('eventNamespace');
    return null == n && ((n = '.' + m(e)), e.data('eventNamespace', n)), n;
  }
  function d(e, n) {
    var t = m(e);
    return e.find('#' + t + V + n);
  }
  function u(e, n) {
    var t = m(e);
    return e.find('#' + t + W + n);
  }
  function c(e, n) {
    var t = m(e);
    return e.find('#' + t + G + n);
  }
  function f(e) {
    return e.data('options');
  }
  function p(e) {
    return e.data('state');
  }
  function h(e) {
    return e.data('steps');
  }
  function v(e, n) {
    var t = h(e);
    return (0 > n || n >= t.length) && $(J), t[n];
  }
  function m(e) {
    var n = e.data('uid');
    return (
      null == n &&
        ((n = e._id()),
        null == n && ((n = 'steps-uid-'.concat(K)), e._id(n)),
        K++,
        e.data('uid', n)),
      n
    );
  }
  function g(e, t) {
    if ((Q('enumType', e), Q('keyOrValue', t), 'string' == typeof t)) {
      var r = e[t];
      return r === n && $("The enum key '{0}' does not exist.", t), r;
    }
    if ('number' == typeof t) {
      for (var a in e) if (e[a] === t) return t;
      $("Invalid enum value '{0}'.", t);
    } else $('Invalid key or value type.');
  }
  function C(e, n, t) {
    return T(e, n, t, y(t, 1));
  }
  function b(e, n, t) {
    return T(e, n, t, i(t, 1));
  }
  function x(e, n, t, r) {
    if (
      ((0 > r || r >= t.stepCount) && $(J),
      !(n.forceMoveForward && r < t.currentIndex))
    ) {
      var a = t.currentIndex;
      return (
        e.triggerHandler('stepChanging', [t.currentIndex, r])
          ? ((t.currentIndex = r),
            j(e, n, t),
            q(e, n, t, a),
            S(e, n, t),
            F(e, n, t),
            U(e, n, t, r, a, function () {
              e.triggerHandler('stepChanged', [r, a]);
            }))
          : e.find('.steps li').eq(a).addClass('error'),
        !0
      );
    }
  }
  function y(e, n) {
    return e.currentIndex + n;
  }
  function I(n) {
    var t = e.extend(!0, {}, tn, n);
    return this.each(function () {
      var n = e(this),
        a = {
          currentIndex: t.startIndex,
          currentStep: null,
          stepCount: 0,
          transitionElement: null,
        };
      n.data('options', t),
        n.data('state', a),
        n.data('steps', []),
        r(n, t, a),
        L(n, t, a),
        E(n, t),
        t.autoFocus && 0 === K && d(n, t.startIndex).focus(),
        n.triggerHandler('init', [t.startIndex]);
    });
  }
  function _(n, t, r, a, i) {
    (0 > a || a > r.stepCount) && $(J),
      (i = e.extend({}, nn, i)),
      A(n, a, i),
      r.currentIndex !== r.stepCount &&
        r.currentIndex >= a &&
        (r.currentIndex++, j(n, t, r)),
      r.stepCount++;
    var s = n.find('.content'),
      o = e('<{0}>{1}</{0}>'.format(t.headerTag, i.title)),
      l = e('<{0}></{0}>'.format(t.bodyTag));
    return (
      (null == i.contentMode || i.contentMode === Y.html) && l.html(i.content),
      0 === a
        ? s.prepend(l).prepend(o)
        : u(n, a - 1)
            .after(l)
            .after(o),
      O(n, r, l, a),
      P(n, t, r, o, a),
      D(n, t, r, a),
      a === r.currentIndex && q(n, t, r),
      S(n, t, r),
      n
    );
  }
  function A(e, n, t) {
    h(e).splice(n, 0, t);
  }
  function w(n) {
    var t = e(this),
      r = f(t),
      a = p(t);
    if (r.suppressPaginationOnFocus && t.find(':focus').is(':input'))
      return n.preventDefault(), !1;
    var i = { left: 37, right: 39 };
    n.keyCode === i.left
      ? (n.preventDefault(), b(t, r, a))
      : n.keyCode === i.right && (n.preventDefault(), C(t, r, a));
  }
  function F(n, t, r) {
    if (r.stepCount > 0) {
      var a = r.currentIndex,
        i = v(n, a);
      if (!t.enableContentCache || !i.contentLoaded)
        switch (g(Y, i.contentMode)) {
          case Y.iframe:
            n.find('.content > .body')
              .eq(r.currentIndex)
              .empty()
              .html(
                '<iframe src="' +
                  i.contentUrl +
                  '" frameborder="0" scrolling="no" />'
              )
              .data('loaded', '1');
            break;
          case Y.async:
            var s = u(n, a)
              ._aria('busy', 'true')
              .empty()
              .append(H(t.loadingTemplate, { text: t.labels.loading }));
            e.ajax({ url: i.contentUrl, cache: !1 }).done(function (e) {
              s.empty().html(e)._aria('busy', 'false').data('loaded', '1'),
                n.triggerHandler('contentLoaded', [a]);
            });
        }
    }
  }
  function T(e, n, t, r) {
    var a = t.currentIndex;
    if (
      r >= 0 &&
      r < t.stepCount &&
      !(n.forceMoveForward && r < t.currentIndex)
    ) {
      var i = d(e, r),
        s = i.parent(),
        o = s.hasClass('disabled');
      return (
        s._enableAria(),
        i.click(),
        a === t.currentIndex && o ? (s._enableAria(!1), !1) : !0
      );
    }
    return !1;
  }
  function k(n) {
    n.preventDefault();
    var t = e(this),
      r = t.parent().parent().parent().parent(),
      i = f(r),
      s = p(r),
      l = t.attr('href');
    switch (l.substring(l.lastIndexOf('#') + 1)) {
      case 'cancel':
        a(r);
        break;
      case 'finish':
        o(r, s);
        break;
      case 'next':
        C(r, i, s);
        break;
      case 'previous':
        b(r, i, s);
    }
  }
  function S(e, n, t) {
    if (n.enablePagination) {
      var r = e.find(".actions a[href$='#finish']").parent(),
        a = e.find(".actions a[href$='#next']").parent();
      if (!n.forceMoveForward) {
        var i = e.find(".actions a[href$='#previous']").parent();
        i._enableAria(t.currentIndex > 0);
      }
      n.enableFinishButton && n.showFinishButtonAlways
        ? (r._enableAria(t.stepCount > 0),
          a._enableAria(t.stepCount > 1 && t.stepCount > t.currentIndex + 1))
        : (r._showAria(
            n.enableFinishButton && t.stepCount === t.currentIndex + 1
          ),
          a
            ._showAria(0 === t.stepCount || t.stepCount > t.currentIndex + 1)
            ._enableAria(
              t.stepCount > t.currentIndex + 1 || !n.enableFinishButton
            ));
    }
  }
  function q(n, t, r, a) {
    var i = d(n, r.currentIndex),
      s = e(
        '<span class="current-info audible">' + t.labels.current + ' </span>'
      ),
      o = n.find('.content > .title');
    if (null != a) {
      var l = d(n, a);
      l.parent().addClass('done').removeClass('error')._selectAria(!1),
        o.eq(a).removeClass('current').next('.body').removeClass('current'),
        (s = l.find('.current-info')),
        i.focus();
    }
    i.prepend(s).parent()._selectAria().removeClass('done')._enableAria(),
      o
        .eq(r.currentIndex)
        .addClass('current')
        .next('.body')
        .addClass('current');
  }
  function D(e, n, t, r) {
    for (var a = m(e), i = r; i < t.stepCount; i++) {
      var s = a + V + i,
        o = a + W + i,
        l = a + G + i,
        d = e.find('.title').eq(i)._id(l);
      e
        .find('.steps a')
        .eq(i)
        ._id(s)
        ._aria('controls', o)
        .attr('href', '#' + l)
        .html(H(n.titleTemplate, { index: i + 1, title: d.html() })),
        e.find('.body').eq(i)._id(o)._aria('labelledby', l);
    }
  }
  function E(e, n) {
    var t = l(e);
    e.bind('canceled' + t, n.onCanceled),
      e.bind('contentLoaded' + t, n.onContentLoaded),
      e.bind('finishing' + t, n.onFinishing),
      e.bind('finished' + t, n.onFinished),
      e.bind('init' + t, n.onInit),
      e.bind('stepChanging' + t, n.onStepChanging),
      e.bind('stepChanged' + t, n.onStepChanged),
      n.enableKeyNavigation && e.bind('keyup' + t, w),
      e.find('.actions a').bind('click' + t, k);
  }
  function M(e, n, t, r) {
    return 0 > r || r >= t.stepCount || t.currentIndex === r
      ? !1
      : (N(e, r),
        t.currentIndex > r && (t.currentIndex--, j(e, n, t)),
        t.stepCount--,
        c(e, r).remove(),
        u(e, r).remove(),
        d(e, r).parent().remove(),
        0 === r && e.find('.steps li').first().addClass('first'),
        r === t.stepCount && e.find('.steps li').eq(r).addClass('last'),
        D(e, n, t, r),
        S(e, n, t),
        !0);
  }
  function N(e, n) {
    h(e).splice(n, 1);
  }
  function L(n, t, r) {
    var a = '<{0} class="{1}">{2}</{0}>',
      i = g(Z, t.stepsOrientation),
      s = i === Z.vertical ? ' vertical' : '',
      o = e(
        a.format(
          t.contentContainerTag,
          'content ' + t.clearFixCssClass,
          n.html()
        )
      ),
      l = e(
        a.format(
          t.stepsContainerTag,
          'steps ' + t.clearFixCssClass,
          '<ul role="tablist"></ul>'
        )
      ),
      d = o.children(t.headerTag),
      u = o.children(t.bodyTag);
    n
      .attr('role', 'application')
      .empty()
      .append(l)
      .append(o)
      .addClass(t.cssClass + ' ' + t.clearFixCssClass + s),
      u.each(function (t) {
        O(n, r, e(this), t);
      }),
      d.each(function (a) {
        P(n, t, r, e(this), a);
      }),
      q(n, t, r),
      B(n, t, r);
  }
  function O(e, n, t, r) {
    var a = m(e),
      i = a + W + r,
      s = a + G + r;
    t._id(i)
      .attr('role', 'tabpanel')
      ._aria('labelledby', s)
      .addClass('body')
      ._showAria(n.currentIndex === r);
  }
  function B(e, n, t) {
    if (n.enablePagination) {
      var r =
          '<{0} class="actions {1}"><ul role="menu" aria-label="{2}">{3}</ul></{0}>',
        a = '<li><a href="#{0}" role="menuitem">{1}</a></li>',
        i = '';
      n.forceMoveForward || (i += a.format('previous', n.labels.previous)),
        (i += a.format('next', n.labels.next)),
        n.enableFinishButton && (i += a.format('finish', n.labels.finish)),
        n.enableCancelButton && (i += a.format('cancel', n.labels.cancel)),
        e.append(
          r.format(
            n.actionContainerTag,
            n.clearFixCssClass,
            n.labels.pagination,
            i
          )
        ),
        S(e, n, t),
        F(e, n, t);
    }
  }
  function H(e, t) {
    for (var r = e.match(/#([a-z]*)#/gi), a = 0; a < r.length; a++) {
      var i = r[a],
        s = i.substring(1, i.length - 1);
      t[s] === n &&
        $("The key '{0}' does not exist in the substitute collection!", s),
        (e = e.replace(i, t[s]));
    }
    return e;
  }
  function P(n, t, r, a, i) {
    var s = m(n),
      o = s + V + i,
      d = s + W + i,
      u = s + G + i,
      c = n.find('.steps > ul'),
      f = H(t.titleTemplate, { index: i + 1, title: a.html() }),
      p = e(
        '<li role="tab"><a id="' +
          o +
          '" href="#' +
          u +
          '" aria-controls="' +
          d +
          '">' +
          f +
          '</a></li>'
      );
    p._enableAria(t.enableAllSteps || r.currentIndex > i),
      r.currentIndex > i && p.addClass('done'),
      a._id(u).attr('tabindex', '-1').addClass('title'),
      0 === i
        ? c.prepend(p)
        : c
            .find('li')
            .eq(i - 1)
            .after(p),
      0 === i && c.find('li').removeClass('first').eq(i).addClass('first'),
      i === r.stepCount - 1 &&
        c.find('li').removeClass('last').eq(i).addClass('last'),
      p.children('a').bind('click' + l(n), z);
  }
  function j(n, t, r) {
    t.saveState && e.cookie && e.cookie(R + m(n), r.currentIndex);
  }
  function U(n, t, r, a, i, s) {
    var o = n.find('.content > .body'),
      l = g(en, t.transitionEffect),
      d = t.transitionEffectSpeed,
      u = o.eq(a),
      c = o.eq(i);
    switch (l) {
      case en.fade:
      case en.slide:
        var f = l === en.fade ? 'fadeOut' : 'slideUp',
          h = l === en.fade ? 'fadeIn' : 'slideDown';
        (r.transitionElement = u),
          c[f](d, function () {
            var n = e(this)._showAria(!1).parent().parent(),
              t = p(n);
            t.transitionElement &&
              (t.transitionElement[h](d, function () {
                e(this)._showAria();
              })
                .promise()
                .done(s),
              (t.transitionElement = null));
          });
        break;
      case en.slideLeft:
        var v = c.outerWidth(!0),
          m = a > i ? -v : v,
          C = a > i ? v : -v;
        e.when(
          c.animate({ left: m }, d, function () {
            e(this)._showAria(!1);
          }),
          u
            .css('left', C + 'px')
            ._showAria()
            .animate({ left: 0 }, d)
        ).done(s);
        break;
      default:
        e.when(c._showAria(!1), u._showAria()).done(s);
    }
  }
  function z(n) {
    n.preventDefault();
    var t = e(this),
      r = t.parent().parent().parent().parent(),
      a = f(r),
      i = p(r),
      s = i.currentIndex;
    if (t.parent().is(':not(.disabled):not(.current)')) {
      var o = t.attr('href'),
        l = parseInt(o.substring(o.lastIndexOf('-') + 1), 0);
      x(r, a, i, l);
    }
    return s === i.currentIndex ? (d(r, s).focus(), !1) : void 0;
  }
  function $(e) {
    throw (
      (arguments.length > 1 &&
        (e = e.format(Array.prototype.slice.call(arguments, 1))),
      new Error(e))
    );
  }
  function Q(e, n) {
    null == n && $("The argument '{0}' is null or undefined.", e);
  }
  e.fn.extend({
    _aria: function (e, n) {
      return this.attr('aria-' + e, n);
    },
    _removeAria: function (e) {
      return this.removeAttr('aria-' + e);
    },
    _enableAria: function (e) {
      return null == e || e
        ? this.removeClass('disabled')._aria('disabled', 'false')
        : this.addClass('disabled')._aria('disabled', 'true');
    },
    _showAria: function (e) {
      return null == e || e
        ? this.show()._aria('hidden', 'false')
        : this.hide()._aria('hidden', 'true');
    },
    _selectAria: function (e) {
      return null == e || e
        ? this.addClass('current')._aria('selected', 'true')
        : this.removeClass('current')._aria('selected', 'false');
    },
    _id: function (e) {
      return e ? this.attr('id', e) : this.attr('id');
    },
  }),
    String.prototype.format ||
      (String.prototype.format = function () {
        for (
          var n =
              1 === arguments.length && e.isArray(arguments[0])
                ? arguments[0]
                : arguments,
            t = this,
            r = 0;
          r < n.length;
          r++
        ) {
          var a = new RegExp('\\{' + r + '\\}', 'gm');
          t = t.replace(a, n[r]);
        }
        return t;
      });
  var K = 0,
    R = 'jQu3ry_5teps_St@te_',
    V = '-t-',
    W = '-p-',
    G = '-h-',
    J = 'Index out of range.',
    X = 'One or more corresponding step {0} are missing.';
  (e.fn.steps = function (n) {
    return e.fn.steps[n]
      ? e.fn.steps[n].apply(this, Array.prototype.slice.call(arguments, 1))
      : 'object' != typeof n && n
        ? void e.error('Method ' + n + ' does not exist on jQuery.steps')
        : I.apply(this, arguments);
  }),
    (e.fn.steps.add = function (e) {
      var n = p(this);
      return _(this, f(this), n, n.stepCount, e);
    }),
    (e.fn.steps.destroy = function () {
      return s(this, f(this));
    }),
    (e.fn.steps.finish = function () {
      o(this, p(this));
    }),
    (e.fn.steps.getCurrentIndex = function () {
      return p(this).currentIndex;
    }),
    (e.fn.steps.getCurrentStep = function () {
      return v(this, p(this).currentIndex);
    }),
    (e.fn.steps.getStep = function (e) {
      return v(this, e);
    }),
    (e.fn.steps.insert = function (e, n) {
      return _(this, f(this), p(this), e, n);
    }),
    (e.fn.steps.next = function () {
      return C(this, f(this), p(this));
    }),
    (e.fn.steps.previous = function () {
      return b(this, f(this), p(this));
    }),
    (e.fn.steps.remove = function (e) {
      return M(this, f(this), p(this), e);
    }),
    (e.fn.steps.setStep = function () {
      throw new Error('Not yet implemented!');
    }),
    (e.fn.steps.skip = function () {
      throw new Error('Not yet implemented!');
    });
  var Y = (e.fn.steps.contentMode = { html: 0, iframe: 1, async: 2 }),
    Z = (e.fn.steps.stepsOrientation = { horizontal: 0, vertical: 1 }),
    en = (e.fn.steps.transitionEffect = {
      none: 0,
      fade: 1,
      slide: 2,
      slideLeft: 3,
    }),
    nn = (e.fn.steps.stepModel = {
      title: '',
      content: '',
      contentUrl: '',
      contentMode: Y.html,
      contentLoaded: !1,
    }),
    tn = (e.fn.steps.defaults = {
      headerTag: 'h1',
      bodyTag: 'div',
      contentContainerTag: 'div',
      actionContainerTag: 'div',
      stepsContainerTag: 'div',
      cssClass: 'wizard',
      clearFixCssClass: 'clearfix',
      stepsOrientation: Z.horizontal,
      titleTemplate: '<span class="number">#index#.</span> #title#',
      loadingTemplate: '<span class="spinner"></span> #text#',
      autoFocus: !1,
      enableAllSteps: !1,
      enableKeyNavigation: !0,
      enablePagination: !0,
      suppressPaginationOnFocus: !0,
      enableContentCache: !0,
      enableCancelButton: !1,
      enableFinishButton: !0,
      preloadContent: !1,
      showFinishButtonAlways: !1,
      forceMoveForward: !1,
      saveState: !1,
      startIndex: 0,
      transitionEffect: en.none,
      transitionEffectSpeed: 200,
      onStepChanging: function () {
        return !0;
      },
      onStepChanged: function () {},
      onCanceled: function () {},
      onFinishing: function () {
        return !0;
      },
      onFinished: function () {},
      onContentLoaded: function () {},
      onInit: function () {},
      labels: {
        cancel: 'Cancel',
        current: 'current step:',
        pagination: 'Pagination',
        finish: 'Finish',
        next: 'Next',
        previous: 'Previous',
        loading: 'Loading ...',
      },
    });
})(jQuery);
