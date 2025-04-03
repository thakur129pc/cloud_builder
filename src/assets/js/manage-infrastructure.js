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
      let MissionStatus = {};
      let page = 'infrastructure.html';
      if (sessionStorage.getItem('infra session data') !== null) {
        currentData = JSON.parse(sessionStorage.getItem('infra session data'));
      }

      if (localStorage.getItem('mission controller') !== null) {
        MissionStatus = JSON.parse(localStorage.getItem('mission controller'));
      }
      $('.chosen-select').chosen({
        disable_search: true,
      });

      // cost ownership table
      var costownership = $('#cost-ownership-list').DataTable({
        iDisplayLength: 50, // Set the default number of rows to display
      });
      tableDetails('cost-ownership-list');

      // cost table
      machineSelect = currentData['machineSelect'];

      if (machineSelect && machineSelect != '') {
        costownership.clear().draw();

        $.each(machineSelect, function (i, option) {
          let id = i.replace(/m/g, '');
          let model = '';
          let [CurrentModel] = InfraData.filter((item, i) => {
            if (item.id == id) {
              model = item.model_name;
              return item;
            }
          });

          // inferences
          $.each(CurrentModel.inferences, function (key, item) {
            let { id, machineType, model } = item;
            let mid = id;
            $.each(machineType, function (i, elemIt) {
              let { id, machineType, machineTypeName, month_cost, year_cost } =
                elemIt;
              let nid = mid + '_' + id;
              let status = '';
              if (!MissionStatus.hasOwnProperty('m' + nid)) {
                MissionStatus['m' + nid] = true;
                status = 'checked';
              } else {
                status = MissionStatus['m' + nid] ? 'checked' : '';
              }

              if (option == nid) {
                $('#cost-ownership-list')
                  .DataTable()
                  .row.add(
                    $(`<tr class="summary-row even" data-model-id="${nid}" role="row">
									<td>${model}</td>
									<td> ${machineTypeName} </td>
									<td>$ ${month_cost}</td>
									<td>$ ${year_cost}</td>
									<td width="10%" class="toggle-btn"><div class="toggle-check-box">
									<div class="button r" id="button-1">
										<input type="checkbox" name="instance_status" class="checkbox checkbox-input" ${status}>
										<div class="knobs"></div>
										<div class="layer"></div>
									</div>
									</div></td>
								</tr>`)
                  )
                  .draw();
              }
            });
          });
          tableDetails('cost-ownership-list');
        });
      } else {
        machineSelect = {};
      }
      // status change functionality
      $(document).on('click', '[name="instance_status"]', function () {
        let id = $(this).parents('tr.summary-row').attr('data-model-id');
        let status = $(this).is(':checked');
        if (status) {
          MissionStatus['m' + id] = true;
        } else {
          MissionStatus['m' + id] = false;
        }
      });

      // save functionality
      $('#save').on('click', function () {
        localStorage.setItem(
          'mission controller',
          JSON.stringify(MissionStatus)
        );
        // Get the rocket modal
        let modal = $('#myModal');
        modal.css('display', 'block');
        setTimeout(function () {
          window.location.href = 'infrastructure-dashboard.html';
        }, 3000);
      });

      $(document)
        .find('.dataTables_filter')
        .children('label')
        .children('input')
        .attr('placeholder', 'Filter');
    }); // json end
  });
});
