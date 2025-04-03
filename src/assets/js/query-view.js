$(document).ready(function () {
  let mainData = {};

  // retrieve local storage data
  if (localStorage.getItem('Query List') !== null) {
    mainData = JSON.parse(localStorage.getItem('Query List'));
  }

  // Search functionality
  $('#prompt-list tfoot th').each(function () {
    let title = $('#prompt-list thead th').eq($(this).index()).text().trim();
    if (title != '' && title) {
      $(this).html(
        '<input type="text" class="filter" placeholder="' + title + '" />'
      );
    }
  });
  $('#prompt-list')
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
  tableDetails('prompt-list');

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
      $('#' + selector + '_info').show();
      $('#' + selector + '_paginate').show();
    }
  }

  // get id from url
  let url = window.location.href;
  if (url.indexOf('v=') !== -1) {
    let params = new URLSearchParams(window.location.search);
    let query_id = params.get('v');
    $('#query_id').val(query_id);

    if (localStorage.getItem('Query List') !== null) {
      let rawData = JSON.parse(localStorage.getItem('Query List'));
      let data = rawData[query_id];
      $('#current-view').text(data['dbName']);
      for (let key in data) {
        $(`[name="${key}"]`).val(data[key]);
      }
      let promptList = data['promptList'];
      let i = 1;
      $.each(promptList, function (key, value) {
        let { id, prompt } = value;
        let html = `<tr data-id="${i}"> <td> ${i} </td> <td> <a href="prompt-list.html"> ${prompt} </a></td> </tr>`;
        $('#prompt-list').DataTable().row.add($(html)).draw();
        i++;
      });
      tableDetails('prompt-list');
    }
  }

  // redirect to edit screen
  $('.edit-btn').on('click', function () {
    let id = $('#query_id').val();
    window.location.href = `query-edit.html?e=${id}`;
  });
}); // document ready end
