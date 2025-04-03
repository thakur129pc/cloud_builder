// check version in local storage
$(document).ready(function () {
  let tableList = [];
  let sub_schemas = [];
  let currentData = {};

  let mainData = {};

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
        if (n.value != '') {
          jsonObj[n.name] = n.value;
        }
      }
    });
    return jsonObj;
  }

  // custom functions
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
      $('#' + selector + '_length').hide();
      $('#' + selector + '_filter').show();
      $('#' + selector + '_info').hide();
      $('#' + selector + '_paginate').hide();
    }
  }

  // random number generator
  function randomString() {
    //generate random number
    var randomNumber = Math.floor(100 + Math.random() * 100);
    return randomNumber;
  }
  // $('#uuid').val(randomString());

  // Search functionality
  $('#table-list tfoot th').each(function () {
    let title = $('#table-list thead th').eq($(this).index()).text().trim();
    if (title != '' && title) {
      $(this).html(
        '<input type="text" class="filter" placeholder="' + title + '" />'
      );
    }
  });

  $('#table-list')
    .DataTable({
      iDisplayLength: 25, // Set the default number of rows to display
      language: {
        info: 'Showing _START_ to _END_ of _TOTAL_ tables',
      },
      columnDefs: [
        {
          targets: 0, // Targeting the first column (index 0)
          orderable: false, // Disabling sorting on this column
        },
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
  tableDetails('table-list');

  // get id from url
  let url = window.location.href;
  let viewSubschema = '';
  if (url.indexOf('v=') !== -1) {
    let params = new URLSearchParams(window.location.search);
    let uniqueId = params.get('v');
    viewSubschema = params.get('d');
    $('#uniqueId').val(uniqueId);

    if (localStorage.getItem('Link Data') !== null) {
      let rawData = JSON.parse(localStorage.getItem('Link Data'));
      currentData = rawData[uniqueId];

      for (let key in currentData) {
        $(`[name="${key}"]`).val(currentData[key]);
      }
      $('[name="subschema_name"]').val(viewSubschema);
      $('[name="database"]').val(currentData['dbName']);
      $.each(currentData['sub_schemas_status'], function (key, value) {
        if (value.name === viewSubschema) {
          $(`[name="status"][value="${value.status}"]`).prop('checked', true);
        }
      });

      tableList =
        currentData['tables'] != undefined ? currentData['tables'] : [];
      sub_schemas =
        currentData['sub_schemas'] != undefined
          ? currentData['sub_schemas']
          : [];
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
          let status = sub_schema.includes(viewSubschema) ? 'checked' : '';
          let html = `<tr data-id="${name}" class="table-list-inner" data-desc="${initDesc}" data-tag="${initTag}" data-ai-access="${access_level}"><td width="7%"> <div class="c-checkbox"> <label> <input ${status} type="checkbox" ${checkbox ? 'checked' : ''} name="sub_checkbox[]" class="checkall prompt_check"> <span class="fa fa-check"></span> </label> </div> </td> <td width="15%"> ${name} </td> <td width="34%" class="editText ${descStatus}" data-name="description"> ${initDesc} </td> <td width="15%"> ${sub_schema.join(', ')} </td> <td width="14%"> ${access_level ? 'Yes' : 'No'} </td><td width="15%" class="editText ${tagStatus}" data-name="tag"> ${initTag} </td> </tr>`;
          $('#table-list').DataTable().row.add($(html)).draw();
        });
      }
      tableDetails('table-list');
    }
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
        let status = sub_schema.includes(viewSubschema) ? 'checked' : '';
        let html = `<tr data-id="${name}" class="table-list-inner" data-desc="${initDesc}" data-tag="${initTag}" data-ai-access="${access_level}"> <td width="7%"> <div class="c-checkbox"> <label> <input ${status} type="checkbox" ${checkbox ? 'checked' : ''} name="sub_checkbox[]" class="checkall prompt_check"> <span class="fa fa-check"></span> </label> </div> </td> <td width="15%"> ${name} </td> <td width="34%" class="editText ${descStatus}" data-name="description"> ${initDesc} </td> <td width="15%"> ${sub_schema.join(', ')} </td> <td width="14%"> ${access_level ? 'Yes' : 'No'} </td><td width="15%" class="editText ${tagStatus}" data-name="tag"> ${initTag} </td> </tr>`;
        $('#table-list').DataTable().row.add($(html)).draw();
      });
      $('[name="main_checkbox[]"]').prop('checked', false);
    }
  }

  // selecting tables
  $(document).on('click', '[name="sub_checkbox[]"]', function () {
    let id = $(this).parents('tr').attr('data-id');
    let status = $(this).is(':checked');
    let checked = [];
    tableList = tableList.map((item, i) => {
      if (item.name == id) {
        item['checkbox'] = status;
        let sub_schema_list = [];
        if (!status) {
          sub_schema_list = item.sub_schema.filter((curElem) => {
            if (curElem != viewSubschema) {
              return curElem;
            }
          });
          item.sub_schema = sub_schema_list;
        } else {
          if (!item.sub_schema.includes(viewSubschema)) {
            item.sub_schema.push(viewSubschema);
          }
        }
        checked.push(item['checkbox']);
        return item;
      } else {
        checked.push(item['checkbox']);
        return item;
      }
    });
    tableUpdate();
  });

  // group functionality
  $('#main_checkbox').on('click', function () {
    let status = $(this).is(':checked');
    tableList = tableList.map((item, i) => {
      item['checkbox'] = status;
      let sub_schema_list = [];
      if (!status) {
        sub_schema_list = item.sub_schema.filter((curElem) => {
          if (curElem != viewSubschema) {
            return curElem;
          }
        });
        item.sub_schema = sub_schema_list;
      } else {
        if (!item.sub_schema.includes(viewSubschema)) {
          item.sub_schema.push(viewSubschema);
        }
      }
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
        let html = `<tr data-id="${name}" class="table-list-inner" data-desc="${initDesc}" data-tag="${initTag}" data-ai-access="${access_level}"><td width="7%"> <div class="c-checkbox"> <label> <input type="checkbox" ${checkbox ? 'checked' : ''} name="sub_checkbox[]" class="checkall prompt_check"> <span class="fa fa-check"></span> </label> </div> </td> <td width="15%"> ${name} </td> <td width="34%" class="editText ${descStatus}" data-name="description"> ${initDesc} </td> <td width="15%"> ${sub_schema.join(', ')} </td> <td width="14%"> ${access_level ? 'Yes' : 'No'} </td><td width="15%" class="editText ${tagStatus}" data-name="tag"> ${initTag} </td> </tr>`;
        $('#table-list').DataTable().row.add($(html)).draw();
      });
    }
  });

  // saving functionality
  $('.save_screen').on('click', function () {
    let form = $('[name="subschema_form"]');
    form.parsley().validate();
    $('[name="subschema_name"]').attr('disabled', false);
    $('[name="database"]').attr('disabled', false);
    let data = SerializeArrToJson(form.serializeArray());
    $('[name="subschema_name"]').attr('disabled', true);
    $('[name="database"]').attr('disabled', true);
    if (form.parsley().isValid()) {
      let value = data['subschema_name'];

      tableList = tableList.map((item, i) => {
        item['checkbox'] = false;
        return item;
      });
      currentData['tables'] = tableList;
      currentData['sub_schemas'] = sub_schemas;
      currentData['sub_schemas_status'] = currentData['sub_schemas_status'].map(
        (item) => {
          if (item.name === viewSubschema) {
            item.status = data['status'];
            return item;
          } else {
            return item;
          }
        }
      );
      // currentData['sub_schemas_status'].push({"name":data['subschema_name'], "status":data['status']});
      mainData[currentData['uniqueId']] = currentData;
      localStorage.setItem('Link Data', JSON.stringify(mainData));
      tableUpdate();
      window.location.href = `subschema-view.html?v=${currentData['uniqueId']}&d=${viewSubschema}`;
    }
  });

  $('.chosen-select').trigger('chosen:updated');
});
