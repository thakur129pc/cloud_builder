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

  // check chat_version in local storage
  var currentVersion = '1.5.8';
  if (localStorage.getItem('chat_version') === null) {
    localStorage.clear();
    localStorage.setItem('chat_version', currentVersion);
  } else {
    let chat_version = localStorage.getItem('chat_version');
    if (chat_version.localeCompare(currentVersion) != 0) {
      localStorage.clear();
      localStorage.setItem('chat_version', currentVersion);
      console.log('chat_version', currentVersion);
    } else {
      console.log('chat_version', currentVersion);
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
    let mainData = {};
    let promptRulesList = [
      { id: '362', rule: "Don't assume anything" },
      {
        id: '213',
        rule: 'Please follow the foreign key and primary key relation only',
        children: [
          {
            id: 3,
            rule: 'Each table should have a primary key that uniquely identifies each record in that table',
          },
          {
            id: 5,
            rule: 'Tables should relate to each other using foreign key constraints',
            children: [{ id: 6, rule: "Don't assume anything" }],
          },
        ],
      },
      {
        id: '250',
        rule: 'This instruction emphasizes the importance of maintaining proper relationships between tables using primary and foreign keys',
      },
      {
        id: '654',
        rule: 'maintain the consistency and accuracy of data within the database',
      },
    ];

    let systemRulesList = [
      {
        id: '362',
        rule: 'Tables should relate to each other using foreign key constraints',
      },
      {
        id: '213',
        rule: 'Please follow the foreign key and primary key relation only',
        children: [
          {
            id: 3,
            rule: 'Each table should have a primary key that uniquely identifies each record in that table',
          },
          {
            id: 5,
            rule: "Don't assume anything",
            children: [{ id: 6, rule: "Don't assume anything" }],
          },
        ],
      },
      {
        id: '250',
        rule: 'This instruction emphasizes the importance of maintaining proper relationships between tables using primary and foreign keys',
      },
      {
        id: '654',
        rule: 'maintain the consistency and accuracy of data within the database',
      },
    ];

    function expandChildren($parentItem) {
      let $childrenList = $parentItem.find('ol.dd-list');

      var $btnExpand = $parentItem.find('button[data-action="expand"]');
      var $btnCollapse = $parentItem.find('button[data-action="collapse"]');
      // var $childList = $parentItem.children('ol.dd-list');

      $btnExpand.hide();
      $btnCollapse.show();
      // $childList.show();

      $childrenList.show(); // Display the children
      $parentItem.removeClass('dd-collapsed'); // Remove the collapsed class from the parent

      // Check and expand children's children recursively
      $childrenList.children('li.dd-item').each(function () {
        let $childItem = $(this);
        if ($childItem.find('ol.dd-list').length > 0) {
          expandChildren($childItem);
        }
      });
    }

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
            '"><a class="btn-add-rule add-new-rule-anchor" data-toggle="modal" data-target="#add-new-prompt-rule-popup"><i class="fa fa-plus add-child"></i></a><a class="btn-edit-rule prompt-rule-edit" data-toggle="modal" data-target="#add-new-prompt-rule-popup"><i class="fa fa-pencil"></i></a><div class="dd-handle dd3-handle">&nbsp;</div> <div class="dd3-content">' +
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
    createNested(promptRulesList, $('#nestable'));

    // Initialize Nestable plugin for prompt
    $('#nestable').nestable({
      maxDepth: 20, // or just don't specify the maxDepth option
    });
    $('#nestable').nestable('collapseAll');

    // trigger prompt modal to add items
    $('#nestable').on('click', '.add-child', function (event) {
      $('#add-prompt-rule-btn').show();
      $('#edit-prompt-rule-btn').hide();
      let Form = $('.add-new-prompt-form');
      Form.trigger('reset');
      $('li.dd-item').removeClass('active-parent');
      $(this)
        .parent('a.add-new-rule-anchor')
        .parent('li.dd-item')
        .addClass('active-parent');
    });

    // add new prompt rule nestable list
    $(document).on('click', '#add-prompt-rule-btn', function (event) {
      event.stopPropagation();

      let Form = $('.add-new-prompt-form');
      let FormInstance = Form.parsley();
      FormInstance.validate();
      let data = SerializeArrToJson(Form.serializeArray());
      if (FormInstance.isValid()) {
        const { rule } = data;
        let id = randomString();

        var newItem = { id: id, rule: rule };

        var newLi = $(
          '<li class="dd-item dd3-item" data-id="' +
            newItem.id +
            '" data-rule="' +
            newItem.rule +
            '"><a class="btn-add-rule add-new-rule-anchor" data-toggle="modal" data-target="#add-new-prompt-rule-popup"><i class="fa fa-plus add-child"></i></a><a class="btn-edit-rule prompt-rule-edit"><i class="fa fa-pencil"></i></a><div class="dd-handle dd3-handle">&nbsp;</div> <div class="dd3-content">' +
            newItem.rule +
            '</div></li>'
        );

        if ($('li.dd-item').hasClass('active-parent')) {
          let list = $('li.dd-item.active-parent').children('ol.dd-list');
          if (list.length === 0) {
            list = $('<ol class="dd-list"></ol>');
            $('li.dd-item.active-parent').append(list);
          }

          list.append(newLi);
          $('#nestable').nestable('re_init');
          $('#nestable').nestable('collapseAll');
          let mainParent = $(document)
            .find('li.dd-item.active-parent')
            .parents('li.dd-item');
          if (mainParent.length > 0) {
            expandChildren(mainParent);
          } else {
            mainParent = $(document).find('li.dd-item.active-parent');
            var $btnExpand = $(document)
              .find('li.dd-item.active-parent')
              .find('button[data-action="expand"]');
            var $btnCollapse = $(document)
              .find('li.dd-item.active-parent')
              .find('button[data-action="collapse"]');
            // var $childList = $parentItem.children('ol.dd-list');

            $btnExpand.hide();
            $btnCollapse.show();
            mainParent.removeClass('dd-collapsed'); // Remove the collapsed class from the parent
            mainParent.find('ol.dd-list').show(); // Display the children
          }
        } else {
          let list = $('#nestable').children('ol.dd-list.main_prompt_ol');
          list.append(newLi);
        }

        Form.trigger('reset');
        $('#add-new-prompt-rule-popup').modal('hide');
      }
    });

    // trigger prompt popup to add main item
    $('.mainPromptItems').on('click', function () {
      $('#add-prompt-rule-btn').show();
      $('#edit-prompt-rule-btn').hide();
      let Form = $('.add-new-prompt-form');
      Form.trigger('reset');
      $('li.dd-item').removeClass('active-parent');
    });

    // trigger prompt modal for edit
    $(document).on('click', '.prompt-rule-edit', function () {
      $('li.dd-item').removeClass('active-edit');
      $(this).parent('li.dd-item').addClass('active-edit');

      let contentElement = $(this).closest('.dd-item').children('.dd3-content');
      let Form = $('.add-new-prompt-form');
      let content = contentElement.text().trim();
      Form.find('[name="rule"]').val(content);
      $('#add-prompt-rule-btn').hide();
      $('#edit-prompt-rule-btn').show();
      $('#add-new-prompt-rule-popup').modal('show');
    });

    // edit prompt text
    $('#edit-prompt-rule-btn').on('click', function () {
      let Form = $('.add-new-prompt-form');
      let FormInstance = Form.parsley();
      FormInstance.validate();
      let data = SerializeArrToJson(Form.serializeArray());
      if (FormInstance.isValid()) {
        let { rule } = data;
        $('#nestable li.dd-item.active-edit').attr('data-rule', rule);
        $('#nestable li.dd-item.active-edit')
          .children('.dd3-content')
          .text(rule);
        $('#nestable li.dd-item').removeClass('active-edit');
        $('#add-new-prompt-rule-popup').modal('hide');
        Form.trigger('reset');
      }
    });

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
            '"><a class="btn-add-rule add-new-rule-anchor" data-toggle="modal" data-target="#add-new-system-rule-popup"><i class="fa fa-plus add-child"></i></a><a class="btn-edit-rule system-rule-edit" data-toggle="modal" data-target="#add-new-system-rule-popup"><i class="fa fa-pencil"></i></a><div class="dd-handle dd3-handle">&nbsp;</div> <div class="dd3-content">' +
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
    createSysNested(systemRulesList, $('#systemNestable'));

    // Initialize Nestable plugin for prompt
    $('#systemNestable').nestable({
      maxDepth: 20, // or just don't specify the maxDepth option
    });
    $('#systemNestable').nestable('collapseAll');

    // trigger system modal to add items
    $('#systemNestable').on('click', '.add-child', function (event) {
      $('#add-system-rule-btn').show();
      $('#edit-system-rule-btn').hide();
      let Form = $('.add-new-system-form');
      Form.trigger('reset');
      $('#systemNestable li.dd-item').removeClass('active-sys-parent');
      $(this)
        .parent('a.add-new-rule-anchor')
        .parent('li.dd-item')
        .addClass('active-sys-parent');
    });

    // add new system rule to nestable list
    $(document).on('click', '#add-system-rule-btn', function (event) {
      event.stopPropagation();

      let Form = $('.add-new-system-form');
      let FormInstance = Form.parsley();
      FormInstance.validate();
      let data = SerializeArrToJson(Form.serializeArray());
      if (FormInstance.isValid()) {
        const { rule } = data;
        let id = randomString();

        var newItem = { id: id, rule: rule };

        var newLi = $(
          '<li class="dd-item dd3-item" data-id="' +
            newItem.id +
            '" data-rule="' +
            newItem.rule +
            '"><a class="btn-add-rule add-new-rule-anchor" data-toggle="modal" data-target="#add-new-system-rule-popup"><i class="fa fa-plus add-child"></i></a><a class="btn-edit-rule system-rule-edit"><i class="fa fa-pencil"></i></a><div class="dd-handle dd3-handle">&nbsp;</div> <div class="dd3-content">' +
            newItem.rule +
            '</div></li>'
        );

        if ($('li.dd-item').hasClass('active-sys-parent')) {
          let list = $('li.dd-item.active-sys-parent').children('ol.dd-list');
          if (list.length === 0) {
            list = $('<ol class="dd-list"></ol>');
            $('li.dd-item.active-sys-parent').append(list);
          }

          list.append(newLi);
          $('#systemNestable').nestable('re_init');
          $('#systemNestable').nestable('collapseAll');
          let mainParent = $(document)
            .find('li.dd-item.active-sys-parent')
            .parents('li.dd-item');
          if (mainParent.length > 0) {
            expandChildren(mainParent);
          } else {
            mainParent = $(document).find('li.dd-item.active-sys-parent');
            var $btnExpand = $(document)
              .find('li.dd-item.active-sys-parent')
              .find('button[data-action="expand"]');
            var $btnCollapse = $(document)
              .find('li.dd-item.active-sys-parent')
              .find('button[data-action="collapse"]');
            // var $childList = $parentItem.children('ol.dd-list');

            $btnExpand.hide();
            $btnCollapse.show();
            mainParent.removeClass('dd-collapsed'); // Remove the collapsed class from the parent
            mainParent.find('ol.dd-list').show(); // Display the children
          }
        } else {
          let list = $('#systemNestable').children('ol.dd-list.main_system_ol');
          list.append(newLi);
        }

        Form.trigger('reset');
        $('#add-new-system-rule-popup').modal('hide');
      }
    });

    // trigger system popup to add main item
    $('.mainSystemItems').on('click', function () {
      $('#add-system-rule-btn').show();
      $('#edit-system-rule-btn').hide();
      let Form = $('.add-new-system-form');
      Form.trigger('reset');
      $('#systemNestable li.dd-item').removeClass('active-sys-parent');
    });

    // trigger system modal for edit
    $(document).on('click', '.system-rule-edit', function () {
      $('#systemNestable li.dd-item').removeClass('active-sys-edit');
      $(this).parent('li.dd-item').addClass('active-sys-edit');

      let contentElement = $(this).closest('.dd-item').children('.dd3-content');
      let Form = $('.add-new-system-form');
      let content = contentElement.text().trim();
      Form.find('[name="rule"]').val(content);
      $('#add-system-rule-btn').hide();
      $('#edit-system-rule-btn').show();
      $('#add-new-system-rule-popup').modal('show');
    });

    // edit system text
    $('#edit-system-rule-btn').on('click', function () {
      let Form = $('.add-new-system-form');
      let FormInstance = Form.parsley();
      FormInstance.validate();
      let data = SerializeArrToJson(Form.serializeArray());
      if (FormInstance.isValid()) {
        let { rule } = data;
        $('#systemNestable li.dd-item.active-sys-edit').attr('data-rule', rule);
        $('#systemNestable li.dd-item.active-sys-edit')
          .children('.dd3-content')
          .text(rule);
        $('#systemNestable li.dd-item').removeClass('active-sys-edit');
        $('#add-new-system-rule-popup').modal('hide');
        Form.trigger('reset');
      }
    });

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

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    if (localStorage.getItem('Query engineering list') !== null) {
      mainData = JSON.parse(localStorage.getItem('Query engineering list'));
    } else {
      mainData = {};
    }

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
    $('#query_id').val(randomString());

    // form serialize arr to json
    function SerializeArrToJson(formSerializeArr) {
      var jsonObj = {};
      jQuery.map(formSerializeArr, function (n, i) {
        if (n.name.endsWith('Arr')) {
          var name = n.name;
          // name = name.substring(0, name.length - 2);
          if (!(name in jsonObj)) {
            jsonObj[name] = [];
          }
          jsonObj[name].push(n.value);
        } else if (!n.name.endsWith('_length') && !n.name.endsWith('[]')) {
          jsonObj[n.name] = n.value;
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
    // add queries to dropdown
    $('[name="database"]').on('change', function () {
      queryNames = [];
      let dbValue = $(this).val();
      let option = `<option value="">Select subschema</option>`;
      let queryOption = `<option value="">Select query</option> <option value="------" disabled="disabled" class="sel2_heading">------</option>`;
      let dbArrList = Object.values(dbList);
      // filter selected db
      let [subschemaSelected] = dbArrList.filter((curElem, i) => {
        if (curElem.uniqueId == dbValue) {
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
          queryNames.push({
            name: value.query_name,
            id: value.query_id,
            dbId: dbValue,
          });

          queryOption += `<option value="${value.query_name}" data-id="${value.query_id}" data-name="${value.query_name}" data-dbId="${dbValue}">${value.query_name}</option>`;
        });
      }
      $('.query-tab-outer a').tab('show');
      $('.mainQueryWrapper').html('');
      querySection();
      // $('[name="subschemaName"]').html(option);
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

    // add schemas and query to dropdown
    $('[name="multiDatabaseArr"]').on('change', function () {
      queryNames = [];
      let db = $(this).val();

      let option = `<option value="">Select subschema</option>`;
      let queryOption = `<option value="">Select query</option> <option value="------" disabled="disabled" class="sel2_heading">------</option>`;
      // let dbArrList = Object.values(dbList);

      if (db && db != '') {
        $.each(db, function (key, item) {
          // filter selected db
          let subschemaSelected = dbList[item];

          if (typeof subschemaSelected == 'object') {
            // subschema names
            $.each(subschemaSelected.sub_schemas_status, function (key, value) {
              if (value.status != 'Inactive') {
                option += `<option value="${value.name}" data-id="${value.id}" data-name="${value.name}" data-status="${value.status}" data-dbId="${item}">${value.name}</option>`;
              }
            });

            // query names
            $.each(subschemaSelected.queries, function (key, value) {
              queryNames.push({
                name: value.query_name,
                id: value.query_id,
                dbId: item,
              });

              queryOption += `<option value="${value.query_name}" data-id="${value.query_id}" data-name="${value.query_name}" data-dbId="${item}">${value.query_name}</option>`;
            });
          }
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
      $('#sub-editor-outer').html(
        '<textarea id="work-schema-initial-editor" ata-id="work-schema-initial-editor"></textarea>'
      );
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
      updateSplitEditors = [];

      $('.ref-schema-tab a').tab('show');
      // $('[name="schemaType"]').attr('checked', false);
      // $('.subschema-row').addClass('hidden');
      // $('.work-schema-tablewise-tab-outer').hide();
      $('.chosen-select').trigger('chosen:updated');
    });

    // enable add btn for query rule
    $(document).on('change', '[name="query_lists[]"]', function () {
      let value = $(this).val();
      $('.add-query-rule-btn').attr('disabled', false);
      let editorId = $(this).find('option:selected').attr('data-id');
      let tableId = $(this).parents('.subQuerySec').attr('data-table');
      let db_id = $(this).find('option:selected').attr('data-dbId');

      $(this)
        .parents('.currentPanel')
        .siblings('.currentPanelBody')
        .find('.queryEditor')
        .attr('data-id', editorId);

      let selSchemaType = $('[name="schemaType"]:checked').val();

      let subschemaSelected = dbList[db_id];

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
    });

    // enable subschema dropdown
    $('[name="schemaType"]').on('click', function () {
      let db = $('[name="database"]').val();
      let value = $('[name="schemaType"]:checked').val();

      if (value == 'Subschema') {
        $('#sub-editor-outer').html(
          '<textarea id="work-schema-initial-editor" ata-id="work-schema-initial-editor"></textarea>'
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

        $('[name="database"]')
          .val('')
          .attr('required', false)
          .trigger('chosen:updated');
        $('[name="multiDatabaseArr"]')
          .attr('required', true)
          .trigger('chosen:updated');
        $('.database-dropdown').addClass('hidden');
        $('.multi-select-dropdown').removeClass('hidden');
      } else if (value == 'Full') {
        $('#sub-editor-outer').html(
          '<textarea id="work-schema-initial-editor" data-id="work-schema-initial-editor"></textarea>'
        );
        $('.subschema-row').addClass('hidden');
        $('#subschemaName')
          .attr('disabled', true)
          .val('')
          .trigger('chosen:updated');
        $('[name="database"]').attr('required', true).trigger('chosen:updated');
        $('[name="multiDatabaseArr"]')
          .val('')
          .attr('required', false)
          .trigger('chosen:updated');
        $('.database-dropdown').addClass('hidden');
        $('.single-select-dropdown').removeClass('hidden');

        if (db != 'init' && db && db != '') {
          let dbArrList = Object.values(dbList);
          let [subschemaSelected] = dbArrList.filter((curElem, i) => {
            if (curElem.uniqueId == db) {
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

      let db = $('[name="multiDatabaseArr"]').val();
      let fullSchema = [];
      let subSchema = [];

      if (db.length > 0) {
        $.each(db, function (key, value) {
          let subschemaSelected = dbList[value];
          let tables = subschemaSelected['tables'];
          $.each(tables, function (k, curQuery) {
            if (curQuery.sub_schema.includes(name)) {
              subSchema.push({ name: curQuery.name, query: curQuery.query });
              fullSchema.push(curQuery.query);
            }
          });
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
          queryOption += `<option value="${item.name}" data-id="${item.id}" data-name="${item.name}" data-dbId="${item.dbId}">${item.name}</option>`;
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

    // Query engineering list base functionality
    $('#save-btn').on('click', function () {
      let Form = $('#screenForm');
      let FormInstance = Form.parsley();
      FormInstance.validate();
      let data = SerializeArrToJson(Form.serializeArray());
      console.log('data: ', data);

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
              let dataList = this.data().slice();
              dataList.splice(2, 1); // Remove the third column
              tableData.push(dataList);
            });

            queryData.push({
              name: queryName,
              table: tableData,
              editorCode: editorCode,
            });
          });

        // assign data
        data['queryData'] = queryData;
        data['systemRulesList'] = $('#systemNestable').nestable('serialize');
        data['promptRulesList'] = $('#nestable').nestable('serialize');
        data['updateSchemeEditor'] = updateSchemeEditorData;
        data['refSchemeEditor'] = refSchemeEditorData;
        data['updateSplitEditors'] = editorValues;
        mainData[data['query_id']] = { ...data };
        localStorage.setItem(
          'Query engineering list',
          JSON.stringify(mainData)
        );
        window.location.href = `query-engineering-view.html?v=${data['query_id']}`;
      }
    });
  }); // get.json function close
});
