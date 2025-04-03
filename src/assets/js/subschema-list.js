$(document).ready(function () {
  $.getJSON('data/database-details.json', function (data) {
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

    let initialData = data;

    if (localStorage.getItem('Link Data') === null) {
      localStorage.setItem('Link Data', JSON.stringify(initialData));
    } else {
      let data = {
        ...initialData,
        ...JSON.parse(localStorage.getItem('Link Data')),
      };
      localStorage.setItem('Link Data', JSON.stringify(data));
    }

    // custom functions
    if (localStorage.getItem('Link Data') !== null) {
      let LinkData = JSON.parse(localStorage.getItem('Link Data'));

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
          $('.dataTables_filter').show();
          $('#' + selector + '_info').hide();
          $('#' + selector + '_paginate').hide();
        }
      }

      // Search functionality
      $('#subschema-list tfoot th').each(function () {
        let title = $('#subschema-list thead th')
          .eq($(this).index())
          .text()
          .trim();
        if (title != '' && title) {
          $(this).html(
            '<input type="text" class="filter" placeholder="' + title + '" />'
          );
        }
      });

      $('#subschema-list')
        .DataTable({
          iDisplayLength: 25, // Set the default number of rows to display
          language: {
            info: 'Showing _START_ to _END_ of _TOTAL_ subschema',
          },
        })
        .columns()
        .every(function () {
          var that = this;

          $('input', this.footer()).on('keyup change', function () {
            that.search(this.value).draw();
          });
        });
      tableDetails('subschema-list');

      let schemaList = {};
      $.each(LinkData, function (key, item) {
        let { dbName, uniqueId } = item;
        if (item.sub_schemas_status && item.sub_schemas_status != undefined) {
          $.each(item.sub_schemas_status, function (key, value) {
            let { name, status, id } = value;
            let db = [];
            let prev = schemaList[name];
            console.log('schemaList: ', schemaList);

            if (prev != 'undefined' && prev) {
              let prevDb = schemaList[name]['dbName'];
              prevDb.push(dbName);
              schemaList[name] = { ...prev, dbName: prevDb };
              console.log('schemaList:2 ', schemaList);
            } else {
              db.push(dbName);
              schemaList[name] = { name, dbName: db, id, status };
            }
          });
        }
      });

      $.each(schemaList, function (key, value) {
        let { name, status, id, dbName } = value;
        $('#subschema-list')
          .DataTable()
          .row.add(
            $(
              `<tr> <td width="25%"><a href="subschema-view.html?v=${id}&n=${name}&s=${status}">${name}</a></td> <td>${dbName.join(', ')}</td> <td width="15%">${status}</td> </tr>`
            )
          )
          .draw();
      });

      tableDetails('subschema-list');
    }
  });
});
