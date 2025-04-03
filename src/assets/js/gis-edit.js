$(document).ready(function () {
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

  // Function to encrypt a string using XOR
  function encrypt(text, key) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const encryptedCharCode = charCode ^ key;
      result += String.fromCharCode(encryptedCharCode);
    }
    return result;
  }

  function decrypt(encryptedText, key) {
    return encrypt(encryptedText, key); // XOR with the same key decrypts the text
  }

  function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
  }

  $.getJSON('data/login-data.json', function (customerData) {
    if (getCookie('logged-in') !== null) {
      // Function to decrypt an encrypted string using XOR
      let encryptedText = JSON.parse(getCookie('logged-in'));
      let encryptionKey = 37;
      const decryptedText = decrypt(encryptedText, encryptionKey);

      let userData = customerData.filter((item) => {
        if (item.id === decryptedText) {
          return item;
        }
      });

      if (userData.length > 0) {
        let id = userData[0]['id'];
        $('[name="userId"]').val(id);
      }
    }
  });

  $.getJSON('data/gis-response.json', function (resData) {
    console.log('resData: ', resData);

    const Al_Response = resData.res;

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
        $('.dataTables_filter').hide();
        $('#' + selector + '_info').show();
        $('#' + selector + '_paginate').show();
      }
    }

    // global variables
    let mainData = {};
    let userGetRes = {};

    let url = window.location.href;
    if (url.indexOf('e=') !== -1) {
      let params = new URLSearchParams(window.location.search);
      let uniqueId = params.get('e');

      if (localStorage.getItem('Gis list') !== null) {
        mainData = JSON.parse(localStorage.getItem('Gis list'));
        let data = mainData[uniqueId];

        for (let key in data) {
          let type = $(`[name="${key}"]`).attr('type');

          if (type == 'radio') {
            $(`#screenForm [name="${key}"][value="${data[key]}"]`).prop(
              'checked',
              true
            );
          } else if (type == 'checkbox') {
            $(`#screenForm [name="${key}"][value="${data[key]}"]`).prop(
              'checked',
              true
            );
          } else {
            $(`#screenForm [name="${key}"]`).val(data[key]);
          }
        }

        // gis tune list
        userGetRes = data['userGetRes'];
        if (Object.keys(userGetRes).length >= 2) {
          $('.fine-tune-btn').remove();
          $('.ask-btn').removeClass('hidden');
          let initialInput = $('[name="input[]"]').val(); // get i/p val
          $('[name="input_2nd[]"]').val(initialInput); // assign i/p val
          $('.fine-action-btn').removeClass('hidden');
          let index = Object.keys(userGetRes).length;
          if (index > 2) {
            $('.ask-again-tune-btn').remove();
          }
          let lastResponse = userGetRes['r' + index];
          $('[name="output2[]"]').val(lastResponse.res);
          $('.thumb-decision-outer').removeClass('hidden');
          $('[name="input_3nd[]"]')
            .val(lastResponse.qes)
            .prop('disabled', true);
          $(
            `#second_round [name="status"][value="${lastResponse.status}"]`
          ).prop('checked', true);
          $(`#second_round [name="status"]`).attr('disabled', true);
          $(`#second_round [name="temperature"]`)
            .val(lastResponse.temperature)
            .attr('disabled', true);
          $('.finetune-again-btn').addClass('hidden');
          console.log('lastResponse: ', lastResponse);
        } else {
          $('.fine-tune-btn').remove();
          $('.ask-btn').removeClass('hidden');
          let initialInput = $('[name="input[]"]').val(); // get i/p val
          $('[name="input_2nd[]"]').val(initialInput); // assign i/p val
        }
      }
    }

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

    $('[name="temperature"]').on('blur', function () {
      var input = $(this);
      var value = input.val();

      // Format the value to have '.00' precision if it's a valid number
      if (value !== '' && !isNaN(value)) {
        var parsedValue = parseFloat(value).toFixed(2);
        input.val(parsedValue);
      }
    });

    $('.chosen-select').trigger('chosen:updated');
    // random number generator
    function randomString() {
      //generate random number
      var randomNumber = Math.floor(100 + Math.random() * 100);
      return randomNumber;
    }
    // $('#finetune_id').val(randomString());

    // form serialize arr to json
    function SerializeArrToJson(formSerializeArr) {
      var jsonObj = {};
      jQuery.map(formSerializeArr, function (n, i) {
        if (!n.name.endsWith('_length')) {
          // if (n.value != '') {
          jsonObj[n.name] = n.value;
          // }
        }
      });
      return jsonObj;
    }

    // fine tune functionality
    $(document).on('click', '.fine-tune-btn', function () {
      let Form = $('#screenForm');
      let FormInstance = Form.parsley();
      FormInstance.validate();
      let data = SerializeArrToJson(Form.serializeArray());
      if (FormInstance.isValid()) {
        if (data.temperature <= 1.0) {
          // Select a random index within the array length
          const randomIndex = Math.floor(Math.random() * Al_Response.length);
          $('[name="input_2nd[]"]').val(data['input[]']);
          // Retrieve the sentence using the random index
          let output = Al_Response[randomIndex];
          userGetRes['r1'] = {
            id: 'r1',
            qes: data['input[]'],
            res: output,
            status: data['status'],
            temperature: data['temperature'],
          };
          $('[name="output[]"]').val(output);
          $('.ask-btn').removeClass('hidden');
          $(this).prop('disabled', true);
          $('#save-btn').prop('disabled', false);
        } else {
          Form.find('[name="temperature"]')
            .siblings('ul')
            .css('display', 'block')
            .html(
              '<li class="parsley-custom-error-message">Please enter a value between 0 to 1.</li>'
            );
        }
      }
    });

    // ask tune functionality
    $(document).on('click', '.ask-again-tune-btn', function () {
      let Form = $('#second_round');
      let FormInstance = Form.parsley();
      FormInstance.validate();
      let data = SerializeArrToJson(Form.serializeArray());
      console.log('data: ', data);

      if (FormInstance.isValid()) {
        if (data.temperature <= 1.0) {
          // Select a random index within the array length
          const randomIndex = Math.floor(Math.random() * Al_Response.length);
          // Retrieve the sentence using the random index
          let output = Al_Response[randomIndex];
          let qes = $('[name="input_2nd[]"]').val();
          userGetRes['r2'] = {
            id: 'r2',
            qes,
            res: output,
            status: data['status'],
            temperature: data['temperature'],
          };
          $('[name="output2[]"]').val(output);
          $(`#second_round [name="status"]`).attr('disabled', true);
          $(`#second_round [name="temperature"]`).attr('disabled', true);
          $(this).attr('disabled', true).remove();
          $('.fine-action-btn').removeClass('hidden');
        } else {
          Form.find('[name="temperature"]')
            .prop('readonly', false)
            .siblings('ul')
            .css('display', 'block')
            .html(
              '<li class="parsley-custom-error-message">Please enter a value between 0 to 1.</li>'
            );
        }
      }
    });

    // ask tune functionality
    $(document).on('click', '.finetune-again-btn', function () {
      let Form = $('#second_round');
      let FormInstance = Form.parsley();
      FormInstance.validate();
      let data = SerializeArrToJson(Form.serializeArray());

      if (FormInstance.isValid()) {
        // Select a random index within the array length
        const randomIndex = Math.floor(Math.random() * Al_Response.length);
        // Retrieve the sentence using the random index
        let output = Al_Response[randomIndex];
        let valueArr = Object.keys(userGetRes);
        let id = parseInt(valueArr.length + 1);
        userGetRes['r' + id] = {
          id: 'r' + id,
          qes: data['input_3nd[]'],
          res: output,
          status: data['status'],
          temperature: data['temperature'],
        };
        $('[name="output2[]"]').val(output);
        $('.thumb-decision-outer').addClass('hidden');
        $(`#second_round [name="status"]`).attr('disabled', true);
        $(`#second_round [name="temperature"]`).attr('disabled', true);
        $('[name="input_3nd[]"]').val('').attr('required', false);
        $('.next').attr('data-current-index', -1).addClass('arrow-disabled');
        $('.prev').attr('data-current-index', 1).removeClass('arrow-disabled');
      }
    });

    // thumbs down functionality
    $(document).on('click', '.re-ask', function () {
      $('.thumb-decision-outer').removeClass('hidden');
      $('.finetune-again-btn').removeClass('hidden');
      $('[name="input_3nd[]"]')
        .val('')
        .prop('disabled', false)
        .attr('required', true);
      $(`#second_round [name="status"]`).attr('disabled', false);
      $(`#second_round [name="status"][value="System default"]`).prop(
        'checked',
        true
      );
      $(`#second_round [name="temperature"]`).val('').attr('disabled', false);
    });

    // thumbs up functionality
    $(document).on('click', '.query-ok', function () {
      $('.thumb-decision-outer').addClass('hidden');
    });

    // prev functionality
    $('.prev').on('click', function () {
      let index = parseInt($(this).attr('data-current-index'));
      let res = Object.values(userGetRes);
      if (index != -1 && index < res.length) {
        res.reverse();

        $('[name="output2[]"]').val(res[index]['res']);
        $('.finetune-again-btn').addClass('hidden');
        $('.thumb-decision-outer').removeClass('hidden');
        $('[name="input_3nd[]"]').val(res[index]['qes']).prop('disabled', true);
        $(
          `#second_round [name="status"][value="${res[index]['status']}"]`
        ).prop('checked', true);
        $(`#second_round [name="status"]`).attr('disabled', true);
        $(`#second_round [name="temperature"]`)
          .val(res[index]['temperature'])
          .attr('disabled', true);
        $(this).attr('data-current-index', index + 1);
        $('.next')
          .attr('data-current-index', index - 1)
          .removeClass('arrow-disabled');
        if (index + 1 == res.length) {
          $(this).addClass('arrow-disabled');
        }
      }
    });

    // next functionality
    $('.next').on('click', function () {
      let index = parseInt($(this).attr('data-current-index'));
      let res = Object.values(userGetRes);

      if (index != -1 && index < res.length) {
        res.reverse();
        $('[name="output2[]"]').val(res[index]['res']);
        $('.finetune-again-btn').addClass('hidden');
        $('.thumb-decision-outer').removeClass('hidden');
        $('[name="input_3nd[]"]').val(res[index]['qes']).prop('disabled', true);
        $(
          `#second_round [name="status"][value="${res[index]['status']}"]`
        ).prop('checked', true);
        $(`#second_round [name="status"]`).attr('disabled', true);
        $(`#second_round [name="temperature"]`)
          .val(res[index]['temperature'])
          .attr('disabled', true);
        $(this).attr('data-current-index', index - 1);
        $('.prev')
          .attr('data-current-index', index + 1)
          .removeClass('arrow-disabled');
        if (index - 1 == -1) {
          $(this).addClass('arrow-disabled');
        }
      }
    });

    // token value assign functionality
    $('[name="input[]"]').on('blur', function () {
      let value = $(this).val();
      if (value != '' && value) {
        $('[name="no_of_tokens"').val(randomString());
      } else {
        $('[name="no_of_tokens"').val('');
      }
    });

    // Query engineering list base functionality
    $('#save-btn').on('click', function () {
      let Form = $('#screenForm');
      let FormInstance = Form.parsley();
      FormInstance.validate();
      let data = SerializeArrToJson(Form.serializeArray());

      if (FormInstance.isValid()) {
        mainData[data['finetune_id']] = { ...data, userGetRes: userGetRes };
        console.log('mainData: ', mainData);
        localStorage.setItem('Gis list', JSON.stringify(mainData));
        window.location.href = `gis-view.html?v=${data['finetune_id']}`;
      }
    });
  });
});
