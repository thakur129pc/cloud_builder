$(document).ready(function () {
  // Search functionality
  $('#database-list tfoot th').each(function () {
    let title = $('#database-list thead th').eq($(this).index()).text().trim();
    if (title != '' && title) {
      $(this).html(
        '<input type="text" class="filter" placeholder="' + title + '" />'
      );
    }
  });

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

      $('#database-list')
        .DataTable({
          iDisplayLength: 25, // Set the default number of rows to display
          language: {
            info: 'Showing _START_ to _END_ of _TOTAL_ database',
          },
        })
        .columns()
        .every(function () {
          var that = this;

          $('input', this.footer()).on('keyup change', function () {
            that.search(this.value).draw();
          });
        });
      function tableDetails(selector) {
        let count = $('#' + selector)
          .DataTable()
          .column(0)
          .data().length;
        if (count > 10) {
          $('#' + selector + '_length').show();
          $('.dataTables_filter').hide();
          $('#' + selector + '_info').show();
          $('#' + selector + '_paginate').show();
        } else {
          $('#' + selector + '_length').show();
          $('.dataTables_filter').show();
          $('#' + selector + '_info').show();
          $('#' + selector + '_paginate').hide();
        }
      }

      let i = 1;
      $.each(LinkData, function (key, item) {
        let j = i;
        let k = i;
        let { dbName, uniqueId } = item;
        let Queries = j * 20;
        let no_of_chats = k * 30;
        $('#database-list')
          .DataTable()
          .row.add(
            $(
              `<tr role="row" data-id="${uniqueId}"> <td><a href="database-view.html?v=${uniqueId}"> ${dbName} </a></td> <td> Connected </td> <td> ${Queries} </td> <td> ${no_of_chats} </td> </tr>`
            )
          )
          .draw();
        i++;
      });
      tableDetails('database-list');
    }
  });
});
