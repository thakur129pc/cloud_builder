$(document).ready(function () {
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

  $.getJSON('data/initial-database-details.json', function (initData) {
    let mainData = {};

    // retrieve local storage data
    if (localStorage.getItem('Link Data') !== null) {
      mainData = JSON.parse(localStorage.getItem('Link Data'));
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
    $('#table-list')
      .DataTable({
        iDisplayLength: 25, // Set the default number of rows to display
        language: {
          info: 'Showing _START_ to _END_ of _TOTAL_ tables',
        },
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

    // get id from url
    let url = window.location.href;
    if (url.indexOf('v=') !== -1) {
      let params = new URLSearchParams(window.location.search);
      let uniqueId = params.get('v');
      $('#uniqueId').val(uniqueId);

      if (localStorage.getItem('Link Data') !== null) {
        let rawData = JSON.parse(localStorage.getItem('Link Data'));
        let data = rawData[uniqueId];
        $('#current-view').text(data['dbName']);

        for (let key in data) {
          $(`[name="${key}"]`).val(data[key]);
        }
        let tableList =
          data['tables'] != undefined ? data['tables'] : initData['tables'];
        let reportList =
          data['reports'] != undefined ? data['reports'] : initData['reports'];
        let queriesList =
          data['queries'] != undefined ? data['queries'] : initData['queries'];

        // table List adding
        if (tableList != undefined) {
          $('#table-list').DataTable().clear().draw();
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
            let html = `<tr data-id="${name}"> <td width="15%"> ${name} </td> <td width="34%"> ${description} </td> <td width="15%"> ${sub_schema.join(', ')} </td> <td width="14%"> ${access_level ? 'Yes' : 'No'} </td><td width="15%"> ${tag} </td> </tr>`;
            $('#table-list').DataTable().row.add($(html)).draw();
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
            let html = `<tr data-id="${query_id}" data-query-name="${query_name}" data-fine-tuned="${fine_tuned}" data-desc="${query_desc}" data-query="${query}"> <td> ${query_id} </td> <td> <a href="query-list.html"> ${query_name} </a></td> <td> ${fine_tuned} </td> <td class=" no-filter details-control" width="5%"></td> </tr>`;
            $('#queries-list').DataTable().row.add($(html)).draw();
          });
        }

        tableDetails('table-list');
        tableDetails('records-list');
        tableDetails('queries-list');

        // Add event listener for opening and closing details
        $('#queries-list tbody').on('click', 'td.details-control', function () {
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
        });
      }
    }

    // redirect to edit screen
    $('.edit-btn').on('click', function () {
      let id = $('#uniqueId').val();
      window.location.href = `database-edit.html?e=${id}`;
    });
  });
}); // document ready end
