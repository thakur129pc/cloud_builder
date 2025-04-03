$(document).ready(function () {
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
        // if (n.value != '') {
        jsonObj[n.name] = n.value;
        // }
      }
    });
    return jsonObj;
  }

  function tableDetails(selector) {
    let count = $('#' + selector)
      .DataTable()
      .column(0)
      .data().length;
    if (count > 25) {
      $('#' + selector + '_length').show();
      $('#' + selector + '_filter').show();
      $('#' + selector + '_info').show();
      $('#' + selector + '_paginate').show();
    } else if (count > 1) {
      $('#' + selector + '_length').hide();
      $('#' + selector + '_filter').show();
      $('#' + selector + '_info').show();
      $('#' + selector + '_paginate').show();
    } else {
      $('#' + selector + '_length').hide();
      $('#' + selector + '_filter').hide();
      $('#' + selector + '_info').hide();
      $('#' + selector + '_paginate').hide();
    }
  }

  // Search functionality
  $('#queries-list tfoot th').each(function () {
    let title = $('#queries-list thead th').eq($(this).index()).text().trim();
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
        info: 'Showing _START_ to _END_ of _TOTAL_ prompts',
      },
      order: [[1, 'asc']],
    })
    .columns()
    .every(function () {
      var that = this;

      $('input', this.footer()).on('keyup change', function () {
        that.search(this.value).draw();
      });
    });
  tableDetails('queries-list');

  // get id from url
  let url = window.location.href;
  if (url.indexOf('v=') !== -1) {
    let params = new URLSearchParams(window.location.search);
    let prompt_id = params.get('v');

    if (localStorage.getItem('prompt list') !== null) {
      let rawData = JSON.parse(localStorage.getItem('prompt list'));
      let [data] = rawData.filter((item) => {
        if (item.promptId == prompt_id) {
          return item;
        }
      });

      for (let key in data) {
        $(`[name="${key}"]`).val(data[key]);
      }
      if (Object.hasOwn(data, 'prompt_engineering')) {
        $.each(data.prompt_engineering, function (key, value) {
          $('#queries-list')
            .DataTable()
            .row.add(
              $(
                `<tr class="prompt-desc-table"> <td width="13%"> ${value.prompt_id} </td> <td> ${value.prompt_engineering} </td> </tr>`
              )
            )
            .draw();
        });
        tableDetails('queries-list');
      }

      let query_link = `<a href="query-view.html?v=${data.query_id}">${data.query_id}</a>`;
      $('.query-link-outer').html(query_link);
    }
  }

  // redirect to edit screen
  $('#edit-btn').on('click', function () {
    let id = $('#promptId').val();
    window.location.href = `prompt-edit.html?e=${id}`;
  });

  // user login function
  // Function to disable scrolling on the main page
  function disableScroll() {
    $('body').css('overflow', 'hidden');
  }

  // Function to enable scrolling on the main page
  function enableScroll() {
    $('body').css('overflow', 'auto');
  }
  $('.custom-info').on('click', function () {
    $('#user_login_popup').modal('show');
    disableScroll();
    $('#user_login_form').trigger('reset');
  });

  var requestEditor;
  var responseEditor;

  $('.confirm_credentials').on('click', function () {
    let Form = $('#user_login_form');
    let FormInstance = Form.parsley();
    FormInstance.validate();
    let data = SerializeArrToJson(Form.serializeArray());

    if (FormInstance.isValid()) {
      $('.error-text').text('');

      let user = 'admin';
      let password = '12345';
      if (data.username == user && data.password == password) {
        console.log('data: ', data);
        $('#user_login_popup').modal('hide');
        setTimeout(function () {
          $('#req_res_popup').modal('show');

          setTimeout(function () {
            // reference schema code editor
            $('.request-tab-li a').tab('show');
            requestEditor = CodeMirror.fromTextArea(
              document.getElementById('request-editor'),
              {
                lineNumbers: true,
                theme: 'dracula',
                mode: 'application/json',
              }
            );

            $('.response-editor-tab-outer a').tab('show');
            responseEditor = CodeMirror.fromTextArea(
              document.getElementById('response-editor'),
              {
                lineNumbers: true,
                theme: 'dracula',
                mode: 'application/json',
              }
            );
            $('.request-tab-li a').tab('show');
          }, 400);
        }, 500);
      } else {
        $('.error-text').text(
          'Username and password mismatch. Please try with correct credentials.'
        );
      }
    }
  });

  // When the second modal is closed, enable scrolling on the main page
  $('#req_res_popup').on('hidden.bs.modal', function () {
    enableScroll();
  });

  // get editor value
  $('.req-res-btn').on('click', function () {
    let requestEditorValue = requestEditor.getValue();
    console.log('requestEditorValue: ', requestEditorValue);
    let responseEditorValue = responseEditor.getValue();
    console.log('responseEditorValue: ', responseEditorValue);
    $('#req_res_popup').modal('hide');
  });
});
