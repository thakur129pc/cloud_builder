(function ($) {
  var $plugin = $('<div>').nestable().data('nestable');
  //console.log("plugin: %o", $plugin);

  var extensionMethods = {
    re_init: function () {
      //console.log('re_init: %o', this);

      // alias
      var list = this;

      // remove expand/collapse controls
      $.each(this.el.find(this.options.itemNodeName), function (k, el) {
        list.expandItem($(el));

        // if has <ol> child - remove previously prepended buttons
        if ($(el).children(list.options.listNodeName).length) {
          $(el).children('button').remove();
        }
      });

      // remove delegated event handlers
      list.el.off('click', 'button');

      var hasTouch = 'ontouchstart' in document;
      if (hasTouch) {
        list.el.off('touchstart');
        list.w.off('touchmove');
        list.w.off('touchend');
        list.w.off('touchcancel');
      }

      list.el.off('mousedown');
      list.w.off('mousemove');
      list.w.off('mouseup');

      // call init again
      list.init();
    }, // re_init
  };

  $.extend(true, $plugin.__proto__, extensionMethods);
})(jQuery);

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
        readOnly: true, // Make the editor read-only
      }
    );

    $('.query-tab-outer a').tab('show');
    let queryEditor = CodeMirror.fromTextArea(
      document.getElementById('query-code-editor'),
      {
        lineNumbers: true,
        theme: 'dracula',
        mode: 'sql',
        readOnly: true, // Make the editor read-only
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
      let { dbName, uniqueId } = item;
      option += `<option value="${uniqueId}" data-id="${uniqueId}" data-db-name="${dbName}">${dbName}</option>`;
    });
    $('[name="database"]').append(option);
    $('[name="multiDatabaseArr"]').append(option);

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
          readOnly: true, // Make the editor read-only
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

    let url = location.href;

    if (url.indexOf('v=') != -1) {
      let params = new URLSearchParams(window.location.search);
      let userId = params.get('v');
      let viewData = mainData[userId];
      if (viewData) {
        // database dropdown functionality
        if (
          viewData.multiDatabaseArr != undefined &&
          viewData.multiDatabaseArr
        ) {
          $.each(viewData.multiDatabaseArr, function (i, option) {
            $('[name="multiDatabaseArr"]')
              .find('option[value="' + option + '"]')
              .attr('selected', true);
          });
          $('select[name="multiDatabaseArr"]').trigger('chosen:updated');
        }

        for (let key in viewData) {
          let inputType = $(`[name="${key}"]`);
          if (inputType.attr('type') == 'radio') {
            $(`[type="radio"][name="${key}"][value="${viewData[key]}"]`).prop(
              'checked',
              true
            );
          } else {
            if (viewData[key] != '') {
              console.log('viewData[key]: ', key);
              $(`[name="${key}"]`).val(viewData[key]);
            }
          }
        }

        if (
          viewData.database != undefined &&
          viewData.database &&
          viewData.database != 'init'
        ) {
          $('[name="database"]').trigger('change');
          console.log('database: ');
          $('[name="schemaType"][value="Full"]').prop('checked', true);
        }
        $('.chosen-select').trigger('chosen:updated');

        // schema type enable
        if ('schemaType' in viewData) {
          if (viewData['schemaType'] == 'Subschema') {
            $('.subschema-row').removeClass('hidden');
            $('.single-select-dropdown').addClass('hidden');
            $('.multi-select-dropdown').removeClass('hidden');
            $('.work-schema-tablewise-tab-outer').show();
            $('.work-schema-tablewise-tab-outer a').tab('show');
            var workInitialEditor = CodeMirror.fromTextArea(
              document.getElementById('work-schema-initial-editor'),
              {
                lineNumbers: true,
                theme: 'dracula',
                mode: 'sql',
                readOnly: true, // Make the editor read-only
              }
            );
          }
        }

        // reference schema editor
        let referenceCode = viewData['updateSchemeEditor'];
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
                readOnly: true, // Make the editor read-only
              }
            );
            editor.setValue(item.code);
            updateSplitEditors.push(editor); // Store the editor instance
          });
        }

        // update prompt table
        promptRulesList = viewData['promptRulesList'];

        // Function to generate the nestable structure for prompts
        function createNested(data, parent) {
          var list = $('<ol class="dd-list main_prompt_ol"></ol>');
          parent.append(list);

          data.forEach(function (item) {
            var listItem = $(
              '<li class="dd-item dd3-item" data-id="' +
                item.id +
                '" data-rule="' +
                item.rule +
                '"><div class="dd-handle dd3-handle">&nbsp;</div> <div class="dd3-content">' +
                item.rule +
                '</div></li>'
            );
            list.append(listItem);

            if (item.children && item.children.length > 0) {
              createNested(item.children, listItem);
            }
          });
        }

        // Call the function to create the nested structure for prompt list
        if (promptRulesList.length > 0) {
          createNested(promptRulesList, $('#nestable'));
        }

        // Initialize Nestable plugin for prompt
        $('#nestable').nestable({
          drag: false, // Disable dragging
        });
        $('#nestable').nestable('collapseAll');

        // toggle nestable list prompt
        let isExpanded = false;
        $('.expand-all-items').on('click', function () {
          if (isExpanded) {
            $('#nestable').nestable('collapseAll');
            $(this).text('Expand All');
            isExpanded = false;
          } else {
            $('#nestable').nestable('expandAll');
            $(this).text('Collapse All');
            isExpanded = true;
          }
        });

        // update system table
        systemRulesList = viewData['systemRulesList'];

        // Function to generate the nestable structure for system
        function createSysNested(data, parent) {
          var list = $('<ol class="dd-list main_system_ol"></ol>');
          parent.append(list);

          data.forEach(function (item) {
            var listItem = $(
              '<li class="dd-item dd3-item" data-id="' +
                item.id +
                '" data-rule="' +
                item.rule +
                '"><div class="dd-handle dd3-handle">&nbsp;</div> <div class="dd3-content">' +
                item.rule +
                '</div></li>'
            );
            list.append(listItem);

            if (item.children && item.children.length > 0) {
              createSysNested(item.children, listItem);
            }
          });
        }

        // Call the function to create the nested structure for system list
        if (systemRulesList.length > 0) {
          createSysNested(systemRulesList, $('#systemNestable'));
        }

        // Initialize Nestable plugin for prompt
        $('#systemNestable').nestable({
          drag: false, // Disable dragging
        });
        $('#systemNestable').nestable('collapseAll');

        // toggle nestable list system
        let isSysExpanded = false;
        $('.expand-all-sys-items').on('click', function () {
          if (isSysExpanded) {
            $('#systemNestable').nestable('collapseAll');
            $(this).text('Expand All');
            isSysExpanded = false;
          } else {
            $('#systemNestable').nestable('expandAll');
            $(this).text('Collapse All');
            isSysExpanded = true;
          }
        });

        // query section update
        let queryData = viewData['queryData'];
        if (Array.isArray(queryData) && queryData.length > 0) {
          $('.mainQueryWrapper').html('');
          let dbArrList = Object.values(dbList);
          let currentDb = $('[name="database"]').val();
          // filter selected db
          let [subschemaSelected] = dbArrList.filter((curElem, i) => {
            if (curElem.dbName == currentDb) {
              return curElem;
            }
          });

          if (typeof subschemaSelected == 'object') {
            // query names
            $.each(subschemaSelected.queries, function (key, value) {
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

            let status = [];

            let querySec =
              `<div class="panel panel-default subQuerySec" data-table="${tableId}" data-editor="${editorId}" >` +
              ` <div class="panel-heading currentPanel"> <h4 class="panel-title add-rule-outer" style="display: flex; justify-content: space-between; align-items: center;"> &nbsp; <div class="pull-right add-rule-inner"> <div class="dflex" style="display: flex; "> <label>Query name</label> <input name="query_lists[]" class="queryName input-md form-control" value="${dropDownValue}" disabled> </div> </div> </h4> </div>` +
              ` <div class="panel-body panel-collapse collapse in currentPanelBody" aria-expanded="true"> <div class="tab-pane active"> <h4><span> Query prompt </span></h4> <div class="row"> <div class="col-md-12"> <table id="${tableId}" class="table v-align table-striped table-hover filter-table"> <thead> <tr> <th width="8%"> ID </th> <th> Prompt </th>  </tr> </thead> <tfoot> <tr> <th width="8%"> ID </th> <th> Prompt </th>  </tr> </tfoot> <tbody> </tbody> </table> </div> </div> <div class="row"> <div class="col-md-12 col-sm-12 query-editor-outer"> <h4> Query </h4> <textarea id="${queryCode.name}" class="queryEditor" data-id=""></textarea> </div> </div> </div> </div> </div>`;
            $('.mainQueryWrapper').append(querySec);

            let queryEditor = CodeMirror.fromTextArea(
              document.getElementById(queryCode.name),
              {
                lineNumbers: true,
                theme: 'dracula',
                mode: 'sql',
                readOnly: true, // Make the editor read-only
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
              let html = `<tr data-id="${arr['0']}" data-rule="${arr['1']}" class="rule-row"> <td width="8%"> ${arr['0']} </td> <td> ${arr['1']} </td></tr>`;
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

        $('.chosen-select').trigger('chosen:updated');
      }
    }

    // edit redirect functionality
    $('#edit-btn').on('click', function () {
      let query_id = $('#query_id').val();
      window.location.href = `query-engineering-edit.html?e=${query_id}`;
    });
  }); // get.json function close
});
