!(function (e) {
  'use strict';
  'function' == typeof define && define.amd
    ? define(
        [
          'jquery',
          'angular',
          './jquery.fileupload-image',
          './jquery.fileupload-audio',
          './jquery.fileupload-video',
          './jquery.fileupload-validate',
        ],
        e
      )
    : e();
})(function () {
  'use strict';
  angular
    .module('blueimp.fileupload', [])
    .provider('fileUpload', function () {
      var e,
        o = function (e) {
          var o = angular.element(this).fileupload('option', 'scope');
          o.$evalAsync(e);
        },
        n = function (e, o) {
          var n = o.files,
            r = n[0];
          angular.forEach(n, function (e, n) {
            (e._index = n),
              (e.$state = function () {
                return o.state();
              }),
              (e.$processing = function () {
                return o.processing();
              }),
              (e.$progress = function () {
                return o.progress();
              }),
              (e.$response = function () {
                return o.response();
              });
          }),
            (r.$submit = function () {
              return r.error ? void 0 : o.submit();
            }),
            (r.$cancel = function () {
              return o.abort();
            });
        };
      (e = this.defaults =
        {
          handleResponse: function (e, o) {
            var n = o.result && o.result.files;
            n
              ? o.scope.replace(o.files, n)
              : (o.errorThrown || 'error' === o.textStatus) &&
                (o.files[0].error = o.errorThrown || o.textStatus);
          },
          add: function (e, o) {
            if (e.isDefaultPrevented()) return !1;
            var r = o.scope,
              t = [];
            angular.forEach(o.files, function (e) {
              t.push(e);
            }),
              r.$apply(function () {
                n(r, o);
                var e = r.option('prependFiles') ? 'unshift' : 'push';
                Array.prototype[e].apply(r.queue, o.files);
              }),
              o
                .process(function () {
                  return r.process(o);
                })
                .always(function () {
                  r.$apply(function () {
                    n(r, o), r.replace(t, o.files);
                  });
                })
                .then(function () {
                  (r.option('autoUpload') || o.autoUpload) &&
                    o.autoUpload !== !1 &&
                    o.submit();
                });
          },
          progress: function (e, o) {
            return e.isDefaultPrevented() ? !1 : void o.scope.$apply();
          },
          done: function (e, o) {
            if (e.isDefaultPrevented()) return !1;
            var n = this;
            o.scope.$apply(function () {
              o.handleResponse.call(n, e, o);
            });
          },
          fail: function (e, o) {
            if (e.isDefaultPrevented()) return !1;
            var n = this,
              r = o.scope;
            return 'abort' === o.errorThrown
              ? void r.clear(o.files)
              : void r.$apply(function () {
                  o.handleResponse.call(n, e, o);
                });
          },
          stop: o,
          processstart: o,
          processstop: o,
          getNumberOfFiles: function () {
            var e = this.scope;
            return e.queue.length - e.processing();
          },
          dataType: 'json',
          autoUpload: !1,
        }),
        (this.$get = [
          function () {
            return { defaults: e };
          },
        ]);
    })
    .provider('formatFileSizeFilter', function () {
      var e = {
        units: [
          { size: 1e9, suffix: ' GB' },
          { size: 1e6, suffix: ' MB' },
          { size: 1e3, suffix: ' KB' },
        ],
      };
      (this.defaults = e),
        (this.$get = function () {
          return function (o) {
            if (!angular.isNumber(o)) return '';
            for (var n, r, t = !0, l = 0; t; ) {
              if (
                ((t = e.units[l]),
                (n = t.prefix || ''),
                (r = t.suffix || ''),
                l === e.units.length - 1 || o >= t.size)
              )
                return n + (o / t.size).toFixed(2) + r;
              l += 1;
            }
          };
        });
    })
    .controller('FileUploadController', [
      '$scope',
      '$element',
      '$attrs',
      '$window',
      'fileUpload',
      function (e, o, n, r, t) {
        var l = {
          progress: function () {
            return o.fileupload('progress');
          },
          active: function () {
            return o.fileupload('active');
          },
          option: function (e, n) {
            return 1 === arguments.length
              ? o.fileupload('option', e)
              : void o.fileupload('option', e, n);
          },
          add: function (e) {
            return o.fileupload('add', e);
          },
          send: function (e) {
            return o.fileupload('send', e);
          },
          process: function (e) {
            return o.fileupload('process', e);
          },
          processing: function (e) {
            return o.fileupload('processing', e);
          },
        };
        (e.disabled = !r.jQuery.support.fileInput),
          (e.queue = e.queue || []),
          (e.clear = function (e) {
            var o = this.queue,
              n = o.length,
              r = e,
              t = 1;
            for (angular.isArray(e) && ((r = e[0]), (t = e.length)); n; )
              if (((n -= 1), o[n] === r)) return o.splice(n, t);
          }),
          (e.replace = function (e, o) {
            var n,
              r,
              t = this.queue,
              l = e[0];
            for (n = 0; n < t.length; n += 1)
              if (t[n] === l) {
                for (r = 0; r < o.length; r += 1) t[n + r] = o[r];
                return;
              }
          }),
          (e.applyOnQueue = function (e) {
            var o,
              n,
              r = this.queue.slice(0);
            for (o = 0; o < r.length; o += 1) (n = r[o]), n[e] && n[e]();
          }),
          (e.submit = function () {
            this.applyOnQueue('$submit');
          }),
          (e.cancel = function () {
            this.applyOnQueue('$cancel');
          }),
          angular.extend(e, l),
          o
            .fileupload(angular.extend({ scope: e }, t.defaults))
            .on('fileuploadadd', function (o, n) {
              n.scope = e;
            })
            .on('fileuploadfail', function (e, o) {
              if (
                'abort' !== o.errorThrown &&
                o.dataType &&
                o.dataType.indexOf('json') === o.dataType.length - 4
              )
                try {
                  o.result = angular.fromJson(o.jqXHR.responseText);
                } catch (n) {}
            })
            .on(
              [
                'fileuploadadd',
                'fileuploadsubmit',
                'fileuploadsend',
                'fileuploaddone',
                'fileuploadfail',
                'fileuploadalways',
                'fileuploadprogress',
                'fileuploadprogressall',
                'fileuploadstart',
                'fileuploadstop',
                'fileuploadchange',
                'fileuploadpaste',
                'fileuploaddrop',
                'fileuploaddragover',
                'fileuploadchunksend',
                'fileuploadchunkdone',
                'fileuploadchunkfail',
                'fileuploadchunkalways',
                'fileuploadprocessstart',
                'fileuploadprocess',
                'fileuploadprocessdone',
                'fileuploadprocessfail',
                'fileuploadprocessalways',
                'fileuploadprocessstop',
              ].join(' '),
              function (o, n) {
                e.$emit(o.type, n).defaultPrevented && o.preventDefault();
              }
            )
            .on('remove', function () {
              var o;
              for (o in l) l.hasOwnProperty(o) && delete e[o];
            }),
          e.$watch(n.fileUpload, function (e) {
            e && o.fileupload('option', e);
          });
      },
    ])
    .controller('FileUploadProgressController', [
      '$scope',
      '$attrs',
      '$parse',
      function (e, o, n) {
        var r = n(o.fileUploadProgress),
          t = function () {
            var o = r(e);
            o && o.total && (e.num = Math.floor((o.loaded / o.total) * 100));
          };
        t(),
          e.$watch(o.fileUploadProgress + '.loaded', function (e, o) {
            e !== o && t();
          });
      },
    ])
    .controller('FileUploadPreviewController', [
      '$scope',
      '$element',
      '$attrs',
      function (e, o, n) {
        e.$watch(n.fileUploadPreview + '.preview', function (e) {
          o.empty(), e && o.append(e);
        });
      },
    ])
    .directive('fileUpload', function () {
      return { controller: 'FileUploadController', scope: !0 };
    })
    .directive('fileUploadProgress', function () {
      return { controller: 'FileUploadProgressController', scope: !0 };
    })
    .directive('fileUploadPreview', function () {
      return { controller: 'FileUploadPreviewController' };
    })
    .directive('download', function () {
      return function (e, o) {
        o.on('dragstart', function (e) {
          try {
            e.originalEvent.dataTransfer.setData(
              'DownloadURL',
              [
                'application/octet-stream',
                o.prop('download'),
                o.prop('href'),
              ].join(':')
            );
          } catch (n) {}
        });
      };
    });
});
