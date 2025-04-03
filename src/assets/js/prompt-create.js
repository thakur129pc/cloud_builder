$(document).ready(function () {
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

  $.getJSON('data/queries-list.json', function (data) {
    let mainQueriesList = data;
    if (localStorage.getItem('Query List') === null) {
      localStorage.setItem('Query List', JSON.stringify(mainQueriesList));
    } else {
      let x = {
        ...mainQueriesList,
        ...JSON.parse(localStorage.getItem('Query List')),
      };
      mainQueriesList = x;
      localStorage.setItem('Query List', JSON.stringify(x));
    }

    let option = '<option value="">Select query name</option>';
    $.each(mainQueriesList, function (key, value) {
      option += `<option value="${value.query_name}" data-id="${value.query_id}">${value.query_name}</option>`;
    });
    $('[name="query_name"]').append(option);
    $('.chosen-select').trigger('chosen:updated');

    // add query id functionality
    $('[name="query_name"]').on('change', function () {
      let value = $(this).val();
      let id = $('[name="query_name"] option:selected').attr('data-id');
      $('[name="query_id"]').val(id);
      $('[name="promptId"]').val(id + 'P' + $('[name="refId"]').val());
    });

    // global variables
    let mainData = [];

    if (localStorage.getItem('prompt list') !== null) {
      mainData = JSON.parse(localStorage.getItem('prompt list'));
    } else {
      mainData = [];
    }

    // random number generator
    function randomString() {
      //generate random number
      var randomNumber = Math.floor(10 + Math.random() * 10);
      return randomNumber;
    }
    $('#promptId').val(randomString());
    $('[name="refId"]').val(randomString());

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

    let mainPromptData = [];
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
        let id = $('[name="query_id"]').val();
        let promptId = $('[name="refId"]').val();
        let prompt = $('[name="prompt"]').val();

        let query = mainQueriesList[id];
        let promptList = query['promptList'];
        promptList.push({ id: promptId, prompt: prompt });
        query['promptList'] = promptList;
        mainQueriesList[id] = query;
        localStorage.setItem('Query List', JSON.stringify(mainQueriesList));

        if (localStorage.getItem('Query List') !== null) {
          let LinkData = JSON.parse(localStorage.getItem('Query List'));
          let promptData = [];
          if (localStorage.getItem('prompt list') !== null) {
            promptData = JSON.parse(localStorage.getItem('prompt list'));
          }

          $.each(LinkData, function (key, value) {
            let { query_id, userId, query_name, query_desc, promptList } =
              value;
            if (Object.hasOwn(value, 'promptList')) {
              $.each(promptList, function (k, item) {
                console.log('item: ', item);
                let { prompt, id } = item;
                let $id = query_id + 'P' + id;

                if (promptData.length > 0) {
                  let [data] = promptData.filter((curElem) => {
                    if (curElem.promptId === $id) {
                      return curElem;
                    }
                  });
                  if (typeof data === 'object') {
                    let {
                      prompt,
                      merge_status,
                      promptId,
                      userId,
                      query_name,
                      query_id,
                      history_icon,
                    } = data;
                    mainPromptData.push(data);
                  } else {
                    mainPromptData.push({
                      promptId: $id,
                      prompt,
                      query_id,
                      userId,
                      query_name,
                      tag: [],
                      merge_id: '',
                      merge_status: false,
                      history_icon: false,
                      checked: false,
                      mergePromptText: [],
                    });
                  }
                } else {
                  mainPromptData.push({
                    promptId: $id,
                    prompt,
                    query_id,
                    userId,
                    query_name,
                    tag: [],
                    merge_id: '',
                    merge_status: false,
                    history_icon: false,
                    checked: false,
                    mergePromptText: [],
                  });
                }
              });
            }
          });
          localStorage.setItem('prompt list', JSON.stringify(mainPromptData));
        }
        window.location.href = 'prompt-view.html?v=' + data['promptId'];
      }
    });
  });
});
