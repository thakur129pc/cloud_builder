!(function (e) {
  'use strict';
  'function' == typeof define && define.amd
    ? define(['jquery', './jquery.fileupload-ui'], e)
    : e('object' == typeof exports ? require('jquery') : window.jQuery);
})(function (e) {
  'use strict';
  e.widget('blueimp.fileupload', e.blueimp.fileupload, {
    options: {
      processdone: function (e, t) {
        t.context.find('.start').button('enable');
      },
      progress: function (e, t) {
        t.context &&
          t.context
            .find('.progress')
            .progressbar(
              'option',
              'value',
              parseInt((t.loaded / t.total) * 100, 10)
            );
      },
      progressall: function (t, n) {
        var i = e(this);
        i.find('.fileupload-progress')
          .find('.progress')
          .progressbar(
            'option',
            'value',
            parseInt((n.loaded / n.total) * 100, 10)
          )
          .end()
          .find('.progress-extended')
          .each(function () {
            e(this).html(
              (
                i.data('blueimp-fileupload') || i.data('fileupload')
              )._renderExtendedProgress(n)
            );
          });
      },
    },
    _renderUpload: function (t, n) {
      var i = this._super(t, n),
        r = e(window).width() > 480;
      return (
        i.find('.progress').empty().progressbar(),
        i
          .find('.start')
          .button({ icons: { primary: 'ui-icon-circle-arrow-e' }, text: r }),
        i
          .find('.cancel')
          .button({ icons: { primary: 'ui-icon-cancel' }, text: r }),
        i.hasClass('fade') && i.hide(),
        i
      );
    },
    _renderDownload: function (t, n) {
      var i = this._super(t, n),
        r = e(window).width() > 480;
      return (
        i
          .find('.delete')
          .button({ icons: { primary: 'ui-icon-trash' }, text: r }),
        i.hasClass('fade') && i.hide(),
        i
      );
    },
    _startHandler: function (t) {
      e(t.currentTarget).button('disable'), this._super(t);
    },
    _transition: function (t) {
      var n = e.Deferred();
      return (
        t.hasClass('fade')
          ? t.fadeToggle(
              this.options.transitionDuration,
              this.options.transitionEasing,
              function () {
                n.resolveWith(t);
              }
            )
          : n.resolveWith(t),
        n
      );
    },
    _create: function () {
      this._super(),
        this.element
          .find('.fileupload-buttonbar')
          .find('.fileinput-button')
          .each(function () {
            var t = e(this).find('input:file').detach();
            e(this)
              .button({ icons: { primary: 'ui-icon-plusthick' } })
              .append(t);
          })
          .end()
          .find('.start')
          .button({ icons: { primary: 'ui-icon-circle-arrow-e' } })
          .end()
          .find('.cancel')
          .button({ icons: { primary: 'ui-icon-cancel' } })
          .end()
          .find('.delete')
          .button({ icons: { primary: 'ui-icon-trash' } })
          .end()
          .find('.progress')
          .progressbar();
    },
    _destroy: function () {
      this.element
        .find('.fileupload-buttonbar')
        .find('.fileinput-button')
        .each(function () {
          var t = e(this).find('input:file').detach();
          e(this).button('destroy').append(t);
        })
        .end()
        .find('.start')
        .button('destroy')
        .end()
        .find('.cancel')
        .button('destroy')
        .end()
        .find('.delete')
        .button('destroy')
        .end()
        .find('.progress')
        .progressbar('destroy'),
        this._super();
    },
  });
});
