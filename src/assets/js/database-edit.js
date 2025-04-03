$('.chosen-select').chosen();
$(document).ready(function () {
  // get cookies
  function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
  }

  // function to encrypt a string using XOR
  function encrypt(text, key) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const encryptedCharCode = charCode ^ key;
      result += String.fromCharCode(encryptedCharCode);
    }
    return result;
  }

  // decrypt
  function decrypt(encryptedText, key) {
    return encrypt(encryptedText, key); // XOR with the same key decrypts the text
  }

  // Search functionality
  $('#table-list tfoot th').each(function () {
    let title = $('#table-list thead th').eq($(this).index()).text().trim();
    if (title != '' && title) {
      $(this).html(
        '<input type="text" class="filter" placeholder="' + title + '" />'
      );
    }
  });

  // Search functionality
  $('#queries-list tfoot th').each(function () {
    let title = $('#queries-list thead th').eq($(this).index()).text().trim();
    if (title != '' && title) {
      $(this).html(
        '<input type="text" class="filter" placeholder="' + title + '" />'
      );
    }
  });

  // Numeric only control handler
  jQuery.fn.ForceNumericOnly = function () {
    return this.each(function () {
      $(this).keydown(function (e) {
        var key = e.charCode || e.keyCode || 0;
        // allow backspace, tab, delete, enter, arrows, numbers and keypad numbers ONLY
        // home, end, period, and numpad decimal
        return (
          key == 8 ||
          key == 9 ||
          key == 13 ||
          key == 46 ||
          key == 110 ||
          key == 190 ||
          (key >= 35 && key <= 40) ||
          (key >= 48 && key <= 57) ||
          (key >= 96 && key <= 105)
        );
      });
    });
  };
  // add data attribute for the fields you required only
  $('[data-field-number="true"]').ForceNumericOnly();
  $.getJSON('data/login-data.json', function (customerData) {
    $.getJSON('data/db-types.json', function (db_list) {
      let mainData = {};
      let db_types = [];
      db_types_init = db_list;
      $.getJSON('data/initial-database-details.json', function (initData) {
        if (localStorage.getItem('Link Data') !== null) {
          mainData = JSON.parse(localStorage.getItem('Link Data'));
        }

        // form serialize arr to json
        function SerializeArrToJson(formSerializeArr) {
          var jsonObj = {};
          jQuery.map(formSerializeArr, function (n, i) {
            if (n.name.endsWith('[]')) {
              var name = n.name;
              name = name.substring(0, name.length - 2);
              if (!(name in jsonObj)) {
                jsonObj[name] = [];
              }
              jsonObj[name].push(n.value);
            } else if (!n.name.endsWith('_length')) {
              // if (n.value != '') {
              jsonObj[n.name] = n.value;
              // }
            }
          });
          return jsonObj;
        }

        // retrieve local storage data
        if (localStorage.getItem('Link Data') !== null) {
          mainData = JSON.parse(localStorage.getItem('Link Data'));
        }

        $('#table-list')
          .DataTable({
            iDisplayLength: 25, // Set the default number of rows to display
            language: {
              info: 'Showing _START_ to _END_ of _TOTAL_ tables',
            },
            order: [[1, 'asc']], // Index 1 (second column), ascending order
          })
          .columns()
          .every(function () {
            var that = this;

            $('input', this.footer()).on('keyup change', function () {
              that.search(this.value).draw();
            });
          });
        tableDetails('table-list');

        $('#records-list')
          .DataTable({
            iDisplayLength: 25, // Set the default number of rows to display
          })
          .columns()
          .every(function () {
            var that = this;

            $('input', this.footer()).on('keyup change', function () {
              that.search(this.value).draw();
            });
          });
        tableDetails('records-list');

        var queriesTable = $('#queries-list')
          .DataTable({
            iDisplayLength: 25, // Set the default number of rows to display
            language: {
              info: 'Showing _START_ to _END_ of _TOTAL_ queries',
            },
          })
          .columns()
          .every(function () {
            var that = this;

            $('input', this.footer()).on('keyup change', function () {
              that.search(this.value).draw();
            });
          });
        tableDetails('queries-list');

        function tableDetails(selector) {
          let count = $('#' + selector)
            .DataTable()
            .column(0)
            .data().length;
          if (count > 10) {
            $('#' + selector + '_length').show();
            $('#' + selector + '_filter').show();
            $('#' + selector + '_info').show();
            $('#' + selector + '_paginate').show();
          } else {
            $('#' + selector + '_length').show();
            $('#' + selector + '_filter').show();
            $('#' + selector + '_info').show();
            $('#' + selector + '_paginate').hide();
          }
        }

        function format(id, query_name, desc, query) {
          return (
            '<table cellpadding="5" cellspacing="0" border="0" class="table-striped table-bordered table-hover data-child-row-order mt-lg"><tbody><tr><th width="45%"> Query Name or Description </th><th width="55%"> Query </th></tr>' +
            '<tr><td width="45%"> ' +
            desc +
            ' </td><td width="55%"> ' +
            query +
            ' </td></tr>' +
            '</tbody></table>'
          );
        }

        // initial variables
        let tableList = [];
        let reportList = [];
        let queriesList = [];
        let sub_schemas = [];
        let sub_schemas_status = [];

        // get id from url
        let url = window.location.href;
        if (url.indexOf('e=') !== -1) {
          let params = new URLSearchParams(window.location.search);
          let uniqueId = params.get('e');
          $('#uniqueId').val(uniqueId);

          if (localStorage.getItem('Link Data') !== null) {
            let rawData = JSON.parse(localStorage.getItem('Link Data'));
            let data = rawData[uniqueId];
            $('#current-view').text(data['dbName']);
            // add db types
            db_types =
              data['db_types'] != undefined ? data['db_types'] : db_types_init;

            let option =
              '<option value="">Select DB Type</option><option value="create"> Create DB Type </option><option disabled="" value="">-------</option>';
            $.each(db_types, function (key, value) {
              option += '<option value="' + value + '">' + value + '</option>';
            });
            // $('#dbType').html(option);
            // ('.chosen-select').trigger('chosen:updated');

            for (let key in data) {
              $(`[name="${key}"]`).val(data[key]);
            }
            $('.chosen-select').trigger('chosen:updated');

            tableList =
              data['tables'] != undefined ? data['tables'] : initData['tables'];
            reportList =
              data['reports'] != undefined
                ? data['reports']
                : initData['reports'];
            queriesList =
              data['queries'] != undefined
                ? data['queries']
                : initData['queries'];
            sub_schemas =
              data['sub_schemas'] != undefined
                ? data['sub_schemas']
                : initData['sub_schemas'];
            sub_schemas_status =
              data['sub_schemas_status'] != undefined
                ? data['sub_schemas_status']
                : initData['sub_schemas_status'];

            // add schema checkbox
            if (sub_schemas.length > 0) {
              let checkboxHtml = '';
              $.each(sub_schemas, function (key, item) {
                checkboxHtml += `<div class="form-group col-md-4 col-sm-4 col-xs-4"> <div class="checkbox c-checkbox"> <label class="normal-text"> <input type="checkbox" name="sub_schema[]" class="variant-toggle" value="${item}"> <span class="fa fa-check"></span> ${item} </label> </div> </div>`;
              });
              $('.sub-schema-checkbox-outer').html(checkboxHtml);
            }

            // table List adding
            if (tableList != undefined) {
              $('#table-list').DataTable().clear().draw();
              $k = 1;
              $.each(tableList, function (i, item) {
                const {
                  name,
                  description,
                  tag,
                  group,
                  db_permission,
                  number_of_records,
                  access_level,
                  sub_schema,
                } = item;
                let initTag = tag;
                let tagStatus = '';
                let initDesc = description;
                let descStatus = '';

                let html = `<tr data-id="${name}" data-desc="${initDesc}" data-tag="${initTag}" data-ai-access="${access_level}" class="table-list-inner"> <td width="7%" class="checkbox-div"> <div class="c-checkbox"> <label> <input type="checkbox"  name="sub_checkbox[]" class="checkall prompt_check"> <span class="fa fa-check"></span> </label> </div> </td> <td width="15%"> ${name} </td> <td width="34%" class="editText ${descStatus}" data-name="description"> ${initDesc} </td> <td width="15%"> ${sub_schema.join(', ')} </td> <td width="14%"> ${access_level ? 'Yes' : 'No'}  </td> <td width="15%" class="editText ${tagStatus}" data-name="tag"> ${initTag} </td><td><em class="edit-table-row icon add-icon mt0 icon-pencil"></em></td> </tr>`;
                $('#table-list').DataTable().row.add($(html)).draw();
                $k++;
              });
            }

            // records table data adding
            if (reportList != undefined) {
              $('#records-list').DataTable().clear().draw();
              $.each(reportList, function (i, item) {
                const { name, description, key_points } = item;
                let html = `<tr data-id="${name}"> <td> ${name} </td> <td> ${description} </td> <td> ${key_points} </td> </tr>`;
                $('#records-list').DataTable().row.add($(html)).draw();
              });
            }

            // queries table data adding
            if (queriesList != undefined) {
              $('#queries-list').DataTable().clear().draw();
              $.each(queriesList, function (i, item) {
                const { query_id, query_name, query_desc, fine_tuned, query } =
                  item;
                let html = `<tr data-id="${query_id}" data-query-name="${query_name}" data-fine-tuned="${fine_tuned}" data-desc="${query_desc}" data-query="${query}"> <td> ${query_id} </td> <td> ${query_name} </td> <td> ${fine_tuned} </td> <td class=" no-filter details-control" width="5%"></td> </tr>`;
                $('#queries-list').DataTable().row.add($(html)).draw();
              });
            }

            tableDetails('table-list');
            tableDetails('records-list');
            tableDetails('queries-list');

            // Add event listener for opening and closing details
            $('#queries-list tbody').on(
              'click',
              'td.details-control',
              function () {
                let tr = $(this).closest('tr');
                let query_id = $(this).closest('tr').attr('data-id');
                let query_name = $(this).closest('tr').attr('data-query-name');
                let desc = $(this).closest('tr').attr('data-desc');
                let query = $(this).closest('tr').attr('data-query');

                let row = queriesTable.row(tr);
                if (row.child.isShown()) {
                  // This row is already open - close it
                  row.child.hide();
                  tr.removeClass('shown');
                } else {
                  // Open this row
                  row.child(format(query_id, query_name, desc, query)).show();
                  tr.addClass('shown');
                }
              }
            );

            // link or save database functionality
            $('.link-btn').on('click', function () {
              let Form = $('#application_form');
              let FormInstance = Form.parsley();
              FormInstance.validate();
              let data = SerializeArrToJson(Form.serializeArray());
              if (FormInstance.isValid()) {
                data['tables'] = tableList;
                data['reports'] = reportList;
                data['queries'] = queriesList;
                data['db_types'] = db_types;
                data['sub_schemas'] = sub_schemas;
                data['sub_schemas_status'] = sub_schemas_status;
                mainData[data['uniqueId']] = data;
                localStorage.setItem('Link Data', JSON.stringify(mainData));
                window.location.href = `database-view.html?v=${data['uniqueId']}`;
              }
            });
          }
        }

        // update data global
        function updateLocalData() {
          let Form = $('#application_form');
          let data = SerializeArrToJson(Form.serializeArray());
          data['tables'] = tableList;
          data['reports'] = reportList;
          data['queries'] = queriesList;
          data['db_types'] = db_types;
          data['sub_schemas'] = sub_schemas;
          data['sub_schemas_status'] = sub_schemas_status;
          mainData[data['uniqueId']] = data;
          localStorage.setItem('Link Data', JSON.stringify(mainData));
        }

        // add report functionality
        $('.add-report-btn').on('click', function () {
          $('#add-new-report-popup').modal('show');
        });

        // add query functionality
        $('.add-query-btn').on('click', function () {
          $('#add-new-query-popup').modal('show');
        });

        function uppy_create($id, $class, $limit) {
          // ----function starts--- //
          const Dashboard = Uppy.Dashboard;
          const Instagram = Uppy.Instagram;
          const Facebook = Uppy.Facebook;
          const ImageEditor = Uppy.ImageEditor;
          const Tus = Uppy.Tus;
          const DropTarget = Uppy.DropTarget;
          const GoldenRetriever = Uppy.GoldenRetriever;
          const XHRUpload = Uppy.XHRUpload;

          const uppy = new Uppy.Core({
            id: $id,
            autoProceed: false,
            allowMultipleUploads: true,
            debug: false,
            restrictions: {
              maxFileSize: 1000000,
              minFileSize: null,
              maxTotalFileSize: null,
              maxNumberOfFiles: $limit,
              minNumberOfFiles: 1,
              allowedFileTypes: [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              ],
            },
            meta: {},
            onBeforeFileAdded: (currentFile, files) => currentFile,
            onBeforeUpload: (files) => {},
            locale: {},
            infoTimeout: 5000,
          })
            .use(Dashboard, {
              trigger: '.UppyModalOpenerBtn',
              inline: true,
              target: $class,
              replaceTargetContent: true,
              showProgressDetails: true,
              height: 470,
              browserBackButtonClose: false,
              proudlyDisplayPoweredByUppy: false,
            })
            .use(DropTarget, { target: document.body })
            .use(GoldenRetriever)

            .use(ImageEditor, {
              target: Dashboard,
              id: 'ImageEditor',
              quality: 0.8,
              cropperOptions: {
                viewMode: 1,
                guides: false,
                zoomable: false,
                cropBoxResizable: false,
                background: false,
                responsive: true,
                aspectRatio: 1 / 1.618,
                //autoCropArea: 1.618
              },
              actions: {
                revert: false,
                rotate: false,
                granularRotate: false,
                flip: false,
                zoomIn: false,
                zoomOut: false,
                cropSquare: true,
                cropWidescreen: true,
                cropWidescreenVertical: true,
              },
            });
          uppy.use(XHRUpload, {
            endpoint: '/database-edit.html',
            method: 'get',
          });

          // upload succes event
          uppy.on('upload-success', (file, response) => {});

          uppy.on('upload-error', (file, error, response) => {});

          // upload complete event
          uppy.on('complete', (result) => {
            let value = {};
            for (let i = 0; i < result['successful'].length; i++) {
              const data = result['successful'][i].data;
              const fileName = result['successful'][i].name;

              var fileReader = new FileReader();
              fileReader.readAsDataURL(data);
              fileReader.onload = function (e) {
                let uoid = $('#uniqueId').val();

                let fileData = e.target.result;
                let obj = { fileName, fileData };
                let name = $(document)
                  .find('.clicked')
                  .children('input')
                  .attr('name');
                $(document)
                  .find('.clicked')
                  .children('input')
                  .val(fileName)
                  .attr('data-file64', fileData);
                $(document)
                  .find('.uppy-StatusBar-actionBtn--done')
                  .trigger('click');
                $(document).find('.uppy_close_button').trigger('click');
              };
            }
          });
        } // ----function end--- //

        uppy_create('report_file_uploader', '.uppy_container1', 1);

        $('[data-target="#uppy-popup-modal"]').on('click', function () {
          $('[data-target="#uppy-popup-modal"]').removeClass('clicked');
          $(this).addClass('clicked');
        });

        // add query functionality
        $('#add_query_btn').on('click', function () {
          let Form = $('.add-new-query-form');
          let FormInstance = Form.parsley();
          FormInstance.validate();
          let data = SerializeArrToJson(Form.serializeArray());
          if (FormInstance.isValid()) {
            let query_id = Math.floor(200 + Math.random() * 100);
            let { query_name, query_desc, fine_tuned, query } = data;
            queriesList.push({ ...data, query_id });

            let html = `<tr data-id="${query_id}" data-query-name="${query_name}" data-fine-tuned="${fine_tuned}" data-desc="${query_desc}" data-query="${query}"> <td> ${query_id} </td> <td> ${query_name} </td> <td> ${fine_tuned} </td> <td class=" no-filter details-control" width="5%"></td> </tr>`;
            $('#queries-list').DataTable().row.add($(html)).draw();
            Form.trigger('reset');
            $('.chosen-select').trigger('chosen:updated');
            $('#add-new-query-popup').modal('hide');
            updateLocalData();
          }
        });

        // add report database functionality
        $('#add_report_btn').on('click', function () {
          let Form = $('.add-new-report-form');
          let FormInstance = Form.parsley();
          FormInstance.validate();
          $('[name="report_file"]').prop('disabled', false);
          let data = SerializeArrToJson(Form.serializeArray());
          $('[name="report_file"]').prop('disabled', true);
          if (FormInstance.isValid()) {
            let attached_file = $('[name="report_file"]').attr('data-file64');
            reportList.push({ ...data, attached_file });
            const { name, description, key_points } = data;
            let html = `<tr data-id="${name}"> <td> ${name} </td> <td> ${description} </td> <td> ${key_points} </td> </tr>`;
            $('#records-list').DataTable().row.add($(html)).draw();

            Form.trigger('reset');
            $('.chosen-select').trigger('chosen:updated');
            $('#add-new-report-popup').modal('hide');
            updateLocalData();
          }
        });

        // table: input and text functionality
        var old_text = '';

        // revert old data in table
        $(document).on('mousedown', '.text_price_close', function () {
          var old_text = $(this)
            .parents('td.editText.active')
            .find('input')
            .attr('data-old_edit_text');
          $(this).parents('td.editText').removeClass('active');
          if (old_text != '' && old_text != null) {
            $(this).parents('td.editText').html(old_text);
          } else {
            $(this).parents('td.editText').html('');
          }
        });

        // access level change functionality
        $(document).on('change', '[name="access-level-dd"]', function () {
          let val = $(this).val();
          let id = $(this).parents('tr.table-list-inner').attr('data-id');
          let key = 'access_level';
          tableList = tableList.map((item, i) => {
            if (item.name == id) {
              item[key] = val;
              return item;
            } else {
              return item;
            }
          });
        });

        // save table data as per category wise
        $(document).on('blur', 'input[name="edit__value"]', function (e) {
          let val = $(this).val();
          let id = $(this).parents('tr.table-list-inner').attr('data-id');
          let key = $(this).parents('td.editText').attr('data-name');
          if (val != '' && val != null && val) {
            $(this).parents('td.editText').removeClass('active');

            if (e.target.name != 'edit__value') {
              $(this).parents('td.editText').html(parseFloat(val).toFixed(2));
            } else {
              tableList = tableList.map((item, i) => {
                if (item.name == id) {
                  item[key] = val;
                  return item;
                } else {
                  return item;
                }
              });
              $(this).parents('td.editText').html(val);
            }
          } else {
            $(this).parents('td.editText').removeClass('active');
            if (e.target.name != 'edit__value') {
              $(this).parents('td.editText').html('0.00');
            } else {
              tableList = tableList.map((item, i) => {
                if (item.name == id) {
                  item[key] = val;
                  return item;
                } else {
                  return item;
                }
              });
              $(this).parents('td.editText').html('');
            }
          }
        });

        // group functionality
        $('#main_checkbox').on('click', function () {
          let status = $(this).is(':checked');
          tableList = tableList.map((item, i) => {
            item['checkbox'] = status;
            return item;
          });

          // table List adding
          if (tableList != undefined) {
            $('#table-list').DataTable().clear().draw();
            $.each(tableList, function (i, item) {
              const {
                name,
                description,
                checkbox,
                tag,
                group,
                db_permission,
                number_of_records,
                access_level,
                sub_schema,
              } = item;
              let initTag = tag;
              let tagStatus = '';
              let initDesc = description;
              let descStatus = '';
              let html = `<tr data-id="${name}" class="table-list-inner" data-desc="${initDesc}" data-tag="${initTag}" data-ai-access="${access_level}"><td width="7%" class="checkbox-div"> <div class="c-checkbox"> <label> <input type="checkbox" ${checkbox ? 'checked' : ''} name="sub_checkbox[]" class="checkall prompt_check"> <span class="fa fa-check"></span> </label> </div> </td> <td width="15%"> ${name} </td> <td width="34%" class="editText ${descStatus}" data-name="description"> ${initDesc} </td> <td width="15%"> ${sub_schema.join(', ')} </td> <td width="14%"> ${access_level ? 'Yes' : 'No'} </td><td width="15%" class="editText ${tagStatus}" data-name="tag"> ${initTag} </td><td><em class="edit-table-row icon add-icon mt0 icon-pencil"></em></td> </tr>`;
              $('#table-list').DataTable().row.add($(html)).draw();
            });
          }
          if (status) {
            $('.add-sub-schema-btn').show();
          } else {
            $('.add-sub-schema-btn').hide();
          }
        });

        // icons enable functionality
        $(document).on('click', '[name="sub_checkbox[]"]', function () {
          let id = $(this).parents('tr').attr('data-id');
          let status = $(this).is(':checked');
          let checked = [];
          tableList = tableList.map((item, i) => {
            if (item.name == id) {
              item['checkbox'] = status;
              checked.push(item['checkbox']);
              return item;
            } else {
              checked.push(item['checkbox']);
              return item;
            }
          });
          let len = checked.filter((v) => v === true).length;
          if (len >= 1) {
            $('.add-sub-schema-btn').show();
          } else {
            $('.add-sub-schema-btn').hide();
          }
        });

        // schema popup functionality
        $('.add-sub-schema-btn').on('click', function () {
          $('.add-new-subschema-form').trigger('reset');
          $(document).find('[name="sub_schema[]"]').prop('disabled', false);
          $('[name="sub_schema"]').prop({ disabled: false, required: true });
          $('#add-new-subschema-popup').modal('show');
        });

        // create group input field disable functionality
        $(document).on('click', '[name="sub_schema[]"]', function () {
          let checked = [];
          $(document)
            .find('[name="sub_schema[]"]')
            .each(function () {
              let status = $(this).is(':checked');
              checked.push(status);
            });
          let len = checked.filter((v) => v === true).length;
          if (len >= 1) {
            $('[name="sub_schema"]').prop({ disabled: true, required: false });
          } else {
            $('[name="sub_schema"]').prop({ disabled: false, required: true });
          }
        });

        // create group checkbox disable functionality
        $('[name="sub_schema"]').on('input', function () {
          let value = $(this).val();
          if (value.length > 0) {
            $(document).find('[name="sub_schema[]"]').prop('disabled', true);
          } else {
            $(document).find('[name="sub_schema[]"]').prop('disabled', false);
          }
        });

        // save group to local storage.
        function saveSubSchema(data, value) {
          tableList = tableList.map((item, i) => {
            if (item['checkbox'] == true) {
              item['sub_schema'].push(value);
            }
            item['checkbox'] = false;
            return item;
          });
          data['tables'] = tableList;
          data['reports'] = reportList;
          data['queries'] = queriesList;
          data['sub_schemas'] = sub_schemas;
          data['sub_schemas_status'] = sub_schemas_status;
          mainData[data['uniqueId']] = data;
          localStorage.setItem('Link Data', JSON.stringify(mainData));
        }

        function tableUpdate() {
          // table List adding
          if (tableList != undefined) {
            $('#table-list').DataTable().clear().draw();
            $.each(tableList, function (i, item) {
              const {
                name,
                description,
                checkbox,
                tag,
                group,
                db_permission,
                number_of_records,
                access_level,
                sub_schema,
              } = item;
              let initTag = tag;
              let tagStatus = '';
              let initDesc = description;
              let descStatus = '';
              let html = `<tr data-id="${name}" class="table-list-inner" data-desc="${initDesc}" data-tag="${initTag}" data-ai-access="${access_level}"> <td width="7%" class="checkbox-div"> <div class="c-checkbox"> <label> <input type="checkbox" ${checkbox ? 'checked' : ''} name="sub_checkbox[]" class="checkall prompt_check"> <span class="fa fa-check"></span> </label> </div> </td> <td width="15%"> ${name} </td> <td width="34%" class="editText ${descStatus}" data-name="description"> ${initDesc} </td> <td width="15%"> ${sub_schema.join(', ')} </td> <td width="14%"> ${access_level ? 'Yes' : 'No'} </td><td width="15%" class="editText ${tagStatus}" data-name="tag"> ${initTag} </td><td><em class="edit-table-row icon add-icon mt0 icon-pencil"></em></td> </tr>`;
              $('#table-list').DataTable().row.add($(html)).draw();
            });
            $('[name="main_checkbox[]"]').prop('checked', false);
          }
        }
        $('#add_group_btn').on('click', function () {
          let Form = $('.add-new-subschema-form');
          let FormInstance = Form.parsley();
          FormInstance.validate();
          let data = SerializeArrToJson(Form.serializeArray());
          let uid = $('#uniqueId').val();

          if (FormInstance.isValid()) {
            let value = data['sub_schema'];
            console.log('value: ', value);
            if (Array.isArray(value)) {
              $('.error-text').text('');
              let Form = $('#application_form');
              let FormInstance = Form.parsley();
              FormInstance.validate();
              let data = SerializeArrToJson(Form.serializeArray());
              if (FormInstance.isValid()) {
                // saveSubSchema(data, value);
                $.each(value, function (key, items) {
                  tableList = tableList.map((item, i) => {
                    if (item['checkbox'] == true) {
                      if (!item['sub_schema'].includes(items)) {
                        item['sub_schema'].push(items);
                      }
                    }
                    return item;
                  });
                });
                tableList = tableList.map((item, i) => {
                  item['checkbox'] = false;
                  return item;
                });
                data['tables'] = tableList;
                data['reports'] = reportList;
                data['queries'] = queriesList;
                data['sub_schemas'] = sub_schemas;
                data['sub_schemas_status'] = sub_schemas_status;
                mainData[data['uniqueId']] = data;
                localStorage.setItem('Link Data', JSON.stringify(mainData));
              }

              tableUpdate();
              $('.add-sub-schema-btn').hide();
              $('#add-new-subschema-popup').modal('hide');
            } else {
              $('.error-text').text('');
              if (!sub_schemas.includes(value)) {
                // random number generator
                function randomString() {
                  //generate random number
                  var randomNumber = Math.floor(100 + Math.random() * 100);
                  return randomNumber;
                }
                sub_schemas_status.push({
                  id: randomString(),
                  name: value,
                  status: 'Active',
                });
                sub_schemas.push(value);
                let Form = $('#application_form');
                let FormInstance = Form.parsley();
                FormInstance.validate();
                let data = SerializeArrToJson(Form.serializeArray());
                if (FormInstance.isValid()) {
                  saveSubSchema(data, value);
                }

                tableUpdate();
                // add schema checkbox
                if (sub_schemas.length > 0) {
                  let checkboxHtml = '';
                  $.each(sub_schemas, function (key, item) {
                    checkboxHtml += `<div class="form-group col-md-4 col-sm-4 col-xs-4"> <div class="checkbox c-checkbox"> <label class="normal-text"> <input type="checkbox" name="sub_schema[]" class="variant-toggle" value="${item}"> <span class="fa fa-check"></span> ${item} </label> </div> </div>`;
                  });
                  $('.sub-schema-checkbox-outer').html(checkboxHtml);
                }
                $('.add-sub-schema-btn').hide();
                $('#add-new-subschema-popup').modal('hide');
              } else {
                Form.trigger('reset');
                $('.error-text').text(
                  'Sub Schema already exists. Please Rename.'
                );
              }
            }
          }
        });

        // new db type adding functionality
        $('[name="dbType"]').on('change', function () {
          let value = $(this).val();
          if (value == 'create') {
            $('#add_new_db_type_modal').modal('show');
          }
        });

        $('button.add_new_db_type').click(function (event) {
          event.preventDefault();
          let form = $('#add_new_db_type_form');
          let data = SerializeArrToJson(form.serializeArray());
          form.parsley().validate();
          if (form.parsley().isValid()) {
            const { db_type_name } = data;
            db_types.push(db_type_name);
            $('#dbType').find('option').attr('selected', false);
            $('#dbType').append(
              '<option value="' +
                db_type_name +
                '" selected>' +
                db_type_name +
                '</option>'
            );
            $('#add_new_db_type_modal').modal('hide');
            form.trigger('reset');
            $('.chosen-select').trigger('chosen:updated');
          }
        });

        $(document).on('click', '.payment-terms-modal-close', function () {
          $('[name="dbType"]').val('');
          $('.chosen-select').trigger('chosen:updated');
          $('#add_new_db_type_modal').modal('hide');
        });

        $('.chosen-select').trigger('chosen:updated');

        // version edit warning
        $(document).on('focus', '.readonly-field', function (e) {
          e.preventDefault();

          $('#warning-popup').modal('show');
        });
        $('#change_version_btn').on('click', function () {
          $('[name="dbTypeVersion"]').removeClass('readonly-field');
          $('#warning-popup').modal('hide');
          $('[name="dbTypeVersion"]').trigger('focus');
        });

        // de-link functionality
        $('.de-link-btn').on('click', function () {
          $('#alert_popup').modal('show');
          $('#confirm_login').addClass('de-link-active');
          $('#confirm_login').removeClass('link-active');
        });

        // link functionality
        $('.link-database-btn').on('click', function () {
          $('#alert_popup').modal('show');
          $('#confirm_login').removeClass('de-link-active');
          $('#confirm_login').addClass('link-active');
        });

        // confirm login functionality for de-link
        $(document).on('click', '#confirm_login', function () {
          $('.default_selection_error').text('');
          let Form = $('#login_alert_form');
          let FormInstance = Form.parsley();
          FormInstance.validate();
          let data = SerializeArrToJson(Form.serializeArray());
          if (FormInstance.isValid()) {
            let { loginPwd } = data;
            if (getCookie('logged-in') !== null) {
              // Function to decrypt an encrypted string using XOR
              let encryptedText = JSON.parse(getCookie('logged-in'));
              let encryptionKey = 37;
              const decryptedText = decrypt(encryptedText, encryptionKey);

              let userData = customerData.filter((item) => {
                if (item.id === decryptedText) {
                  return item;
                }
              });

              if ($('#confirm_login').hasClass('de-link-active')) {
                if (userData.length > 0) {
                  let pwd = userData[0]['password'];
                  if (loginPwd === pwd) {
                    $('.de-link-btn').addClass('hidden');
                    $('.link-database-btn').removeClass('hidden');
                    $('.pause-btn, .refresh-btn').attr('disabled', true);
                    $('#alert_popup').modal('hide');
                    Form.trigger('reset');
                  } else {
                    $('.default_selection_error').text('Password not match!');
                  }
                }
              } else if ($('#confirm_login').hasClass('link-active')) {
                if (userData.length > 0) {
                  let pwd = userData[0]['password'];
                  if (loginPwd === pwd) {
                    $('.de-link-btn').removeClass('hidden');
                    $('.link-database-btn').addClass('hidden');
                    $('.pause-btn, .refresh-btn').attr('disabled', false);
                    $('#alert_popup').modal('hide');
                    Form.trigger('reset');
                  } else {
                    $('.default_selection_error').text('Password not match!');
                  }
                }
              }
            }
          }
        });

        $('#alert_popup_cancel_btn').on('click', function () {
          let Form = $('#login_alert_form');
          $('.default_selection_error').text('');
          $('#alert_popup').modal('hide');
          Form.trigger('reset');
        });

        // modify table list
        $(document).on('click', '.edit-table-row', function () {
          $('#table-list')
            .find('tr.table-list-inner')
            .removeClass('row-modify-active');
          $(this).parents('tr.table-list-inner').addClass('row-modify-active');
          let tag = $(this).parents('tr.table-list-inner').attr('data-tag');
          let desc = $(this).parents('tr.table-list-inner').attr('data-desc');
          let ai_access = JSON.parse(
            $(this).parents('tr.table-list-inner').attr('data-ai-access')
          );

          $('.modify-table-row-form').find('[name="tagName"]').val(tag);
          $('.modify-table-row-form').find('[name="description"]').val(desc);
          $('.modify-table-row-form')
            .find('[name="AI-access-level-btn"]')
            .prop('checked', ai_access)
            .change();

          $('#modify-table-row-popup').modal('show');
        });

        // add modified row to table
        $(document).on('click', '#add_modify_row', function () {
          let Form = $('.modify-table-row-form');
          let FormInstance = Form.parsley();
          FormInstance.validate();
          let data = SerializeArrToJson(Form.serializeArray());
          data['AI-access-level-btn'] = $('[name="AI-access-level-btn"]').is(
            ':checked'
          );

          let modifiedRow = $(document)
            .find('tr.row-modify-active')
            .attr('data-id');

          if (FormInstance.isValid()) {
            tableList = tableList.map((item, i) => {
              if (item.name === modifiedRow) {
                item['tag'] = data['tagName'];
                item['access_level'] = data['AI-access-level-btn'];
                item['description'] = data['description'];
                return item;
              } else {
                return item;
              }
            });
            tableUpdate();
            let MainForm = $('#application_form');
            let main_data = SerializeArrToJson(MainForm.serializeArray());

            main_data['tables'] = tableList;
            main_data['reports'] = reportList;
            main_data['queries'] = queriesList;
            main_data['sub_schemas'] = sub_schemas;
            main_data['sub_schemas_status'] = sub_schemas_status;
            mainData[main_data['uniqueId']] = main_data;
            localStorage.setItem('Link Data', JSON.stringify(mainData));

            $('#modify-table-row-popup').modal('hide');
          }
        });

        // checkbox check functionality
        $(document).on('click', '.checkbox-div', function (e) {
          if ($(e.target).is('input[type="checkbox"]')) {
            // If the click was directly on the checkbox, do nothing here, let it perform its default behavior.
            return;
          }

          e.stopImmediatePropagation(); // Stop the event from propagating further
          var checkbox = $(this).find('input[type="checkbox"]');

          checkbox.trigger('click'); // Toggle the checkbox state
        });
        $(document).on('click', '.checkbox-div span', function (e) {
          e.stopImmediatePropagation(); // Stop the event from propagating further
          var checkbox = $(this).find('input[type="checkbox"]');

          checkbox.trigger('click'); // Toggle the checkbox state
        });
      }); // initial data json end
    });
  });
}); // document ready end
