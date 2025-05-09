!(function (e) {
  'use strict';
  (e.FileDialog = function (a) {
    var o = e.extend(e.FileDialog.defaults, a),
      t = e(
        [
          " <div class='modal fade' id='custom-modal'>",
          "    <div class='modal-dialog'>",
          "        <div class='modal-content'> <form  method='post'    data-parsley-validate=''>",
          "            <div class='modal-header'>",
          "                <button type='button' class='close' data-dismiss='modal'>",
          "                    <span aria-hidden='true'>&times;</span>",
          "                    <span class='sr-only'>",
          o.cancelButton,
          '                    </span>',
          '                </button>',
          "                <h4 class='modal-title'>",
          o.title,
          '                </h4>',
          '            </div>',
          "            <div class='modal-body pt0 pb0'>",
          " <div class='row mt-lg'> <div class='form-group col-md-12'>",
          "<label> Audience name <span class='mandatory'> * </span> </label>",
          "<input type='text' class='form-control audiencelistNameImport' placeholder='Enter audience list name'  required data-parsley-required-message='Enter audience name'  /> <ul class='error-toggle hidden'><li class='parsley-required'>Enter audience name</li></ul> ",
          '</div>',
          "<div class='pb-sm col-md-12'>",
          '<label> Description </label>',
          "<textarea cols='10' rows='3' class='form-control'></textarea>",
          '</div>',
          "</div>             <input type='file'  style='display:none;' />",
          "                <div class='bfd-dropfield pt-sm'>",
          "                    <div class='bfd-dropfield-inner'>",
          o.dragMessage,
          '                    </div>',
          "        </div>       <div class='form-group1'> <a href=",
          o.csvdownhref,
          " target='_blank' >",
          o.sampletext,
          '</a> </div> ',
          "                <div class='container-fluid bfd-files'>",
          '</div>',
          '            </div>',
          "            <div class='modal-footer'>",
          '<a href=',
          o.linkhref,
          " class='btn btn-primary'>",
          o.linktext,
          '</a>',
          "                <button type='button' class='btn btn-default bfd-cancel'",
          "                                data-dismiss='modal'>",
          o.cancelButton,
          '                </button>',
          "<button type='button' class='btn btn-primary bfd-ok'>",
          o.okButton,
          '</button>',
          '            </div>',
          '        </div>  </form>',
          '    </div>',
          '</div>',
        ].join('')
      ),
      n = !1,
      i = e('input:file', t),
      r = e('.bfd-dropfield', t),
      s = e('.bfd-dropfield-inner', r);
    s.css({
      height: o.dropheight,
      'padding-top': o.dropheight / 2 - 32,
    }),
      i.attr({
        accept: o.accept,
        multiple: o.multiple,
      }),
      r.on('click.bfd', function () {
        i.trigger('click');
      });
    var d = [],
      l = [],
      c = function (a) {
        var n,
          i,
          r = new FileReader();
        l.push(r),
          (r.onloadstart = function () {}),
          (r.onerror = function (e) {
            e.target.error.code !== e.target.error.ABORT_ERR &&
              n
                .parent()
                .html(
                  [
                    "<div class='bg-danger bfd-error-message'>",
                    o.errorMessage,
                    '</div>',
                  ].join('\n')
                );
          }),
          (r.onprogress = function (a) {
            var o = Math.round((100 * a.loaded) / a.total) + '%';
            n.attr('aria-valuenow', a.loaded),
              n.css('width', o),
              e('.sr-only', n).text(o);
          }),
          (r.onload = function (e) {
            (a.content = e.target.result), d.push(a), n.removeClass('active');
          });
        var s = e(
          [
            "<div class='col-xs-7 col-sm-4 bfd-info'>",
            "    <span class='glyphicon glyphicon-remove bfd-remove'></span>&nbsp;",
            "    <span class='glyphicon glyphicon-file'></span>&nbsp;" + a.name,
            '</div>',
            "<div class='col-xs-5 col-sm-8 bfd-progress'>",
            "    <div class='progress'>",
            "        <div class='progress-bar progress-bar-striped active' role='progressbar'",
            "            aria-valuenow='0' aria-valuemin='0' aria-valuemax='" +
              a.size +
              "'>",
            "            <span class='sr-only'>0%</span>",
            '        </div>',
            '    </div>',
            '</div>',
          ].join('')
        );
        (n = e('.progress-bar', s)),
          e('.bfd-remove', s)
            .tooltip({
              container: 'body',
              html: !0,
              placement: 'top',
              title: o.removeMessage,
            })
            .on('click.bfd', function () {
              r.abort();
              var e = d.indexOf(a);
              e >= 0 && d.pop(e), i.fadeOut();
            }),
          (i = e("<div class='row'></div>")),
          i.append(s),
          e('.bfd-files', t).append(i),
          r['readAs' + o.readAs](a);
      },
      f = function (e) {
        Array.prototype.forEach.apply(e, [c]);
      };
    return (
      i.change(function (e) {
        e = e.originalEvent;
        var a = e.target.files;
        f(a);
        var o = i.clone(!0);
        i.replaceWith(o), (i = o);
      }),
      r
        .on('dragenter.bfd', function () {
          s.addClass('bfd-dragover');
        })
        .on('dragover.bfd', function (e) {
          (e = e.originalEvent),
            e.stopPropagation(),
            e.preventDefault(),
            (e.dataTransfer.dropEffect = 'copy');
        })
        .on('dragleave.bfd drop.bfd', function () {
          s.removeClass('bfd-dragover');
        })
        .on('drop.bfd', function (e) {
          (e = e.originalEvent), e.stopPropagation(), e.preventDefault();
          var a = e.dataTransfer.files;
          0 === a.length, f(a);
        }),
      e('.bfd-ok', t).on('click.bfd', function () {
        var a = e.Event('files.bs.filedialog');
        (a.files = d), t.trigger(a), (n = !0); // t.modal("hide")
        //  Validate the form
        // alert($(".audiencelistNameImport").val());
        if ($('.audiencelistNameImport').val() == '') {
          $('.error-toggle').removeClass('hidden');
        } else {
          $('.error-toggle').addClass('hidden');
          t.modal('hide');
        }
      }),
      t.on('hidden.bs.modal', function () {
        if (
          (l.forEach(function (e) {
            e.abort();
          }),
          !n)
        ) {
          var a = e.Event('cancel.bs.filedialog');
          t.trigger(a);
        }
        t.remove();
      }),
      e(document.body).append(t),
      t.modal(),
      t
    );
  }),
    (e.FileDialog.defaults = {
      accept: '*',
      cancelButton: 'Close',
      dragMessage: 'Drop files here',
      dropheight: 400,
      errorMessage: 'An error occured while loading file',
      multiple: !0,
      okButton: 'OK',
      readAs: 'DataURL',
      removeMessage: 'Remove&nbsp;file',
      title: 'Load file(s)',
    });
})(jQuery);
