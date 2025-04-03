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

$(document).ready(function () {
  // custom functions
  function tableDetails(selector) {
    let count = $('#' + selector)
      .DataTable()
      .column(0)
      .data().length;
    if (count > 10) {
      $('#' + selector + '_length').hide();
      $('#' + selector + '_filter').show();
      $('#' + selector + '_info').hide();
      $('#' + selector + '_paginate').hide();
    } else {
      $('#' + selector + '_length').hide();
      $('#' + selector + '_filter').show();
      $('#' + selector + '_info').hide();
      $('#' + selector + '_paginate').hide();
    }
  }

  // vendor global variables
  let summaries = [];
  let mainData = {};
  if (localStorage.getItem('AWS Item List') !== null) {
    mainData = JSON.parse(localStorage.getItem('AWS Item List'));
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

  $.getJSON('data/infrastructure.json', function (InfraData) {
    $.getJSON('data/modelParameters.json', function (modelPara) {
      let currentData = {};
      let page = 'infrastructure.html';
      if (sessionStorage.getItem('infra session data') !== null) {
        currentData = JSON.parse(sessionStorage.getItem('infra session data'));
      }
      $('.chosen-select').chosen({
        disable_search: true,
      });

      let destination = currentData['destination'];
      let certificate = currentData['certificate'];
      let dest_name = currentData['dest_name'];
      console.log('dest_name: ', dest_name);
      if (certificate) {
        $('.chosen-level').html(' - ' + certificate.replace(/_/g, ' '));
        $('.topology-edit-btn-outer').css('display', 'block');
      } else {
        $('.no-topology').css('display', 'block');
      }
      if (destination) {
        $('[name="destination"]').val(destination);
      }
      let comboimage = certificate + '_' + destination;
      $('[data-choice="true"]').css('display', 'none');
      $(`[data-mermaid-id="${comboimage}"]`).css('display', 'block');
      $('.chosen-select').trigger('chosen:updated');

      // edit topology
      $('#edit-topology').on('click', function () {
        window.location.href = `${page}?s=5`;
      });

      $('.dismiss_btn').on('click', function () {
        $('.default_close_button').trigger('click');
      });

      // topology popup
      $('.topology-img').on('click', function () {
        let html = $(this).html();
        // let title = $('.chosen-level').text().trim();
        $('.current-topology').text(certificate.replace(/_/g, ' '));
        $('#topology_popup').modal('show');
        $('.topology-model-view').html(html);
      });

      // destination selection functionality
      $('[name="destination"]').on('change', function () {
        let destination = $(this).val();
        let comboimage = certificate + '_' + destination;
        $('[data-choice="true"]').css('display', 'none');
        $(`[data-mermaid-id="${comboimage}"]`).css('display', 'block');
      });
    }); // json end
  });
});
