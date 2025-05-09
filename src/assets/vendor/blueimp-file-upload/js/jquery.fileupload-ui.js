!(function (e) {
  'use strict';
  'function' == typeof define && define.amd
    ? define(
        [
          'jquery',
          'tmpl',
          './jquery.fileupload-image',
          './jquery.fileupload-audio',
          './jquery.fileupload-video',
          './jquery.fileupload-validate',
        ],
        e
      )
    : 'object' == typeof exports
      ? e(require('jquery'), require('tmpl'))
      : e(window.jQuery, window.tmpl);
})(function (e, t) {
  'use strict';
  e.blueimp.fileupload.prototype._specialOptions.push(
    'filesContainer',
    'uploadTemplateId',
    'downloadTemplateId'
  ),
    e.widget('blueimp.fileupload', e.blueimp.fileupload, {
      options: {
        autoUpload: !1,
        uploadTemplateId: 'template-upload',
        downloadTemplateId: 'template-download',
        filesContainer: void 0,
        prependFiles: !1,
        dataType: 'json',
        messages: { unknownError: 'Unknown error' },
        getNumberOfFiles: function () {
          return this.filesContainer.children().not('.processing').length;
        },
        getFilesFromResponse: function (t) {
          return t.result && e.isArray(t.result.files) ? t.result.files : [];
        },
        add: function (t, i) {
          if (t.isDefaultPrevented()) return !1;
          var n = e(this),
            r = n.data('blueimp-fileupload') || n.data('fileupload'),
            o = r.options;
          (i.context = r
            ._renderUpload(i.files)
            .data('data', i)
            .addClass('processing')),
            o.filesContainer[o.prependFiles ? 'prepend' : 'append'](i.context),
            r._forceReflow(i.context),
            r._transition(i.context),
            i
              .process(function () {
                return n.fileupload('process', i);
              })
              .always(function () {
                i.context
                  .each(function (t) {
                    e(this)
                      .find('.size')
                      .text(r._formatFileSize(i.files[t].size));
                  })
                  .removeClass('processing'),
                  r._renderPreviews(i);
              })
              .done(function () {
                i.context.find('.start').prop('disabled', !1),
                  r._trigger('added', t, i) !== !1 &&
                    (o.autoUpload || i.autoUpload) &&
                    i.autoUpload !== !1 &&
                    i.submit();
              })
              .fail(function () {
                i.files.error &&
                  i.context.each(function (t) {
                    var n = i.files[t].error;
                    n && e(this).find('.error').text(n);
                  });
              });
        },
        send: function (t, i) {
          if (t.isDefaultPrevented()) return !1;
          var n =
            e(this).data('blueimp-fileupload') || e(this).data('fileupload');
          return (
            i.context &&
              i.dataType &&
              'iframe' === i.dataType.substr(0, 6) &&
              i.context
                .find('.progress')
                .addClass(!e.support.transition && 'progress-animated')
                .attr('aria-valuenow', 100)
                .children()
                .first()
                .css('width', '100%'),
            n._trigger('sent', t, i)
          );
        },
        done: function (t, i) {
          if (t.isDefaultPrevented()) return !1;
          var n,
            r,
            o =
              e(this).data('blueimp-fileupload') || e(this).data('fileupload'),
            a = i.getFilesFromResponse || o.options.getFilesFromResponse,
            s = a(i);
          i.context
            ? i.context.each(function (a) {
                var d = s[a] || { error: 'Empty file upload result' };
                (r = o._addFinishedDeferreds()),
                  o._transition(e(this)).done(function () {
                    var a = e(this);
                    (n = o._renderDownload([d]).replaceAll(a)),
                      o._forceReflow(n),
                      o._transition(n).done(function () {
                        (i.context = e(this)),
                          o._trigger('completed', t, i),
                          o._trigger('finished', t, i),
                          r.resolve();
                      });
                  });
              })
            : ((n = o
                ._renderDownload(s)
                [
                  o.options.prependFiles ? 'prependTo' : 'appendTo'
                ](o.options.filesContainer)),
              o._forceReflow(n),
              (r = o._addFinishedDeferreds()),
              o._transition(n).done(function () {
                (i.context = e(this)),
                  o._trigger('completed', t, i),
                  o._trigger('finished', t, i),
                  r.resolve();
              }));
        },
        fail: function (t, i) {
          if (t.isDefaultPrevented()) return !1;
          var n,
            r,
            o =
              e(this).data('blueimp-fileupload') || e(this).data('fileupload');
          i.context
            ? i.context.each(function (a) {
                if ('abort' !== i.errorThrown) {
                  var s = i.files[a];
                  (s.error =
                    s.error || i.errorThrown || i.i18n('unknownError')),
                    (r = o._addFinishedDeferreds()),
                    o._transition(e(this)).done(function () {
                      var a = e(this);
                      (n = o._renderDownload([s]).replaceAll(a)),
                        o._forceReflow(n),
                        o._transition(n).done(function () {
                          (i.context = e(this)),
                            o._trigger('failed', t, i),
                            o._trigger('finished', t, i),
                            r.resolve();
                        });
                    });
                } else
                  (r = o._addFinishedDeferreds()),
                    o._transition(e(this)).done(function () {
                      e(this).remove(),
                        o._trigger('failed', t, i),
                        o._trigger('finished', t, i),
                        r.resolve();
                    });
              })
            : 'abort' !== i.errorThrown
              ? ((i.context = o
                  ._renderUpload(i.files)
                  [
                    o.options.prependFiles ? 'prependTo' : 'appendTo'
                  ](o.options.filesContainer)
                  .data('data', i)),
                o._forceReflow(i.context),
                (r = o._addFinishedDeferreds()),
                o._transition(i.context).done(function () {
                  (i.context = e(this)),
                    o._trigger('failed', t, i),
                    o._trigger('finished', t, i),
                    r.resolve();
                }))
              : (o._trigger('failed', t, i),
                o._trigger('finished', t, i),
                o._addFinishedDeferreds().resolve());
        },
        progress: function (t, i) {
          if (t.isDefaultPrevented()) return !1;
          var n = Math.floor((i.loaded / i.total) * 100);
          i.context &&
            i.context.each(function () {
              e(this)
                .find('.progress')
                .attr('aria-valuenow', n)
                .children()
                .first()
                .css('width', n + '%');
            });
        },
        progressall: function (t, i) {
          if (t.isDefaultPrevented()) return !1;
          var n = e(this),
            r = Math.floor((i.loaded / i.total) * 100),
            o = n.find('.fileupload-progress'),
            a = o.find('.progress-extended');
          a.length &&
            a.html(
              (
                n.data('blueimp-fileupload') || n.data('fileupload')
              )._renderExtendedProgress(i)
            ),
            o
              .find('.progress')
              .attr('aria-valuenow', r)
              .children()
              .first()
              .css('width', r + '%');
        },
        start: function (t) {
          if (t.isDefaultPrevented()) return !1;
          var i =
            e(this).data('blueimp-fileupload') || e(this).data('fileupload');
          i._resetFinishedDeferreds(),
            i
              ._transition(e(this).find('.fileupload-progress'))
              .done(function () {
                i._trigger('started', t);
              });
        },
        stop: function (t) {
          if (t.isDefaultPrevented()) return !1;
          var i =
              e(this).data('blueimp-fileupload') || e(this).data('fileupload'),
            n = i._addFinishedDeferreds();
          e.when.apply(e, i._getFinishedDeferreds()).done(function () {
            i._trigger('stopped', t);
          }),
            i
              ._transition(e(this).find('.fileupload-progress'))
              .done(function () {
                e(this)
                  .find('.progress')
                  .attr('aria-valuenow', '0')
                  .children()
                  .first()
                  .css('width', '0%'),
                  e(this).find('.progress-extended').html('&nbsp;'),
                  n.resolve();
              });
        },
        processstart: function (t) {
          return t.isDefaultPrevented()
            ? !1
            : void e(this).addClass('fileupload-processing');
        },
        processstop: function (t) {
          return t.isDefaultPrevented()
            ? !1
            : void e(this).removeClass('fileupload-processing');
        },
        destroy: function (t, i) {
          if (t.isDefaultPrevented()) return !1;
          var n =
              e(this).data('blueimp-fileupload') || e(this).data('fileupload'),
            r = function () {
              n._transition(i.context).done(function () {
                e(this).remove(), n._trigger('destroyed', t, i);
              });
            };
          i.url
            ? ((i.dataType = i.dataType || n.options.dataType),
              e
                .ajax(i)
                .done(r)
                .fail(function () {
                  n._trigger('destroyfailed', t, i);
                }))
            : r();
        },
      },
      _resetFinishedDeferreds: function () {
        this._finishedUploads = [];
      },
      _addFinishedDeferreds: function (t) {
        return t || (t = e.Deferred()), this._finishedUploads.push(t), t;
      },
      _getFinishedDeferreds: function () {
        return this._finishedUploads;
      },
      _enableDragToDesktop: function () {
        var t = e(this),
          i = t.prop('href'),
          n = t.prop('download'),
          r = 'application/octet-stream';
        t.bind('dragstart', function (e) {
          try {
            e.originalEvent.dataTransfer.setData(
              'DownloadURL',
              [r, n, i].join(':')
            );
          } catch (t) {}
        });
      },
      _formatFileSize: function (e) {
        return 'number' != typeof e
          ? ''
          : e >= 1e9
            ? (e / 1e9).toFixed(2) + ' GB'
            : e >= 1e6
              ? (e / 1e6).toFixed(2) + ' MB'
              : (e / 1e3).toFixed(2) + ' KB';
      },
      _formatBitrate: function (e) {
        return 'number' != typeof e
          ? ''
          : e >= 1e9
            ? (e / 1e9).toFixed(2) + ' Gbit/s'
            : e >= 1e6
              ? (e / 1e6).toFixed(2) + ' Mbit/s'
              : e >= 1e3
                ? (e / 1e3).toFixed(2) + ' kbit/s'
                : e.toFixed(2) + ' bit/s';
      },
      _formatTime: function (e) {
        var t = new Date(1e3 * e),
          i = Math.floor(e / 86400);
        return (
          (i = i ? i + 'd ' : ''),
          i +
            ('0' + t.getUTCHours()).slice(-2) +
            ':' +
            ('0' + t.getUTCMinutes()).slice(-2) +
            ':' +
            ('0' + t.getUTCSeconds()).slice(-2)
        );
      },
      _formatPercentage: function (e) {
        return (100 * e).toFixed(2) + ' %';
      },
      _renderExtendedProgress: function (e) {
        return (
          this._formatBitrate(e.bitrate) +
          ' | ' +
          this._formatTime((8 * (e.total - e.loaded)) / e.bitrate) +
          ' | ' +
          this._formatPercentage(e.loaded / e.total) +
          ' | ' +
          this._formatFileSize(e.loaded) +
          ' / ' +
          this._formatFileSize(e.total)
        );
      },
      _renderTemplate: function (t, i) {
        if (!t) return e();
        var n = t({
          files: i,
          formatFileSize: this._formatFileSize,
          options: this.options,
        });
        return n instanceof e
          ? n
          : e(this.options.templatesContainer).html(n).children();
      },
      _renderPreviews: function (t) {
        t.context.find('.preview').each(function (i, n) {
          e(n).append(t.files[i].preview);
        });
      },
      _renderUpload: function (e) {
        return this._renderTemplate(this.options.uploadTemplate, e);
      },
      _renderDownload: function (e) {
        return this._renderTemplate(this.options.downloadTemplate, e)
          .find('a[download]')
          .each(this._enableDragToDesktop)
          .end();
      },
      _startHandler: function (t) {
        t.preventDefault();
        var i = e(t.currentTarget),
          n = i.closest('.template-upload'),
          r = n.data('data');
        i.prop('disabled', !0), r && r.submit && r.submit();
      },
      _cancelHandler: function (t) {
        t.preventDefault();
        var i = e(t.currentTarget).closest(
            '.template-upload,.template-download'
          ),
          n = i.data('data') || {};
        (n.context = n.context || i),
          n.abort
            ? n.abort()
            : ((n.errorThrown = 'abort'), this._trigger('fail', t, n));
      },
      _deleteHandler: function (t) {
        t.preventDefault();
        var i = e(t.currentTarget);
        this._trigger(
          'destroy',
          t,
          e.extend(
            { context: i.closest('.template-download'), type: 'DELETE' },
            i.data()
          )
        );
      },
      _forceReflow: function (t) {
        return e.support.transition && t.length && t[0].offsetWidth;
      },
      _transition: function (t) {
        var i = e.Deferred();
        return (
          e.support.transition && t.hasClass('fade') && t.is(':visible')
            ? t
                .bind(e.support.transition.end, function (n) {
                  n.target === t[0] &&
                    (t.unbind(e.support.transition.end), i.resolveWith(t));
                })
                .toggleClass('in')
            : (t.toggleClass('in'), i.resolveWith(t)),
          i
        );
      },
      _initButtonBarEventHandlers: function () {
        var t = this.element.find('.fileupload-buttonbar'),
          i = this.options.filesContainer;
        this._on(t.find('.start'), {
          click: function (e) {
            e.preventDefault(), i.find('.start').click();
          },
        }),
          this._on(t.find('.cancel'), {
            click: function (e) {
              e.preventDefault(), i.find('.cancel').click();
            },
          }),
          this._on(t.find('.delete'), {
            click: function (e) {
              e.preventDefault(),
                i
                  .find('.toggle:checked')
                  .closest('.template-download')
                  .find('.delete')
                  .click(),
                t.find('.toggle').prop('checked', !1);
            },
          }),
          this._on(t.find('.toggle'), {
            change: function (t) {
              i.find('.toggle').prop(
                'checked',
                e(t.currentTarget).is(':checked')
              );
            },
          });
      },
      _destroyButtonBarEventHandlers: function () {
        this._off(
          this.element
            .find('.fileupload-buttonbar')
            .find('.start, .cancel, .delete'),
          'click'
        ),
          this._off(
            this.element.find('.fileupload-buttonbar .toggle'),
            'change.'
          );
      },
      _initEventHandlers: function () {
        this._super(),
          this._on(this.options.filesContainer, {
            'click .start': this._startHandler,
            'click .cancel': this._cancelHandler,
            'click .delete': this._deleteHandler,
          }),
          this._initButtonBarEventHandlers();
      },
      _destroyEventHandlers: function () {
        this._destroyButtonBarEventHandlers(),
          this._off(this.options.filesContainer, 'click'),
          this._super();
      },
      _enableFileInputButton: function () {
        this.element
          .find('.fileinput-button input')
          .prop('disabled', !1)
          .parent()
          .removeClass('disabled');
      },
      _disableFileInputButton: function () {
        this.element
          .find('.fileinput-button input')
          .prop('disabled', !0)
          .parent()
          .addClass('disabled');
      },
      _initTemplates: function () {
        var e = this.options;
        (e.templatesContainer = this.document[0].createElement(
          e.filesContainer.prop('nodeName')
        )),
          t &&
            (e.uploadTemplateId && (e.uploadTemplate = t(e.uploadTemplateId)),
            e.downloadTemplateId &&
              (e.downloadTemplate = t(e.downloadTemplateId)));
      },
      _initFilesContainer: function () {
        var t = this.options;
        void 0 === t.filesContainer
          ? (t.filesContainer = this.element.find('.files'))
          : t.filesContainer instanceof e ||
            (t.filesContainer = e(t.filesContainer));
      },
      _initSpecialOptions: function () {
        this._super(), this._initFilesContainer(), this._initTemplates();
      },
      _create: function () {
        this._super(),
          this._resetFinishedDeferreds(),
          e.support.fileInput || this._disableFileInputButton();
      },
      enable: function () {
        var e = !1;
        this.options.disabled && (e = !0),
          this._super(),
          e &&
            (this.element.find('input, button').prop('disabled', !1),
            this._enableFileInputButton());
      },
      disable: function () {
        this.options.disabled ||
          (this.element.find('input, button').prop('disabled', !0),
          this._disableFileInputButton()),
          this._super();
      },
    });
});
