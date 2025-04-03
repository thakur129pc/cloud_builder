$(document).ready(function () {
  $.getJSON('data/query-engineering-list.json', function (data) {
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

    if (localStorage.getItem('Query engineering list') === null) {
      localStorage.setItem(
        'Query engineering list',
        JSON.stringify(initialData)
      );
    } else {
      let data = {
        ...initialData,
        ...JSON.parse(localStorage.getItem('Query engineering list')),
      };
      localStorage.setItem('Query engineering list', JSON.stringify(data));
    }
    // custom functions

    $.getJSON('data/database-details.json', function (dbDetails) {
      let initialData = dbDetails;
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

      if (localStorage.getItem('Query engineering list') !== null) {
        let QueryData = JSON.parse(
          localStorage.getItem('Query engineering list')
        );
        let LinkData = JSON.parse(localStorage.getItem('Link Data'));
        // Search functionality
        $('#queries-list tfoot th').each(function () {
          let title = $('#queries-list thead th')
            .eq($(this).index())
            .text()
            .trim();
          if (title != '' && title) {
            $(this).html(
              '<input type="text" class="filter" placeholder="' + title + '" />'
            );
          }
        });
        $('#queries-list')
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

        function trimStringTo100Chars(inputString) {
          // Check if the input string is longer than 300 characters
          if (inputString.length > 100) {
            // Trim the string to 300 characters and add "..." to indicate truncation
            return inputString.substring(0, 100) + '...';
          } else {
            // If the string is 300 characters or shorter, return it as is
            return inputString;
          }
        }

        $.each(QueryData, function (key, value) {
          let {
            query_id,
            database,
            description,
            multiDatabaseArr,
            schemaType,
          } = value;
          console.log('database: ', database);
          console.log('multiDatabaseArr: ', multiDatabaseArr);
          var trimmedString = trimStringTo100Chars(description);
          let db = '';
          if (multiDatabaseArr != undefined && multiDatabaseArr) {
            let dbNames = [];
            $.each(multiDatabaseArr, function (key, item) {
              dbNames.push(LinkData[item]['dbName']);
            });
            db = dbNames.join(', ');
          }

          if (database != undefined && database && database != 'init') {
            if (LinkData[database] != undefined && LinkData[database]) {
              db = LinkData[database]['dbName'];
            }
          }

          $('#queries-list')
            .DataTable()
            .row.add(
              $(
                `<tr role="row" data-id="${query_id}"> <td><a href="query-engineering-view.html?v=${query_id}"> ${query_id} </a></td> <td> ${db} </td> <td> ${trimmedString} </td> <td> ${schemaType} </td> </tr>`
              )
            )
            .draw();
        });
        tableDetails('queries-list');
      }
    });
  });
});
