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
      $('.dataTables_filter').show();
      $('#' + selector + '_info').show();
      $('#' + selector + '_paginate').show();
    }
  }

  // global variables
  let mainData = {};
  let promptList = [
    { id: 1, prompt: 'What is the highest selling product last week' },
    { id: 2, prompt: 'Which product sold the most last week' },
    {
      id: 3,
      prompt: 'Which product was most popular with customers last week',
    },
  ];

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

  if (localStorage.getItem('Query List') !== null) {
    mainData = JSON.parse(localStorage.getItem('Query List'));
  } else {
    mainData = {};
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

  // random number generator
  function randomString() {
    //generate random number
    var randomNumber = Math.floor(100 + Math.random() * 100);
    return randomNumber;
  }
  $('#query_id').val(randomString());

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

  // prompt-list table  // Search functionality
  $('#prompt-list tfoot th').each(function () {
    let title = $('#prompt-list thead th').eq($(this).index()).text().trim();
    if (title != '' && title) {
      $(this).html(
        '<input type="text" class="filter" placeholder="' + title + '" />'
      );
    }
  });
  $('#prompt-list')
    .DataTable({
      iDisplayLength: 25, // Set the default number of rows to display
      language: {
        info: 'Showing _START_ to _END_ of _TOTAL_ prompts',
      },
    })
    .columns()
    .every(function () {
      var that = this;

      $('input', this.footer()).on('keyup change', function () {
        that.search(this.value).draw();
      });
    });
  tableDetails('prompt-list');

  // add new description functionality
  $('.add-new-btn').on('click', function () {
    $('#add-new-prompt-popup').modal('show');
  });

  // Query List base functionality
  $('.save-btn').on('click', function () {
    let Form = $('#application_form');
    let FormInstance = Form.parsley();
    FormInstance.validate();
    $('[name="query_id"]').prop('disabled', false);
    let data = SerializeArrToJson(Form.serializeArray());
    $('[name="query_id"]').prop('disabled', true);
    if (FormInstance.isValid()) {
      mainData[data['query_id']] = { ...data, promptList };
      localStorage.setItem('Query List', JSON.stringify(mainData));
      window.location.href = `query-view.html?v=${data['query_id']}`;
    }
  });

  // link database functionality
  let promptLength =
    parseInt($('#prompt-list').DataTable().column(0).data().length) + 1;
  $('#add-prompt-btn').on('click', function () {
    let Form = $('.add-new-prompt-form');
    let FormInstance = Form.parsley();
    FormInstance.validate();
    let data = SerializeArrToJson(Form.serializeArray());
    if (FormInstance.isValid()) {
      const { prompt } = data;
      promptList.push({ id: promptLength, ...data });
      let html = `<tr data-id="${promptLength}"> <td> ${promptLength} </td> <td> <a href="prompt-list.html"> ${prompt} </td> </a> </tr>`;
      $('#prompt-list').DataTable().row.add($(html)).draw();
      Form.trigger('reset');
      $('#add-new-prompt-popup').modal('hide');
      promptLength++;
    }
  });
});
