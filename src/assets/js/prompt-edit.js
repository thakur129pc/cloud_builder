$(document).ready(function () {
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

  $.getJSON('data/queries-list.json', function (data) {
    let initialData = data;
    if (localStorage.getItem('Query List') === null) {
      localStorage.setItem('Query List', JSON.stringify(initialData));
    } else {
      let x = {
        ...initialData,
        ...JSON.parse(localStorage.getItem('Query List')),
      };
      initialData = x;
      localStorage.setItem('Query List', JSON.stringify(x));
    }

    let option = '<option value="">Select query name</option>';
    $.each(initialData, function (key, value) {
      option += `<option value="${value.query_name}" data-id="${value.query_id}">${value.query_name}</option>`;
    });
    $('[name="query_name"]').append(option);
    $('.chosen-select').trigger('chosen:updated');

    // add query id functionality
    $('[name="query_name"]').on('change', function () {
      let value = $(this).val();
      let id = $('[name="query_name"] option:selected').attr('data-id');
      $('[name="query_id"]').val(id);
    });

    // global variables
    let mainData = [];
    let prompt_engineering = [];

    if (localStorage.getItem('prompt list') !== null) {
      mainData = JSON.parse(localStorage.getItem('prompt list'));
    } else {
      mainData = [];
    }

    // random number generator
    function randomString() {
      //generate random number
      var randomNumber = Math.floor(100 + Math.random() * 100);
      return randomNumber;
    }
    // $('#promptId').val(randomString());

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

    // get id from url
    let url = window.location.href;
    let prompt_id = '';
    if (url.indexOf('e=') !== -1) {
      let params = new URLSearchParams(window.location.search);
      prompt_id = params.get('e');
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
          prompt_engineering = data.prompt_engineering;
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

        let count = $('#queries-list').DataTable().column(0).data().length;
        if (count > 0) {
          $('#run-btn').show();
        } else {
          $('#run-btn').hide();
        }

        $('#run-btn').on('click', function () {
          window.location.href = `query-view.html?v=${data.query_id}`;
        });

        $('.chosen-select').trigger('chosen:updated');
      }
    }

    // prompt list base functionality
    $('#save-btn').on('click', function () {
      let Form = $('#application_form');
      let FormInstance = Form.parsley();
      FormInstance.validate();
      $('[name="promptId"]').prop('disabled', false);
      $('[name="query_id"]').prop('disabled', false);
      let data = SerializeArrToJson(Form.serializeArray());
      $('[name="promptId"]').prop('disabled', true);
      $('[name="query_id"]').prop('disabled', true);

      if (FormInstance.isValid()) {
        mainData = mainData.map((item) => {
          if (item.promptId == prompt_id) {
            return { ...item, ...data, prompt_engineering };
          } else {
            return item;
          }
        });
        localStorage.setItem('prompt list', JSON.stringify(mainData));
        window.location.href = 'prompt-view.html?v=' + data['promptId'];
      }
    });

    // add prompt description
    $('#add-prompt-modal').on('click', function () {
      let Form = $('#promptDescriptionForm');
      Form.trigger('reset');
      Form.find('[name="prompt_id"]').val($('[name="promptId"]').val());
      $('#desc-popup-modal').modal('show');
    });

    // prompt description saving functionality
    $('#add-prompt-desc').on('click', function () {
      let Form = $('#promptDescriptionForm');
      let FormInstance = Form.parsley();
      FormInstance.validate();
      if (FormInstance.isValid()) {
        let data = SerializeArrToJson(Form.serializeArray());
        $('#queries-list')
          .DataTable()
          .row.add(
            $(
              `<tr class="prompt-desc-table"> <td width="13%"> ${data.prompt_id} </td> <td> ${data.prompt_engineering} </td> </tr>`
            )
          )
          .draw();
        prompt_engineering.push(data);
        Form.trigger('reset');

        let appForm = $('#application_form');
        $('[name="promptId"]').prop('disabled', false);
        $('[name="query_id"]').prop('disabled', false);
        let main_data = SerializeArrToJson(appForm.serializeArray());
        $('[name="promptId"]').prop('disabled', true);
        $('[name="query_id"]').prop('disabled', true);

        mainData = mainData.map((item) => {
          if (item.promptId == prompt_id) {
            return { ...item, ...main_data, prompt_engineering };
          } else {
            return item;
          }
        });
        localStorage.setItem('prompt list', JSON.stringify(mainData));
        let count = $('#queries-list').DataTable().column(0).data().length;
        if (count > 0) {
          $('#run-btn').show();
        } else {
          $('#run-btn').hide();
        }
        $('#desc-popup-modal').modal('hide');
        tableDetails('queries-list');
      }
    });
  });
});
