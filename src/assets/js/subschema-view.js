$(document).ready(function () {
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

  let mainData = {};
  let tableLists = {};

  if (localStorage.getItem('Link Data') !== null) {
    mainData = JSON.parse(localStorage.getItem('Link Data'));
  }

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

  function tableActive(id) {
    // Search functionality
    $('#' + id + ' tfoot th').each(function () {
      let title = $('#' + id + ' thead th')
        .eq($(this).index())
        .text()
        .trim();
      if (title != '' && title) {
        $(this).html(
          '<input type="text" class="filter" placeholder="' + title + '" />'
        );
      }
    });

    $('#' + id)
      .DataTable({
        iDisplayLength: 25, // Set the default number of rows to display
        language: {
          info: 'Showing _START_ to _END_ of _TOTAL_ tables',
        },
        columnDefs: [
          { targets: 0, orderable: false }, // Disable sorting for the first column (column index 0)
        ],
        order: [[1, 'asc']], // Index 1 (second column), ascending order
      })
      .columns()
      .every(function () {
        var that = this;

        $('input', this.footer()).on('keyup change', function () {
          that.search(this.value).draw();
        });
      });
    tableDetails(id);
  }

  function databaseTable(dbId, tableId, checkSchema) {
    let tableData = mainData[dbId]['tables'];
    let subSchemas = mainData[dbId]['sub_schemas'];

    if (tableData != undefined) {
      // $('#' + tableId).DataTable().clear().draw();
      let TableRows = '';
      let newTableRows = [];
      $.each(tableData, function (i, item) {
        const {
          name,
          description,
          tag,
          group,
          db_permission,
          number_of_records,
          access_level,
          sub_schema,
          checkbox,
        } = item;
        console.log('sub_schema: ', sub_schema);

        let initTag = tag;
        let tagStatus = '';
        let initDesc = description;
        let descStatus = '';
        let sel = '';
        let schema = '';
        if (sub_schema != undefined) {
          if (
            sub_schema.includes(checkSchema) &&
            subSchemas.includes(checkSchema)
          ) {
            sel = 'checked';
            newTableRows.push({ ...item, checkbox: true });
          } else {
            newTableRows.push({ ...item, checkbox: false });
          }
          schema = sub_schema.join(', ');
        }

        TableRows += `<tr data-id="${name}" data-desc="${initDesc}" data-tag="${initTag}" data-ai-access="${access_level}" class="table-list-inner"> <td width="7%"> <div class="c-checkbox"> <label> <input disabled ${sel} type="checkbox"  name="sub_checkbox[]" class="checkall prompt_check"> <span class="fa fa-check"></span> </label> </div> </td> <td width="15%"> ${name} </td> <td width="34%" class="editText ${descStatus}" data-name="description"> ${initDesc} </td> <td width="15%"> ${schema} </td> <td width="14%"> ${access_level ? 'Yes' : 'No'}  </td> <td width="15%" class="editText ${tagStatus}" data-name="tag"> ${initTag} </td> </tr>`;
      });
      mainData[dbId]['tables'] = newTableRows;
      tableLists[dbId] = newTableRows;
      return TableRows;
    } else {
      return '';
    }
  }

  // get id from url
  let url = window.location.href;
  let viewSubschema = '';
  let status = '';
  if (url.indexOf('v=') !== -1) {
    let params = new URLSearchParams(window.location.search);
    let uniqueId = params.get('v');
    viewSubschema = params.get('n');
    status = params.get('s');
    $('#uuid').val(uniqueId);

    if (localStorage.getItem('Link Data') !== null) {
      let LinkData = JSON.parse(localStorage.getItem('Link Data'));
      let tabLists = '<ul class="nav nav-tabs" role="tablist">';
      let tabPanels = '<div class="tab-content">';

      let dbOptions = '<option value="">Select database</option>';
      let $i = 1;
      let tableIdList = [];
      $.each(LinkData, function (key, item) {
        let sel;
        $i == 1 ? (sel = 'active') : (sel = '');

        // database dropdown
        let { dbName, uniqueId } = item;
        let databaseId = dbName.replaceAll(' ', '_');
        let tableId = 'table_' + databaseId;
        let select = '';
        $i == 1 ? (select = 'selected') : (select = '');
        dbOptions += `<option value="${uniqueId}" ${select} data-db-tab="${databaseId}">${dbName}</option>`;
        // database tab list

        tableIdList.push(tableId);
        tabLists += `<li role="presentation" class="${sel} ${databaseId}"> <a href="#${databaseId}" aria-controls="${databaseId}" role="tab" data-toggle="tab"> ${dbName} </a> </li>`;

        // database tab panel
        tabPanels += `<div role="tabpanel" class="tab-pane ${sel}" id="${databaseId}"><div class="row"><div class="col-md-12"><table id="${tableId}" data-table-id="${tableId}" data-db-id="${uniqueId}" class="datatable_common table v-align table-striped table-hover filter-table"><thead><tr><th width="7%"><div class="c-checkbox"><label><input disabled type="checkbox" name="main_checkbox[]" class="checkall main_checkbox"><span class="fa fa-check"></span></label></div></th><th width="15%"> Table name </th><th width="34%"> Description </th><th width="15%"> Subschema </th><th width="14%"> AI access level </th><th width="15%"> Tag name </th></tr></thead><tfoot><tr><th width="7%"></th><th width="15%"> Table name </th><th width="34%"> Description </th><th width="15%"> Subschema </th><th width="14%"> AI access level </th><th width="15%"> Tag name </th></tr></tfoot><tbody>${databaseTable(uniqueId, tableId, viewSubschema)}</tbody></table></div></div></div>`;
        $i++;
      });
      tabLists += '</ul>';
      tabPanels += '</div>';
      $('#datatable-tabs').html('');
      $('#datatable-tabs').append(tabLists);
      $('#datatable-tabs').append(tabPanels);
      // $('[name="database"]').html(dbOptions);
      $.each(tableIdList, function (key, value) {
        tableActive(value);
      });

      $('[name="subschema_name"]').val(viewSubschema);
      $(`[name="status"][value="${status}"]`).prop('checked', true);
    }
  }

  // redirect to edit screen
  $('.edit-btn').on('click', function () {
    let id = $('#uuid').val();
    window.location.href = `subschema-edit.html?v=${id}&n=${viewSubschema}&s=${status}`;
  });
}); // document ready end
