!(function (e) {
  'use strict';
  'function' == typeof define && define.amd
    ? define(['jquery', './jquery.fileupload-process'], e)
    : e('object' == typeof exports ? require('jquery') : window.jQuery);
})(function (e) {
  'use strict';
  e.blueimp.fileupload.prototype.options.processQueue.push({
    action: 'validate',
    always: !0,
    acceptFileTypes: '@',
    maxFileSize: '@',
    minFileSize: '@',
    maxNumberOfFiles: '@',
    disabled: '@disableValidation',
  }),
    e.widget('blueimp.fileupload', e.blueimp.fileupload, {
      options: {
        getNumberOfFiles: e.noop,
        messages: {
          maxNumberOfFiles: 'Maximum number of files exceeded',
          acceptFileTypes: 'File type not allowed',
          maxFileSize: 'File is too large',
          minFileSize: 'File is too small',
        },
      },
      processActions: {
        validate: function (i, r) {
          if (r.disabled) return i;
          var l,
            s = e.Deferred(),
            t = this.options,
            o = i.files[i.index];
          return (
            (r.minFileSize || r.maxFileSize) && (l = o.size),
            'number' === e.type(r.maxNumberOfFiles) &&
            (t.getNumberOfFiles() || 0) + i.files.length > r.maxNumberOfFiles
              ? (o.error = t.i18n('maxNumberOfFiles'))
              : !r.acceptFileTypes ||
                  r.acceptFileTypes.test(o.type) ||
                  r.acceptFileTypes.test(o.name)
                ? l > r.maxFileSize
                  ? (o.error = t.i18n('maxFileSize'))
                  : 'number' === e.type(l) && l < r.minFileSize
                    ? (o.error = t.i18n('minFileSize'))
                    : delete o.error
                : (o.error = t.i18n('acceptFileTypes')),
            o.error || i.files.error
              ? ((i.files.error = !0), s.rejectWith(this, [i]))
              : s.resolveWith(this, [i]),
            s.promise()
          );
        },
      },
    });
});
