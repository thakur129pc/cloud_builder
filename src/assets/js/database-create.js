$('.chosen-select').chosen();
$(document).ready(function () {
  // global variables
  let mainData = {};
  let db_types = [];

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

  if (localStorage.getItem('Link Data') !== null) {
    mainData = JSON.parse(localStorage.getItem('Link Data'));
  } else {
    mainData = {};
  }

  $.getJSON('data/db-types.json', function (db_list) {
    db_types = db_list;
    let option =
      '<option value="">Select DB type</option><option value="create"> Create DB type </option><option disabled="" value="">-------</option>';
    $.each(db_types, function (key, value) {
      option += '<option value="' + value + '">' + value + '</option>';
    });
    $('#dbType').html(option);

    // random number generator
    function randomString() {
      //generate random number
      var randomNumber = Math.floor(100 + Math.random() * 100);
      return randomNumber;
    }
    $('#uniqueId').val(randomString());

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

    // upload file functionality
    $('.upload_file').on('change', function (input) {
      let uniqueId = $('#uniqueId').val();
      let file = $(this);
      let inputFile = input.target.files[0];
      if (inputFile != undefined) {
        let value = {};
        let filename = inputFile.name;
        let uploadAttempts = 1;
        let limitExceed = 'no';
        if (localStorage.getItem('applicationUploads') !== null) {
          applicationUploads = JSON.parse(
            localStorage.getItem('applicationUploads')
          );
          if (applicationUploads[uniqueId] != undefined) {
            value = applicationUploads[uniqueId];
            if (value != undefined) {
              if (value[file.context.name] != undefined) {
                uploadAttempts = value[file.context.name]['uploadAttempts'] + 1;
                // if (uploadAttempts > 2) {
                //     limitExceed = 'yes';
                // }
              }
            }
          }
        }

        if (filename.match(/\.(doc|docx|pdf|xlsx|pptx)$/i)) {
          // file storage
          let reader = new FileReader();
          reader.onload = function (event) {
            let files = event.target.result;
            let obj = { filename, uploadAttempts, limitExceed, files };
            value[file.context.name] = obj;
            applicationUploads[uniqueId] = value;
            localStorage.setItem(
              'applicationUploads',
              JSON.stringify(applicationUploads)
            );
          };
          reader.readAsDataURL(inputFile);
        }
      }
    });

    // link or save database functionality
    $('.link-btn').on('click', function () {
      let Form = $('#application_form');
      let FormInstance = Form.parsley();
      FormInstance.validate();
      let data = SerializeArrToJson(Form.serializeArray());
      if (FormInstance.isValid()) {
        let username = 'admin';
        let password = '12345';
        if (data.username == username && data.password == password) {
          data['db_types'] = db_types;
          mainData[data['uniqueId']] = data;
          data['sub_schemas_status'] = [
            {
              name: 'Finance',
              status: 'Active',
            },
            {
              name: 'Warehouse',
              status: 'Active',
            },
            {
              name: 'POS',
              status: 'Active',
            },
            {
              name: 'Sales',
              status: 'Active',
            },
          ];
          data['sub_schemas'] = ['Finance', 'Warehouse', 'POS', 'Sales'];
          localStorage.setItem('Link Data', JSON.stringify(mainData));
          window.location.href = `database-view.html?v=${data['uniqueId']}`;
        } else {
          $('#error-popup').modal('show');
        }
      }
    });

    // test connection functionality
    $('[data-connection-enable=""]').on('change input', function () {
      let check = [];
      $('[data-connection-enable=""]').each(function () {
        let value = $(this).val();
        if (value != '' && value) {
          check.push(true);
        } else {
          check.push(false);
        }
      });
      if (!check.includes(false)) {
        $('.test-link-btn').prop('disabled', false);
      } else {
        $('.test-link-btn').prop('disabled', true);
      }
    });

    $('.test-link-btn').on('click', function () {
      let Form = $('#application_form');
      let FormInstance = Form.parsley();
      FormInstance.validate();
      let data = SerializeArrToJson(Form.serializeArray());
      if (FormInstance.isValid()) {
        let username = 'admin';
        let password = '12345';
        if (data.username == username && data.password == password) {
          $('#success-popup').modal('show');
        } else {
          $('#error-popup').modal('show');
        }
      }
    });

    // Function to validate input for numbers and decimal point
    function validateNumberInput(event) {
      const inputChar = String.fromCharCode(event.which);
      const currentValue = event.target.value;
      const pattern = /^[0-9]*\.?[0-9]*$/; // Regular expression to match numbers and decimal point

      if (!pattern.test(currentValue + inputChar)) {
        event.preventDefault(); // Prevent input if it doesn't match the pattern
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

    // new db type adding functionality
    $('[name="dbType"]').on('change', function () {
      let value = $(this).val();
      if (value == 'create') {
        $('#add_new_db_type_modal').modal('show');
      }
    });

    $('button.add_new_db_type').click(function (event) {
      event.preventDefault();
      let form = $('#add_new_db_type_form');
      let data = SerializeArrToJson(form.serializeArray());
      form.parsley().validate();
      if (form.parsley().isValid()) {
        const { db_type_name } = data;
        db_types.push(db_type_name);
        $('#dbType').find('option').attr('selected', false);
        $('#dbType').append(
          '<option value="' +
            db_type_name +
            '" selected>' +
            db_type_name +
            '</option>'
        );
        $('#add_new_db_type_modal').modal('hide');
        form.trigger('reset');
        $('.chosen-select').trigger('chosen:updated');
      }
    });

    $(document).on('click', '.payment-terms-modal-close', function () {
      $('[name="dbType"]').val('');
      $('.chosen-select').trigger('chosen:updated');
      $('#add_new_db_type_modal').modal('hide');
    });

    $('.chosen-select').trigger('chosen:updated');

    $('#page1').click(function () {
      $('#content-container').load('database-list.html');
    });
  }); // db type get function ends
});
