!(function (t) {
  'use strict';
  var e = t.HTMLCanvasElement && t.HTMLCanvasElement.prototype,
    n =
      t.Blob &&
      (function () {
        try {
          return Boolean(new Blob());
        } catch (t) {
          return !1;
        }
      })(),
    o =
      n &&
      t.Uint8Array &&
      (function () {
        try {
          return 100 === new Blob([new Uint8Array(100)]).size;
        } catch (t) {
          return !1;
        }
      })(),
    r =
      t.BlobBuilder ||
      t.WebKitBlobBuilder ||
      t.MozBlobBuilder ||
      t.MSBlobBuilder,
    i =
      (n || r) &&
      t.atob &&
      t.ArrayBuffer &&
      t.Uint8Array &&
      function (t) {
        var e, i, a, l, u, B;
        for (
          e =
            t.split(',')[0].indexOf('base64') >= 0
              ? atob(t.split(',')[1])
              : decodeURIComponent(t.split(',')[1]),
            i = new ArrayBuffer(e.length),
            a = new Uint8Array(i),
            l = 0;
          l < e.length;
          l += 1
        )
          a[l] = e.charCodeAt(l);
        return (
          (u = t.split(',')[0].split(':')[1].split(';')[0]),
          n
            ? new Blob([o ? a : i], { type: u })
            : ((B = new r()), B.append(i), B.getBlob(u))
        );
      };
  t.HTMLCanvasElement &&
    !e.toBlob &&
    (e.mozGetAsFile
      ? (e.toBlob = function (t, n, o) {
          t(
            o && e.toDataURL && i
              ? i(this.toDataURL(n, o))
              : this.mozGetAsFile('blob', n)
          );
        })
      : e.toDataURL &&
        i &&
        (e.toBlob = function (t, e, n) {
          t(i(this.toDataURL(e, n)));
        })),
    'function' == typeof define && define.amd
      ? define(function () {
          return i;
        })
      : (t.dataURLtoBlob = i);
})(this);
