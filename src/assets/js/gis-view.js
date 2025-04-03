$(document).ready(function () {
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
      $('#' + selector + '_paginate').hide();
    }
  }

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

  // get id from url
  let mainData = {};
  let userGetRes = {};
  let url = window.location.href;
  if (url.indexOf('v=') !== -1) {
    let params = new URLSearchParams(window.location.search);
    let uniqueId = params.get('v');

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
        console.log('userGetRes: ', userGetRes);
        $('.ask-btn').removeClass('hidden');
        let initialInput = $('[name="input[]"]').val(); // get i/p val
        $('[name="input_2nd[]"]').val(initialInput); // assign i/p val
        $('.fine-action-btn').removeClass('hidden');
        let index = Object.keys(userGetRes).length;
        let lastResponse = userGetRes['r' + index];
        $('[name="output2[]"]').val(lastResponse.res);
        $('.thumb-decision-outer').removeClass('hidden');
        $('[name="input_3nd[]"]').val(lastResponse.qes).prop('disabled', true);
        $(`#second_round [name="status"][value="${lastResponse.status}"]`).prop(
          'checked',
          true
        );
        $(`#second_round [name="status"]`).attr('disabled', true);
        $(`#second_round [name="temperature"]`)
          .val(lastResponse.temperature)
          .attr('disabled', true);
        console.log('lastResponse: ', lastResponse);
      }
    }
  }

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
      $(`#second_round [name="status"][value="${res[index]['status']}"]`).prop(
        'checked',
        true
      );
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
      $(`#second_round [name="status"][value="${res[index]['status']}"]`).prop(
        'checked',
        true
      );
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

  // redirect to edit screen
  $('#edit-btn').on('click', function () {
    let id = $('#finetune_id').val();
    window.location.href = `gis-edit.html?e=${id}`;
  });
}); // get.json function close
