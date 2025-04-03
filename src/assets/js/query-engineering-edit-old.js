$(document).ready(function () {
  function tableDetails(selector) {
    let count = $('#' + selector)
      .DataTable()
      .column(0)
      .data().length;
    if (count > 10) {
      $('#' + selector + '_length').show();
      $('.dataTables_filter').show();
      $('#' + selector + '_info').show();
      $('#' + selector + '_paginate').show();
    } else {
      $('#' + selector + '_length').hide();
      $('.dataTables_filter').hide();
      $('#' + selector + '_info').show();
      $('#' + selector + '_paginate').show();
    }
  }

  // Function to encrypt a string using XOR
  function encrypt(text, key) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const encryptedCharCode = charCode ^ key;
      result += String.fromCharCode(encryptedCharCode);
    }
    return result;
  }

  function decrypt(encryptedText, key) {
    return encrypt(encryptedText, key); // XOR with the same key decrypts the text
  }

  function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
  }

  $.getJSON('data/login-data.json', function (customerData) {
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

      if (userData.length > 0) {
        let id = userData[0]['id'];
        $('[name="userId"]').val(id);
      }
    }
  });

  $.getJSON('data/database-details.json', function (db) {
    // global variables
    let promptRulesList = [];
    let systemRulesList = [];
    let mainData = {};

    if (localStorage.getItem('Query engineering list') !== null) {
      mainData = JSON.parse(localStorage.getItem('Query engineering list'));
    }
    console.log('mainData: ', mainData);

    // Initialize an array to store the CodeMirror editor instances
    var updateSplitEditors = [];
    var queryEditors = [];

    // reference schema code editor
    var refSchemeEditor = CodeMirror.fromTextArea(
      document.getElementById('reference-schema-editor'),
      {
        lineNumbers: true,
        theme: 'dracula',
        mode: 'sql',
        readOnly: true, // Make the editor read-only
      }
    );

    $('.work-schema-tab-outer a').tab('show');
    var updateSchemeEditor = CodeMirror.fromTextArea(
      document.getElementById('update-schema-editor'),
      {
        lineNumbers: true,
        theme: 'dracula',
        mode: 'sql',
      }
    );

    $('.query-tab-outer a').tab('show');
    let queryEditor = CodeMirror.fromTextArea(
      document.getElementById('query-code-editor'),
      {
        lineNumbers: true,
        theme: 'dracula',
        mode: 'sql',
      }
    );
    queryEditors.push(queryEditor);
    $('.ref-schema-tab a').tab('show');

    let initialData = db;
    let dbList = {};
    if (localStorage.getItem('Link Data') === null) {
      dbList = initialData;
      localStorage.setItem('Link Data', JSON.stringify(initialData));
    } else {
      dbList = {
        ...initialData,
        ...JSON.parse(localStorage.getItem('Link Data')),
      };
      localStorage.setItem('Link Data', JSON.stringify(dbList));
    }

    let option = '';
    $.each(dbList, function (key, item) {
      let { dbName } = item;
      option += `<option value="${dbName}">${dbName}</option>`;
    });
    $('[name="database"]').append(option);

    // random number generator
    function randomString() {
      //generate random number
      var randomNumber = Math.floor(100 + Math.random() * 100);
      return randomNumber;
    }
    // $('#query_id').val(randomString());

    // form serialize arr to json
    function SerializeArrToJson(formSerializeArr) {
      var jsonObj = {};
      jQuery.map(formSerializeArr, function (n, i) {
        if (!n.name.endsWith('_length') && !n.name.endsWith('[]')) {
          // if (n.value != '') {
          jsonObj[n.name] = n.value;
          // }
        }
      });
      return jsonObj;
    }

    // query section
    function querySection() {
      let key = randomString();
      let editorId = 'editor' + key;
      let tableId = 'table' + key;
      queryEditors = [];

      let querySec =
        `<div class="panel panel-default subQuerySec" data-table="${tableId}" data-editor="${editorId}" >` +
        ` <div class="panel-heading currentPanel"> <h4 class="panel-title add-rule-outer" style="display: flex; justify-content: space-between; align-items: center;"> &nbsp; <div class="pull-right add-rule-inner"> <div class="dflex" style="display: flex; "> <label>Query name</label> <select name="query_lists[]" class=" input-md form-control query_lists" data-parsley-error-message="Select query" data-show-subtext="true" data-live-search="true">  </select> <button type="button" class="btn btn-info btn-xs btn-tcenter add-query-rule-btn" disabled> Add rule</button> </div> </div> </h4> </div>` +
        ` <div class="panel-body panel-collapse collapse in currentPanelBody" aria-expanded="true"> <div class="tab-pane active"> <h4><span> Query prompt </span></h4> <div class="row"> <div class="col-md-12"> <table id="${tableId}" class="table v-align table-striped table-hover filter-table"> <thead> <tr> <th width="8%"> ID </th> <th> Prompt </th> <th width="10%"> Action </th> </tr> </thead> <tfoot> <tr> <th width="8%"> ID </th> <th> Prompt </th> <th width="10%"> Action </th> </tr> </tfoot> <tbody> </tbody> </table> </div> </div> <div class="row"> <div class="col-md-12 col-sm-12 query-editor-outer"> <h4> Query </h4> <textarea id="${editorId}" class="queryEditor" data-id="${editorId}"></textarea> </div> </div> </div> </div> </div>`;
      $('.mainQueryWrapper').append(querySec);

      let queryEditor = CodeMirror.fromTextArea(
        document.getElementById(editorId),
        {
          lineNumbers: true,
          theme: 'dracula',
          mode: 'sql',
        }
      );
      queryEditors.push(queryEditor);

      $('#' + tableId + ' tfoot th').each(function () {
        let title = $('#' + tableId + ' thead th')
          .eq($(this).index())
          .text()
          .trim();
        if (title != '' && title) {
          $(this).html(
            '<input type="text" class="filter" placeholder="' + title + '" />'
          );
        }
      });

      $('#' + tableId)
        .DataTable({
          iDisplayLength: 25, // Set the default number of rows to display
          language: {
            info: 'Showing _START_ to _END_ of _TOTAL_ query rules',
          },
        })
        .columns()
        .every(function () {
          var that = this;

          $('input', this.footer()).on('keyup change', function () {
            that.search(this.value).draw();
          });
        });
      tableDetails(tableId);
      queryDropdown();
    }

    // prompt-rules-list table  // Search functionality
    $('#prompt-rules-list tfoot th').each(function () {
      let title = $('#prompt-rules-list thead th')
        .eq($(this).index())
        .text()
        .trim();
      if (title != '' && title) {
        $(this).html(
          '<input type="text" class="filter" placeholder="' + title + '" />'
        );
      }
    });
    $('#prompt-rules-list')
      .DataTable({
        iDisplayLength: 25, // Set the default number of rows to display
        ordering: false,
        language: {
          info: 'Showing _START_ to _END_ of _TOTAL_ prompt rules',
        },
      })
      .columns()
      .every(function () {
        var that = this;

        $('input', this.footer()).on('keyup change', function () {
          that.search(this.value).draw();
        });
      });
    tableDetails('prompt-rules-list');

    // Make the prompt rows draggable using jQuery UI
    $('#prompt-rules-list tbody')
      .sortable({
        items: 'tr', // Allow only rows to be sorted
        helper: 'clone',
        opacity: 0.6,
        axis: 'y', // Enable vertical dragging only
        update: function () {
          // If you want to perform some action when the order changes, do it here.
        },
      })
      .disableSelection();

    // prompt-rules-list table  // Search functionality
    $('#system-rules-list tfoot th').each(function () {
      let title = $('#system-rules-list thead th')
        .eq($(this).index())
        .text()
        .trim();
      if (title != '' && title) {
        $(this).html(
          '<input type="text" class="filter" placeholder="' + title + '" />'
        );
      }
    });
    $('#system-rules-list')
      .DataTable({
        iDisplayLength: 25, // Set the default number of rows to display
        language: {
          info: 'Showing _START_ to _END_ of _TOTAL_ system rules',
        },
        ordering: false,
      })
      .columns()
      .every(function () {
        var that = this;

        $('input', this.footer()).on('keyup change', function () {
          that.search(this.value).draw();
        });
      });
    tableDetails('system-rules-list');
    // Make the system rows draggable using jQuery UI
    $('#system-rules-list tbody')
      .sortable({
        items: 'tr', // Allow only rows to be sorted
        helper: 'clone',
        opacity: 0.6,
        axis: 'y', // Enable vertical dragging only
        update: function () {
          // If you want to perform some action when the order changes, do it here.
        },
      })
      .disableSelection();

    // query-prompt-list table  // Search functionality
    $('#query-prompt-list tfoot th').each(function () {
      let title = $('#query-prompt-list thead th')
        .eq($(this).index())
        .text()
        .trim();
      if (title != '' && title) {
        $(this).html(
          '<input type="text" class="filter" placeholder="' + title + '" />'
        );
      }
    });
    $('#query-prompt-list')
      .DataTable({
        iDisplayLength: 25, // Set the default number of rows to display
        language: {
          info: 'Showing _START_ to _END_ of _TOTAL_ prompts',
        },
      })
      .columns()
      .every(function () {
        var that = this;

        $('input', this.footer()).on('keyup change', function () {
          that.search(this.value).draw();
        });
      });
    tableDetails('query-prompt-list');
    let queryNames = [];
    // add subschema to dropdown
    $('[name="database"]').on('change', function () {
      queryNames = [];
      let value = $(this).val();
      let option = `<option value="">Select subschema</option>`;
      let queryOption = `<option value="">Select query</option> <option value="------" disabled="disabled" class="sel2_heading">------</option>`;
      let dbArrList = Object.values(dbList);
      // filter selected db
      let [subschemaSelected] = dbArrList.filter((curElem, i) => {
        if (curElem.dbName == value) {
          return curElem;
        }
      });

      if (typeof subschemaSelected == 'object') {
        // subschema names
        $.each(subschemaSelected.sub_schemas_status, function (key, value) {
          option += `<option value="${value.name}" data-id="${value.id}" data-name="${value.name}" data-status="${value.status}">${value.name}</option>`;
        });

        // query names
        $.each(subschemaSelected.queries, function (key, value) {
          queryNames.push({ name: value.query_name, id: value.query_id });

          queryOption += `<option value="${value.query_name}" data-id="${value.query_id}" data-name="${value.query_name}">${value.query_name}</option>`;
        });
      }
      $('.query-tab-outer a').tab('show');
      $('.mainQueryWrapper').html('');
      querySection();
      $('[name="subschemaName"]').html(option);
      $('[name="query_lists[]"]').html(queryOption);
      $('.ref-schema-tab a').tab('show');
      refSchemeEditor.setValue('');
      $('.work-schema-tab-outer a').tab('show');
      updateSchemeEditor.setValue('');
      // $('.work-schema-tablewise-tab-outer a').tab('show');
      $('#sub-editor-outer').html('');
      updateSplitEditors = [];

      $('.ref-schema-tab a').tab('show');
      $('[name="schemaType"]').attr('checked', false);
      $('.subschema-row').addClass('hidden');
      $('.work-schema-tablewise-tab-outer').hide();
      $('.chosen-select').trigger('chosen:updated');
    });

    // enable add btn for query rule
    $(document).on('change', '[name="query_lists[]"]', function () {
      let value = $(this).val();
      $('.add-query-rule-btn').attr('disabled', false);
      let editorId = $(this).find('option:selected').attr('data-id');
      let tableId = $(this).parents('.subQuerySec').attr('data-table');

      $(this)
        .parents('.currentPanel')
        .siblings('.currentPanelBody')
        .find('.queryEditor')
        .attr('data-id', editorId);

      let db = $('[name="database"]').val();
      if (db != '' && db) {
        let dbArrList = Object.values(dbList);
        // filter selected db
        let [subschemaSelected] = dbArrList.filter((curElem, i) => {
          if (curElem.dbName == db) {
            return curElem;
          }
        });

        if (typeof subschemaSelected == 'object') {
          let [currentQuery] = subschemaSelected.queries.filter((item, i) => {
            if (item.query_name == value) {
              return item;
            }
          });

          if (
            'promptList' in currentQuery &&
            currentQuery.promptList.length > 0
          ) {
            $('#' + tableId)
              .DataTable()
              .clear()
              .draw();
            $.each(currentQuery.promptList, function (key, val) {
              let html = `<tr data-id="${val.id}" data-rule="${val.prompt}" class="rule-row"> <td width="8%"> ${val.id} </td> <td> ${val.prompt} </td><td width="10%"><em class="icon icon-eye view-query-prompt mt0" style="color:#cb427c;" title="View"></em><em class="icon icon-pencil edit-query-prompt mt0" style="color:#cb427c; padding-left:10px" title="Edit"></em><i class="icon icon-close  delete-query-prompt" style="color:#cb427c; padding-left:10px" title="Delete"></i></td> </tr>`;
              $('#' + tableId)
                .DataTable()
                .row.add($(html))
                .draw();
            });
            tableDetails(tableId);
          }

          if ('query' in currentQuery) {
            // Iterate through the CodeMirror updateSplitEditors and get their values
            queryEditors.forEach(function (editor) {
              if (editor.getTextArea().getAttribute('data-id') == editorId) {
                editor.setValue(currentQuery.query);
              }
            });
          }
        }
      }
    });

    // enable subschema dropdown
    $('[name="schemaType"]').on('click', function () {
      let db = $('[name="database"]').val();
      let value = $('[name="schemaType"]:checked').val();

      if (value == 'Subschema') {
        $('#sub-editor-outer').html(
          '<textarea id="work-schema-initial-editor"></textarea>'
        );
        $('.work-schema-tablewise-tab-outer').show();
        $('.ref-schema-tab a').tab('show');
        refSchemeEditor.setValue('');
        $('.work-schema-tab-outer a').tab('show');
        updateSchemeEditor.setValue('');
        $('.work-schema-tablewise-tab-outer a').tab('show');
        var workInitialEditor = CodeMirror.fromTextArea(
          document.getElementById('work-schema-initial-editor'),
          {
            lineNumbers: true,
            theme: 'dracula',
            mode: 'sql',
          }
        );
        $('.ref-schema-tab a').tab('show');
        $('#subschemaName').attr('disabled', false).trigger('chosen:updated');
        $('.subschema-row').removeClass('hidden');
      } else if (value == 'Full') {
        $('#sub-editor-outer').html(
          '<textarea id="work-schema-initial-editor"></textarea>'
        );
        $('.subschema-row').addClass('hidden');
        $('#subschemaName')
          .attr('disabled', true)
          .val('')
          .trigger('chosen:updated');
        if (db != '' && db) {
          let dbArrList = Object.values(dbList);
          let [subschemaSelected] = dbArrList.filter((curElem, i) => {
            if (curElem.dbName == db) {
              return curElem;
            }
          });
          let fullSchema = [];
          let tables = subschemaSelected['tables'];
          $.each(tables, function (k, curQuery) {
            fullSchema.push(curQuery.query);
          });

          $('.ref-schema-tab a').tab('show');
          refSchemeEditor.setValue(fullSchema.join('\n'));
          $('.work-schema-tab-outer a').tab('show');
          updateSchemeEditor.setValue(fullSchema.join('\n'));
          $('.work-schema-tablewise-tab-outer a').tab('show');
          var workInitialEditor = CodeMirror.fromTextArea(
            document.getElementById('work-schema-initial-editor'),
            {
              lineNumbers: true,
              theme: 'dracula',
              mode: 'sql',
            }
          );
          $('.ref-schema-tab a').tab('show');
          $('.work-schema-tablewise-tab-outer').css('display', 'none');
          updateSplitEditors = [];
        } else {
          $('.ref-schema-tab a').tab('show');
          refSchemeEditor.setValue('');
          $('.work-schema-tab-outer a').tab('show');
          updateSchemeEditor.setValue('');
          $('.work-schema-tablewise-tab-outer a').tab('show');
          var workInitialEditor = CodeMirror.fromTextArea(
            document.getElementById('work-schema-initial-editor'),
            {
              lineNumbers: true,
              theme: 'dracula',
              mode: 'sql',
            }
          );
          $('.ref-schema-tab a').tab('show');
          $('.work-schema-tablewise-tab-outer').hide();
          updateSplitEditors = [];
        }
      }
    });

    // add subschema name to field
    $('[name="subschemaName"]').on('change', function () {
      let name = $('[name="subschemaName"] option:selected').attr('data-name');

      let db = $('[name="database"]').val();
      if (db != '' && db) {
        let dbArrList = Object.values(dbList);
        let [subschemaSelected] = dbArrList.filter((curElem, i) => {
          if (curElem.dbName == db) {
            return curElem;
          }
        });
        let fullSchema = [];
        let subSchema = [];
        let tables = subschemaSelected['tables'];
        $.each(tables, function (k, curQuery) {
          if (curQuery.sub_schema.includes(name)) {
            subSchema.push({ name: curQuery.name, query: curQuery.query });
            fullSchema.push(curQuery.query);
          }
        });
        $('.ref-schema-tab a').tab('show');
        refSchemeEditor.setValue(fullSchema.join('\n'));
        $('.work-schema-tab-outer a').tab('show');
        updateSchemeEditor.setValue(fullSchema.join('\n'));
        $('.work-schema-tablewise-tab-outer a').tab('show');
        $('#sub-editor-outer').html('');
        if (Array.isArray(subSchema) && subSchema.length > 0) {
          updateSplitEditors = [];
          $.each(subSchema, function (key, item) {
            let marginTop = '';
            if (key != 0) {
              marginTop = 'style="margin-top:35px"';
            }
            let subschemaEditor = `<h4 ${marginTop}> Table name: ${item.name} </h4><textarea id="${item.name}" data-id="${item.name}"></textarea>`;
            $('#sub-editor-outer').append(subschemaEditor);

            let editor = CodeMirror.fromTextArea(
              document.getElementById(item.name),
              {
                lineNumbers: true,
                theme: 'dracula',
                mode: 'sql',
              }
            );
            editor.setValue(item.query);
            updateSplitEditors.push(editor); // Store the editor instance
          });
        } else {
          $('#sub-editor-outer').html(
            '<textarea id="work-schema-initial-editor"></textarea>'
          );
          $('.work-schema-tablewise-tab-outer a').tab('show');
          var workInitialEditor = CodeMirror.fromTextArea(
            document.getElementById('work-schema-initial-editor'),
            {
              lineNumbers: true,
              theme: 'dracula',
              mode: 'sql',
            }
          );
        }
        $('.ref-schema-tab a').tab('show');
      }
    });

    // add new prompt rule functionality
    $('.add-new-btn').on('click', function () {
      $('tr.rule-row').removeClass('edit-row');
      $('.prompt-title').text('Prompt rule');
      $('.add-new-prompt-form').trigger('reset');
      $('.add-new-prompt-form').find('[name="rule"]').attr('disabled', false);
      $('.add-new-prompt-form').find('.modal-footer').show();
      $('#add-prompt-rule-btn').removeClass('hidden');
      $('#edit-prompt-rule-btn').addClass('hidden');
      $('#add-new-prompt-rule-popup').modal('show');
    });

    // add new prompt rule functionality
    $('.add-new-system-rule').on('click', function () {
      $('tr.system-rule-row').removeClass('edit-row');
      $('.system-title').text('System rule');
      $('.add-new-system-form').trigger('reset');
      $('.add-new-system-form').find('[name="rule"]').attr('disabled', false);
      $('.add-new-system-form').find('.modal-footer').show();
      $('#add-system-rule-btn').removeClass('hidden');
      $('#edit-system-rule-btn').addClass('hidden');
      $('#add-new-system-rule-popup').modal('show');
    });

    // add prompt rule functionality
    $('#add-prompt-rule-btn').on('click', function () {
      let Form = $('.add-new-prompt-form');
      let FormInstance = Form.parsley();
      FormInstance.validate();
      let data = SerializeArrToJson(Form.serializeArray());
      // <i class="icon icon-close  delete-prompt-rule" style="color:#cb427c; padding-left:10px" title="Delete"></i>
      if (FormInstance.isValid()) {
        const { rule } = data;
        let id = randomString();
        let html = `<tr data-id="${id}" data-rule="${rule}" class="rule-row"> <td width="10%"> ${id} </td> <td width="80%"> ${rule} </td><td width="10%"><em class="icon icon-eye view-prompt-rule mt0" style="color:#cb427c;" title="View"></em><em class="icon icon-pencil edit-prompt-rule mt0" style="color:#cb427c; padding-left:10px" title="Edit"></em></td> </tr>`;
        $('#prompt-rules-list').DataTable().row.add($(html)).draw();
        tableDetails('prompt-rules-list');
        promptRulesList.push({ id, rule });
        Form.trigger('reset');
        $('#add-new-prompt-rule-popup').modal('hide');
      }
    });

    // add system rule functionality
    $('#add-system-rule-btn').on('click', function () {
      let Form = $('.add-new-system-form');
      let FormInstance = Form.parsley();
      FormInstance.validate();
      let data = SerializeArrToJson(Form.serializeArray());
      if (FormInstance.isValid()) {
        const { rule } = data;
        let id = randomString();
        // <i class="icon icon-close  delete-system-rule" style="color:#cb427c; padding-left:10px" title="Delete"></i>
        let html = `<tr data-id="${id}" data-rule="${rule}" class="system-rule-row"> <td width="10%"> ${id} </td> <td width="80%"> ${rule} </td><td width="10%"><em class="icon icon-eye view-system-rule mt0" style="color:#cb427c;" title="View"></em><em class="icon icon-pencil edit-system-rule mt0" style="color:#cb427c; padding-left:10px" title="Edit"></em></td> </tr>`;
        $('#system-rules-list').DataTable().row.add($(html)).draw();
        tableDetails('system-rules-list');
        systemRulesList.push({ id, rule });
        Form.trigger('reset');
        $('#add-new-system-rule-popup').modal('hide');
      }
    });

    // initial prompt rules
    $.each(promptRulesList, function (key, item) {
      let { id, rule } = item;
      // <i class="icon icon-close  delete-prompt-rule" style="color:#cb427c; padding-left:10px" title="Delete"></i>
      let html = `<tr data-id="${id}" data-rule="${rule}" class="rule-row"> <td width="10%"> ${id} </td> <td width="80%"> ${rule} </td><td width="10%"><em class="icon icon-eye view-prompt-rule mt0" style="color:#cb427c;" title="View"></em><em class="icon icon-pencil edit-prompt-rule mt0" style="color:#cb427c; padding-left:10px" title="Edit"></em></td> </tr>`;
      $('#prompt-rules-list').DataTable().row.add($(html)).draw();
      tableDetails('prompt-rules-list');
    });

    // initial prompt rules
    $.each(systemRulesList, function (key, item) {
      let { id, rule } = item;
      let html = `<tr data-id="${id}" data-rule="${rule}" class="system-rule-row"> <td width="10%"> ${id} </td> <td width="80%"> ${rule} </td><td width="10%"><em class="icon icon-eye view-system-rule mt0" style="color:#cb427c;" title="View"></em><em class="icon icon-pencil edit-system-rule mt0" style="color:#cb427c; padding-left:10px" title="Edit"></em></td> </tr>`;
      $('#system-rules-list').DataTable().row.add($(html)).draw();
      tableDetails('system-rules-list');
    });

    // view prompt rules
    $(document).on('click', '.view-prompt-rule', function () {
      let id = $(this).parents('tr.rule-row').attr('data-id');
      let rule = $(this).parents('tr.rule-row').attr('data-rule');
      $('.prompt-title').text('Prompt id: ' + id);
      $('.add-new-prompt-form')
        .find('[name="rule"]')
        .val(rule)
        .attr('disabled', true);
      $('.add-new-prompt-form').find('.modal-footer').hide();
      $('#add-new-prompt-rule-popup').modal('show');
    });

    // view system rules
    $(document).on('click', '.view-system-rule', function () {
      let id = $(this).parents('tr.system-rule-row').attr('data-id');
      let rule = $(this).parents('tr.system-rule-row').attr('data-rule');
      $('.system-title').text('System id: ' + id);
      $('.add-new-system-form')
        .find('[name="rule"]')
        .val(rule)
        .attr('disabled', true);
      $('.add-new-system-form').find('.modal-footer').hide();
      $('#add-new-system-rule-popup').modal('show');
    });

    // edit rules
    $(document).on('click', '.edit-prompt-rule', function () {
      $('tr.rule-row').removeClass('edit-row');
      let id = $(this).parents('tr.rule-row').attr('data-id');
      let rule = $(this).parents('tr.rule-row').attr('data-rule');
      $(this).parents('tr.rule-row').addClass('edit-row');
      $('.prompt-title').text('Prompt id: ' + id);
      $('.add-new-prompt-form')
        .find('[name="rule"]')
        .val(rule)
        .attr('disabled', false);
      $('.add-new-prompt-form').find('.modal-footer').show();
      $('#add-prompt-rule-btn').addClass('hidden');
      $('#edit-prompt-rule-btn').removeClass('hidden');
      $('#add-new-prompt-rule-popup').modal('show');
    });

    // save edited prompt rule
    $('#edit-prompt-rule-btn').on('click', function () {
      let Form = $('.add-new-prompt-form');
      let FormInstance = Form.parsley();
      FormInstance.validate();
      let data = SerializeArrToJson(Form.serializeArray());
      if (FormInstance.isValid()) {
        const { rule } = data;
        let row = $('tr.rule-row.edit-row');
        let id = $('tr.rule-row.edit-row').attr('data-id');
        promptRulesList = promptRulesList.filter((curRule) => {
          if (curRule.id != id) {
            return curRule;
          }
        });
        $('#prompt-rules-list').DataTable().row(row).remove().draw(false);
        // <i class="icon icon-close  delete-prompt-rule" style="color:#cb427c; padding-left:10px" title="Delete"></i>
        let html = `<tr data-id="${id}" data-rule="${rule}" class="rule-row"> <td width="10%"> ${id} </td> <td width="80%"> ${rule} </td><td width="10%"><em class="icon icon-eye view-prompt-rule mt0" style="color:#cb427c;" title="View"></em><em class="icon icon-pencil edit-prompt-rule mt0" style="color:#cb427c; padding-left:10px" title="Edit"></em></td> </tr>`;
        $('#prompt-rules-list').DataTable().row.add($(html)).draw();
        tableDetails('prompt-rules-list');
        promptRulesList.push({ id, rule });
        Form.trigger('reset');
        $('#add-new-prompt-rule-popup').modal('hide');
      }
    });

    // edit system rules
    $(document).on('click', '.edit-system-rule', function () {
      $('tr.system-rule-row').removeClass('edit-row');
      let id = $(this).parents('tr.system-rule-row').attr('data-id');
      let rule = $(this).parents('tr.system-rule-row').attr('data-rule');
      $(this).parents('tr.system-rule-row').addClass('edit-row');
      $('.system-title').text('System id: ' + id);
      $('.add-new-system-form')
        .find('[name="rule"]')
        .val(rule)
        .attr('disabled', false);
      $('.add-new-system-form').find('.modal-footer').show();
      $('#add-system-rule-btn').addClass('hidden');
      $('#edit-system-rule-btn').removeClass('hidden');
      $('#add-new-system-rule-popup').modal('show');
    });

    // save edited system rule
    $('#edit-system-rule-btn').on('click', function () {
      let Form = $('.add-new-system-form');
      let FormInstance = Form.parsley();
      FormInstance.validate();
      let data = SerializeArrToJson(Form.serializeArray());
      if (FormInstance.isValid()) {
        const { rule } = data;
        let row = $('tr.system-rule-row.edit-row');
        let id = $('tr.system-rule-row.edit-row').attr('data-id');
        systemRulesList = systemRulesList.filter((curRule) => {
          if (curRule.id != id) {
            return curRule;
          }
        });
        $('#system-rules-list').DataTable().row(row).remove().draw(false);
        // <i class="icon icon-close  delete-system-rule" style="color:#cb427c; padding-left:10px" title="Delete"></i>
        let html = `<tr data-id="${id}" data-rule="${rule}" class="system-rule-row"> <td width="10%"> ${id} </td> <td width="80%"> ${rule} </td><td width="10%"><em class="icon icon-eye view-system-rule mt0" style="color:#cb427c;" title="View"></em><em class="icon icon-pencil edit-system-rule mt0" style="color:#cb427c; padding-left:10px" title="Edit"></em></td> </tr>`;
        $('#system-rules-list').DataTable().row.add($(html)).draw();
        tableDetails('system-rules-list');
        systemRulesList.push({ id, rule });
        Form.trigger('reset');
        $('#add-new-system-rule-popup').modal('hide');
      }
    });

    $('.chosen-select').trigger('chosen:updated');
    // trigger query rule modal
    $(document).on('click', '.add-query-rule-btn', function () {
      $(document).find('.subQuerySec').removeClass('add-prompt');
      $(this).parents('.subQuerySec').addClass('add-prompt');
      $('[name="add-new-query-form"]').trigger('reset');
      $('#add-new-query-rule-popup').modal('show');
    });

    // add query rule functionality
    $('#save-query-rule-btn').on('click', function () {
      let Form = $('.add-new-query-form');
      let FormInstance = Form.parsley();
      FormInstance.validate();
      let data = SerializeArrToJson(Form.serializeArray());
      if (FormInstance.isValid()) {
        const { prompt } = data;
        let id = randomString();
        let tableId = $(document)
          .find('.subQuerySec.add-prompt')
          .attr('data-table');

        let html = `<tr data-id="${id}" data-rule="${prompt}" class="rule-row"> <td width="8%"> ${id} </td> <td> ${prompt} </td><td width="10%"><em class="icon icon-eye view-query-prompt mt0" style="color:#cb427c;" title="View"></em><em class="icon icon-pencil edit-query-prompt mt0" style="color:#cb427c; padding-left:10px" title="Edit"></em><i class="icon icon-close  delete-query-prompt" style="color:#cb427c; padding-left:10px" title="Delete"></i></td> </tr>`;
        $('#' + tableId)
          .DataTable()
          .row.add($(html))
          .draw();
        tableDetails(tableId);
        Form.trigger('reset');
        $('#add-new-query-rule-popup').modal('hide');
      }
    });

    // products dropdon function
    const queryDropdown = () => {
      $('.query_lists').each(function () {
        $(this).select2({
          templateResult: formatQuery,
          placeholder: 'Select query',
          searchInputPlaceholder: 'Search query',
        });
      });
    };

    // select2 dropdown call back function
    function formatQuery(state) {
      if (state.text != 'Select query' && state.text != '------') {
        return $(
          '<div class="drop_down_otr product_dropdown_otr"><div class="product_number">' +
            $(state.element).attr('data-id') +
            '</div><div class="product_name">' +
            $(state.element).attr('data-name') +
            '</div></div>'
        );
      } else if (state.text == '------') {
        return $(
          '<div class="drop_down_otr headingDropdown"><div class="product_number_hd">Query ID</div><div class="product_name_hd">Query name</div></div>'
        );
      } else {
        return $(
          '<div class="drop_down_otr"><div>' + state.text + '</div></div>'
        );
      }
    }

    queryDropdown();

    // add new query section
    $('.add-new-query-sec-btn').on('click', function () {
      let key = randomString();
      let editorId = 'editor' + key;
      let tableId = 'table' + key;
      let notReqQuery = [];
      let len = 0;
      $(document)
        .find('[name="query_lists[]"]')
        .each(function () {
          let value = $(this).val();
          if (value != '' && value) {
            notReqQuery.push(value);
          }
          len++;
        });

      let queryOption = `<option value="">Select query</option> <option value="------" disabled="disabled" class="sel2_heading">------</option>`;
      let status = [];
      $.each(queryNames, function (key, item) {
        if (!notReqQuery.includes(item.name)) {
          queryOption += `<option value="${item.name}" data-id="${item.id}" data-name="${item.name}">${item.name}</option>`;
          status.push(true);
        } else {
          status.push(false);
        }
      });
      if (status.includes(true)) {
        let querySec =
          `<div class="panel panel-default subQuerySec" data-table="${tableId}" data-editor="${editorId}" >` +
          ` <div class="panel-heading currentPanel"> <h4 class="panel-title add-rule-outer" style="display: flex; justify-content: space-between; align-items: center;"> &nbsp; <div class="pull-right add-rule-inner"> <div class="dflex" style="display: flex; "> <label>Query name</label> <select name="query_lists[]" class=" input-md form-control query_lists" data-parsley-error-message="Select query" data-show-subtext="true" data-live-search="true"> ${queryOption} </select> <button type="button" class="btn btn-info btn-xs btn-tcenter add-query-rule-btn" disabled> Add rule</button> </div> </div> </h4> </div>` +
          ` <div class="panel-body panel-collapse collapse in currentPanelBody" aria-expanded="true"> <div class="tab-pane active"> <h4><span> Query prompt </span></h4> <div class="row"> <div class="col-md-12"> <table id="${tableId}" class="table v-align table-striped table-hover filter-table"> <thead> <tr> <th width="8%"> ID </th> <th> Prompt </th> <th width="10%"> Action </th> </tr> </thead> <tfoot> <tr> <th width="8%"> ID </th> <th> Prompt </th> <th width="10%"> Action </th> </tr> </tfoot> <tbody> </tbody> </table> </div> </div> <div class="row"> <div class="col-md-12 col-sm-12 query-editor-outer"> <h4> Query </h4> <textarea id="${editorId}" class="queryEditor" data-id=""></textarea> </div> </div> </div> </div> </div>`;
        $('.mainQueryWrapper').append(querySec);

        let queryEditor = CodeMirror.fromTextArea(
          document.getElementById(editorId),
          {
            lineNumbers: true,
            theme: 'dracula',
            mode: 'sql',
          }
        );
        queryEditors.push(queryEditor);

        $('#' + tableId + ' tfoot th').each(function () {
          let title = $('#' + tableId + ' thead th')
            .eq($(this).index())
            .text()
            .trim();
          if (title != '' && title) {
            $(this).html(
              '<input type="text" class="filter" placeholder="' + title + '" />'
            );
          }
        });

        $('#' + tableId)
          .DataTable({
            iDisplayLength: 25, // Set the default number of rows to display
            language: {
              info: 'Showing _START_ to _END_ of _TOTAL_ query rules',
            },
          })
          .columns()
          .every(function () {
            var that = this;

            $('input', this.footer()).on('keyup change', function () {
              that.search(this.value).draw();
            });
          });
        tableDetails(tableId);
        queryDropdown();
      } else {
        $('#alert-popup_one').modal('show');
      }
    });

    let url = location.href;
    if (url.indexOf('e=') != -1) {
      let params = new URLSearchParams(window.location.search);
      let userId = params.get('e');
      let viewData = mainData[userId];
      let dbArrList = Object.values(dbList);
      let currentDb = viewData.database;
      console.log('currentDb: ', currentDb);
      // filter selected db
      let [selectedDB] = dbArrList.filter((curElem, i) => {
        if (curElem.dbName == currentDb) {
          return curElem;
        }
      });
      let option = `<option value="">Select subschema</option>`;
      console.log('selectedDB: ', selectedDB);
      if (typeof selectedDB == 'object') {
        // subschema names
        $.each(selectedDB.sub_schemas_status, function (key, value) {
          option += `<option value="${value.name}" data-id="${value.id}" data-name="${value.name}" data-status="${value.status}">${value.name}</option>`;
        });
      }

      $('[name="subschemaName"]').html(option);

      for (let key in viewData) {
        let inputType = $(`[name="${key}"]`);
        if (inputType.attr('type') == 'radio') {
          $(`[type="radio"][name="${key}"][value="${viewData[key]}"]`).attr(
            'checked',
            true
          );
        } else {
          if (viewData[key] != '') {
            $(`[name="${key}"]`).val(viewData[key]);
          }
        }
      }
      $('.chosen-select').trigger('chosen:updated');
      // schema type enable
      if (viewData['schemaType'] == 'Subschema') {
        $('.subschema-row').removeClass('hidden');
        $('#subschemaName').attr('disabled', false);
        $('.work-schema-tablewise-tab-outer').show();
        $('.work-schema-tablewise-tab-outer a').tab('show');
        var workInitialEditor = CodeMirror.fromTextArea(
          document.getElementById('work-schema-initial-editor'),
          {
            lineNumbers: true,
            theme: 'dracula',
            mode: 'sql',
          }
        );
      }

      // reference schema editor
      let referenceCode = viewData['refSchemeEditor'];
      $('.ref-schema-tab a').tab('show');
      refSchemeEditor.setValue(referenceCode['code']);

      // update schema editor
      let updateSchemeEditorCode = viewData['updateSchemeEditor'];
      $('.work-schema-tab-outer a').tab('show');
      updateSchemeEditor.setValue(updateSchemeEditorCode['code']);

      // update split schema editor
      let updateSplitSchemeCode = viewData['updateSplitEditors'];
      $('.work-schema-tablewise-tab-outer a').tab('show');
      if (
        Array.isArray(updateSplitSchemeCode) &&
        updateSplitSchemeCode.length > 0
      ) {
        updateSplitEditors = [];
        $('#sub-editor-outer').html('');
        $.each(updateSplitSchemeCode, function (key, item) {
          let marginTop = '';
          if (key != 0) {
            marginTop = 'style="margin-top:35px"';
          }
          let subschemaEditor = `<h4 ${marginTop}> Table name: ${item.name} </h4><textarea id="${item.name}" data-id="${item.name}"></textarea>`;
          $('#sub-editor-outer').append(subschemaEditor);

          let editor = CodeMirror.fromTextArea(
            document.getElementById(item.name),
            {
              lineNumbers: true,
              theme: 'dracula',
              mode: 'sql',
            }
          );
          editor.setValue(item.code);
          updateSplitEditors.push(editor); // Store the editor instance
        });
      }

      // update prompt table
      promptRulesList = viewData['promptRulesList'];
      $.each(promptRulesList, function (key, item) {
        let { id, rule } = item;
        // <i class="icon icon-close  delete-prompt-rule" style="color:#cb427c; padding-left:10px" title="Delete"></i>
        let html = `<tr data-id="${id}" data-rule="${rule}" class="rule-row"> <td width="10%"> ${id} </td> <td width="80%"> ${rule} </td><td width="10%"><em class="icon icon-eye view-prompt-rule mt0" style="color:#cb427c;" title="View"></em><em class="icon icon-pencil edit-prompt-rule mt0" style="color:#cb427c; padding-left:10px" title="Edit"></em></td> </tr>`;
        $('#prompt-rules-list').DataTable().row.add($(html)).draw();
        tableDetails('prompt-rules-list');
      });

      // update system table
      systemRulesList = viewData['systemRulesList'];
      $.each(systemRulesList, function (key, item) {
        let { id, rule } = item;
        let html = `<tr data-id="${id}" data-rule="${rule}" class="system-rule-row"> <td width="10%"> ${id} </td> <td width="80%"> ${rule} </td><td width="10%"><em class="icon icon-eye view-system-rule mt0" style="color:#cb427c;" title="View"></em><em class="icon icon-pencil edit-system-rule mt0" style="color:#cb427c; padding-left:10px" title="Edit"></em></td> </tr>`;
        $('#system-rules-list').DataTable().row.add($(html)).draw();
        tableDetails('system-rules-list');
      });

      // query section update
      let queryData = viewData['queryData'];
      if (Array.isArray(queryData) && queryData.length > 0) {
        $('.mainQueryWrapper').html('');

        if (typeof selectedDB == 'object') {
          // query names
          $.each(selectedDB.queries, function (key, value) {
            queryNames.push({ name: value.query_name, id: value.query_id });
          });
        }

        $('.query-tab-outer a').tab('show');
        $.each(queryData, function (key, curItem) {
          let dropDownValue = curItem.name;
          let tableData = curItem.table;
          let queryCode = curItem.editorCode;
          let editorId = queryCode.name;
          let tableId = queryCode.name.replace('editor', 'table');
          console.log('queryCode: ', queryCode);

          let notReqQuery = [];
          $(document)
            .find('[name="query_lists[]"]')
            .each(function () {
              let value = $(this).val();
              if (value != '' && value) {
                notReqQuery.push(value);
              }
            });

          let queryOption = `<option value="">Select query</option> <option value="------" disabled="disabled" class="sel2_heading">------</option>`;
          let status = [];
          $.each(queryNames, function (key, item) {
            if (!notReqQuery.includes(item.name)) {
              let sel = '';
              if (item.name == dropDownValue) {
                sel = 'selected';
              } else {
                sel = '';
              }
              queryOption += `<option value="${item.name}" ${sel} data-id="${item.id}" data-name="${item.name}">${item.name}</option>`;
              status.push(true);
            } else {
              status.push(false);
            }
          });

          let querySec =
            `<div class="panel panel-default subQuerySec" data-table="${tableId}" data-editor="${editorId}" >` +
            ` <div class="panel-heading currentPanel"> <h4 class="panel-title add-rule-outer" style="display: flex; justify-content: space-between; align-items: center;"> &nbsp; <div class="pull-right add-rule-inner"> <div class="dflex" style="display: flex; "> <label>Query name</label> <select name="query_lists[]" class=" input-md form-control query_lists" data-parsley-error-message="Select query" data-show-subtext="true" data-live-search="true"> ${queryOption} </select><button type="button" class="btn btn-info btn-xs btn-tcenter add-query-rule-btn"> Add rule</button> </div> </div> </h4> </div>` +
            ` <div class="panel-body panel-collapse collapse in currentPanelBody" aria-expanded="true"> <div class="tab-pane active"> <h4><span> Query prompt </span></h4> <div class="row"> <div class="col-md-12"> <table id="${tableId}" class="table v-align table-striped table-hover filter-table"> <thead> <tr> <th width="8%"> ID </th> <th> Prompt </th><th width="10%"> Action </th>  </tr> </thead> <tfoot> <tr> <th width="8%"> ID </th> <th> Prompt </th><th width="10%"> Action </th>  </tr> </tfoot> <tbody> </tbody> </table> </div> </div> <div class="row"> <div class="col-md-12 col-sm-12 query-editor-outer"> <h4> Query </h4> <textarea id="${queryCode.name}" class="queryEditor" data-id=""></textarea> </div> </div> </div> </div> </div>`;
          $('.mainQueryWrapper').append(querySec);

          let queryEditor = CodeMirror.fromTextArea(
            document.getElementById(queryCode.name),
            {
              lineNumbers: true,
              theme: 'dracula',
              mode: 'sql',
            }
          );
          queryEditor.setValue(queryCode.code);
          queryEditors.push(queryEditor);

          $('#' + tableId + ' tfoot th').each(function () {
            let title = $('#' + tableId + ' thead th')
              .eq($(this).index())
              .text()
              .trim();
            if (title != '' && title) {
              $(this).html(
                '<input type="text" class="filter" placeholder="' +
                  title +
                  '" />'
              );
            }
          });

          $('#' + tableId)
            .DataTable({
              iDisplayLength: 25, // Set the default number of rows to display
              language: {
                info: 'Showing _START_ to _END_ of _TOTAL_ query rules',
              },
            })
            .columns()
            .every(function () {
              var that = this;

              $('input', this.footer()).on('keyup change', function () {
                that.search(this.value).draw();
              });
            });

          $.each(tableData, function (key, arr) {
            let html = `<tr data-id="${arr['0']}" data-rule="${arr['1']}" class="rule-row"> <td width="8%"> ${arr['0']} </td> <td> ${arr['1']} </td><td width="10%"><em class="icon icon-eye view-query-prompt mt0" style="color:#cb427c;" title="View"></em><em class="icon icon-pencil edit-query-prompt mt0" style="color:#cb427c; padding-left:10px" title="Edit"></em><i class="icon icon-close  delete-query-prompt" style="color:#cb427c; padding-left:10px" title="Delete"></i></td></tr>`;
            $('#' + tableId)
              .DataTable()
              .row.add($(html))
              .draw();
          });
          tableDetails(tableId);
          queryDropdown();
          $('.chosen-select').trigger('chosen:updated');
        });
      }
      $('.ref-schema-tab a').tab('show');
    }

    // Query engineering list base functionality
    $('#save-btn').on('click', function () {
      let Form = $('#screenForm');
      let FormInstance = Form.parsley();
      FormInstance.validate();
      let data = SerializeArrToJson(Form.serializeArray());

      if (FormInstance.isValid()) {
        var editorValues = [];

        // update split schema editor code
        updateSplitEditors.forEach(function (editor) {
          var editorValue = editor.getValue();
          editorValues.push({
            name: editor.getTextArea().getAttribute('data-id'),
            code: editorValue,
          });
        });

        // reference schema editor code
        let refSchemeEditorData = {
          name: refSchemeEditor.getTextArea().getAttribute('data-id'),
          code: refSchemeEditor.getValue(),
        };

        // update scheme editor code
        let updateSchemeEditorData = {
          name: updateSchemeEditor.getTextArea().getAttribute('data-id'),
          code: updateSchemeEditor.getValue(),
        };

        // query sections data
        let queryData = [];
        $(document)
          .find('.subQuerySec')
          .each(function () {
            let queryName = $(this).find('[name="query_lists[]"]').val();
            let tableId = $(this).attr('data-table');
            let editorId = $(this).attr('data-editor');
            let tableData = [];
            let table = $('#' + tableId).DataTable();
            let editorCode = {};
            queryEditors.forEach(function (editor) {
              if (editor.getTextArea().getAttribute('id') == editorId) {
                editorCode = {
                  name: editor.getTextArea().getAttribute('id'),
                  code: editor.getValue(),
                };
              }
            });

            table.rows().every(function () {
              var data = this.data().slice();
              data.splice(2, 1); // Remove the third column
              tableData.push(data);
            });

            queryData.push({
              name: queryName,
              table: tableData,
              editorCode: editorCode,
            });
          });

        // assign data
        data['queryData'] = queryData;
        data['systemRulesList'] = systemRulesList;
        data['promptRulesList'] = promptRulesList;
        data['updateSchemeEditor'] = updateSchemeEditorData;
        data['refSchemeEditor'] = refSchemeEditorData;
        data['updateSplitEditors'] = editorValues;
        mainData[data['query_id']] = { ...data };
        console.log('data: ', data);
        localStorage.setItem(
          'Query engineering list',
          JSON.stringify(mainData)
        );
        window.location.href = `query-engineering-view.html?v=${data['query_id']}`;
      }
    });
  }); // get.json function close
});
