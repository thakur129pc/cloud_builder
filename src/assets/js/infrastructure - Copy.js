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

// Chart.defaults.scale.gridLines.display = false;
// <block:plugin:0>
const getOrCreateLegendList = (chart, id) => {
  const legendContainer = document.getElementById(id);
  let listContainer = legendContainer.querySelector('ul');

  if (!listContainer) {
    listContainer = document.createElement('ul');
    listContainer.style.display = 'flex';
    listContainer.style.flexDirection = 'row';
    listContainer.style.margin = 0;
    listContainer.style.padding = 0;

    legendContainer.appendChild(listContainer);
  }

  return listContainer;
};

const htmlLegendPlugin = {
  id: 'htmlLegend',
  afterUpdate(chart, args, options) {
    const ul = getOrCreateLegendList(chart, options.containerID);

    // Remove old legend items
    while (ul.firstChild) {
      ul.firstChild.remove();
    }

    // Reuse the built-in legendItems generator
    const items = chart.options.plugins.legend.labels.generateLabels(chart);

    items.forEach((item) => {
      const li = document.createElement('li');
      li.style.alignItems = 'center';
      li.style.cursor = 'pointer';
      li.style.display = 'flex';
      li.style.flexDirection = 'row';
      li.style.marginLeft = '10px';

      li.onclick = () => {
        const { type } = chart.config;
        if (type === 'pie' || type === 'doughnut') {
          // Pie and doughnut charts only have a single dataset and visibility is per item
          chart.toggleDataVisibility(item.index);
        } else {
          chart.setDatasetVisibility(
            item.datasetIndex,
            !chart.isDatasetVisible(item.datasetIndex)
          );
        }
        chart.update();
      };

      // Color box
      const boxSpan = document.createElement('span');
      boxSpan.style.background = item.fillStyle;
      boxSpan.style.borderColor = item.strokeStyle;
      boxSpan.style.borderWidth = item.lineWidth + 'px';
      boxSpan.style.display = 'inline-block';
      boxSpan.style.flexShrink = 0;
      boxSpan.style.height = '20px';
      boxSpan.style.marginRight = '10px';
      boxSpan.style.width = '20px';

      // Text
      const textContainer = document.createElement('p');
      textContainer.style.color = item.fontColor;
      textContainer.style.margin = 0;
      textContainer.style.padding = 0;
      textContainer.style.textDecoration = item.hidden ? 'line-through' : '';

      const text = document.createTextNode(item.text);
      textContainer.appendChild(text);

      li.appendChild(boxSpan);
      li.appendChild(textContainer);
      ul.appendChild(li);
    });
  },
};
// </block:plugin>

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
  let mainData = {};
  let currentData = {};
  let page = 'infrastructure.html';
  if (sessionStorage.getItem('infra session data') !== null) {
    currentData = JSON.parse(sessionStorage.getItem('infra session data'));
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

  $(function () {
    // jQuery Only
    $('.js-accordion-group-bom').wfAccordion();
  });

  $(function () {
    // jQuery Only
    $('.js-accordion-group-sbom').wfAccordion();
  });

  $.getJSON('data/infrastructure.json', function (InfraData) {
    $.getJSON('data/bill-of-materials.json', function (bom) {
      $.getJSON('data/modelParameters.json', function (modelPara) {
        $(document).on('click', '.a-open', function () {
          $(this).removeClass('a-open');
          $(this).addClass('a-close');
        });

        $(document).on('click', '.a-close', function () {
          $(this).removeClass('a-close');
          $(this).addClass('a-open');
        });

        // create new wizard
        // setTimeout(function () {
        // 	// myWizard = new Wizard($('#myWizard'));
        // 	$('div.topology-main').removeClass('topology-init-wrapper');
        // }, 1500);

        // Numeric only control handler
        jQuery.fn.ForceNumericOnly = function () {
          return this.each(function () {
            $(this).keydown(function (e) {
              var key = e.charCode || e.keyCode || 0;
              // allow backspace, tab, delete, enter, arrows, numbers and keypad numbers ONLY
              // home, end, period, and numpad decimal
              return (
                key == 8 ||
                key == 9 ||
                key == 13 ||
                key == 46 ||
                key == 110 ||
                key == 190 ||
                (key >= 35 && key <= 40) ||
                (key >= 48 && key <= 57) ||
                (key >= 96 && key <= 105)
              );
            });
          });
        };
        // add data attribute for the fields you required only
        $('[data-field-number="true"]').ForceNumericOnly();

        function toSentenceCase(text) {
          return text.toLowerCase().replace(/(^\w|\s\w)/g, function (match) {
            return match.toUpperCase();
          });
        }

        let option = '';
        $.each(InfraData, function (i, item) {
          option += `<option value="${item.model_name}" data-id="${item.id}">${toSentenceCase(item.model_name)}</option>`;
        });
        $('[name="modelsCompare"]').append(option);
        $('.chosen-select').trigger('chosen:updated');

        function SerializeArrToJson(arr) {
          var jsonObj = {};
          jQuery.map(arr, function (n, i) {
            if (n.value != '') {
              if (n.name.endsWith('[]') && !n.name.endsWith('checkbox[]')) {
                var name = n.name;
                name = name.substring(0, name.length - 2);
                if (!(name in jsonObj)) {
                  jsonObj[name] = [];
                }
                jsonObj[name].push(n.value);
              } else {
                if (!n.name.endsWith('_length')) {
                  jsonObj[n.name] = n.value;
                }
              }
            }
          });
          return jsonObj;
        }

        // random number generator
        function randomString() {
          //generate random number
          return Math.floor(100 + Math.random() * 100);
        }
        $('[name="uuid"]').val(randomString());

        jQuery.fn.CurrencyNumericOnly = function () {
          return this.each(function () {
            $(this).keydown(function (e) {
              var key = e.charCode || e.keyCode || 0;
              // allow backspace, tab, delete, enter, arrows, numbers and keypad numbers ONLY
              // home, end, period, and numpad decimal
              return (
                key == 8 ||
                key == 9 ||
                key == 13 ||
                key == 46 ||
                key == 110 ||
                key == 190 ||
                (key >= 35 && key <= 40) ||
                (key >= 48 && key <= 57) ||
                (key >= 96 && key <= 105)
              );
            });
          });
        };

        $('[data-currency-format="true"]').CurrencyNumericOnly();

        // currency format
        $('[data-currency-format="true"]')
          .on('keyup', function (event) {
            let keyCode = event.which || event.keyCode;
            if (keyCode != 190 && keyCode != 110) {
              let value = $(this).val();
              if (value != '') {
                // Remove any non-numeric characters from the input value
                let inputValue = $(this)
                  .val()
                  .replace(/[^0-9\.]/g, '');

                // Format the input value as currency
                if (inputValue != '') {
                  const formattedAmount = parseFloat(inputValue).toLocaleString(
                    'en-US',
                    { minimumFractionDigits: 0, maximumFractionDigits: 2 }
                  );
                  $(this).val(formattedAmount);
                }
              }
            }
          })
          .on('blur', function () {
            let value = parseFloat($(this).val());
            if (value != '' && typeof value != 'string' && value) {
              // Get the input value and parse it as a float with two decimal places
              const inputValue = $(this)
                .val()
                .replace(/[^0-9\.]/g, '');
              const amount = parseFloat(inputValue).toFixed(2);

              // Format the amount as currency with two decimal places
              const formattedAmount = parseFloat(amount).toLocaleString(
                'en-US',
                { minimumFractionDigits: 2, maximumFractionDigits: 2 }
              );

              // Update the input value with the formatted amount
              $(this).val(formattedAmount);
            } else {
              $(this).val('');
            }
          });

        function FC(amount) {
          // Check if the input is a valid number
          if (isNaN(amount) || amount == '') {
            return '-';
          }

          // Use toFixed(2) to ensure the number has two decimal places
          const formattedAmount = parseFloat(amount).toFixed(2);
          if (formattedAmount && formattedAmount != NaN) {
            // Use Intl.NumberFormat to format the number as currency
            const currencyFormatter = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            });

            return (
              '$ ' +
              currencyFormatter.format(formattedAmount).replace(/\$/g, '')
            );
          } else {
            return '-';
          }
        }

        function FC3(amount) {
          // Check if the input is a valid number
          if (isNaN(amount) || amount == '') {
            return '-';
          }

          // Ensure the number has three decimal places
          const formattedAmount = parseFloat(amount).toFixed(3);
          if (formattedAmount && formattedAmount != NaN) {
            // Use Intl.NumberFormat to format the number
            const currencyFormatter = new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 3,
              maximumFractionDigits: 3,
            });

            // Format the number and remove the currency symbol
            return '$ ' + currencyFormatter.format(formattedAmount);
          } else {
            return '-';
          }
        }

        function numberFormat(amount) {
          // Check if the input is a valid number
          if (isNaN(amount) || amount == '') {
            return '-';
          }

          // Convert the number to an integer to remove decimal places
          const formattedAmount = parseInt(amount);

          if (formattedAmount && formattedAmount != NaN) {
            // Use Intl.NumberFormat to format the number with commas
            const numberFormatter = new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            });

            return numberFormatter.format(formattedAmount);
          } else {
            return '-';
          }
        }

        var ModelDataList = $('#ModelDataList').DataTable({
          iDisplayLength: 50,
          order: [[1, 'asc']],
          columnDefs: [
            { targets: 0, orderable: false }, // First column (index 0) will not be sortable
          ],
        });
        tableDetails('ModelDataList');

        // $('#vpc').DataTable({
        // 	"paging": false, // Disable pagination
        // 	"ordering": false, // Disable sorting on all columns
        // 	"searching": false, // Disable searching
        // 	"info": false // Disable information display
        // });

        // $('#networking').DataTable({
        // 	"paging": false, // Disable pagination
        // 	"ordering": false, // Disable sorting on all columns
        // 	"searching": false, // Disable searching
        // 	"info": false // Disable information display
        // });

        // $('#security').DataTable({
        // 	"paging": false, // Disable pagination
        // 	"ordering": false, // Disable sorting on all columns
        // 	"searching": false, // Disable searching
        // 	"info": false // Disable information display
        // });

        // $('#server').DataTable({
        // 	"paging": false, // Disable pagination
        // 	"ordering": false, // Disable sorting on all columns
        // 	"searching": false, // Disable searching
        // 	"info": false // Disable information display
        // });

        // $('#rokket_core').DataTable({
        // 	"paging": false, // Disable pagination
        // 	"ordering": false, // Disable sorting on all columns
        // 	"searching": false, // Disable searching
        // 	"info": false // Disable information display
        // });

        // $('#vector').DataTable({
        // 	"paging": false, // Disable pagination
        // 	"ordering": false, // Disable sorting on all columns
        // 	"searching": false, // Disable searching
        // 	"info": false // Disable information display
        // });

        // var NodesList = $('#NodesList').DataTable({
        // 	"iDisplayLength": 50,
        // 	"order": [[1, "asc"]],
        // 	columnDefs: [
        // 		{ targets: 0, orderable: false } // First column (index 0) will not be sortable
        // 	]
        // });
        // tableDetails('NodesList');
        let modelCompareList = [];
        let selectModel = {};
        var InfraDataList = $('#InfraDataList').DataTable({
          iDisplayLength: 50, // Set the default number of rows to display
          ordering: false, // Sort by the second column in ascending order
          columnDefs: [
            { targets: [0, 7], orderable: false }, // First column (index 0) will not be sortable
          ],
        });

        if (
          sessionStorage.getItem('InfraData', JSON.stringify(InfraData)) !==
          null
        ) {
          InfraData = JSON.parse(
            sessionStorage.getItem('InfraData', JSON.stringify(InfraData))
          );
        }

        $.each(InfraData, function (key, item) {
          let {
            id,
            model_name,
            task_type,
            context_tokens,
            parameters,
            model_size,
            speed,
            training_data_size,
            status,
          } = item;
          let check = '';
          if (status && status != null) {
            check = 'checked';
          }

          // <td width="5%" class="checkbox-div"> <div class="c-checkbox"> <label> <input type="checkbox" name="sub_checkbox[]" class="checkall" ${check}> <span class="fa fa-check"></span> </label> </div> </td>

          $('#InfraDataList')
            .DataTable()
            .row.add(
              $(`<tr data-id="${id}" class="dataList r${id}"> 
					<td class="" width="24%"><a class="model-view"> ${model_name} </a></td> 
					<td> ${task_type} </td> 
					<td> ${numberFormat(context_tokens)} </td> 
					<td> ${parameters} </td> 
					<td>${model_size}</td>
					<td>${speed}</td>
					<td>${training_data_size}</td>
					<td class="no-filter details-control" width="5%"><i class="fa fa-plus-circle" aria-hidden="true"></i><i class="fa fa-minus-circle" aria-hidden="true" style="display:none;"></i></td>
					</tr>`)
            )
            .draw();
        });
        tableDetails('InfraDataList');

        // Add event listener for opening and closing details
        $('#InfraDataList tbody').on(
          'click',
          'td.details-control',
          function () {
            $(this).find('.fa-plus-circle').toggle();
            $(this).find('.fa-minus-circle').toggle();
            var tr = $(this).closest('tr');
            let id = tr.attr('data-id');
            let model = '';
            let [data] = InfraData.filter((item) => {
              if (item.id == id) {
                model = item.model_name;
                return item;
              }
            });
            var row = InfraDataList.row(tr);
            if (row.child.isShown()) {
              // This row is already open - close it
              row.child.hide();
              tr.removeClass('shown');
            } else {
              // Open this row
              row.child(format(data, id, model)).show();
              tr.addClass('shown');
            }

            $(document).find('[data-toggle="tooltip"]').tooltip();
          }
        );

        /* Formatting function for row details - modify as you need */
        function format(data, pid, model) {
          let { inferences } = data;
          inferences.sort(function (a, b) {
            if (
              typeof a.quantization === 'string' &&
              typeof b.quantization !== 'string'
            ) {
              return -1; // String comes before number
            } else if (
              typeof a.quantization !== 'string' &&
              typeof b.quantization === 'string'
            ) {
              return 1; // Number comes after string
            } else {
              // Both elements are either strings or numbers, sort them accordingly
              return a.quantization - b.quantization;
            }
          });
          let tr = '';
          let moId = [];
          $.each(inferences, (i, item) => {
            moId.push(item.id);
            let check = '';
            if (item.status != '' && item['status']) {
              check = 'checked';
            }
            let info = '';
            if (item.method == 'AWQ') {
              info = `<a class="ml-sm help-icon" data-toggle="tooltip" data-placement="bottom" title="" data-original-title='AWQ (Ask, Wait, Question) is a communication technique emphasizing active listening by asking open-ended questions and waiting for responses, fostering deeper understanding and connection. It encourages meaningful dialogue and empathy in conversations.'> <em class="icon-info"></em></a>`;
            }
            if (item.method == 'SmoothQuant') {
              info = `<a class="ml-sm help-icon" data-toggle="tooltip" data-placement="bottom" title="" data-original-title='SmoothQuant is a term that could refer to a variety of things, but it's commonly associated with quantitative finance or data analysis where "smooth" indicates some form of data smoothing technique applied to quantitative models or algorithms to reduce noise or volatility in the data.'> <em class="icon-info"></em></a>`;
            }
            if (item.method == 'VLLM') {
              info = `<a class="ml-sm help-icon" data-toggle="tooltip" data-placement="bottom" title="" data-original-title='"VLLM" could refer to various things depending on the context. It might stand for Very Large Language Model, which could be a reference to AI models like GPT (Generative Pre-trained Transformer) series developed by OpenAI. These models are capable of processing and generating human-like text across a wide range of topics and tasks.'> <em class="icon-info"></em></a>`;
            }
            let modelName = '';
            if (i == 0) {
              modelName = `<td rowspan="${inferences.length}">${model}</td>`;
            }

            tr += `<tr data-id="${item.id}" class="sub-table">
				<td width="7%" class="checkbox-div"><div class="c-checkbox"> <label> <input type="checkbox" name="inf_checkbox[]" class="checkall" ${check}> <span class="fa fa-check"></span> </label> </div></td>
				<td>${item.model_convention}</td>
				<td style="text-align:center;">${item.quantization}</td>
				<td style="text-transform: none;">${item.method != '' ? item.method + info : '-'}</td>
				<td>${item.tps}</td>
				<td>${item.throughput}</td>
				<td>${item.latency}</td>
				</tr>`;
          });

          // <div class="c-checkbox" style="text-align:center;"> <label> <input type="checkbox" name="main_inf_checkbox[]" data-ids="${moId.join(',')}" class="checkall"> <span class="fa fa-check"></span> </label> </div>

          return `<table border="0" class="data-child-row sub-table-main" data-id="${pid}">
				<thead>
					<tr>
						<th width="7%" class="checkbox-div" style="text-align:center;"></th>
						<th><a class="ml-sm help-icon para-desc" title="" data-original-title='' data-id="model_name"> Model name</a></th>
						<th> <a class="ml-sm help-icon para-desc"  title="" data-id="bit" data-original-title=""> Bit </a> </th>
						<th> <a class="ml-sm help-icon para-desc"  title="" data-id="inference_method" data-original-title=""> Inference Method </a> </th>
						<th> <a class="ml-sm help-icon para-desc" title="" data-id="tps" data-original-title=''> TPS (A100) </a> </th>
						<th> <a class="ml-sm help-icon para-desc" title="" data-id="throughput_a100" data-original-title=""> Throughput (A100) </a></th>
						<th> <a class="ml-sm help-icon para-desc" title="" data-id="latency" data-original-title=""> Latency <span style="text-transform:lowercase;">(ms)</span> </a> </th>
					</tr>
				</thead>
					<tbody>
						${tr}
					</tbody>
				</table>`;
        }

        // sub table checkbox functionality
        $(document).on('click', '[name="main_inf_checkbox[]"]', function () {
          let status = $(this).is(':checked');
          let modelId = $(this).parents('.sub-table-main').attr('data-id');
          let submodels = $(this).attr('data-ids');
          if (status) {
            $(this)
              .parents('.sub-table-main')
              .find('input[type="checkbox"]')
              .prop('checked', true);
            $('#InfraDataList tbody')
              .find(`tr.r${modelId}`)
              .find('td input[name="sub_checkbox[]"]')
              .prop('checked', true);
            if (!modelCompareList.includes(modelId)) {
              modelCompareList.push(modelId);
            }
            $('[name="model_select"]').val(modelCompareList.join(','));
            submodels = submodels.split(',');
            selectModel[modelId] = submodels;
            inferenceMainChecker(modelId, true);
          } else {
            $(this)
              .parents('.sub-table-main')
              .find('input[type="checkbox"]')
              .prop('checked', false);
            let curModels = selectModel[modelId];
            if (curModels && curModels.length > 0) {
              selectModel[modelId] = [];
              inferenceMainChecker(modelId, false);
            }
          }
        });

        $(document).on('click', '[name="inf_checkbox[]"]', function () {
          let status = $(this).is(':checked');
          let modelId = $(this).parents('.sub-table-main').attr('data-id');
          let subModel = $(this).parents('tr.sub-table').attr('data-id');
          console.log('subModel: ', subModel);
          if (status) {
            let curModels = selectModel[modelId];
            if (curModels && curModels.length > 0) {
              curModels.push(subModel);
              selectModel[modelId] = curModels;
            } else {
              selectModel[modelId] = [];
              curModels = [subModel];
              selectModel[modelId] = curModels;
            }

            inferenceChecker(modelId, subModel, true);

            $('#InfraDataList tbody')
              .find(`tr.r${modelId}`)
              .find('td input[name="sub_checkbox[]"]')
              .prop('checked', true);
            if (!modelCompareList.includes(modelId)) {
              modelCompareList.push(modelId);
            }
            $('[name="model_select"]').val(modelCompareList.join(','));
            console.log('modelCompareList: ', modelCompareList);
          } else {
            let curModels = selectModel[modelId];
            console.log('curModels:1 ', curModels);

            if (curModels && curModels.length > 0) {
              // curModels.push(subModel);
              curModels = curModels.filter((item) => {
                if (item != subModel) {
                  return item;
                }
              });
              console.log('curModels:2 ', curModels);
              if (curModels.length == 0) {
                delete selectModel[modelId];
                modelCompareList = modelCompareList.filter((item) => {
                  if (item != modelId) {
                    return item;
                  }
                });

                console.log('modelCompareList: ', modelCompareList);

                if (modelCompareList.length == 0) {
                  $('[name="model_select"]').val('');
                } else {
                  $('[name="model_select"]').val(modelCompareList.join(','));
                }
                inferenceChecker(modelId, subModel, false, false);
              } else {
                selectModel[modelId] = curModels;
                inferenceChecker(modelId, subModel, false);
              }
              console.log('selectModel: ', selectModel);
            } else {
              // inferenceChecker(modelId, subModel, false, false);
            }
          }
        });
        // status modifier
        function mainModelChecker(modelId, status) {
          InfraData = InfraData.map((item) => {
            if (modelId == item.id) {
              item['status'] = status;
              return item;
            } else {
              return item;
            }
          });
        }
        // model inference status modifier
        function inferenceChecker(modelId, childId, status, mainSatus = true) {
          InfraData = InfraData.map((item) => {
            if (modelId == item.id) {
              if (!mainSatus) {
                item['status'] = false;
              } else {
                item['status'] = true;
              }

              let inferences = item['inferences'];
              inferences = inferences.map((elem) => {
                if (elem.id == childId) {
                  elem['status'] = status;
                  return elem;
                } else {
                  return elem;
                }
              });
              item['inferences'] = inferences;

              return item;
            } else {
              return item;
            }
          });
          console.log('InfraData: ', InfraData);
        }
        // model inference main status modifier
        function inferenceMainChecker(modelId, status) {
          InfraData = InfraData.map((item) => {
            if (modelId == item.id) {
              item['status'] = true;
              let inferences = item['inferences'];
              inferences = inferences.map((elem) => {
                elem['status'] = status;
                return elem;
              });
              item['inferences'] = inferences;

              return item;
            } else {
              return item;
            }
          });
        }

        // view model list
        $(document).on('click', '.model-view', function () {
          let id = $(this).parents('tr.dataList').attr('data-id');
          $('[name="view_mode"]').val(id);
          currentData['model_view_id'] = id;

          currentData['selectModel'] = selectModel;
          currentData['model_select'] = $('[name="model_select"]').val();
          sessionStorage.setItem(
            'infra session data',
            JSON.stringify(currentData)
          );
          sessionStorage.setItem('InfraData', JSON.stringify(InfraData));
          window.location.href = `${page}?s=10`;

          // goto specified step
          // myWizard.step(9);
        });

        $('#back-model1').on('click', function () {
          window.location.href = `${page}?s=3`;
          // goto specified step
          // myWizard.step(2);
        });

        // validate model selection to view machine types
        $('#model-validate').on('click', function () {
          let key = Object.keys(selectModel);
          if (key.length > 0) {
            $('#selected-models-wrapper').html('');
            let html = '';
            let modelId = '';
            let llm_text = $(`[type="hidden"][name="llm_text"]`).val();

            currentData['selectModel'] = selectModel;
            currentData['model_select'] = $('[name="model_select"]').val();
            sessionStorage.setItem(
              'infra session data',
              JSON.stringify(currentData)
            );
            sessionStorage.setItem('InfraData', JSON.stringify(InfraData));
            window.location.href = `${page}?s=4`;

            // goto specified step
            // myWizard.step(3);
          } else {
            $.notification(['Please select model'], {
              position: ['top', 'right'],
              timeView: 4000,
              messageType: 'error',
            });
          }
        });

        // machine selection save
        let machineSelect = {};
        let PurchaseMachineSelect = [];

        $(document).on('click', '[name="mac_checkbox[]"]', function () {
          $(document).find('table.mac_table').removeClass('active');
          $(this).parents('table.mac_table').addClass('active');
          let modelId = $(this).parents('tr.machineList').attr('data-id');
          let parentId = $(this).parents('table.mac_table').attr('data-pid');
          let checked = $(this).is(':checked');

          if (checked) {
            $(document)
              .find('table.mac_table.active')
              .find('[name="mac_checkbox[]"]')
              .prop('checked', false);
            $(this).prop('checked', true);
            machineSelect['m' + parentId] = modelId;
          } else {
            delete machineSelect['m' + parentId];
          }
        });

        // validate machine selection
        $('[data-action="machineSelect"]').on('click', function () {
          let ids = Object.keys(machineSelect);

          if (ids.length > 0) {
            currentData['machineSelect'] = machineSelect;
            sessionStorage.setItem(
              'infra session data',
              JSON.stringify(currentData)
            );
            window.location.href = `${page}?s=5`;

            // myWizard.step(4);// certificate screen
          } else {
            $.notification(['Please select machine type!'], {
              position: ['top', 'right'],
              timeView: 4000,
              messageType: 'error',
            });
          }
        });

        $(document).on(
          'click',
          '#InfraDataList [name="sub_checkbox[]"]',
          function () {
            let checked = $(this).is(':checked');
            let modelId = $(this).parents('tr.dataList').attr('data-id');

            if (checked) {
              selectModel[modelId] = [];

              mainModelChecker(modelId, true);
              modelCompareList.push(modelId);
              $('[name="model_select"]').val(modelCompareList.join(','));
            } else {
              delete selectModel[modelId];
              mainModelChecker(modelId, false);
              modelCompareList = modelCompareList.filter((item, i) => {
                if (item != modelId) {
                  return item;
                }
              });
              if (modelCompareList.length > 0) {
                $('[name="model_select"]').val(modelCompareList.join(','));
              } else {
                $('[name="model_select"]').val('');
              }
            }
          }
        );

        // compare functionality
        $('#compare-models').on('click', function () {
          let modelsId = $('[name="model_select"]').val();
          if (modelsId && modelsId != '') {
            let modelsArr = modelsId.split(',');
            if (modelsArr.length > 0) {
              currentData['selectModel'] = selectModel;
              currentData['model_select'] = $('[name="model_select"]').val();
              sessionStorage.setItem(
                'infra session data',
                JSON.stringify(currentData)
              );
              sessionStorage.setItem('InfraData', JSON.stringify(InfraData));
              window.location.href = `${page}?s=11`;
            } else {
              $.notification(['Please select model'], {
                position: ['top', 'right'],
                timeView: 4000,
                messageType: 'error',
              });
            }
          } else {
            $.notification(['Please select model'], {
              position: ['top', 'right'],
              timeView: 4000,
              messageType: 'error',
            });
          }
        });

        // get details on multiple selection
        $('[name="modelsCompare"]').on('change', function () {
          let names = $(this).val();
          let modelsArr = [];
          $.each(names, function (i, item) {
            let id = $('[name="modelsCompare"]')
              .find('option[value="' + item + '"]')
              .attr('data-id');
            modelsArr.push(id);
          });

          if (modelsArr.length > 0) {
            if (modelsArr != undefined) {
              let compareTable = '';
              let perplexity = '';
              let endtoend = [];
              let latencyChart = [];
              let denseChart = [];
              let selfChart = [];
              $.each(modelsArr, function (i, option) {
                let [CurrentModel] = InfraData.filter((item, i) => {
                  if (item.id == option) {
                    return item;
                  }
                });

                // inferences
                $.each(CurrentModel.inferences, function (i, elem) {
                  // table row forming
                  if (i == 0) {
                    let len = CurrentModel.inferences.length;
                    compareTable += `<tr>
										<td rowspan="${len}" class="model-name freeze-columns">${CurrentModel.model_name}</td>
										<td class="freeze-columns2">${elem.quantization}</td>
										<td class="freeze-columns3" style="text-transform:initial;">${elem.method}</td>
										<td>${elem.PIQA}</td>
										<td>${elem.ARCe}</td>
										<td>${elem.ARCc}</td>
										<td>${elem.boolq}</td>
										<td>${elem.hellaSwag}</td>
										<td>${elem.winogrande}</td>
										<td>${elem.avg}</td>
										<td>${elem.wikitext}</td>
										<td>${elem.ptb}</td>
										<td>${elem.c4}</td>
										</tr>`;
                  } else {
                    compareTable += `<tr>
										<td class="freeze-columns2">${elem.quantization}</td>
										<td class="freeze-columns3" style="text-transform:initial;">${elem.method}</td>
										<td>${elem.PIQA}</td>
										<td>${elem.ARCe}</td>
										<td>${elem.ARCc}</td>
										<td>${elem.boolq}</td>
										<td>${elem.hellaSwag}</td>
										<td>${elem.winogrande}</td>
										<td>${elem.avg}</td>
										<td>${elem.wikitext}</td>
										<td>${elem.ptb}</td>
										<td>${elem.c4}</td>
										</tr>`;
                  }
                });

                endtoend.push({
                  label: CurrentModel.endtoend_throughput.name,
                  data: CurrentModel.endtoend_throughput.value,
                  fill: false,
                  // borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 2,
                });

                latencyChart.push({
                  label: CurrentModel.latency_per_token.name,
                  data: CurrentModel.latency_per_token.value,
                  fill: false,
                  // borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 2,
                });

                denseChart.push({
                  label: CurrentModel.dense_layer.name,
                  data: CurrentModel.dense_layer.value,
                  fill: false,
                  // borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 2,
                });

                selfChart.push({
                  label: CurrentModel.self_attention.name,
                  data: CurrentModel.self_attention.value,
                  fill: false,
                  // borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 2,
                });

                $('[name="modelsCompare"]')
                  .find('option[value="' + CurrentModel.model_name + '"]')
                  .attr('selected', true);
              });
              $('#compare-table1 > tbody').html(compareTable);
              $('[name="modelsCompare"]').trigger('chosen:updated');

              enetoendchart1.data.datasets = endtoend;
              enetoendchart1.update();

              latency1.data.datasets = latencyChart;
              latency1.update();

              dense1.data.datasets = denseChart;
              dense1.update();

              self1.data.datasets = selfChart;
              self1.update();
            }
          } else {
            // $('.error-compare').text('Please select  models.');
            $.notification(['Please select model'], {
              position: ['top', 'right'],
              timeView: 4000,
              messageType: 'error',
            });
          }
        });

        // back btn functionality
        $('#compare-back-btn').on('click', function () {
          window.location.href = `${page}?s=3`;
          // goto specified step
          // myWizard.step(2);
        });

        // throughput comparison chart
        if ($('#throughput-comparison').length > 0) {
          // Sample data for demonstration
          const labels = ['W16A16', 'W4A16', 'W8A8', 'W4A4'];
          const data1 = [0.5, 1.5, 1, 0.4];
          const data2 = [15, 20, 30, 60];

          // Create the chart
          const ctx = $('#throughput-comparison')[0].getContext('2d');
          const throughputComparison = new Chart(ctx, {
            type: 'bar', // Change the chart type to line
            data: {
              labels: labels,
              datasets: [
                {
                  label: 'Throughput',
                  data: data1,
                  backgroundColor: 'rgba(54, 162, 235, 0.2)', // Change the color
                  borderColor: 'rgba(54, 162, 235, 1)', // Change the color
                  borderWidth: 2,
                  type: 'line', // Change the chart type to bar
                  yAxisID: 'y', // Assign to secondary y-axis
                },
                {
                  label: 'Latency',
                  data: data2,
                  fill: false,
                  backgroundColor: 'rgba(255, 99, 132, 0.2)', // Change the color
                  borderColor: 'rgba(255, 99, 132, 1)', // Change the color
                  borderWidth: 2,
                  yAxisID: 'y1', // Assign to primary y-axis
                },
              ],
            },
            options: {
              responsive: true,
              interaction: {
                mode: 'index',
                intersect: false,
              },
              stacked: false,
              plugins: {
                title: {
                  display: true,
                  text: 'Chart.js Line Chart - Multi Axis',
                },
              },
              scales: {
                y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  title: {
                    display: true,
                    text: 'Throughput',
                  },
                },
                y1: {
                  type: 'linear',
                  display: true,
                  position: 'right',
                  // title: {
                  // 	display: true,
                  // 	text: 'Latency'
                  // },

                  // grid line settings
                  grid: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                  },
                },
              },
              plugins: {
                htmlLegend: {
                  // ID of the container to put the legend in
                  // containerID: 'legend-container',
                },
                legend: {
                  display: true,
                  labels: {
                    usePointStyle: true,
                  },
                },
              },
            },
          });
        } else {
          console.error(
            "Canvas element with id 'throughput-comparison chart' not found."
          );
        }

        if ($('#throughput-comparison2').length > 0) {
          // Sample data for demonstration
          const labels = ['W16A16', 'W4A16', 'W8A8', 'W4A4'];
          const data1 = [0.5, 1.5, 1, 0.4];
          const data2 = [15, 20, 30, 60];

          // Create the chart
          const ctx = $('#throughput-comparison2')[0].getContext('2d');
          const throughputComparison = new Chart(ctx, {
            type: 'bar', // Change the chart type to line
            data: {
              labels: labels,
              datasets: [
                {
                  label: 'Throughput',
                  data: data1,
                  backgroundColor: 'rgba(54, 162, 235, 0.2)', // Change the color
                  borderColor: 'rgba(54, 162, 235, 1)', // Change the color
                  borderWidth: 2,
                  type: 'line', // Change the chart type to bar
                  yAxisID: 'y', // Assign to secondary y-axis
                },
                {
                  label: 'Latency',
                  data: data2,
                  fill: false,
                  backgroundColor: 'rgba(255, 99, 132, 0.2)', // Change the color
                  borderColor: 'rgba(255, 99, 132, 1)', // Change the color
                  borderWidth: 2,
                  yAxisID: 'y1', // Assign to primary y-axis
                },
              ],
            },
            options: {
              responsive: true,
              interaction: {
                mode: 'index',
                intersect: false,
              },
              stacked: false,
              plugins: {
                title: {
                  display: true,
                  text: 'Chart.js Line Chart - Multi Axis',
                },
              },
              scales: {
                y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  title: {
                    display: true,
                    text: 'Throughput',
                  },
                },
                y1: {
                  type: 'linear',
                  display: true,
                  position: 'right',
                  // title: {
                  // 	display: true,
                  // 	text: 'Latency'
                  // },

                  // grid line settings
                  grid: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                  },
                },
              },
              plugins: {
                htmlLegend: {
                  // ID of the container to put the legend in
                  // containerID: 'legend-container',
                },
                legend: {
                  display: true,
                  labels: {
                    usePointStyle: true,
                  },
                },
              },
            },
          });
        } else {
          console.error(
            "Canvas element with id 'throughput-comparison2 chart' not found."
          );
        }

        // end to end chart
        let enetoendchart1 = '';
        if ($('#ene-to-end-chart').length > 0) {
          const labels = ['2³', '2⁴', '2⁵', '2⁶', '2⁷', '2⁸'];
          const data1 = [0.9, 1.1, 1.9, 2.1, 2.5, 2.9];
          const data2 = [1, 1.3, 2.1, 2.5, 2.9, 3.3];
          const data3 = [1.2, 1.8, 2.5, 2.9, 3.3, 3.6];
          const data4 = [1.6, 2.4, 3.1, 3.5, 4.1, 4.7];

          // Create the chart
          const ctx = document
            .getElementById('ene-to-end-chart')
            .getContext('2d');
          enetoendchart1 = new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [
                {
                  label: 'FP16',
                  data: data1,
                  fill: false,
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 2,
                },
                {
                  label: 'W4A16',
                  data: data2,
                  fill: false,
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 2,
                },
                {
                  label: 'W8A8',
                  data: data3,
                  fill: false,
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 2,
                },
                {
                  label: 'W4A4(Atom)',
                  data: data4,
                  fill: false,
                  borderColor: 'rgba(255, 206, 86, 1)',
                  borderWidth: 2,
                },
              ],
            },
            options: {
              scales: {
                x: {
                  display: true,
                  title: {
                    display: true,
                    text: 'Batch size',
                  },
                },
                y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  grid: {
                    display: false, // Hide grid lines
                  },
                  title: {
                    display: true,
                    text: 'Throughput (kilo tokens/s)',
                  },
                },
              },
              plugins: {
                htmlLegend: {
                  // ID of the container to put the legend in
                  // containerID: 'legend-container',
                },
                legend: {
                  display: true,
                  labels: {
                    usePointStyle: true,
                  },
                },
              },
            },
          });
        } else {
          console.error('Canvas element not found.');
        }

        if ($('#ene-to-end-chart2').length > 0) {
          const labels = ['2³', '2⁴', '2⁵', '2⁶', '2⁷', '2⁸'];
          const data1 = [0.9, 1.1, 1.9, 2.1, 2.5, 2.9];
          const data2 = [1, 1.3, 2.1, 2.5, 2.9, 3.3];
          const data3 = [1.2, 1.8, 2.5, 2.9, 3.3, 3.6];
          const data4 = [1.6, 2.4, 3.1, 3.5, 4.1, 4.7];

          // Create the chart
          const ctx = document
            .getElementById('ene-to-end-chart2')
            .getContext('2d');
          const enetoendchart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [
                {
                  label: 'FP16',
                  data: data1,
                  fill: false,
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 2,
                },
                {
                  label: 'W4A16',
                  data: data2,
                  fill: false,
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 2,
                },
                {
                  label: 'W8A8',
                  data: data3,
                  fill: false,
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 2,
                },
                {
                  label: 'W4A4(Atom)',
                  data: data4,
                  fill: false,
                  borderColor: 'rgba(255, 206, 86, 1)',
                  borderWidth: 2,
                },
              ],
            },
            options: {
              scales: {
                x: {
                  display: true,
                  title: {
                    display: true,
                    text: 'Batch size',
                  },
                },
                y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  grid: {
                    display: false, // Hide grid lines
                  },
                  title: {
                    display: true,
                    text: 'Throughput (kilo tokens/s)',
                  },
                },
              },
              plugins: {
                htmlLegend: {
                  // ID of the container to put the legend in
                  // containerID: 'legend-container',
                },
                legend: {
                  display: true,
                  labels: {
                    usePointStyle: true,
                  },
                },
              },
            },
          });
        } else {
          console.error(
            "Canvas element with id 'ene-to-end-chart2' not found."
          );
        }

        // Latency per token chart
        let latency1 = '';
        if ($('#latency-per-token').length > 0) {
          const labels = ['2³', '2⁴', '2⁵', '2⁶', '2⁷', '2⁸'];
          const data1 = [10, 15, 19, 24, 30, 50];
          const data2 = [20, 25, 31, 38, 48, 70];
          const data3 = [20, 28, 35, 50, 70, 135];
          const data4 = [25, 30, 40, 60, 80, 150];
          const ctx = document
            .getElementById('latency-per-token')
            .getContext('2d');
          latency1 = new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [
                {
                  label: 'FP16',
                  data: data1,
                  fill: false,
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 2,
                },
                {
                  label: 'W4A16',
                  data: data2,
                  fill: false,
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 2,
                },
                {
                  label: 'W8A8',
                  data: data3,
                  fill: false,
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 2,
                },
                {
                  label: 'W4A4(Atom)',
                  data: data4,
                  fill: false,
                  borderColor: 'rgba(255, 206, 86, 1)',
                  borderWidth: 2,
                },
              ],
            },
            options: {
              plugins: {
                legend: {
                  display: false,
                },
                annotation: {
                  annotations: {
                    line1: {
                      type: 'line',
                      yMin: 100,
                      yMax: 100,
                      borderColor: 'rgb(255, 99, 132)',
                      borderWidth: 2,
                      borderDash: [4, 5],
                    },
                  },
                },
              },
              scales: {
                x: {
                  display: true,
                  title: {
                    display: true,
                    text: 'Batch size',
                  },
                },
                y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  grid: {
                    display: false, // Hide grid lines
                  },
                  title: {
                    display: true,
                    text: 'Latency (ms)',
                  },
                },
              },
            },
          });
        } else {
          console.error(
            "Canvas element with id 'latency-per-token' not found."
          );
        }

        if ($('#latency-per-token2').length > 0) {
          const labels = ['2³', '2⁴', '2⁵', '2⁶', '2⁷', '2⁸'];
          const data1 = [10, 15, 19, 24, 30, 50];
          const data2 = [20, 25, 31, 38, 48, 70];
          const data3 = [20, 28, 35, 50, 70, 135];
          const data4 = [25, 30, 40, 60, 80, 150];
          const ctx = document
            .getElementById('latency-per-token2')
            .getContext('2d');
          const latency = new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [
                {
                  label: 'FP16',
                  data: data1,
                  fill: false,
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 2,
                },
                {
                  label: 'W4A16',
                  data: data2,
                  fill: false,
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 2,
                },
                {
                  label: 'W8A8',
                  data: data3,
                  fill: false,
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 2,
                },
                {
                  label: 'W4A4(Atom)',
                  data: data4,
                  fill: false,
                  borderColor: 'rgba(255, 206, 86, 1)',
                  borderWidth: 2,
                },
              ],
            },
            options: {
              plugins: {
                legend: {
                  display: false,
                },
                annotation: {
                  annotations: {
                    line1: {
                      type: 'line',
                      yMin: 100,
                      yMax: 100,
                      borderColor: 'rgb(255, 99, 132)',
                      borderWidth: 2,
                      borderDash: [4, 5],
                    },
                  },
                },
              },
              scales: {
                x: {
                  display: true,
                  title: {
                    display: true,
                    text: 'Batch size',
                  },
                },
                y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  grid: {
                    display: false, // Hide grid lines
                  },
                  title: {
                    display: true,
                    text: 'Latency (ms)',
                  },
                },
              },
            },
          });
        } else {
          console.error(
            "Canvas element with id 'latency-per-token2' not found."
          );
        }

        // Dense layer chart
        let dense1 = '';
        if ($('#dense-chart').length > 0) {
          const labels = [
            '2²',
            '2³',
            '2⁴',
            '2⁵',
            '2⁶',
            '2⁷',
            '2⁸',
            '2⁹',
            '2¹⁰',
          ];
          const data0 = [1, 1, 1, 1, 1, 1, 1, 1, 1];
          const data1 = [0.6, 0.4, 0.7, 0.9, 1.1, 1.3, 1.8, 2.8, 2.9];
          const data2 = [1.2, 0.8, 1.1, 0.2, 0.7, 0.6, 0.5, 0.4, 0.3];
          const data3 = [1.3, 1.0, 1.3, 1.4, 1.5, 2.2, 3.1, 3.4, 3.7];

          const ctx = document.getElementById('dense-chart').getContext('2d');
          dense1 = new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [
                {
                  label: 'FP16 Baseline',
                  data: data0,
                  fill: false,
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 2,
                  borderDash: [5, 5],
                },
                {
                  label: 'W4A16',
                  data: data1,
                  fill: false,
                  borderColor: 'rgba(255, 165, 0,1)',
                  borderWidth: 2,
                },
                {
                  label: 'W8A8',
                  data: data2,
                  fill: false,
                  borderColor: 'rgba(60, 179, 113,1)',
                  borderWidth: 2,
                },
                {
                  label: 'W4A4(Atom)',
                  data: data3,
                  fill: false,
                  borderColor: 'rgba(127, 0, 255,1)',
                  borderWidth: 2,
                },
              ],
            },
            options: {
              plugins: {
                legend: {
                  display: true,
                  labels: {
                    usePointStyle: true,
                  },
                },
              },
              scales: {
                x: {
                  display: true,
                  title: {
                    display: true,
                    text: 'Batch size(#)',
                  },
                },
                y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  grid: {
                    display: false, // Hide grid lines
                  },
                  title: {
                    display: true,
                    text: 'Tops improvement',
                  },
                },
              },
            },
          });
        } else {
          console.error("Canvas element with id 'dense-chart' not found.");
        }

        if ($('#dense-chart2').length > 0) {
          const labels = [
            '2²',
            '2³',
            '2⁴',
            '2⁵',
            '2⁶',
            '2⁷',
            '2⁸',
            '2⁹',
            '2¹⁰',
          ];
          const data0 = [1, 1, 1, 1, 1, 1, 1, 1, 1];
          const data1 = [0.6, 0.4, 0.7, 0.9, 1.1, 1.3, 1.8, 2.8, 2.9];
          const data2 = [1.2, 0.8, 1.1, 0.2, 0.7, 0.6, 0.5, 0.4, 0.3];
          const data3 = [1.3, 1.0, 1.3, 1.4, 1.5, 2.2, 3.1, 3.4, 3.7];

          const ctx = document.getElementById('dense-chart2').getContext('2d');
          const dense = new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [
                {
                  label: 'FP16 Baseline',
                  data: data0,
                  fill: false,
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 2,
                  borderDash: [5, 5],
                },
                {
                  label: 'W4A16',
                  data: data1,
                  fill: false,
                  borderColor: 'rgba(255, 165, 0,1)',
                  borderWidth: 2,
                },
                {
                  label: 'W8A8',
                  data: data2,
                  fill: false,
                  borderColor: 'rgba(60, 179, 113,1)',
                  borderWidth: 2,
                },
                {
                  label: 'W4A4(Atom)',
                  data: data3,
                  fill: false,
                  borderColor: 'rgba(127, 0, 255,1)',
                  borderWidth: 2,
                },
              ],
            },
            options: {
              plugins: {
                legend: {
                  display: true,
                  labels: {
                    usePointStyle: true,
                  },
                },
              },
              scales: {
                x: {
                  display: true,
                  title: {
                    display: true,
                    text: 'Batch size(#)',
                  },
                },
                y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  grid: {
                    display: false, // Hide grid lines
                  },
                  title: {
                    display: true,
                    text: 'Tops improvement',
                  },
                },
              },
            },
          });
        } else {
          console.error("Canvas element with id 'dense-chart2' not found.");
        }

        // self attention chart
        let self1 = '';
        if ($('#self-attention-chart').length > 0) {
          const labels = ['2³', '2⁴', '2⁵', '2⁶', '2⁷'];
          const data1 = [80, 350, 700, 1300, 2400];
          const data2 = [40, 200, 310, 700, 1200];
          const data3 = [40, 130, 200, 300, 500];

          const ctx = document
            .getElementById('self-attention-chart')
            .getContext('2d');
          self1 = new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [
                {
                  label: 'FP16',
                  data: data1,
                  fill: false,
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 2,
                },
                {
                  label: 'W8A8',
                  data: data2,
                  fill: false,
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 2,
                },
                {
                  label: 'W4A4(Atom)',
                  data: data3,
                  fill: false,
                  borderColor: 'rgba(255, 206, 86, 1)',
                  borderWidth: 2,
                },
              ],
            },
            options: {
              plugins: {
                legend: {
                  display: true,
                  labels: {
                    usePointStyle: true,
                  },
                },
                annotation: {
                  annotations: {
                    line1: {
                      type: 'line',
                      yMin: 100,
                      yMax: 100,
                      borderColor: 'rgb(255, 99, 132)',
                      borderWidth: 2,
                      borderDash: [2, 10],
                    },
                  },
                },
              },
              scales: {
                x: {
                  display: true,
                  title: {
                    display: true,
                    text: 'Batch size',
                  },
                },
                y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  grid: {
                    display: false, // Hide grid lines
                  },
                  title: {
                    display: true,
                    text: 'Latency (us)',
                  },
                },
              },
            },
          });
        } else {
          console.error(
            "Canvas element with id 'self-attention-chart' not found."
          );
        }

        if ($('#self-attention-chart2').length > 0) {
          const labels = ['2³', '2⁴', '2⁵', '2⁶', '2⁷'];
          const data1 = [80, 350, 700, 1300, 2400];
          const data2 = [40, 200, 310, 700, 1200];
          const data3 = [40, 130, 200, 300, 500];

          const ctx = document
            .getElementById('self-attention-chart2')
            .getContext('2d');
          const self = new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [
                {
                  label: 'FP16',
                  data: data1,
                  fill: false,
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 2,
                },
                {
                  label: 'W8A8',
                  data: data2,
                  fill: false,
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 2,
                },
                {
                  label: 'W4A4(Atom)',
                  data: data3,
                  fill: false,
                  borderColor: 'rgba(255, 206, 86, 1)',
                  borderWidth: 2,
                },
              ],
            },
            options: {
              plugins: {
                legend: {
                  display: true,
                  labels: {
                    usePointStyle: true,
                  },
                },
                annotation: {
                  annotations: {
                    line1: {
                      type: 'line',
                      yMin: 100,
                      yMax: 100,
                      borderColor: 'rgb(255, 99, 132)',
                      borderWidth: 2,
                      borderDash: [2, 10],
                    },
                  },
                },
              },
              scales: {
                x: {
                  display: true,
                  title: {
                    display: true,
                    text: 'Batch size',
                  },
                },
                y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  grid: {
                    display: false, // Hide grid lines
                  },
                  title: {
                    display: true,
                    text: 'Latency (us)',
                  },
                },
              },
            },
          });
        } else {
          console.error(
            "Canvas element with id 'self-attention-chart2' not found."
          );
        }

        // dashboard charts

        // model behaviour
        if ($('#model-behaviour').length > 0) {
          const labels = [
            'Mistral 7B Instruct V0.01',
            ' Tempest 5C Learn V0.01 ',
            ' Cyclone 8D Teach V0.03 ',
          ];
          const data1 = [80, 350, 700];

          const ctx = document
            .getElementById('model-behaviour')
            .getContext('2d');
          const self = new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: labels,
              datasets: [
                {
                  label: 'FP16',
                  data: data1,
                  backgroundColor: [
                    '#F4D03F',
                    '#17A589',
                    '#9B59B6',
                    '#5D6D7E ',
                    '#FADBD8',
                  ],
                  fill: false,
                  borderColor: 'rgba(255, 99, 132, 0)',
                  borderWidth: 2,
                },
              ],
            },
            options: {
              plugins: {
                legend: {
                  display: true,
                  labels: {
                    usePointStyle: true,
                  },
                },
              },
            },
          });
        } else {
          console.error(
            "Canvas element with id 'self-attention-chart' not found."
          );
        }

        // infrastructure behaviour
        if ($('#infrastructure-chart').length > 0) {
          const labels = [
            'Mistral 7B Instruct V0.01',
            ' Tempest 5C Learn V0.01 ',
            ' Cyclone 8D Teach V0.03 ',
          ];
          const data1 = [80, 350, 700];

          const ctx = document
            .getElementById('infrastructure-chart')
            .getContext('2d');
          const self = new Chart(ctx, {
            type: 'pie',
            data: {
              labels: labels,
              datasets: [
                {
                  label: 'FP16',
                  data: data1,
                  backgroundColor: [
                    '#F4D03F',
                    '#17A589',
                    '#9B59B6',
                    '#5D6D7E ',
                    '#FADBD8',
                  ],
                  fill: false,
                  borderColor: 'rgba(255, 99, 132, 0)',
                  borderWidth: 2,
                },
              ],
            },
            options: {
              plugins: {
                legend: {
                  display: true,
                  labels: {
                    usePointStyle: true,
                  },
                },
              },
            },
          });
        } else {
          console.error(
            "Canvas element with id 'self-attention-chart' not found."
          );
        }

        // area chart
        if ($('#area-chart').length > 0) {
          const labels = [
            'Mistral 7B Instruct V0.01',
            ' Tempest 5C Learn V0.01 ',
            ' Cyclone 8D Teach V0.03 ',
          ];
          const data1 = [80, 350, 700];

          const ctx = document.getElementById('area-chart').getContext('2d');
          const self = new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [
                {
                  label: 'FP16',
                  data: data1,
                  backgroundColor: [
                    '#F4D03F',
                    '#17A589',
                    '#9B59B6',
                    '#5D6D7E ',
                    '#FADBD8',
                  ],
                  fill: false,
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 2,
                },
              ],
            },
            options: {
              plugins: {
                legend: {
                  display: true,
                  labels: {
                    usePointStyle: true,
                  },
                },
              },
            },
          });
        } else {
          console.error(
            "Canvas element with id 'self-attention-chart' not found."
          );
        }
        // chart ends

        $(document)
          .find('.dataTables_filter')
          .children('label')
          .children('input')
          .attr('placeholder', 'Filter');

        // production options
        $('[name="objective"]').on('click', function () {
          let value = $('[name="objective"]:checked').val();

          if (value == 'Production') {
            $('.compliance-select-dropdown').removeClass('hidden');
          } else {
            $('.compliance-select-dropdown').addClass('hidden');
            $('[name="compliance_docs"]').val('');
            $('.chosen-select').trigger('chosen:updated');
          }
        });

        // add class to dropdown to change font size
        $(document).on('change', '.chosen-select', function () {
          $(this).siblings('div.chosen-container').addClass('font-active');
        });

        function checkData(data) {
          $.each(data, function (i, item) {
            if (item == '') {
              return false;
            }
          });

          return true;
        }

        // redirect
        $('#launch-rokket').on('click', function () {
          let data = {};
          let llm_type = $('[name="llm_text"]').val();
          let ai_toolkit = $('[name="llm_aitoolkit"]').val();
          let ai_team_size = $('[name="ai_team_size"]').val();
          let workspace_type = $('[name="workspace_types"]').val();
          let number_of_users = $('[name="number_of_users"]').val();

          let childList = [];
          $(
            `[data-type="aitoolkit"][data-value="${ai_toolkit}"] ul.checkbox-list li`
          ).each(function () {
            let value = $(this).find('input:checked').val();
            if (value && value != '') {
              childList.push(value);
            }
          });
          let llm_cert_level = $('[name="llm_cert_level"]').val();
          let llm_destination = $('[name="llm_destination"]').val();

          data = {
            llm_type,
            ai_toolkit,
            ai_team_size,
            workspace_type,
            number_of_users,
            childList,
            selectModel,
            machineSelect,
            llm_cert_level,
            llm_destination,
          };

          if (checkData(data)) {
            // Get the rocket modal
            var modal = $('#myModal');
            modal.css('display', 'block');
            mainData = data;
            localStorage.setItem(
              'Infrastructure Data',
              JSON.stringify(mainData)
            );
            setTimeout(function () {
              window.location.href = 'infrastructure-dashboard.html';
            }, 3000);
          }
        });

        // llm type save
        function llm_type_save() {
          let llm = [];
          $(document)
            .find('[data-type="text"].card-wrapper.selected')
            .each(function () {
              let value = $(this).find('[name="text"]').val();
              llm.push(value);
            });
          if (llm.length > 0) {
            $('[name="llm_text"]').val(llm.join(','));
          } else {
            $('[name="llm_text"]').val('');
          }
        }

        // ai tool kit save
        function ai_toolkit_save() {
          let arr = [];
          $(document)
            .find('[data-type="aitoolkit"].card-wrapper.selected')
            .each(function () {
              let value = $(this).find('[name="aitoolkit"]').val();
              arr.push(value);
            });
          if (arr.length > 0) {
            $('[name="llm_aitoolkit"]').val(arr.join(','));
          } else {
            $('[name="llm_aitoolkit"]').val('');
          }
        }

        // card click functionality
        $(document).on('click', '.card-wrapper:not(.selected)', function (e) {
          e.stopPropagation();
          let type = $(this).attr('data-type');
          let value = $(this).attr('data-value');

          // $(`[data-type="${type}"]`).removeClass('selected');
          // $(`[name="${type}"]`).prop('checked', false);
          $(this).find(`[name="${type}"]`).prop('checked', true);
          $(this).addClass('selected');

          if (type == 'text') {
            llm_type_save();
          }

          if (type == 'media') {
            $(`[name="llm_${type}"]`).val(value);
          }

          if (type == 'aitoolkit') {
            // $(document).find('.card-checkbox').find('[type="checkbox"]').prop('checked', false);
            // $('[name="llm_aitoolkit"]').val(value);
            ai_toolkit_save();
          }

          if (type == 'cert_level') {
            $(`[data-type="${type}"]`).removeClass('selected');
            $(`[name="${type}"]`).prop('checked', false);
            $(this).find(`[name="${type}"]`).prop('checked', true);
            $(this).addClass('selected');
            $(`[name="llm_cert_level"]`).val(value);
          }

          if (type == 'destination') {
            $(`[data-type="${type}"]`).removeClass('selected');
            $(`[name="${type}"]`).prop('checked', false);
            $(this).find(`[name="${type}"]`).prop('checked', true);
            $(this).addClass('selected');
            $(`[name="llm_destination"]`).val(value);
          }
        });

        $('.card-checkbox label').on('click', function (event) {
          // $(`[data-type="aitoolkit"]`).removeClass('selected');
          $(this).parents(`[data-type="aitoolkit"]`).addClass('selected');
          $(this)
            .parents('.card-wrapper')
            .find('[name="aitoolkit"]')
            .prop('checked', true);
          // $('.ai-check-outer .card-wrapper:not(.selected)').find('input[type="checkbox"]').prop('checked', false);
          let value = $(this)
            .parents(`[data-type="aitoolkit"]`)
            .attr('data-value');
          // $('[name="llm_aitoolkit"]').val(value);
          ai_toolkit_save();
          event.stopPropagation();
        });

        $(document).on('click', '.selected', function (e) {
          e.stopPropagation();
          let type = $(this).attr('data-type');
          $(this).removeClass('selected');
          $(this).find(`[name="${type}"]`).prop('checked', false);

          if (type == 'text') {
            llm_type_save();
          } else if (type == 'aitoolkit') {
            ai_toolkit_save();
          } else {
            $(`[type="hidden"][name="llm_${type}"]`).val('');
          }
        });

        $('.custom-grid-select label').on('click', function (event) {
          event.stopImmediatePropagation();
          let status = $(this).find('.custom-radio-select').is(':checked');
          let type = $(this).parents('.card-wrapper').attr('data-type');
          let value = $(this).parents('.card-wrapper').attr('data-value');
          if (status) {
            // $(`[name="${type}"]`).prop('checked', false);
            $(this).find(`[name="${type}"]`).prop('checked', true);
            // $(`[data-type="${type}"]`).removeClass('selected');
            $(this).parents('.card-wrapper').addClass('selected');

            if (type == 'text') {
              $(`[name="llm_${type}"]`).val(value);
            }

            if (type == 'media') {
              $(`[name="llm_${type}"]`).val(value);
            }

            if (type == 'aitoolkit') {
              // $(document).find('.card-checkbox').find('[type="checkbox"]').prop('checked', false);
              // $('[name="llm_aitoolkit"]').val(value);
              ai_toolkit_save();
            }

            if (type == 'cert_level') {
              $(`[name="llm_cert_level"]`).val(value);
            }

            if (type == 'destination') {
              $(`[name="llm_destination"]`).val(value);
            }
          } else {
            // $(`[name="${type}"]`).prop('checked', false);
            $(this).parents('.card-wrapper').removeClass('selected');
            ai_toolkit_save();
            // $(`[type="hidden"][name="llm_${type}"]`).val('');
          }
        });

        // projected cost table
        var cost = $('#cost-table-list').DataTable({
          iDisplayLength: 50, // Set the default number of rows to display
        });
        tableDetails('cost-table-list');

        // cost ownership table
        var costownership = $('#cost-ownership-list').DataTable({
          iDisplayLength: 50, // Set the default number of rows to display
        });
        tableDetails('cost-ownership-list');

        // screen functionality
        let url = window.location.href;
        let isBack = false;
        if (url.indexOf('s=') !== -1) {
          isBack = true;
          let params = new URLSearchParams(window.location.search);
          let screenId = params.get('s');

          // screen display block
          let sid = 's' + screenId;
          let csid = '.s' + screenId;
          if (sessionStorage.getItem('infra session data') !== null) {
            currentData = JSON.parse(
              sessionStorage.getItem('infra session data')
            );

            if (sid == 's1') {
              let type = currentData['llm_text'];
              if (type != '' && type) {
                $('[type="hidden"][name="llm_text"]').val(type);
                let llmArr = type.split(',');
                $.each(llmArr, function (i, item) {
                  $(`[data-type="text"][data-value="${item}"]`).addClass(
                    'selected'
                  );
                  $(`[data-type="text"][data-value="${item}"]`)
                    .find(`input[value="${item}"]`)
                    .prop('checked', true);
                });
              }
            } else if (sid == 's2') {
              let data = currentData['ai_toolkit'];
              if (data) {
                let type = data['llm_aitoolkit'].split(',');
                let childLists = JSON.parse(data['childLists']);

                $('[name="ai_team_size"]').val(data['ai_team_size']);
                $('[name="number_of_users"]').val(data['number_of_users']);
                $('[name="workspace_types"]').val(data['workspace_types']);
                $('.chosen-select').trigger('chosen:updated');
                $('[type="hidden"][name="llm_aitoolkit"]').val(type);

                $.each(type, function (i, elem) {
                  $(`[data-type="aitoolkit"][data-value="${elem}"]`).addClass(
                    'selected'
                  );
                  $(`[data-type="aitoolkit"][data-value="${elem}"]`)
                    .find(`input[value="${elem}"]`)
                    .prop('checked', true);
                  $.each(childLists[elem].split(','), function (i, item) {
                    $(
                      `[data-type="aitoolkit"][data-value="${elem}"] ul.checkbox-list li input[value="${item}"]`
                    ).prop('checked', true);
                  });
                });
              }
            } else if (sid == 's3') {
              if (
                currentData['selectModel'] != '' &&
                currentData['selectModel']
              ) {
                selectModel = currentData['selectModel'];
                console.log('selectModel: ', selectModel);
                $('[name="model_select"]').val(currentData['model_select']);
                if (
                  currentData['model_select'] != '' &&
                  currentData['model_select']
                ) {
                  modelCompareList = currentData['model_select'].split(',');
                } else {
                  modelCompareList = [];
                }
              }
            } else if (sid == 's4') {
              selectModel = currentData['selectModel'];
              console.log('selectModel: ', selectModel);

              machineSelect = currentData['machineSelect'];
              console.log('machineSelect: ', machineSelect);

              if (selectModel) {
                let type = currentData['llm_text'];
                let key = Object.keys(selectModel);
                if (key.length > 0) {
                  $('#selected-models-wrapper').html('');
                  let html = '';
                  let modelId = '';
                  $.each(key, function (i, option) {
                    let customSelection = selectModel[option];

                    let [CurrentModel] = InfraData.filter((item, i) => {
                      if (item.id == option) {
                        return item;
                      }
                    });
                    let rows = '';
                    let modelName = CurrentModel.model_name;
                    modelId = modelName.replace(/[ .]/g, '').toLowerCase();

                    if (customSelection.length > 0) {
                      $.each(CurrentModel.inferences, function (i, elem) {
                        let { id, machineType, tps, memory } = elem;
                        let mid = id;
                        if (customSelection.includes(mid)) {
                          $.each(machineType, function (i, mac) {
                            let {
                              id,
                              gpu,
                              gpuparameters,
                              machineTypeName,
                              cores,
                              hour_cost,
                              month_cost,
                              year_cost,
                            } = mac;
                            rows += `<tr data-id="${mid + '_' + id}" class="machineList"> 
													<td width="7%" class="checkbox-div"> <div class="c-checkbox"> <label> <input type="checkbox" name="mac_checkbox[]" class="checkall" data-cid="${option}-${mid + '_' + id}"> <span class="fa fa-check"></span> </label> </div> </td>
													<td class="" width="25%"><a class=""> ${machineTypeName} </a></td> 
													<td width="10%"> ${FC(hour_cost)} </td> 
													<td width="10%"> ${FC(month_cost)} </td> 
													<td width="10%"> ${FC(year_cost)} </td>
													<td> ${gpu} </td> 
													<td width="15%"> ${gpuparameters} </td> 
													<td> ${cores} </td> 
													<td>${memory}</td>
													<td>${tps}</td>
													</tr>`;
                          });
                        }
                      });

                      html = `<div class="col-sm-12"><h4 class="title mac_title">${modelName} <span class="model-title-span">(${type})</span></h4><div class="model-inner mac_model" data-id="${modelId}" data-table-name="${modelId}"><div class="table-main-div mac_table_outer"><table class="table table-striped table-hover pb mac_table" data-pid="${option}" id="${modelId}" cellspacing="0" width="100%"><thead><tr><th width="7%"></th><th width="25%">Machine type</th><th width="15%">Hourly</th><th width="15%">Monthly</th><th width="15%">Yearly</th><th> GPUs </th><th> GPU parameters (GiB) </th><th> vCPUs </th><th> Memory (GiB) </th><th> TPS </th></tr></thead><tbody>${rows}</tbody></table></div></div></div>`;

                      $('#selected-models-wrapper').append(html);
                      $('#' + modelId).DataTable({
                        paging: false, // Disable pagination
                        ordering: false, // Disable sorting on all columns
                        searching: false, // Disable searching
                        info: false, // Disable information display
                      });
                      tableDetails(modelId);
                    } else {
                      // inferences
                      $.each(CurrentModel.inferences, function (i, elem) {
                        let { id, machineType, tps, memory } = elem;
                        let mid = id;
                        $.each(machineType, function (i, mac) {
                          let {
                            gpu,
                            gpuparameters,
                            machineTypeName,
                            cores,
                            hour_cost,
                            month_cost,
                            year_cost,
                          } = mac;

                          rows += `<tr data-id="${mid + '_' + id}" class="machineList"> 
													<td width="7%" class="checkbox-div"> <div class="c-checkbox"> <label> <input type="checkbox" name="mac_checkbox[]" class="checkall" data-cid="${option}-${mid + '_' + id}"> <span class="fa fa-check"></span> </label> </div> </td>
													<td class="" width="25%"><a class=""> ${machineTypeName} </a></td> 
													<td width="10%"> ${FC(hour_cost)} </td> 
													<td width="10%"> ${FC(month_cost)} </td> 
													<td width="10%"> ${FC(year_cost)} </td>
													<td> ${gpu} </td>
													<td width="15%"> ${gpuparameters} </td>
													<td> ${cores} </td>
													<td>${memory}</td>
													<td>${tps}</td>
													</tr>`;
                        });
                      });

                      html = `<div class="col-sm-12"> <h4 class="title mac_title">${modelName} <span class="model-title-span">(${type})</span></h4><div class="model-inner mac_model" data-id="${modelId}" data-table-name="${modelId}"><div class="table-main-div mac_table_outer"><table class="table table-striped table-hover pb mac_table" data-pid="${option}" id="${modelId}" cellspacing="0" width="100%"><thead><tr><th width="7%"></th><th width="25%">Machine type</th><th width="15%">Hourly</th><th width="15%">Monthly</th><th width="15%">Yearly</th><th> GPUs </th><th> GPU parameters (GiB) </th><th> vCPUs </th><th> Memory (GiB) </th><th> TPS </th></tr></thead><tbody>${rows}</tbody></table></div></div></div>`;

                      $('#selected-models-wrapper').append(html);

                      $('#' + modelId).DataTable({
                        paging: false, // Disable pagination
                        ordering: false, // Disable sorting on all columns
                        searching: false, // Disable searching
                        info: false, // Disable information display
                      });
                      tableDetails(modelId);
                    }

                    $(document)
                      .find('.dataTables_filter')
                      .children('label')
                      .children('input')
                      .attr('placeholder', 'Filter');
                  });
                }
              } else {
                selectModel = {};
              }

              if (machineSelect != '' && machineSelect) {
                $.each(machineSelect, function (i, item) {
                  let id = i.replace(/m/g, '');
                  $(document)
                    .find(`[data-cid="${id + '-' + item}"]`)
                    .prop('checked', true);
                });
              } else {
                machineSelect = {};
              }
            } else if (sid == 's5') {
              let destination = currentData['destination'];
              let certificate = currentData['certificate'];
              if (destination && destination != '') {
                $(
                  `[data-type="destination"][data-value="${destination}"]`
                ).addClass('selected');
                $(`[data-type="destination"][data-value="${destination}"]`)
                  .find(`input[value="${destination}"]`)
                  .prop('checked', true);
                $('[type="hidden"][name="llm_destination"]').val(destination);
              }

              if (certificate && certificate != '') {
                $(
                  `[data-type="cert_level"][data-value="${certificate}"]`
                ).addClass('selected');
                $(`[data-type="cert_level"][data-value="${certificate}"]`)
                  .find(`input[value="${certificate}"]`)
                  .prop('checked', true);
                $('[type="hidden"][name="llm_cert_level"]').val(certificate);
              }
            } else if (sid == 's6') {
              // cost table
              machineSelect = currentData['machineSelect'];
              console.log('machineSelect: ', machineSelect);
              let destination = currentData['destination'];
              if (machineSelect && machineSelect != '') {
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
                    let { id, machineType } = item;
                    let mid = id;
                    $.each(machineType, function (j, items) {
                      let { id, machineTypeName, month_cost, year_cost } =
                        items;
                      console.log('id,: ', id);
                      let cusId = mid + '_' + id;
                      console.log('cusId: ', cusId);
                      if (option == cusId) {
                        $('#cost-table-list')
                          .DataTable()
                          .row.add(
                            $(`<tr class="" data-model-id="${id}">
													<td width="30%" class="sorting_1">${model}</td>
													<td width="30%"> ${machineTypeName} </td>
													<td> ${FC(month_cost)}</td>
													<td> ${FC(year_cost)}</td>
												</tr>`)
                          )
                          .draw();
                      }
                    });
                  });
                  tableDetails('cost-table-list');
                });

                // bill of materials
                let mainBom = bom[destination];
                let subBom = mainBom.bom;
                let subSBom = mainBom.sbom;

                // bom tables
                $.each(subBom, function (i, bitem) {
                  let tr = '';
                  $.each(bitem, function (key, item) {
                    let { name, hourly, monthly, yearly } = item;
                    tr += `<tr role="row">
									<td width="30%">${name}</td>
									<td> ${FC(hourly)}</td>
									<td> ${FC(monthly)}</td>
									<td> ${FC(yearly)}</td>
								 </tr>`;
                  });
                  let accordion = `<div class="wf-accordion js-accordion">
								<div class="wf-accordion__header js-accordion__header">
								   <h3 class="wf-accordion__trigger js-accordion__trigger accordion-title">${i.replace(/_/g, ' ')}</h3>
								 </div>
							 
								<div class="wf-accordion__panel js-accordion__panel">
								<div class="row form-group" >
								   <div class="col-md-12">
									  <table  class="table v-align table-striped">
									  <thead>
										  <tr>
											<th width="30%"> Name </th>
											<th width="30%"> Hourly </th>
											<th width="15%"> Monthly </th>
											<th width="15%"> Yearly </th>
										</tr>
									  </thead>
									  <tbody>
											  ${tr}
									  </tbody>
									  </table>
								   </div>
								</div>
								</div>
							 </div>`;
                  $('.js-accordion-group-bom').append(accordion);
                });
                $('.js-accordion-group-bom').wfAccordion();

                // sbom tables
                $.each(subSBom, function (i, sitem) {
                  let tr = '';
                  $.each(sitem, function (key, item) {
                    let { name, hourly, monthly, yearly } = item;
                    tr += `<tr role="row">
									<td width="30%">${name}</td>
									<td> ${FC(hourly)}</td>
									<td> ${FC(monthly)}</td>
									<td> ${FC(yearly)}</td>
								 </tr>`;
                  });
                  let sbomAccordion = `<div class="wf-accordion js-accordion">
								<div class="wf-accordion__header js-accordion__header">
								   <h3 class="wf-accordion__trigger js-accordion__trigger accordion-title">${i.replace(/_/g, ' ')}</h3>
								 </div>
							 
								<div class="wf-accordion__panel js-accordion__panel">
								<div class="row form-group" >
								   <div class="col-md-12">
									  <table  class="table v-align table-striped">
									  <thead>
										  <tr>
											<th width="30%"> Name </th>
											<th width="30%"> Hourly </th>
											<th width="15%"> Monthly </th>
											<th width="15%"> Yearly </th>
										</tr>
									  </thead>
									  <tbody>
											  ${tr}
									  </tbody>
									  </table>
								   </div>
								</div>
								</div>
							 </div>`;
                  $('.js-accordion-group-sbom').append(sbomAccordion);
                });
                $('.js-accordion-group-sbom').wfAccordion();
              } else {
                machineSelect = {};
              }
            } else if (sid == 's7') {
              let destination = currentData['destination'];
              let certificate = currentData['certificate'];
              let dest_name = currentData['dest_name'];
              if (certificate) {
                $('.chosen-level').html(certificate.replace(/_/g, ' '));
              }
              if (dest_name) {
                $('.chosen-destination').html(dest_name);
              }
              let comboimage = certificate + '_' + destination;
              $('[data-choice="true"]').css('display', 'none');
              $(`[data-mermaid-id="${comboimage}"]`).css('display', 'block');
            } else if (sid == 's10') {
              let id = currentData['model_view_id'];
              if (id) {
                let [data] = InfraData.filter((item) => {
                  if (item.id == id) {
                    return item;
                  }
                });

                $('#ModelDataList').DataTable().clear().draw();

                let { inferences, model_name } = data;

                let tr = '';
                $.each(inferences, (i, item) => {
                  let {
                    id,
                    method,
                    quantization,
                    ttft,
                    tpot,
                    latency,
                    throughput,
                  } = item;

                  $('#ModelDataList')
                    .DataTable()
                    .row.add(
                      $(`<tr data-id="${id}" class="dataList"> 
										<td width="7%" class="checkbox-div"> <div class="c-checkbox"> <label> <input type="checkbox" name="sub_model[]" class="checkall"> <span class="fa fa-check"></span> </label> </div> </td>
										<td class="inference-meth" width="30%" style="text-transform: none;">  ${method} </td> 
										<td> ${quantization} </td> 
										<td> ${ttft} </td> 
										<td> ${tpot} </td> 
										<td> ${latency}</td>
										<td>${throughput}</td>
									</tr>`)
                    )
                    .draw();

                  $('[name="modelsCompare"]')
                    .find('option[value="' + data.model_name + '"]')
                    .attr('selected', true);
                });
                $('.screen-title').text(model_name);
                $('[name="modelsCompare"]').trigger('chosen:updated');
                tableDetails('ModelDataList');
              }
            } else if (sid == 's11') {
              let modelsIds = currentData['model_select'];

              if (modelsIds && modelsIds != '') {
                let modelsArr = modelsIds.split(',');

                if (modelsArr.length > 0) {
                  let endtoend = [];
                  let latencyChart = [];
                  let denseChart = [];
                  let selfChart = [];

                  if (modelsArr != undefined) {
                    let compareTable = '';
                    let perplexity = '';
                    $.each(modelsArr, function (i, option) {
                      let [CurrentModel] = InfraData.filter((item, i) => {
                        if (item.id == option) {
                          return item;
                        }
                      });

                      // inferences

                      $.each(CurrentModel.inferences, function (i, elem) {
                        // table row forming
                        if (i == 0) {
                          let len = CurrentModel.inferences.length;
                          compareTable += `<tr>
														<td rowspan="${len}" class="model-name freeze-columns">${CurrentModel.model_name}</td>
														<td class="freeze-columns2">${elem.quantization}</td>
														<td class="freeze-columns3" style="text-transform:initial;">${elem.method}</td>
														<td>${elem.PIQA}</td>
														<td>${elem.ARCe}</td>
														<td>${elem.ARCc}</td>
														<td>${elem.boolq}</td>
														<td>${elem.hellaSwag}</td>
														<td>${elem.winogrande}</td>
														<td>${elem.avg}</td>
														<td>${elem.wikitext}</td>
														<td>${elem.ptb}</td>
														<td>${elem.c4}</td>
														</tr>`;
                        } else {
                          compareTable += `<tr>
													<td class="freeze-columns2">${elem.quantization}</td>
													<td class="freeze-columns3" style="text-transform:initial;">${elem.method}</td>
													<td>${elem.PIQA}</td>
													<td>${elem.ARCe}</td>
													<td>${elem.ARCc}</td>
													<td>${elem.boolq}</td>
													<td>${elem.hellaSwag}</td>
													<td>${elem.winogrande}</td>
													<td>${elem.avg}</td>
													<td>${elem.wikitext}</td>
													<td>${elem.ptb}</td>
													<td>${elem.c4}</td>
													</tr>`;
                        }
                      });

                      endtoend.push({
                        label: CurrentModel.endtoend_throughput.name,
                        data: CurrentModel.endtoend_throughput.value, // Update FP16 data
                        fill: false,
                        // borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 2,
                      });

                      latencyChart.push({
                        label: CurrentModel.latency_per_token.name,
                        data: CurrentModel.latency_per_token.value,
                        fill: false,
                        // borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 2,
                      });

                      denseChart.push({
                        label: CurrentModel.dense_layer.name,
                        data: CurrentModel.dense_layer.value,
                        fill: false,
                        // borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 2,
                      });

                      selfChart.push({
                        label: CurrentModel.self_attention.name,
                        data: CurrentModel.self_attention.value,
                        fill: false,
                        // borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 2,
                      });

                      $('[name="modelsCompare"]')
                        .find('option[value="' + CurrentModel.model_name + '"]')
                        .attr('selected', true);
                    });
                    $('#compare-table1 > tbody').html(compareTable);
                    $('[name="modelsCompare"]').trigger('chosen:updated');
                  }
                  enetoendchart1.data.datasets = endtoend;
                  enetoendchart1.update();

                  latency1.data.datasets = latencyChart;
                  latency1.update();

                  dense1.data.datasets = denseChart;
                  dense1.update();

                  self1.data.datasets = selfChart;
                  self1.update();

                  // goto specified step
                  // myWizard.step(10);
                } else {
                  $.notification(['Please select model'], {
                    position: ['top', 'right'],
                    timeView: 4000,
                    messageType: 'error',
                  });
                }
              } else {
                $.notification(['Please select model'], {
                  position: ['top', 'right'],
                  timeView: 4000,
                  messageType: 'error',
                });
              }
            }
          }
          $(csid).css('display', 'block');
        } else {
          $('.s1').css('display', 'block');
          if (sessionStorage.getItem('infra session data') !== null) {
            currentData = JSON.parse(
              sessionStorage.getItem('infra session data')
            );
            let type = currentData['llm_text'];

            if (type && type != '') {
              $(`[data-type="text"][data-value="${type}"]`).addClass(
                'selected'
              );
              $(`[data-type="text"][data-value="${type}"]`)
                .find(`input[value="${type}"]`)
                .prop('checked', true);
              $('[type="hidden"][name="llm_text"]').val(type);
            }
          }
        }

        // parameter details
        $(document).on('click', '.para-desc', function () {
          let id = $(this).attr('data-id');
          console.log('id: ', id);
          let text = $(this).text().trim();
          let desc = modelPara[id];
          $('.modelParameterDescription').text(desc);
          $('.current-param-details').text(text);
          $('#model_desc_popup').modal('show');
        });

        $('.dismiss_btn').on('click', function () {
          $('.modal-close-btn').trigger('click');
        });

        $('.dismiss_btn_sec').on('click', function () {
          $('.modal-close-btn-sec').trigger('click');
        });

        $('.modal').on('hidden.bs.modal', function (e) {
          if ($('.modal:visible').length) {
            $('body').addClass('modal-open');
          }
        });

        // llm type validation
        $('[data-action="llmType"]').on('click', function () {
          let llm_text = $(`[type="hidden"][name="llm_text"]`).val();

          if (llm_text != '') {
            $('.machine-llm-type').text(llm_text);
            if (!isBack) {
              // let newObj = {};
              // newObj['llm_text'] = llm_text;
              currentData['llm_text'] = llm_text;
              sessionStorage.setItem(
                'infra session data',
                JSON.stringify(currentData)
              );
            } else {
              currentData['llm_text'] = llm_text;
              sessionStorage.setItem(
                'infra session data',
                JSON.stringify(currentData)
              );
            }
            window.location.href = `${page}?s=2`;
            // myWizard.step(1);
          } else {
            $.notification(['Please Select LLM Task Type'], {
              position: ['top', 'right'],
              timeView: 3000,
              messageType: 'error',
            });
          }
        });

        // aitoolkit validation
        $('[data-action="aitoolkit"]').on('click', function () {
          let llm_aitoolkit = $(`[type="hidden"][name="llm_aitoolkit"]`).val();
          let number_of_users = $(`[name="number_of_users"]`).val();
          let workspace_types = $(`[name="workspace_types"]`).val();
          let ai_team_size = $(`[name="ai_team_size"]`).val();

          if (
            llm_aitoolkit != '' &&
            number_of_users != '' &&
            workspace_types != '' &&
            ai_team_size != ''
          ) {
            let childLists = {};
            let arr_llm_aitoolkit = llm_aitoolkit.split(',');
            $.each(arr_llm_aitoolkit, function (i, item) {
              let childList = [];
              $(
                `[data-type="aitoolkit"][data-value="${item}"] ul.checkbox-list li`
              ).each(function () {
                let value = $(this).find('input:checked').val();
                if (value && value != '') {
                  childList.push(value);
                }
              });
              let stringchildList = childList.join(',');
              childLists[item] = stringchildList;
            });

            JsonChildLists = JSON.stringify(childLists);
            currentData['ai_toolkit'] = {
              llm_aitoolkit,
              number_of_users,
              workspace_types,
              ai_team_size,
              childLists: JsonChildLists,
            };
            sessionStorage.setItem(
              'infra session data',
              JSON.stringify(currentData)
            );
            window.location.href = `${page}?s=3`;
            // myWizard.step(2);
          } else {
            if (llm_aitoolkit == '') {
              $.notification(['Please select AI Tool Kits'], {
                position: ['top', 'right'],
                timeView: 3000,
                messageType: 'error',
              });
            }

            if (ai_team_size == '') {
              $.notification(['Please Enter AI team size'], {
                position: ['top', 'right'],
                timeView: 3000,
                messageType: 'error',
              });
            }

            if (number_of_users == '') {
              $.notification(['Please Enter Number of users'], {
                position: ['top', 'right'],
                timeView: 3000,
                messageType: 'error',
              });
            }
            if (workspace_types == '') {
              $.notification(['Please Select Workspace types'], {
                position: ['top', 'right'],
                timeView: 3000,
                messageType: 'error',
              });
            }
          }
        });

        // certification validation
        $('[data-action="certification"]').on('click', function () {
          let certificate = $(`[type="hidden"][name="llm_cert_level"]`).val();
          let destination = $(`[type="hidden"][name="llm_destination"]`).val();
          let dest_name = destination.replace(/_/g, ' ');

          if (certificate != '' && destination != '') {
            currentData['certificate'] = certificate;
            currentData['destination'] = destination;
            currentData['dest_name'] = dest_name;
            sessionStorage.setItem(
              'infra session data',
              JSON.stringify(currentData)
            );
            window.location.href = `${page}?s=6`;
            // myWizard.step(5);
          } else {
            $.notification(['Please Certification level and Destination'], {
              position: ['top', 'right'],
              timeView: 3000,
              messageType: 'error',
            });
          }
        });

        // cost projection
        $('[data-action="cost"]').on('click', function () {
          window.location.href = `${page}?s=7`;
        });

        // topology popup
        $('.topology-img').on('click', function () {
          let html = $(this).html();
          let modalClass = $(this).attr('data-name');
          let title = $(this).attr('data-title');
          $('.current-topology').text(title);
          $(`.${modalClass}`).modal('show');
          // $('.topology-model-view').html(html);
        });

        // $('img.topology-map').rwdImageMaps();

        $('[data-topology="true"]').on('click', function () {
          let title = $(this).attr('data-title');
          $('.current-topology-details').text(title);
          $('.topology-modal-desc').modal('show');
        });

        // back functionality
        $('[data-action="prev"]').on('click', function () {
          let pageID = $(this).attr('data-prev-pageid');
          window.location.href = `${page}?s=${pageID}`;
        });

        $(document).find('[data-toggle="tooltip"]').tooltip();

        $(document)
          .find('.dataTables_filter')
          .children('label')
          .children('input')
          .attr('placeholder', 'Filter');

        // new chart version starts

        // var ctx = $document.getElementById('gleuChart').getContext('2d');
        // var gleuChart = new Chart(ctx, {
        // 	type: 'line',
        // 	data: {
        // 		labels: [
        // 			"sshleifer/tiny-distilbert-base-cased-distilled-squad",
        // 			"EleutherAI/gpt-neo-1.3B",
        // 			"tiiuae/falcon-7b-instruct",
        // 			"mosaicml/mpt-7b-8k-instruct"
        // 		],
        // 		datasets: [{
        // 			label: 'GLEU',
        // 			data: [
        // 				0.01546391753,
        // 				0.005154639175,
        // 				0.01546391753,
        // 				0
        // 			],
        // 			borderColor: 'rgba(75, 192, 192, 1)',
        // 			borderWidth: 2,
        // 			fill: false,
        // 			tension: 0.1
        // 		}]
        // 	},
        // 	options: {
        // 		scales: {
        // 			y: {
        // 				beginAtZero: true,
        // 				title: {
        // 					display: true,
        // 					text: 'GLEU Scores'
        // 				}
        // 			},
        // 			x: {
        // 				title: {
        // 					display: true,
        // 					text: 'Models'
        // 				}
        // 			}
        // 		},
        // 		plugins: {
        // 			title: {
        // 				display: true,
        // 				text: 'Question Answering - GLEU Scores'
        // 			}
        // 		}
        // 	}
        // });

        let gleuChart = '';
        if ($('#gleuChart').length > 0) {
          const labels = [
            'sshleifer/tiny-distilbert-base-cased-distilled-squad',
            'EleutherAI/gpt-neo-1.3B',
            'tiiuae/falcon-7b-instruct',
            'mosaicml/mpt-7b-8k-instruct',
          ];
          const data1 = [0.01546391753, 0.005154639175, 0.01546391753, 0];

          /**  Create the chart  */

          // gleuChart
          const ctx = document.getElementById('gleuChart').getContext('2d');
          gleuChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: labels,
              datasets: [
                {
                  label: 'GLEU',
                  data: data1,
                  fill: false,
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 2,
                },
              ],
            },
            options: {
              scales: {
                x: {
                  display: true,
                  title: {
                    display: true,
                    text: 'Models',
                  },
                },
                y: {
                  type: 'linear',
                  display: true,
                  beginAtZero: true,
                  position: 'left',
                  grid: {
                    display: false, // Hide grid lines
                  },
                  title: {
                    display: true,
                    text: 'GLEU Scores',
                  },
                },
              },
              plugins: {
                htmlLegend: {
                  // ID of the container to put the legend in
                  // containerID: 'legend-container',
                },
                legend: {
                  display: true,
                  labels: {
                    usePointStyle: true,
                    // padding: 120 // Adds padding around legend items
                  },
                },
              },
            },
          });
        } else {
          console.error('Canvas element not found.');
        }

        // rouge chart
        var rougeChart = '';
        if ($('#rougeChart').length > 0) {
          var ctx = document.getElementById('rougeChart').getContext('2d');
          rougeChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: [
                'sshleifer/tiny-distilbert-base-cased-distilled-squad',
                'EleutherAI/gpt-neo-1.3B',
                'tiiuae/falcon-7b-instruct',
                'mosaicml/mpt-7b-8k-instruct',
              ],
              datasets: [
                {
                  label: 'ROUGE-1',
                  data: [
                    0.01871428571, 0.06116917293, 0.06157575758, 0.04796428571,
                  ],
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 2,
                  fill: false,
                  tension: 0.1,
                },
                {
                  label: 'ROUGE-2',
                  data: [0, 0.03480392157, 0.01555555556, 0.02142857143],
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 2,
                  fill: false,
                  tension: 0.1,
                },
                {
                  label: 'ROUGE-L',
                  data: [0.018, 0.06130451128, 0.06090909091, 0.04535714286],
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 2,
                  fill: false,
                  tension: 0.1,
                },
                {
                  label: 'ROUGE-Lsum',
                  data: [0.01714285714, 0.05942857143, 0.062, 0.04410714286],
                  borderColor: 'rgba(153, 102, 255, 1)',
                  borderWidth: 2,
                  fill: false,
                  tension: 0.1,
                },
              ],
            },
            options: {
              scales: {
                x: {
                  display: true,
                  title: {
                    display: true,
                    text: 'Models',
                  },
                },
                y: {
                  type: 'linear',
                  display: true,
                  beginAtZero: true,
                  position: 'left',
                  grid: {
                    display: false, // Hide grid lines
                  },
                  title: {
                    display: true,
                    text: 'Scores',
                  },
                },
              },
              plugins: {
                htmlLegend: {
                  // ID of the container to put the legend in
                  // containerID: 'legend-container',
                },
                legend: {
                  display: true,
                  labels: {
                    usePointStyle: true,
                    // padding: 120 // Adds padding around legend items
                  },
                },
              },
            },
          });
        } else {
          console.error('Canvas element not found.');
        }

        // mauve Chart
        var mauveChart = '';
        if ($('#mauveChart').length > 0) {
          var ctx = $('#mauveChart');
          mauveChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: [
                'sshleifer/tiny-distilbert-base-cased-distilled-squad',
                'EleutherAI/gpt-neo-1.3B',
                'tiiuae/falcon-7b-instruct',
                'mosaicml/mpt-7b-8k-instruct',
              ],
              datasets: [
                {
                  label: 'MAUVE',
                  data: [0.1415727372, 0.466510739, 0.6274329518, 0.4553890349],
                  borderColor: 'rgba(153, 102, 255, 1)',
                  borderWidth: 2,
                  fill: false,
                  tension: 0.1,
                },
              ],
            },
            options: {
              scales: {
                x: {
                  display: true,
                  title: {
                    display: true,
                    text: 'Models',
                  },
                },
                y: {
                  type: 'linear',
                  display: true,
                  beginAtZero: true,
                  position: 'left',
                  grid: {
                    display: false, // Hide grid lines
                  },
                  title: {
                    display: true,
                    text: 'MAUVE Scores',
                  },
                },
              },
              plugins: {
                legend: {
                  display: true,
                  labels: {
                    usePointStyle: true,
                  },
                },
                // title: {
                // 	display: true,
                // 	text: 'Question Answering - MAUVE Scores'
                // }
              },
            },
          });
        } else {
          console.error('Canvas element not found.');
        }

        // meteor Chart
        var meteorChart = '';
        if ($('#meteorChart').length > 0) {
          var ctx = $('#meteorChart');
          meteorChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: [
                'sshleifer/tiny-distilbert-base-cased-distilled-squad',
                'EleutherAI/gpt-neo-1.3B',
                'tiiuae/falcon-7b-instruct',
                'mosaicml/mpt-7b-8k-instruct',
              ],
              datasets: [
                {
                  label: 'METEOR',
                  data: [
                    0.006083384521, 0.05820183981, 0.03148266651, 0.03693426455,
                  ],
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 2,
                  fill: false,
                  tension: 0.1,
                },
              ],
            },
            options: {
              scales: {
                x: {
                  display: true,
                  title: {
                    display: true,
                    text: 'Models',
                  },
                },
                y: {
                  type: 'linear',
                  display: true,
                  beginAtZero: true,
                  position: 'left',
                  grid: {
                    display: false, // Hide grid lines
                  },
                  title: {
                    display: true,
                    text: 'METEOR Scores',
                  },
                },
              },
              plugins: {
                legend: {
                  display: true,
                  labels: {
                    usePointStyle: true,
                  },
                },
                // title: {
                // 	display: true,
                // 	text: 'Question Answering - METEOR Scores'
                // }
              },
            },
          });
        } else {
          console.error('Canvas element not found.');
        }

        // samplesPerSecond Chart
        var samplesPerSecondChart = '';
        if ($('#samplesPerSecondChart').length > 0) {
          var ctx = $('#samplesPerSecondChart');
          samplesPerSecondChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: [
                'sshleifer/tiny-distilbert-base-cased-distilled-squad',
                'EleutherAI/gpt-neo-1.3B',
                'tiiuae/falcon-7b-instruct',
                'mosaicml/mpt-7b-8k-instruct',
              ],
              datasets: [
                {
                  label: 'Samples Per Second',
                  data: [19.70714505, 13.92227618, 4.416245881, 4.944588781],
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 2,
                  fill: false,
                  tension: 0.1,
                },
              ],
            },
            options: {
              scales: {
                x: {
                  display: true,
                  title: {
                    display: true,
                    text: 'Models',
                  },
                },
                y: {
                  type: 'linear',
                  display: true,
                  beginAtZero: true,
                  position: 'left',
                  grid: {
                    display: false, // Hide grid lines
                  },
                  title: {
                    display: true,
                    text: 'Samples Per Second',
                  },
                },
              },
              plugins: {
                legend: {
                  display: true,
                  labels: {
                    usePointStyle: true,
                  },
                },
                // title: {
                // 	display: true,
                // 	text: 'Question Answering - Samples Per Second'
                // }
              },
            },
          });
        } else {
          console.error('Canvas element not found.');
        }

        // latency Chart
        var latencyChart = '';
        if ($('#latencyChart').length > 0) {
          var ctx = $('#latencyChart');
          latencyChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: [
                'sshleifer/tiny-distilbert-base-cased-distilled-squad',
                'EleutherAI/gpt-neo-1.3B',
                'tiiuae/falcon-7b-instruct',
                'mosaicml/mpt-7b-8k-instruct',
              ],
              datasets: [
                {
                  label: 'Latency',
                  data: [
                    0.0507430172, 0.07182733536, 0.2264366674, 0.2022412872,
                  ],
                  borderColor: 'rgba(255, 99, 132, 1)',
                  borderWidth: 2,
                  fill: false,
                  tension: 0.1,
                },
              ],
            },
            options: {
              scales: {
                x: {
                  display: true,
                  title: {
                    display: true,
                    text: 'Models',
                  },
                },
                y: {
                  type: 'linear',
                  display: true,
                  beginAtZero: true,
                  position: 'left',
                  grid: {
                    display: false, // Hide grid lines
                  },
                  title: {
                    display: true,
                    text: 'Latency (seconds)',
                  },
                },
              },
              plugins: {
                legend: {
                  display: true,
                  labels: {
                    usePointStyle: true,
                  },
                },
              },
            },
          });
        } else {
          console.error('Canvas element not found.');
        }

        // gpuUtilization Chart
        var gpuUtilizationChart = '';
        if ($('#gpuUtilizationChart').length > 0) {
          var ctx = $('#gpuUtilizationChart');
          gpuUtilizationChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: [
                'sshleifer/tiny-distilbert-base-cased-distilled-squad',
                'EleutherAI/gpt-neo-1.3B',
                'tiiuae/falcon-7b-instruct',
                'mosaicml/mpt-7b-8k-instruct',
              ],
              datasets: [
                {
                  label: 'Average GPU Utilization',
                  data: [1.30078125, 14.22636719, 78.33251953, 95.52001953],
                  borderColor: 'rgba(255, 159, 64, 1)',
                  borderWidth: 2,
                  fill: false,
                  tension: 0.1,
                },
              ],
            },
            options: {
              scales: {
                x: {
                  display: true,
                  title: {
                    display: true,
                    text: 'Models',
                  },
                },
                y: {
                  type: 'linear',
                  display: true,
                  beginAtZero: true,
                  position: 'left',
                  grid: {
                    display: false, // Hide grid lines
                  },
                  title: {
                    display: true,
                    text: 'Average GPU Utilization (%)',
                  },
                },
              },
              plugins: {
                legend: {
                  display: true,
                  labels: {
                    usePointStyle: true,
                  },
                },
                // title: {
                // 	display: true,
                // 	text: 'Question Answering - Average GPU Utilization'
                // }
              },
            },
          });
        } else {
          console.error('Canvas element not found.');
        }

        // gpuRamUsage Chart
        var gpuRamUsageChart = '';
        if ($('#gpuRamUsageChart').length > 0) {
          var ctx = $('#gpuRamUsageChart');
          gpuRamUsageChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: [
                'sshleifer/tiny-distilbert-base-cased-distilled-squad',
                'EleutherAI/gpt-neo-1.3B',
                'tiiuae/falcon-7b-instruct',
                'mosaicml/mpt-7b-8k-instruct',
              ],
              datasets: [
                {
                  label: 'Used GPU RAM After Load',
                  data: [0.4150390625, 5.522460938, 31.33300781, 38.20800781],
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 2,
                  fill: false,
                  tension: 0.1,
                },
              ],
            },
            options: {
              scales: {
                x: {
                  display: true,
                  title: {
                    display: true,
                    text: 'Models',
                  },
                },
                y: {
                  type: 'linear',
                  display: true,
                  beginAtZero: true,
                  position: 'left',
                  grid: {
                    display: false, // Hide grid lines
                  },
                  title: {
                    display: true,
                    text: 'Used GPU RAM After Load (GB)',
                  },
                },
              },
              plugins: {
                legend: {
                  display: true,
                  labels: {
                    usePointStyle: true,
                  },
                },
                // title: {
                // 	display: true,
                // 	text: 'Question Answering - Used GPU RAM After Load'
                // }
              },
            },
          });
        } else {
          console.error('Canvas element not found.');
        }

        // cpuUtilization Chart
        var cpuUtilizationChart = '';
        if ($('#cpuUtilizationChart').length > 0) {
          var ctx = $('#cpuUtilizationChart');
          cpuUtilizationChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: [
                'sshleifer/tiny-distilbert-base-cased-distilled-squad',
                'EleutherAI/gpt-neo-1.3B',
                'tiiuae/falcon-7b-instruct',
                'mosaicml/mpt-7b-8k-instruct',
              ],
              datasets: [
                {
                  label: 'Average CPU Utilization',
                  data: [7.422, 13.996, 10.186, 9.362],
                  borderColor: 'rgba(153, 102, 255, 1)',
                  borderWidth: 2,
                  fill: false,
                  tension: 0.1,
                },
              ],
            },
            options: {
              scales: {
                x: {
                  display: true,
                  title: {
                    display: true,
                    text: 'Models',
                  },
                },
                y: {
                  type: 'linear',
                  display: true,
                  beginAtZero: true,
                  position: 'left',
                  grid: {
                    display: false, // Hide grid lines
                  },
                  title: {
                    display: true,
                    text: 'Average CPU Utilization (%)',
                  },
                },
              },
              plugins: {
                legend: {
                  display: true,
                  labels: {
                    usePointStyle: true,
                  },
                },
                // title: {
                // 	display: true,
                // 	text: 'Question Answering - Average CPU Utilization'
                // }
              },
            },
          });
        } else {
          console.error('Canvas element not found.');
        }

        /** new chart version ends */
      }); // json end
    });
  });
});
