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

  // global variables
  let mainData = {};
  let inputTableData = [];
  let outputTableData = [];
  let filterTableData = [];
  $('[name="tokens"]').val(
    inputTableData.length + outputTableData.length + filterTableData.length
  );

  if (localStorage.getItem('guardrails list') !== null) {
    mainData = JSON.parse(localStorage.getItem('guardrails list'));
  } else {
    mainData = {};
  }

  // random number generator
  function randomString() {
    //generate random number
    var randomNumber = Math.floor(100 + Math.random() * 100);
    return randomNumber;
  }
  // $('#guardrailSet').val(randomString());
  // $('#uuid').val(randomString());

  // form serialize arr to json
  function SerializeArrToJson(formSerializeArr) {
    var jsonObj = {};
    jQuery.map(formSerializeArr, function (n, i) {
      if (n.name.endsWith('Arr')) {
        var name = n.name;
        // name = name.substring(0, name.length - 2);
        if (!(name in jsonObj)) {
          jsonObj[name] = [];
        }
        jsonObj[name].push(n.value);
      } else if (!n.name.endsWith('_length') && !n.name.endsWith('[]')) {
        jsonObj[n.name] = n.value;
      }
    });
    return jsonObj;
  }

  // input table
  $('#input-list tfoot th').each(function () {
    let title = $('#input-list thead th').eq($(this).index()).text().trim();
    if (title != '' && title != 'Action') {
      $(this).html(
        '<input type="text" class="filter" placeholder="' + title + '" />'
      );
    }
  });
  $('#input-list')
    .DataTable({
      iDisplayLength: 25, // Set the default number of rows to display
      // "language": {
      //     "info": "Showing _START_ to _END_ of _TOTAL_ data"
      // }
    })
    .columns()
    .every(function () {
      var that = this;

      $('input', this.footer()).on('keyup change', function () {
        that.search(this.value).draw();
      });
    });

  tableDetails('input-list');

  // output table
  $('#output-list tfoot th').each(function () {
    let title = $('#output-list thead th').eq($(this).index()).text().trim();
    if (title != '' && title) {
      $(this).html(
        '<input type="text" class="filter" placeholder="' + title + '" />'
      );
    }
  });
  $('#output-list')
    .DataTable({
      iDisplayLength: 25, // Set the default number of rows to display
    })
    .columns()
    .every(function () {
      var that = this;

      $('input', this.footer()).on('keyup change', function () {
        that.search(this.value).draw();
      });
    });

  tableDetails('output-list');

  // filter table
  $('#filter-list tfoot th').each(function () {
    let title = $('#filter-list thead th').eq($(this).index()).text().trim();
    if (title != '' && title) {
      $(this).html(
        '<input type="text" class="filter" placeholder="' + title + '" />'
      );
    }
  });
  $('#filter-list')
    .DataTable({
      iDisplayLength: 25, // Set the default number of rows to display
      // "language": {
      //     "info": "Showing _START_ to _END_ of _TOTAL_ data"
      // }
    })
    .columns()
    .every(function () {
      var that = this;

      $('input', this.footer()).on('keyup change', function () {
        that.search(this.value).draw();
      });
    });
  tableDetails('filter-list');

  // trigger iguard modal
  $(document).on('click', '.add-new-iguard-item', function () {
    $('[name="add-new-iguard-form"]').trigger('reset');
    $('#add-iguard-popup').find('#save-iguard-item-btn').show();
    $('#add-iguard-popup').find('#update-iguard-item-btn').hide();
    $('.input-guardrails').removeClass('edit-mode');
    $('[name="onfail"][value="Inform"]').prop('checked', true);
    $('.filterWords').addClass('hidden');
    $('.infoDesc').removeClass('hidden');
    $('[name="infoDesc"]').val('').attr('required', true);
    $('[name="filterWords"]').val('').attr('required', false);
    $('#add-iguard-popup').modal('show');
  });

  // onfail functionality
  $('[name="onfail"]').on('click', function () {
    let value = $(this).val();
    if (value == 'Inform') {
      $('.filterWords').addClass('hidden');
      $('.infoDesc').removeClass('hidden');
      $('[name="infoDesc"]').val('').attr('required', true);
      $('[name="filterWords"]').val('').attr('required', false);
    } else if (value == 'Reject') {
      let isChecked = $(this).hasClass('selected_mode');
      if (!isChecked) {
        $('input').removeClass('select-mode-change');
        $(this).addClass('select-mode-change');
        $('#onfail-selection-popup').modal('show');
        $(this)
          .parents('.onfail-outer')
          .find('input:not(.selected_mode)')
          .prop('checked', false);
        $(this)
          .parents('.onfail-outer')
          .find('input.selected_mode')
          .prop('checked', true);
      }
    }
  });

  $('#onfail-selection-btn').on('click', function () {
    $('.onfail-outer').find('input:not(.selected_mode)').prop('checked', true);
    // $('.onfail-outer').find('input.selected_mode').removeClass('selected_mode');
    $('.infoDesc').addClass('hidden');
    $('.filterWords').removeClass('hidden');
    $('[name="infoDesc"]').val('').attr('required', false);
    $('[name="filterWords"]').val('').attr('required', true);
    $('#onfail-selection-popup').modal('hide');
  });

  $(document).on('hidden.bs.modal', '.modal', function () {
    $('.modal:visible').length && $(document.body).addClass('modal-open');
  });

  // add iguard item functionality
  $('#save-iguard-item-btn').on('click', function () {
    let Form = $('.add-new-iguard-form');
    let FormInstance = Form.parsley();
    FormInstance.validate();
    let data = SerializeArrToJson(Form.serializeArray());
    if (FormInstance.isValid()) {
      let id = randomString();
      let token = randomString();
      const { description, onfail } = data;
      data['id'] = id;
      data['token'] = token;
      inputTableData.push(data);
      console.log('inputTableData: ', inputTableData);

      $('#input-list')
        .DataTable()
        .row.add(
          $(
            `<tr data-id="${id}" class="input-guardrails"><td class="guard-input-id"><a href="javascript:void(0)">${id}</a></td><td class="desc">${description}</td><td class="token">${token}</td><td class="onfail">${onfail}</td><td width="10%" class="checkbox-div"> <div class="c-checkbox"> <label> <input type="checkbox" name="sub_checkbox[]" class="checkall"> <span class="fa fa-check"></span> </label> </div> </td</tr>`
          )
        )
        .draw();
      tableDetails('input-list');
      Form.trigger('reset');
      $('#add-iguard-popup').modal('hide');
    }
  });

  // edit or view input guard functionality
  $(document).on('click', '.guard-input-id', function () {
    $('.input-guardrails').removeClass('edit-mode');
    $(this).parents('.input-guardrails').addClass('edit-mode');
    let id = $(this).parents('.input-guardrails').attr('data-id');
    let [data] = inputTableData.filter((item, i) => {
      if (item.id == id) {
        return item;
      }
    });

    let form = $('[name="add-new-iguard-form"]');
    for (let key in data) {
      let inputType = $(`[name="${key}"]`);
      if (inputType.attr('type') == 'radio') {
        form
          .find(`[type="radio"][name="${key}"][value="${data[key]}"]`)
          .prop('checked', true);

        if (data[key] == 'Inform') {
          $('.filterWords').addClass('hidden');
          $('.infoDesc').removeClass('hidden');
          $('[name="infoDesc"]').attr('required', true);
          $('[name="filterWords"]').attr('required', false);
        } else if (data[key] == 'Reject') {
          $('.infoDesc').addClass('hidden');
          $('.filterWords').removeClass('hidden');
          $('[name="infoDesc"]').attr('required', false);
          $('[name="filterWords"]').attr('required', true);
        }
      } else {
        if (data[key] != '') {
          form.find(`[name="${key}"]`).val(data[key]);
        }
      }
    }
    $('#add-iguard-popup').find('#save-iguard-item-btn').hide();
    $('#add-iguard-popup').find('#update-iguard-item-btn').show();
    // $('#add-iguard-popup').find('input').attr('disabled', true);
    // $('#add-iguard-popup').find('textarea').attr('readonly', true);
    $('#add-iguard-popup').modal('show');
  });

  // update iguard item functionality
  $('#update-iguard-item-btn').on('click', function () {
    let Form = $('.add-new-iguard-form');
    let FormInstance = Form.parsley();
    FormInstance.validate();
    let data = SerializeArrToJson(Form.serializeArray());
    if (FormInstance.isValid()) {
      let id = $(document).find('.edit-mode').attr('data-id');
      inputTableData = inputTableData.map((item, i) => {
        if (item.id == id) {
          if (data.onfail == 'Inform') {
            item = { ...item, ...data, filterWords: '' };
          } else {
            item = { ...item, ...data, infoDesc: '' };
          }

          return item;
        } else {
          return item;
        }
      });

      $('#input-list').DataTable().clear().draw();
      $.each(inputTableData, function (i, item) {
        let { id, description, token, onfail } = item;
        $('#input-list')
          .DataTable()
          .row.add(
            $(
              `<tr data-id="${id}" class="input-guardrails"><td class="guard-input-id"><a href="javascript:void(0)">${id}</a></td><td class="desc">${description}</td><td class="token">${token}</td><td class="onfail">${onfail}</td><td width="10%" class="checkbox-div"> <div class="c-checkbox"> <label> <input type="checkbox" name="sub_checkbox[]" class="checkall"> <span class="fa fa-check"></span> </label> </div> </td</tr>`
            )
          )
          .draw();
      });
      tableDetails('input-list');

      Form.trigger('reset');
      $('#add-iguard-popup').modal('hide');
    }
  });

  // output popup functionality
  $(document).on('click', '.add-new-oguard-item', function () {
    $('[name="add-new-oguard-form"]').trigger('reset');
    $('#add-oguard-popup').find('#save-oguard-item-btn').show();
    $('#add-oguard-popup').find('#update-oguard-item-btn').hide();
    $('.output-guardrails').removeClass('oedit-mode');
    $('#add-oguard-popup').modal('show');
  });
  $('#save-oguard-item-btn').on('click', function () {
    let Form = $('.add-new-oguard-form');
    let FormInstance = Form.parsley();
    FormInstance.validate();
    let data = SerializeArrToJson(Form.serializeArray());
    if (FormInstance.isValid()) {
      let id = randomString();
      const { description } = data;
      data['id'] = id;
      outputTableData.push(data);
      console.log('outputTableData: ', outputTableData);

      $('#output-list')
        .DataTable()
        .row.add(
          $(
            `<tr data-id="${id}" class="output-guardrails"><td class="guard-output-id"><a href="javascript:void(0)">${id}</a></td><td class="desc">${description}</td></tr>`
          )
        )
        .draw();
      tableDetails('output-list');
      Form.trigger('reset');
      $('#add-oguard-popup').modal('hide');
    }
  });
  $(document).on('click', '.guard-output-id', function () {
    $('.output-guardrails').removeClass('oedit-mode');
    $(this).parents('.output-guardrails').addClass('oedit-mode');
    let id = $(this).parents('.output-guardrails').attr('data-id');
    let [data] = outputTableData.filter((item, i) => {
      if (item.id == id) {
        return item;
      }
    });

    let form = $('[name="add-new-oguard-form"]');
    for (let key in data) {
      if (data[key] != '') {
        form.find(`[name="${key}"]`).val(data[key]);
      }
    }
    $('#add-oguard-popup').find('#save-oguard-item-btn').hide();
    $('#add-oguard-popup').find('#update-oguard-item-btn').show();
    $('#add-oguard-popup').modal('show');
  });
  $('#update-oguard-item-btn').on('click', function () {
    let Form = $('.add-new-oguard-form');
    let FormInstance = Form.parsley();
    FormInstance.validate();
    let data = SerializeArrToJson(Form.serializeArray());
    if (FormInstance.isValid()) {
      let id = $(document).find('.oedit-mode').attr('data-id');
      outputTableData = outputTableData.map((item, i) => {
        if (item.id == id) {
          item = { ...item, ...data, infoDesc: '' };
          return item;
        } else {
          return item;
        }
      });

      $('#output-list').DataTable().clear().draw();
      $.each(outputTableData, function (i, item) {
        let { id, description, token, onfail } = item;
        $('#output-list')
          .DataTable()
          .row.add(
            $(
              `<tr data-id="${id}" class="output-guardrails"><td class="guard-output-id"><a href="javascript:void(0)">${id}</a></td><td class="desc">${description}</td></tr>`
            )
          )
          .draw();
      });
      tableDetails('output-list');

      Form.trigger('reset');
      $('#add-oguard-popup').modal('hide');
    }
  });

  // filter popup functionality
  $(document).on('click', '.add-new-fguard-item', function () {
    $('[name="add-new-fguard-form"]').trigger('reset');
    $('#add-fguard-popup').find('#save-fguard-item-btn').show();
    $('#add-fguard-popup').find('#update-fguard-item-btn').hide();
    $('.filter-guardrails').removeClass('fedit-mode');
    $('#add-fguard-popup').modal('show');
  });
  $('#save-fguard-item-btn').on('click', function () {
    let Form = $('.add-new-fguard-form');
    let FormInstance = Form.parsley();
    FormInstance.validate();
    let data = SerializeArrToJson(Form.serializeArray());
    if (FormInstance.isValid()) {
      let id = randomString();
      const { description } = data;
      data['id'] = id;
      filterTableData.push(data);
      console.log('filterTableData: ', filterTableData);

      $('#filter-list')
        .DataTable()
        .row.add(
          $(
            `<tr data-id="${id}" class="filter-guardrails"><td class="guard-filter-id"><a href="javascript:void(0)">${id}</a></td><td class="desc">${description}</td></tr>`
          )
        )
        .draw();
      tableDetails('filter-list');
      Form.trigger('reset');
      $('#add-fguard-popup').modal('hide');
    }
  });
  $(document).on('click', '.guard-filter-id', function () {
    $('.filter-guardrails').removeClass('fedit-mode');
    $(this).parents('.filter-guardrails').addClass('fedit-mode');
    let id = $(this).parents('.filter-guardrails').attr('data-id');
    let [data] = filterTableData.filter((item, i) => {
      if (item.id == id) {
        return item;
      }
    });

    let form = $('[name="add-new-fguard-form"]');
    for (let key in data) {
      if (data[key] != '') {
        form.find(`[name="${key}"]`).val(data[key]);
      }
    }
    $('#add-fguard-popup').find('#save-fguard-item-btn').hide();
    $('#add-fguard-popup').find('#update-fguard-item-btn').show();
    $('#add-fguard-popup').modal('show');
  });
  $('#update-fguard-item-btn').on('click', function () {
    let Form = $('.add-new-fguard-form');
    let FormInstance = Form.parsley();
    FormInstance.validate();
    let data = SerializeArrToJson(Form.serializeArray());
    if (FormInstance.isValid()) {
      let id = $(document).find('.fedit-mode').attr('data-id');
      filterTableData = filterTableData.map((item, i) => {
        if (item.id == id) {
          item = { ...item, ...data, infoDesc: '' };
          return item;
        } else {
          return item;
        }
      });

      $('#filter-list').DataTable().clear().draw();
      $.each(filterTableData, function (i, item) {
        let { id, description } = item;
        $('#filter-list')
          .DataTable()
          .row.add(
            $(
              `<tr data-id="${id}" class="filter-guardrails"><td class="guard-filter-id"><a href="javascript:void(0)">${id}</a></td><td class="desc">${description}</td></tr>`
            )
          )
          .draw();
      });
      tableDetails('filter-list');

      Form.trigger('reset');
      $('#add-fguard-popup').modal('hide');
    }
  });

  // prompt functionality
  $('[name="prompt"]').on('click', function () {
    let value = $('[name="prompt"]:checked').val();
    if (value == 'Role') {
      $('.role_name_wrapper')
        .removeClass('hidden')
        .find('input')
        .attr('required', false);
    } else {
      clearTags();
      tags = [];
      $('.role_name_wrapper')
        .addClass('hidden')
        .find('input')
        .attr('required', false)
        .val('');
    }
  });

  // Guardrails functionality
  $('#save-btn').on('click', function () {
    let Form = $('#screenForm');
    let FormInstance = Form.parsley();
    FormInstance.validate();
    let data = SerializeArrToJson(Form.serializeArray());
    console.log('data: ', data);

    if (FormInstance.isValid()) {
      $('#save-confirm-popup').modal('show');
    }
  });

  // role name with tag functionality
  //----tag creating, adding, removing starts----
  var tags = [];
  const tagContainer = document.querySelector('#tag-container');

  function createTag(label) {
    const div = document.createElement('div');
    div.setAttribute('class', 'custom_tag');
    const span = document.createElement('span');
    span.innerHTML = label;
    const closeIcon = document.createElement('i');
    closeIcon.innerHTML = '<i class="tag-remove-icons"></i>';
    closeIcon.setAttribute('data-item', label);
    div.appendChild(span);
    div.appendChild(closeIcon);
    document.querySelector('#tag-container input').value = '';
    return div;
  }

  function clearTags() {
    document.querySelectorAll('.custom_tag').forEach((tag) => {
      tag.parentElement.removeChild(tag);
    });
  }

  function addTags() {
    clearTags();
    tags
      .slice()
      .reverse()
      .forEach((tag) => {
        tagContainer.prepend(createTag(tag));
      });
  }

  $('#tag-container input').keydown(function (e) {
    if (e.keyCode == 13 || e.keyCode == 188) {
      var array_tag = [];
      $('.custom_tag span').each(function () {
        array_tag.push($(this).text());
      });
      inputValue = document.querySelector('#tag-container input').value;

      if (
        inputValue != '' &&
        inputValue != null &&
        !array_tag.includes(inputValue)
      ) {
        $(this).css('color', 'black');

        inputValue.split(',').forEach((tag) => {
          if (tag != null && tag != '') {
            tags.push(tag);
          }
        });
        addTags();
      } else {
        $(this).css('color', 'red');
      }
    }
  });

  $('#tag-container input').blur(function (e) {
    var array_tag = [];
    $('.custom_tag span').each(function () {
      array_tag.push($(this).text());
    });
    inputValue = document.querySelector('#tag-container input').value;

    if (
      inputValue != '' &&
      inputValue != null &&
      !array_tag.includes(inputValue)
    ) {
      $(this).css('color', 'black');

      inputValue.split(',').forEach((tag) => {
        if (tag != null && tag != '') {
          tags.push(tag);
        }
      });

      addTags();
    } else {
      $(this).css('color', 'red');
    }
  });

  $('#tag-container input').keyup(function (e) {
    if (e.keyCode == 188) {
      document.querySelector('#tag-container input').value = '';
    }
  });

  document.addEventListener('click', (e) => {
    if (e.target.className === 'tag-remove-icons') {
      const tagLabel = e.target.parentNode.getAttribute('data-item');

      const index = tags.indexOf(tagLabel);
      tags = [...tags.slice(0, index), ...tags.slice(index + 1)];
      addTags();
    }
  });
  //----tag creating, adding, removing ends----

  $('#save-confirm-btn').on('click', function () {
    let Form = $('#screenForm');
    let FormInstance = Form.parsley();
    FormInstance.validate();
    let data = SerializeArrToJson(Form.serializeArray());

    if (FormInstance.isValid()) {
      $('[name="tokens"]').val(
        inputTableData.length + outputTableData.length + filterTableData.length
      );
      mainData[data['guardrailSet']] = {
        ...data,
        inputTableData,
        outputTableData,
        filterTableData,
        tags,
      };
      console.log('mainData: ', mainData);
      localStorage.setItem('guardrails list', JSON.stringify(mainData));
      $('#save-confirm-popup').modal('hide');
      window.location.href = `guardrails-view.html?v=${data['guardrailSet']}`;
    }
  });

  let url = window.location.href;
  if (url.indexOf('e=') !== -1) {
    let params = new URLSearchParams(window.location.search);
    let uniqueId = params.get('e');
    console.log('uniqueId: ', uniqueId);

    if (localStorage.getItem('guardrails list') !== null) {
      mainData = JSON.parse(localStorage.getItem('guardrails list'));
      let data = mainData[uniqueId];

      for (let key in data) {
        $(`#screenForm [name="${key}"][type="text"]`).val(data[key]);
      }

      if (data['prompt'] == 'Everyone') {
        $('[name="prompt"][value="Everyone"]').prop('checked', true);
      } else if (data['prompt'] == 'Role') {
        $('[name="prompt"][value="Role"]').prop('checked', true);
        $('.role_name_wrapper').removeClass('hidden');
      }

      if (data['guardrailsFilter'] == 'Enable filter') {
        $('[name="guardrailsFilter"][value="Enable filter"]').prop(
          'checked',
          true
        );
      } else if (data['guardrailsFilter'] == 'Disable filter') {
        $('[name="guardrailsFilter"][value="Disable filter"]').prop(
          'checked',
          true
        );
      }

      inputTableData =
        data['inputTableData'] != undefined ? data['inputTableData'] : [];
      outputTableData =
        data['outputTableData'] != undefined ? data['outputTableData'] : [];
      filterTableData =
        data['filterTableData'] != undefined ? data['filterTableData'] : [];
      tags = data['tags'];
      if (tags != undefined && tags) {
        addTags();
      } else {
        tags = [];
      }

      $('[name="tokens"]').val(
        inputTableData.length + outputTableData.length + filterTableData.length
      );

      $.each(inputTableData, function (i, item) {
        let { id, description, token, onfail } = item;
        $('#input-list')
          .DataTable()
          .row.add(
            $(
              `<tr data-id="${id}" class="input-guardrails"><td class="guard-input-id"><a href="javascript:void(0)">${id}</a></td><td class="desc">${description}</td><td class="token">${token}</td><td class="onfail">${onfail}</td><td width="10%" class="checkbox-div"> <div class="c-checkbox"> <label> <input type="checkbox" name="sub_checkbox[]" class="checkall"> <span class="fa fa-check"></span> </label> </div> </td></tr>`
            )
          )
          .draw();
      });
      tableDetails('input-list');

      $.each(outputTableData, function (i, item) {
        let { id, description, token, onfail } = item;
        $('#output-list')
          .DataTable()
          .row.add(
            $(
              `<tr data-id="${id}" class="output-guardrails"><td class="guard-output-id"><a href="javascript:void(0)">${id}</a></td><td class="desc">${description}</td></tr>`
            )
          )
          .draw();
      });
      tableDetails('output-list');

      $.each(filterTableData, function (i, item) {
        let { id, description, token, onfail } = item;
        $('#filter-list')
          .DataTable()
          .row.add(
            $(
              `<tr data-id="${id}" class="filter-guardrails"><td class="guard-filter-id"><a href="javascript:void(0)">${id}</a></td><td class="desc">${description}</td></tr>`
            )
          )
          .draw();
      });
      tableDetails('filter-list');
    }
  }
});
