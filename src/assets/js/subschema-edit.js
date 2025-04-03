// check version in local storage
$(document).ready(function () {
  var mainData = {};
  $.getJSON('data/database-details.json', function (initData) {
    let tableLists = {};
    let sub_schemas = [];
    let currentData = {};

    mainData = initData;

    if (localStorage.getItem('Link Data') === null) {
      localStorage.setItem('Link Data', JSON.stringify(mainData));
    } else {
      let data = {
        ...mainData,
        ...JSON.parse(localStorage.getItem('Link Data')),
      };
      localStorage.setItem('Link Data', JSON.stringify(data));
      mainData = data;
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

    // cookies functions
    function setCookie(key, value, expiry) {
      var expires = new Date();
      expires.setTime(expires.getTime() + expiry * 24 * 60 * 60 * 1000);
      document.cookie =
        key + '=' + value + ';expires=' + expires.toUTCString() + ';path=/';
    }

    function getCookie(key) {
      var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
      return keyValue ? keyValue[2] : null;
    }

    function eraseCookie(key) {
      var keyValue = getCookie(key);
      setCookie(key, keyValue, '-1');
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

    function databaseTable(dbId, tableId, arr) {
      let tableData = mainData[dbId]['tables'];

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
          let initTag = tag;
          let tagStatus = '';
          let initDesc = description;
          let descStatus = '';
          let sel = '';
          let schema = '';
          if (sub_schema != undefined) {
            if (sub_schema.includes(arr)) {
              sel = 'checked';
              newTableRows.push({ ...item, checkbox: true });
            } else {
              newTableRows.push({ ...item, checkbox: false });
            }
            schema = sub_schema.join(', ');
          }

          TableRows += `<tr data-id="${name}" data-desc="${initDesc}" data-tag="${initTag}" data-ai-access="${access_level}" class="table-list-inner"> <td width="7%"> <div class="c-checkbox"> <label> <input ${sel} type="checkbox"  name="sub_checkbox[]" class="checkall prompt_check"> <span class="fa fa-check"></span> </label> </div> </td> <td width="15%"> ${name} </td> <td width="34%" class="editText ${descStatus}" data-name="description"> ${initDesc} </td> <td width="15%"> ${schema} </td> <td width="14%"> ${access_level ? 'Yes' : 'No'}  </td> <td width="15%" class="editText ${tagStatus}" data-name="tag"> ${initTag} </td> </tr>`;
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
          tabPanels += `<div role="tabpanel" class="tab-pane ${sel}" id="${databaseId}"><div class="row"><div class="col-md-12"><table id="${tableId}" data-table-id="${tableId}" data-db-id="${uniqueId}" class="datatable_common table v-align table-striped table-hover filter-table"><thead><tr><th width="7%"><div class="c-checkbox"><label><input type="checkbox" name="main_checkbox[]" class="checkall main_checkbox"><span class="fa fa-check"></span></label></div></th><th width="15%"> Table name </th><th width="34%"> Description </th><th width="15%"> Subschema </th><th width="14%"> AI access level </th><th width="15%"> Tag name </th></tr></thead><tfoot><tr><th width="7%"></th><th width="15%"> Table name </th><th width="34%"> Description </th><th width="15%"> Subschema </th><th width="14%"> AI access level </th><th width="15%"> Tag name </th></tr></tfoot><tbody>${databaseTable(uniqueId, tableId, viewSubschema)}</tbody></table></div></div></div>`;
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

    // table List adding
    $('[name="database"]').on('change', function () {
      let value = $(this).find('option:selected').attr('data-db-tab');
      $('.' + value + ' a').tab('show');
    });

    // selecting tables
    $(document).on('click', '[name="sub_checkbox[]"]', function () {
      let id = $(this).parents('tr').attr('data-id');
      let status = $(this).is(':checked');
      let checked = [];
      let dbId = $(this).parents('.datatable_common').attr('data-db-id');

      let tableData = mainData[dbId]['tables'];

      if (tableData != undefined) {
        let tables = '';
        tables = tableData.map((item, i) => {
          if (item.name == id) {
            item['checkbox'] = status;
            checked.push(item['checkbox']);
            return item;
          } else {
            checked.push(item['checkbox']);
            return item;
          }
        });
        mainData[dbId]['tables'] = tables;
        tableLists[dbId] = tables;
      }
    });

    function tableUpdate() {
      // table List adding
      if (tableLists != undefined) {
        $('#table-list').DataTable().clear().draw();
        $.each(tableLists, function (i, item) {
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
          let html = `<tr data-id="${name}" class="table-list-inner" data-desc="${initDesc}" data-tag="${initTag}" data-ai-access="${access_level}"> <td width="7%"> <div class="c-checkbox"> <label> <input type="checkbox" ${checkbox ? 'checked' : ''} name="sub_checkbox[]" class="checkall prompt_check"> <span class="fa fa-check"></span> </label> </div> </td> <td width="15%"> ${name} </td> <td width="34%" class="editText ${descStatus}" data-name="description"> ${initDesc} </td> <td width="15%"> ${sub_schema.join(', ')} </td> <td width="14%"> ${access_level ? 'Yes' : 'No'} </td><td width="15%" class="editText ${tagStatus}" data-name="tag"> ${initTag} </td> </tr>`;
          $('#table-list').DataTable().row.add($(html)).draw();
        });
        $('[name="main_checkbox[]"]').prop('checked', false);
      }
    }

    // group functionality
    $('[name="main_checkbox[]"]').on('click', function () {
      let status = $(this).is(':checked');
      let dbId = $(this).parents('.datatable_common').attr('data-db-id');
      let tableId = $(this).parents('.datatable_common').attr('data-table-id');
      let tableData = mainData[dbId]['tables'];

      let tables = tableData.map((item, i) => {
        item['checkbox'] = status;
        return item;
      });
      mainData[dbId]['tables'] = tables;
      console.log('mainData: ', mainData);
      tableLists[dbId] = tables;

      // table List adding
      if (tableData != undefined) {
        $('#' + tableId)
          .DataTable()
          .clear()
          .draw();
        $.each(tables, function (i, item) {
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
          let schema = '';
          if (sub_schema.length > 0) {
            schema = sub_schema.join(', ');
          }
          let html = `<tr data-id="${name}" class="table-list-inner" data-desc="${initDesc}" data-tag="${initTag}" data-ai-access="${access_level}"><td width="7%"> <div class="c-checkbox"> <label> <input type="checkbox" ${checkbox ? 'checked' : ''} name="sub_checkbox[]" class="checkall prompt_check"> <span class="fa fa-check"></span> </label> </div> </td> <td width="15%"> ${name} </td> <td width="34%" class="editText ${descStatus}" data-name="description"> ${initDesc} </td> <td width="15%"> ${schema} </td> <td width="14%"> ${access_level ? 'Yes' : 'No'} </td><td width="15%" class="editText ${tagStatus}" data-name="tag"> ${initTag} </td> </tr>`;
          $('#' + tableId)
            .DataTable()
            .row.add($(html))
            .draw();
        });
      }
    });

    // Function to remove the first occurrence of a particular value from the array without using a loop
    function removeFirstValueFromArray(arr, value) {
      if (typeof arr[0] == 'string') {
        var index = arr.indexOf(value);
        if (index !== -1) {
          arr.splice(index, 1);
        }
        return arr;
      } else if (typeof arr[0] == 'object') {
        arr = arr.filter((item, i) => {
          if (item.name != value) {
            return item;
          }
        });
        return arr;
      }
    }

    // saving functionality
    $('.save_screen').on('click', function () {
      let form = $('[name="subschema_form"]');
      form.parsley().validate();
      let data = SerializeArrToJson(form.serializeArray());
      if (form.parsley().isValid()) {
        let value = data['subschema_name'];

        $.each(mainData, function (key, curElm) {
          if (
            curElm['sub_schemas'] != undefined &&
            curElm['sub_schemas'].includes(value)
          ) {
            let isChecked = [];
            if (curElm['tables'] != undefined) {
              curElm['tables'] = curElm['tables'].map((curItem, key) => {
                if (curItem['checkbox']) {
                  isChecked.push(true);
                  if (!curItem['sub_schema'].includes(value)) {
                    curItem['sub_schema'].push(value);
                  }
                  curItem['checkbox'] = false;
                  return curItem;
                } else {
                  isChecked.push(false);
                  let modifiedSchema = removeFirstValueFromArray(
                    curItem['sub_schema'],
                    value
                  );
                  curItem['sub_schema'] = modifiedSchema;
                  return curItem;
                }
              });
            }

            if (!isChecked.includes(true)) {
              curElm['sub_schemas'] = removeFirstValueFromArray(
                curElm['sub_schemas'],
                value
              );

              // curElm['sub_schemas_status'] = removeFirstValueFromArray(curElm['sub_schemas_status'], value);
            }

            curElm['sub_schemas_status'] = curElm['sub_schemas_status'].map(
              (item, i) => {
                if (item.name == data['subschema_name']) {
                  item.status = data['status'];
                  return item;
                } else {
                  return item;
                }
              }
            );

            mainData[key] = curElm;
          } else if (
            curElm['sub_schemas'] &&
            !curElm['sub_schemas'].includes(value)
          ) {
            curElm['sub_schemas'].push(value);
            curElm['sub_schemas_status'].push({
              id: data['uuid'],
              name: value,
              status: data['status'],
            });

            if (curElm['tables'] != undefined) {
              curElm['tables'] = curElm['tables'].map((curItem, key) => {
                if (curItem['checkbox']) {
                  curItem['sub_schema'].push(value);
                  curItem['checkbox'] = false;
                  return curItem;
                } else {
                  return curItem;
                }
              });
            }
            mainData[key] = curElm;
          }
        });
        localStorage.setItem('Link Data', JSON.stringify(mainData));
        window.location.href = `subschema-view.html?v=${data['uuid']}&n=${value}&s=${data['status']}`;
      }
    });

    $('.chosen-select').trigger('chosen:updated');
  }); // db details ends
});
