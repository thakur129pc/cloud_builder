!(function (e) {
  'use strict';
  'function' == typeof define && define.amd
    ? define(['jquery', './jquery.fileupload'], e)
    : e('object' == typeof exports ? require('jquery') : window.jQuery);
})(function (e) {
  'use strict';
  var s = e.blueimp.fileupload.prototype.options.add;
  e.widget('blueimp.fileupload', e.blueimp.fileupload, {
    options: {
      processQueue: [],
      add: function (r, i) {
        var o = e(this);
        i.process(function () {
          return o.fileupload('process', i);
        }),
          s.call(this, r, i);
      },
    },
    processActions: {},
    _processFile: function (s, r) {
      var i = this,
        o = e.Deferred().resolveWith(i, [s]),
        t = o.promise();
      return (
        this._trigger('process', null, s),
        e.each(s.processQueue, function (s, o) {
          var n = function (s) {
            return r.errorThrown
              ? e.Deferred().rejectWith(i, [r]).promise()
              : i.processActions[o.action].call(i, s, o);
          };
          t = t.pipe(n, o.always && n);
        }),
        t
          .done(function () {
            i._trigger('processdone', null, s),
              i._trigger('processalways', null, s);
          })
          .fail(function () {
            i._trigger('processfail', null, s),
              i._trigger('processalways', null, s);
          }),
        t
      );
    },
    _transformProcessQueue: function (s) {
      var r = [];
      e.each(s.processQueue, function () {
        var i = {},
          o = this.action,
          t = this.prefix === !0 ? o : this.prefix;
        e.each(this, function (r, o) {
          i[r] =
            'string' === e.type(o) && '@' === o.charAt(0)
              ? s[
                  o.slice(1) ||
                    (t ? t + r.charAt(0).toUpperCase() + r.slice(1) : r)
                ]
              : o;
        }),
          r.push(i);
      }),
        (s.processQueue = r);
    },
    processing: function () {
      return this._processing;
    },
    process: function (s) {
      var r = this,
        i = e.extend({}, this.options, s);
      return (
        i.processQueue &&
          i.processQueue.length &&
          (this._transformProcessQueue(i),
          0 === this._processing && this._trigger('processstart'),
          e.each(s.files, function (o) {
            var t = o ? e.extend({}, i) : i,
              n = function () {
                return s.errorThrown
                  ? e.Deferred().rejectWith(r, [s]).promise()
                  : r._processFile(t, s);
              };
            (t.index = o),
              (r._processing += 1),
              (r._processingQueue = r._processingQueue
                .pipe(n, n)
                .always(function () {
                  (r._processing -= 1),
                    0 === r._processing && r._trigger('processstop');
                }));
          })),
        this._processingQueue
      );
    },
    _create: function () {
      this._super(),
        (this._processing = 0),
        (this._processingQueue = e.Deferred().resolveWith(this).promise());
    },
  });
});
