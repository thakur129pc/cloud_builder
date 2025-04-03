$(document).ready(function () {
  $.getJSON('data/queries-list.json', function (data) {
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

    if (localStorage.getItem('Query List') === null) {
      localStorage.setItem('Query List', JSON.stringify(initialData));
    } else {
      let data = {
        ...initialData,
        ...JSON.parse(localStorage.getItem('Query List')),
      };
      localStorage.setItem('Query List', JSON.stringify(data));
    }
    // custom functions

    if (localStorage.getItem('Query List') !== null) {
      let LinkData = JSON.parse(localStorage.getItem('Query List'));

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
            info: 'Showing _START_ to _END_ of _TOTAL_ query',
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

      $.each(LinkData, function (key, value) {
        let { query_id, query_name, query_desc, promptList } = value;
        let promptCount = promptList.length;
        $('#queries-list')
          .DataTable()
          .row.add(
            $(
              `<tr role="row" data-id="${query_id}"> <td><a href="query-view.html?v=${query_id}"> ${query_id} </a></td> <td> ${query_name} </td> <td> ${query_desc} </td> <td> ${promptCount} </td> </tr>`
            )
          )
          .draw();
      });
      tableDetails('queries-list');
    }
  });
});
