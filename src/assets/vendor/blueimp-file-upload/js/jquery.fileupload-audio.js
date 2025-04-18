!(function (e) {
  'use strict';
  'function' == typeof define && define.amd
    ? define(['jquery', 'load-image', './jquery.fileupload-process'], e)
    : 'object' == typeof exports
      ? e(require('jquery'), require('load-image'))
      : e(window.jQuery, window.loadImage);
})(function (e, i) {
  'use strict';
  e.blueimp.fileupload.prototype.options.processQueue.unshift(
    {
      action: 'loadAudio',
      prefix: !0,
      fileTypes: '@',
      maxFileSize: '@',
      disabled: '@disableAudioPreview',
    },
    {
      action: 'setAudio',
      name: '@audioPreviewName',
      disabled: '@disableAudioPreview',
    }
  ),
    e.widget('blueimp.fileupload', e.blueimp.fileupload, {
      options: { loadAudioFileTypes: /^audio\/.*$/ },
      _audioElement: document.createElement('audio'),
      processActions: {
        loadAudio: function (o, d) {
          if (d.disabled) return o;
          var a,
            t,
            u = o.files[o.index];
          return this._audioElement.canPlayType &&
            this._audioElement.canPlayType(u.type) &&
            ('number' !== e.type(d.maxFileSize) || u.size <= d.maxFileSize) &&
            (!d.fileTypes || d.fileTypes.test(u.type)) &&
            (a = i.createObjectURL(u))
            ? ((t = this._audioElement.cloneNode(!1)),
              (t.src = a),
              (t.controls = !0),
              (o.audio = t),
              o)
            : o;
        },
        setAudio: function (e, i) {
          return (
            e.audio &&
              !i.disabled &&
              (e.files[e.index][i.name || 'preview'] = e.audio),
            e
          );
        },
      },
    });
});
