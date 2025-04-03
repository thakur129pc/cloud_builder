// init mask
// $('[data-masked]').inputmask();

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
      if (url.indexOf('v=') !== -1) {
        let params = new URLSearchParams(window.location.search);
        let query_id = params.get('v');
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
        }
      }

      // redirect to edit screen
      $('.edit-user').on('click', function () {
        let id = $('#userId').val();
        window.location.href = `users-edit.html?e=${id}`;
      });

      $('.chosen-select').trigger('chosen:updated');
    });
  });
});
