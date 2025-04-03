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
  // format mobile number
  $('[data-tel=""]').intlTelInput({
    initialCountry: 'us',
    separateDialCode: true,
    onlyCountries: ['us', 'in'],
    showFlags: true,
  });

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

  $('[data-tel=""]').trigger('countrychange');

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

    let option = '<option value="">Select role</option>';
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
          const { first_name, last_name, user_email, userId } = data;
          let html = `<tr data-id="${userId}"> <td>${first_name}</td> <td>${last_name}</td> <td>${user_email}</td> <td>${todayDate.replaceAll('/', '-')}</td> <td><span class="label label-success u-edit" data-toggle="tooltip" title="" data-original-title="Edit"><i class="fa fa-edit"></i></span></td> <td> <span class="label label-warning" data-toggle="tooltip" title="" data-original-title="Reset Password"> <i class="fa fa-key"></i></span></td> <td><span class="label label-danger delete-btn" data-toggle="tooltip" title="" data-original-title="Delete"><i class="fa fa-trash-o"></i></span></td> </tr>`;

          mainData[data['userId']] = data;
          localStorage.setItem('user_list', JSON.stringify(mainData));
          $('#edit-user').removeClass('hidden');
          $('.add-user').addClass('hidden');
          $('input, select').attr('disabled', true);
          $('[name="role"]').trigger('chosen:updated');
          $(document).find('a.search-choice-close').css('display', 'none');
        }
      });

      // edit screen
      $('#edit-user').on('click', function () {
        $('#edit-user').addClass('hidden');
        $('.add-user').removeClass('hidden');
        $('input, select').attr('disabled', false);
        $('[name="role"]').trigger('chosen:updated');
      });
    });
  });
});
