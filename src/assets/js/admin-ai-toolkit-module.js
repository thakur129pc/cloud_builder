jQuery(document).ready(function ($) {
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
  // global variables
  let mainData = {};

  if (localStorage.getItem('application modules') !== null) {
    mainData = JSON.parse(localStorage.getItem('application modules'));
  } else {
    mainData = {};
  }

  $('.chosen-select').chosen({
    disable_search: true,
  });

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

  function toSentenceCase(text) {
    return text.toLowerCase().replace(/(^\w|\s\w)/g, function (match) {
      return match.toUpperCase();
    });
  }

  function SerializeArrToJson(arr) {
    var jsonObj = {};
    jQuery.map(arr, function (n, i) {
      if (n.value != '') {
        if (n.name.endsWith('[]') && !n.name.endsWith('checkbox[]')) {
          var name = n.name;
          name = name.substring(0, name.length - 2);
          if (!(name in jsonObj)) {
            jsonObj[name] = [];
          }
          jsonObj[name].push(n.value);
        } else {
          if (!n.name.endsWith('_length')) {
            jsonObj[n.name] = n.value;
          }
        }
      }
    });
    return jsonObj;
  }

  // random number generator
  function randomString() {
    //generate random number
    return Math.floor(100 + Math.random() * 100);
  }
  $('[name="uuid"]').val(randomString());

  function toSentenceCase(text) {
    return text.toLowerCase().replace(/(^\w|\s\w)/g, function (match) {
      return match.toUpperCase();
    });
  }

  // text transform to sentence case
  $(document).on('input', '[data-sentence-case="true"]', function () {
    var input = $(this).val();
    $(this).val(toSentenceCase(input));
  });

  // add new module
  $('#add-module').on('click', function () {
    let html = `<div class="module-outer">

                <div class="row"><div class="col-sm-12"><hr class="solid-hr"/></div></div>

                <div class="row">
                <div class="col-sm-12"><div class="pull-right"><i class="fa fa-times delete-section" aria-hidden="true" style="color:red;"></i></div></div>
                </div>
                
                <div class="row form-group">
                    <div class="col-sm-8">
                    <label class="labels"> Application Name: </label>
                    <input type="text" name="application_name" value="" required="" data-sentence-case="true" data-parsley-error-message="Enter application name" placeholder="Enter application name, e.g, Guardrails" class="form-control" maxlength="150">
                    </div>
                </div>
                              
                <div class="row form-group">
                    <div class="col-sm-8">
                    <label class="labels"> Function Name: </label>
                    <div class="form-group">
                        <input type="text" name="function_name[]" value="" required="" data-sentence-case="true" data-parsley-error-message="Enter function name" placeholder="Enter function Name, e.g, Obscenity" class="form-control" maxlength="150">
                    </div>
                    <div class="form-group">
                        <input type="text" name="function_name[]" value="" data-sentence-case="true" data-parsley-error-message="Enter function name" placeholder="Enter function Name, e.g, Obscenity" class="form-control" maxlength="150">
                    </div>
                    <div class="form-group">
                        <input type="text" name="function_name[]" value="" data-sentence-case="true" data-parsley-error-message="Enter function name" placeholder="Enter function Name, e.g, Obscenity" class="form-control" maxlength="150">
                    </div>
                    </div>
                </div>
                
                </div>`;
    $('#module-wrapper').append(html);
  });

  // delete section
  $(document).on('click', '.delete-section', function () {
    $(this).parents('.module-outer').remove();
  });

  // save modules
  $('#save-btn').on('click', function () {
    let Form = $('#app_form');
    let FormInstance = Form.parsley();
    FormInstance.validate();
    let data = {};
    if (FormInstance.isValid()) {
      $(document)
        .find('.module-outer')
        .each(function () {
          let key = $(this).find('[name="application_name"]').val();
          let values = [];
          $(this)
            .find('[name="function_name[]"]')
            .each(function () {
              let value = $(this).val();
              values.push(value);
            });
          data[key] = values;
        });
      mainData['ai-toolkit'] = data;
      console.log('mainData: ', mainData);
      localStorage.setItem('application modules', JSON.stringify(mainData));
      $(this).hide();
      $(document).find('input, button').prop('disabled', true);
      $(document).find('.delete-section').hide();
      $('#edit-module').show().prop('disabled', false);
    }
  });

  // edit functionality
  $('#edit-module').on('click', function () {
    $(this).hide();
    $('#save-btn').show();
    $(document).find('input, button').prop('disabled', false);
    $(document).find('.delete-section').show();
  });
});
