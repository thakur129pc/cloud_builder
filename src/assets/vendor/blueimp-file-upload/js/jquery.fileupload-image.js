!(function (e) {
  'use strict';
  'function' == typeof define && define.amd
    ? define(
        [
          'jquery',
          'load-image',
          'load-image-meta',
          'load-image-exif',
          'load-image-ios',
          'canvas-to-blob',
          './jquery.fileupload-process',
        ],
        e
      )
    : 'object' == typeof exports
      ? e(require('jquery'), require('load-image'))
      : e(window.jQuery, window.loadImage);
})(function (e, i) {
  'use strict';
  e.blueimp.fileupload.prototype.options.processQueue.unshift(
    {
      action: 'loadImageMetaData',
      disableImageHead: '@',
      disableExif: '@',
      disableExifThumbnail: '@',
      disableExifSub: '@',
      disableExifGps: '@',
      disabled: '@disableImageMetaDataLoad',
    },
    {
      action: 'loadImage',
      prefix: !0,
      fileTypes: '@',
      maxFileSize: '@',
      noRevoke: '@',
      disabled: '@disableImageLoad',
    },
    {
      action: 'resizeImage',
      prefix: 'image',
      maxWidth: '@',
      maxHeight: '@',
      minWidth: '@',
      minHeight: '@',
      crop: '@',
      orientation: '@',
      forceResize: '@',
      disabled: '@disableImageResize',
    },
    {
      action: 'saveImage',
      quality: '@imageQuality',
      type: '@imageType',
      disabled: '@disableImageResize',
    },
    { action: 'saveImageMetaData', disabled: '@disableImageMetaDataSave' },
    {
      action: 'resizeImage',
      prefix: 'preview',
      maxWidth: '@',
      maxHeight: '@',
      minWidth: '@',
      minHeight: '@',
      crop: '@',
      orientation: '@',
      thumbnail: '@',
      canvas: '@',
      disabled: '@disableImagePreview',
    },
    {
      action: 'setImage',
      name: '@imagePreviewName',
      disabled: '@disableImagePreview',
    },
    {
      action: 'deleteImageReferences',
      disabled: '@disableImageReferencesDeletion',
    }
  ),
    e.widget('blueimp.fileupload', e.blueimp.fileupload, {
      options: {
        loadImageFileTypes: /^image\/(gif|jpeg|png|svg\+xml)$/,
        loadImageMaxFileSize: 1e7,
        imageMaxWidth: 1920,
        imageMaxHeight: 1080,
        imageOrientation: !1,
        imageCrop: !1,
        disableImageResize: !0,
        previewMaxWidth: 80,
        previewMaxHeight: 80,
        previewOrientation: !0,
        previewThumbnail: !0,
        previewCrop: !1,
        previewCanvas: !0,
      },
      processActions: {
        loadImage: function (a, t) {
          if (t.disabled) return a;
          var n = this,
            s = a.files[a.index],
            r = e.Deferred();
          return ('number' === e.type(t.maxFileSize) &&
            s.size > t.maxFileSize) ||
            (t.fileTypes && !t.fileTypes.test(s.type)) ||
            !i(
              s,
              function (e) {
                e.src && (a.img = e), r.resolveWith(n, [a]);
              },
              t
            )
            ? a
            : r.promise();
        },
        resizeImage: function (a, t) {
          if (t.disabled || (!a.canvas && !a.img)) return a;
          t = e.extend({ canvas: !0 }, t);
          var n,
            s = this,
            r = e.Deferred(),
            o = (t.canvas && a.canvas) || a.img,
            d = function (e) {
              e &&
                (e.width !== o.width ||
                  e.height !== o.height ||
                  t.forceResize) &&
                (a[e.getContext ? 'canvas' : 'img'] = e),
                (a.preview = e),
                r.resolveWith(s, [a]);
            };
          if (a.exif) {
            if (
              (t.orientation === !0 &&
                (t.orientation = a.exif.get('Orientation')),
              t.thumbnail && (n = a.exif.get('Thumbnail')))
            )
              return i(n, d, t), r.promise();
            a.orientation
              ? delete t.orientation
              : (a.orientation = t.orientation);
          }
          return o ? (d(i.scale(o, t)), r.promise()) : a;
        },
        saveImage: function (i, a) {
          if (!i.canvas || a.disabled) return i;
          var t = this,
            n = i.files[i.index],
            s = e.Deferred();
          return i.canvas.toBlob
            ? (i.canvas.toBlob(
                function (e) {
                  e.name ||
                    (n.type === e.type
                      ? (e.name = n.name)
                      : n.name &&
                        (e.name = n.name.replace(
                          /\..+$/,
                          '.' + e.type.substr(6)
                        ))),
                    n.type !== e.type && delete i.imageHead,
                    (i.files[i.index] = e),
                    s.resolveWith(t, [i]);
                },
                a.type || n.type,
                a.quality
              ),
              s.promise())
            : i;
        },
        loadImageMetaData: function (a, t) {
          if (t.disabled) return a;
          var n = this,
            s = e.Deferred();
          return (
            i.parseMetaData(
              a.files[a.index],
              function (i) {
                e.extend(a, i), s.resolveWith(n, [a]);
              },
              t
            ),
            s.promise()
          );
        },
        saveImageMetaData: function (e, i) {
          if (!(e.imageHead && e.canvas && e.canvas.toBlob) || i.disabled)
            return e;
          var a = e.files[e.index],
            t = new Blob([e.imageHead, this._blobSlice.call(a, 20)], {
              type: a.type,
            });
          return (t.name = a.name), (e.files[e.index] = t), e;
        },
        setImage: function (e, i) {
          return (
            e.preview &&
              !i.disabled &&
              (e.files[e.index][i.name || 'preview'] = e.preview),
            e
          );
        },
        deleteImageReferences: function (e, i) {
          return (
            i.disabled ||
              (delete e.img,
              delete e.canvas,
              delete e.preview,
              delete e.imageHead),
            e
          );
        },
      },
    });
});
