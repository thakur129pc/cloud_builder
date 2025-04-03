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

  //----tag creating, adding, removing starts----
  let tags = [];
  const tagContainer = document.querySelector('#tag-container');
  const input = document.querySelector('#editable-input input');

  function createTag(label) {
    const div = document.createElement('div');
    div.setAttribute('class', 'custom_tag');
    const span = document.createElement('span');
    span.innerHTML = label;
    const closeIcon = document.createElement('i');
    // closeIcon.innerHTML = '<i class="tag-remove-icons"></i>';
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
  //----tag creating, adding, removing ends----

  // get id from url
  let mainData = {};
  let url = window.location.href;
  if (url.indexOf('v=') !== -1) {
    let params = new URLSearchParams(window.location.search);
    let uniqueId = params.get('v');
    $('#uniqueId').val(uniqueId);

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

      let inputTableData =
        data['inputTableData'] != undefined ? data['inputTableData'] : [];
      let outputTableData =
        data['outputTableData'] != undefined ? data['outputTableData'] : [];
      let filterTableData =
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

      // input table
      $('#input-list tfoot th').each(function () {
        let title = $('#input-list thead th').eq($(this).index()).text().trim();
        if (title != '' && title) {
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
      $.each(inputTableData, function (i, item) {
        let { id, description, token, onfail } = item;
        $('#input-list')
          .DataTable()
          .row.add(
            $(
              `<tr data-id="${id}" class="input-guardrails"><td class="guard-input-id"><a href="javascript:void(0)">${id}</a></td><td class="desc">${description}</td><td class="token">${token}</td><td class="onfail">${onfail}</td></tr>`
            )
          )
          .draw();
      });
      tableDetails('input-list');

      // output table
      $('#output-list tfoot th').each(function () {
        let title = $('#output-list thead th')
          .eq($(this).index())
          .text()
          .trim();
        if (title != '' && title) {
          $(this).html(
            '<input type="text" class="filter" placeholder="' + title + '" />'
          );
        }
      });
      $('#output-list')
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

      // filter table
      $('#filter-list tfoot th').each(function () {
        let title = $('#filter-list thead th')
          .eq($(this).index())
          .text()
          .trim();
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
    }
  }

  // redirect to edit screen
  $('#edit-btn').on('click', function () {
    let id = $('#guardrailSet').val();
    window.location.href = `guardrails-edit.html?e=${id}`;
  });
}); // get.json function close
