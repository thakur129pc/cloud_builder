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
      action: 'loadVideo',
      prefix: !0,
      fileTypes: '@',
      maxFileSize: '@',
      disabled: '@disableVideoPreview',
    },
    {
      action: 'setVideo',
      name: '@videoPreviewName',
      disabled: '@disableVideoPreview',
    }
  ),
    e.widget('blueimp.fileupload', e.blueimp.fileupload, {
      options: { loadVideoFileTypes: /^video\/.*$/ },
      _videoElement: document.createElement('video'),
      processActions: {
        loadVideo: function (o, d) {
          if (d.disabled) return o;
          var t,
            l,
            n = o.files[o.index];
          return this._videoElement.canPlayType &&
            this._videoElement.canPlayType(n.type) &&
            ('number' !== e.type(d.maxFileSize) || n.size <= d.maxFileSize) &&
            (!d.fileTypes || d.fileTypes.test(n.type)) &&
            (t = i.createObjectURL(n))
            ? ((l = this._videoElement.cloneNode(!1)),
              (l.src = t),
              (l.controls = !0),
              (o.video = l),
              o)
            : o;
        },
        setVideo: function (e, i) {
          return (
            e.video &&
              !i.disabled &&
              (e.files[e.index][i.name || 'preview'] = e.video),
            e
          );
        },
      },
    });
});
