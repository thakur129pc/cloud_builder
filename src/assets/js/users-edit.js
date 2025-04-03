//Wait for window load
$(window).load(function () {
  // Animate loader off screen
  $('.pre-loader').fadeOut('slow');
});

// init mask
// $('[data-masked]').inputmask();

function onlyAlphabets(e, t) {
  try {
    if (window.event) {
      var charCode = window.event.keyCode;
    } else if (e) {
      var charCode = e.which;
    } else {
      return true;
    }
    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123))
      return true;
    else return false;
  } catch (err) {
    console.log(err.Description);
  }
}

jQuery(document).ready(function () {
  $('[data-tel=""]').on('countrychange', function (e) {
    $(this).val('');
    var selectedCountry = $(this).intlTelInput('getSelectedCountryData');
    var dialCode = selectedCountry.dialCode;
    var maskNumber = intlTelInputUtils.getExampleNumber(
      selectedCountry.iso2,
      0,
      0
    );
    maskNumber = intlTelInputUtils.formatNumber(
      maskNumber,
      selectedCountry.iso2,
      2
    );
    maskNumber = maskNumber.replace('+' + dialCode + ' ', '');
    mask = maskNumber.replace(/[0-9+]/gi, '0');

    $('.tel_country_code').val(selectedCountry.iso2);
    if (selectedCountry.iso2 == 'in') {
      mask = '00000 00000';
      maskNumber = '74104 10123';
    }

    //maskPlaceHolder = mask.replace(/[0-9+]/ig, '_');

    $('[data-tel=""]').mask(mask, { placeholder: maskNumber });
  });

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

  $.getJSON('data/default-roles.json', function (rolesData) {
    let roles_list = rolesData;

    if (localStorage.getItem('role list') !== null) {
      let roles = JSON.parse(localStorage.getItem('role list'));
      $.each(roles, function (i, item) {
        if (!roles_list.includes(item.role)) {
          roles_list.push(item.role);
        }
      });
    }

    let option = '<option value="">Select Role</option>';
    if (roles_list.length > 0) {
      $.each(roles_list, function (i, item) {
        option += `<option value="${item}">${item}</option>`;
      });
    }
    $('[name="role"]').append(option);
    $('.chosen-select').trigger('chosen:updated');

    $.getJSON('data/user-list.json', function (userList) {
      // global variables
      let mainData = userList;

      if (localStorage.getItem('user_list') !== null) {
        mainData = JSON.parse(localStorage.getItem('user_list'));
      } else {
        localStorage.setItem('user_list', JSON.stringify(mainData));
      }

      function tableDetails(selector) {
        let count = $('#' + selector)
          .DataTable()
          .column(0)
          .data().length;
        if (count > 10) {
          $('#' + selector + '_length').hide();
          $('.dataTables_filter').hide();
          $('#' + selector + '_info').show();
          $('#' + selector + '_paginate').show();
        } else {
          $('#' + selector + '_length').hide();
          $('.dataTables_filter').hide();
          $('#' + selector + '_info').show();
          $('#' + selector + '_paginate').show();
        }
      }

      // form serialize arr to json
      function SerializeArrToJson(formSerializeArr) {
        var jsonObj = {};
        jQuery.map(formSerializeArr, function (n, i) {
          if (n.name.endsWith('role')) {
            var name = n.name;
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

      // random number generator
      function randomString() {
        //generate random number
        var randomNumber = Math.floor(100 + Math.random() * 100);
        return randomNumber;
      }
      $('#userId').val(randomString());

      jQuery(document).on(
        'change',
        'input:checkbox[name="status"]',
        function () {
          $(this).closest('tr').addClass('temp');
          if ($('.temp').find('.status').prop('checked') == true) {
            $('.temp').find('.active-status').val('true');
          } else if ($('.temp').find('.status').prop('checked') == false) {
            $('.temp').find('.active-status').val('false');
          }
          $(this).closest('tr').removeClass('temp');
        }
      );

      $('#userresetPassword').click(function (e) {
        var email = $('#resetEmail').val();
        var newPassword = $('#newPassword').val();
        var confirmNewPassword = $('#confirmNewPassword').val();
        var currentPassword = $('#currentPassword').val();
        var data = {
          email: email,
          newPassword: newPassword,
          confirmNewPassword: confirmNewPassword,
          currentPassword: currentPassword,
        };
        $('#message').text('');
      });

      // add user to list function
      $('.add-user').on('click', function () {
        let Form = $('#add-users');
        let FormInstance = Form.parsley();
        FormInstance.validate();
        let data = SerializeArrToJson(Form.serializeArray());
        if (FormInstance.isValid()) {
          let todayDate = new Date().toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
          data['createdDate'] = todayDate.replaceAll('/', '-');
          mainData[data['userId']] = data;
          localStorage.setItem('user_list', JSON.stringify(mainData));
          $('#add-users').trigger('reset');
          window.location.href = `users-view.html?v=${data['userId']}`;
        }
      });

      // get id from url
      let url = window.location.href;
      if (url.indexOf('e=') !== -1) {
        let params = new URLSearchParams(window.location.search);
        let query_id = params.get('e');
        $('.sec_title_tag').text(`User ID: ${query_id}`);

        if (localStorage.getItem('user_list') !== null) {
          let rawData = JSON.parse(localStorage.getItem('user_list'));
          let viewData = rawData[query_id];
          // format mobile number
          $('[data-tel=""]').intlTelInput({
            initialCountry: viewData['tel_country_code'],
            separateDialCode: true,
            onlyCountries: ['us', 'in'],
            showFlags: true,
          });
          $('[data-tel=""]').trigger('countrychange');
          for (let key in viewData) {
            let inputType = $(`[name="${key}"]`);
            if (inputType.attr('type') == 'radio') {
              $(`[type="radio"][name="${key}"][value="${viewData[key]}"]`).attr(
                'checked',
                true
              );
            } else {
              if (viewData[key] != '') {
                $(`[name="${key}"]`).val(viewData[key]);
              }
            }
          }
          $('.chosen-select').trigger('chosen:updated');
        }
      }
    });
  });
});
