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
      $('#' + selector + '_length').show();
      $('#' + selector + '_filter').hide();
      $('#' + selector + '_info').show();
      $('#' + selector + '_paginate').show();
    } else {
      $('#' + selector + '_length').hide();
      $('#' + selector + '_filter').hide();
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
  $('.chosen-select').chosen();

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

  $.getJSON('data/private-ai-data.json', function (privateAIData) {
    console.log('privateAIData: ', privateAIData);

    function SerializeArrToJson(arr) {
      var jsonObj = {};
      jQuery.map(arr, function (n, i) {
        if (n.value != '') {
          if (n.name.endsWith('[]')) {
            var name = n.name;
            name = name.substring(0, name.length - 2);
            if (!(name in jsonObj)) {
              jsonObj[name] = [];
            }
            jsonObj[name].push(n.value);
          } else {
            jsonObj[n.name] = n.value;
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

    function FC(amount) {
      // Check if the input is a valid number
      if (isNaN(amount)) {
        return 'Invalid input';
      }

      // Use toFixed(2) to ensure the number has two decimal places
      const formattedAmount = parseFloat(amount).toFixed(2);

      // Use Intl.NumberFormat to format the number as currency
      const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      });

      return currencyFormatter.format(formattedAmount).replace(/\$/g, '');
    }

    var privateAIList = $('#privateAIList').DataTable({
      iDisplayLength: 25, // Set the default number of rows to display
    });
    $.each(privateAIData, function (key, item) {
      let {
        id,
        llms,
        model,
        weight,
        finetune,
        tasktype,
        cost_this_month,
        cost_this_year,
        total_cost,
      } = item;
      $('#privateAIList')
        .DataTable()
        .row.add(
          $(`<tr data-id="${id}" class="dataList"> 
			<td width="10%" class="checkbox-div sorting_1"> <div class="c-checkbox"> <label> <input type="checkbox" name="sub_checkbox[]" class="checkall"> <span class="fa fa-check"></span> </label> </div> </td>
			<td class="" width="25%"> ${llms} </td> 
			<td> ${model} </td> 
			<td> ${weight} </td> 
			<td> ${finetune} </td> 
			<td> ${tasktype} </td>
			</tr>`)
        )
        .draw();
    });
    tableDetails('privateAIList');

    // add contact info to table functionality
    $(document).on('click', '#addAWSItem', function () {
      $('#AWSItemForm').trigger('reset');
      $('.chosen-select').trigger('chosen:updated');
      $('#contactInfoModal').modal('show');
    });

    $('button.addAWSItemRow').click(function () {
      $('#AWSItemForm').parsley().validate();
      if ($('#AWSItemForm').parsley().isValid()) {
        let data = SerializeArrToJson($('#AWSItemForm').serializeArray());

        let {
          awsItem,
          description,
          service,
          purpose,
          hourlyRate,
          costThisMonth,
          costThisYear,
          totalCost,
          startStopBtn,
        } = data;

        let btn = '';
        if (startStopBtn != undefined && startStopBtn) {
          btn = `<div class="toggle-check-box">
				<div class="button r" id="button-1">
				   <input type="checkbox" name="instance_status" class="checkbox checkbox-input" checked=""/>
				   <div class="knobs"></div>
				   <div class="layer"></div>
				</div>
				</div>`;
        }
        let id = randomString();

        let row = `<tr class="child" data-id="${id}">
			<td width="5%" class="checkbox-div"> <div class="c-checkbox"> <label> <input type="checkbox" name="sub_checkbox[]" class="checkall"> <span class="fa fa-check"></span> </label> </div> </td>
			<td>${awsItem}</td> 
			<td>${description}</td>
			<td>${service}</td>
			<td>${purpose}</td>
			<td>${hourlyRate}</td> 
			<td>${costThisMonth}</td>
			<td>${costThisYear}</td>
			<td>${totalCost}</td>
			<td width="10%">
				<div class="action-outer">
					<a class="mt-minus-5" data-toggle="" data-target="#addOwners"> <em class="icon edit_owner_information icon-pencil add-icon mt0"></em> </a>

					${btn}
				</div>
			</td>
			</tr>`;

        $('#privateAIList').DataTable().row.add($(row)).draw();
        tableDetails('privateAIList');
        $('#contactInfoModal').modal('hide');
        $('#AWSItemForm').trigger('reset');
        $('.chosen-select').trigger('chosen:updated');
      }
    });

    $('#privateAIList tfoot th').each(function () {
      let title = $('#privateAIList thead th')
        .eq($(this).index())
        .text()
        .trim();
      if (title != '' && title && title != 'Select') {
        $(this).html(
          '<input type="text" class="filter" placeholder="' + title + '" />'
        );
      }
    });

    privateAIList.columns().every(function () {
      var that = this;
      $('input', this.footer()).on('keyup change', function () {
        that.search(this.value).draw();
      });
    });
    // Assuming privateAIList is your initialized DataTable

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
          const formattedAmount = parseFloat(amount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

          // Update the input value with the formatted amount
          $(this).val(formattedAmount);
        } else {
          $(this).val('');
        }
      });

    // start / stop  functionality
    $(document).on('click', '.checkbox-input', function (e) {
      e.preventDefault();
      $(document).find('.checkbox-input').removeClass('select-mode-change');
      $(this).addClass('select-mode-change');
      $('#alert_popup').modal('show');
    });

    // login popup functionality
    $('#login_alert_form').on('submit', function (e) {
      let form = $(this);
      let data = SerializeArrToJson($(this).serializeArray());
      form.parsley().validate();
      if (form.parsley().isValid()) {
        if (data.loginPassword == '12345') {
          $('#login_alert_form').find('.defalut_selection_error').text('');
          let curStatus = $(document)
            .find('.select-mode-change')
            .is(':checked');
          $(document).find('.select-mode-change').prop('checked', !curStatus);
          $('.default_close_button').trigger('click');
          $('#login_alert_form').trigger('reset');
          return false;
        } else {
          $('#login_alert_form')
            .find('.defalut_selection_error')
            .text('Please enter correct password');
          return false;
        }
      }
    });

    // pricing functionality
    $(document).on('click', '.price-btn', function (e) {
      e.preventDefault();
      $(document).find('.node-row').removeClass('node-price-btn');
      $(this).parents('.node-row').addClass('node-price-btn');
      let modelId = $(document).find('tr.node-price-btn').attr('data-model-id');
      let nodeId = $(document).find('tr.node-price-btn').attr('data-node-id');

      let [data] = privateAIData.filter((item) => {
        if (item.id == modelId) {
          return item;
        }
      });

      let { nodes } = data;
      let [nodeData] = nodes.filter((item) => {
        if (item.id == nodeId) {
          return item;
        }
      });

      let { node, cores, hour, month, year, pricing } = nodeData;
      console.log('nodeData: ', nodeData);
      $(`[name="pricing"][value="${pricing}"]`).prop('checked', true);
      $('.current-price-details').text(`${node} pricing`);
      $('.hourly-cost').text(FC(hour));
      $('.monthly-cost').text(FC(month));
      $('.yearly-cost').text(FC(year));
      $('#price_type_popup').modal('show');
    });
    $('#price_trigger_btn').on('click', function (e) {
      let form = $('#price_type_form');
      let data = SerializeArrToJson(form.serializeArray());
      form.parsley().validate();
      if (form.parsley().isValid()) {
        $('#price_type_form').find('.defalut_selection_error').text('');
        let modelId = $(document)
          .find('tr.node-price-btn')
          .attr('data-model-id');
        let nodeId = $(document).find('tr.node-price-btn').attr('data-node-id');

        privateAIData = privateAIData.map((item) => {
          if (item.id == modelId) {
            let nodes = item.nodes;
            item.nodes = nodes.map((nitem) => {
              if (nitem.id == nodeId) {
                return { ...nitem, pricing: data.pricing };
              } else {
                return nitem;
              }
            });
            return item;
          } else {
            return item;
          }
        });

        console.log('privateAIData', privateAIData);

        $('.default_close_button').trigger('click');
        $('#price_type_form').trigger('reset');
      }
    });

    // launch functionality
    $(document).on('click', '.launch-btn', function (e) {
      e.preventDefault();
      $(document).find('.node-row').removeClass('node-launch-btn');
      $(this).parents('.node-row').addClass('node-launch-btn');
      let modelId = $(document)
        .find('tr.node-launch-btn')
        .attr('data-model-id');
      let nodeId = $(document).find('tr.node-launch-btn').attr('data-node-id');

      let [data] = privateAIData.filter((item) => {
        if (item.id == modelId) {
          return item;
        }
      });

      let { nodes } = data;
      let [nodeData] = nodes.filter((item) => {
        if (item.id == nodeId) {
          return item;
        }
      });

      let { node, cores, hour } = nodeData;
      $('.current-launch-details').text(
        `Now you are launching ${node} with ${cores} cores paying $ ${FC(hour)} per hour.`
      );

      $('#launch_popup').modal('show');
    });
    $('#launch_alert_form').on('submit', function (e) {
      let form = $(this);
      let data = SerializeArrToJson($(this).serializeArray());
      form.parsley().validate();
      if (form.parsley().isValid()) {
        if (data.loginPassword == '12345') {
          $('#launch_alert_form').find('.defalut_selection_error').text('');
          let nodeId = $(document)
            .find('tr.node-launch-btn')
            .attr('data-node-id');
          // launch functionality

          $('.default_close_button').trigger('click');
          $('#launch_alert_form').trigger('reset');
          return false;
        } else {
          $('#launch_alert_form')
            .find('.defalut_selection_error')
            .text('Please enter correct password');
          return false;
        }
      }
    });

    $('.alert_popup_cancel_btn').on('click', function () {
      $('.default_close_button').trigger('click');
      $('#login_alert_form').trigger('reset');
      $('#launch_alert_form').trigger('reset');
    });

    // saving functionality
    $('#save-btn').on('click', function () {
      let form = $('#app_form').parsley();
      let formData = $('#app_form').serializeArray();
      let data = SerializeArrToJson(formData);
      form.validate();

      if (form.isValid()) {
        const { uuid } = data;
        mainData[uuid] = data;
        localStorage.setItem('AWS Item List', JSON.stringify(mainData));
        // window.location.href = 'supplier-view.html?v=' + uvid;
      }
    });

    // Search functionality
    $('#summary-table-list tfoot th').each(function () {
      let title = $('#summary-table-list thead th')
        .eq($(this).index())
        .text()
        .trim();
      if (title != '' && title != 'Action' && title != 'Use for chat') {
        $(this).html(
          '<input type="text" class="filter" placeholder="' + title + '" />'
        );
      }
    });

    var summaryTable = $('#summary-table-list')
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
    tableDetails('summary-table-list');

    // summary table draw functionality
    function drawSummaryTable(data) {
      summaryTable.clear().draw();
      if (data.length > 0) {
        $.each(data, function (k, item) {
          console.log('item: ', item);
          let {
            modelId,
            model,
            nodeType,
            costThisMonth,
            costThisYear,
            status,
            llms,
          } = item;
          let check = status ? 'checked' : '';
          $('#summary-table-list')
            .DataTable()
            .row.add(
              $(`<tr class="summary-row" data-model-id="model${modelId}">
					<td>${llms}</td>
					<td><a href="javascript:void(0)" class="nodeType">${nodeType}</a></td>
					<td>$ ${FC(costThisMonth)}</td>
					<td>$ ${FC(costThisYear)}</td>
					<td width="10%" class="toggle-btn"><div class="toggle-check-box">
					   <div class="button r" id="button-1">
						  <input type="checkbox" name="instance_status" class="checkbox checkbox-input" ${check}/>
						  <div class="knobs"></div>
						  <div class="layer"></div>
					   </div>
					   </div></td>
					   <td width="15%" class="radio-custom-btn"><div class="radio c-radio col-sm-12 m0">
					   <label><input type="radio" class="channel-type" name="useForChat" value="useForChat" data-parsley-multiple="prompt"> <span class="fa fa-circle"></span>  </label>
				   </div></td>
				 </tr>`)
            )
            .draw();
        });
        tableDetails('summary-table-list');
      } else {
      }
    }

    // back to node section
    $(document).on('click', '.nodeType', function () {
      let modelId = $(this).parents('tr.summary-row').attr('data-model-id');

      $('.info-main-tab a').tab('show');

      var targetSection = $('.' + modelId);

      // Check if the target section exists
      if (targetSection.length) {
        $(document).find('.amis-section').removeClass('hidden');
        var offsetTop = targetSection.offset().top;

        // Scroll to the target section
        $('html, body').animate(
          {
            scrollTop: offsetTop - 50,
          },
          1300
        ); // You can adjust the animation duration as needed
      }
    });

    $(document).on('click', '[name="sub_checkbox[]"]', function () {
      $(document).find('.amis-section').remove();

      let rowId = $(this).parents('tr.dataList').attr('data-id');
      let checked = $(this).is(':checked');
      let [data] = privateAIData.filter((item) => {
        if (item.id == rowId) {
          return item;
        }
      });

      let { id, llms, nodes, summary } = data;
      let modelId = id;
      if (checked) {
        $(document).find('[name="sub_checkbox[]"]').prop('checked', false);
        $(this).prop('checked', true);
        // node section functionality
        let rows = '';
        $.each(data.nodes, function (i, item) {
          let { id, node, cores, ram, gpu, gpuCompCabl, hour, month, year } =
            item;
          rows += `<tr data-node-id="${id}" data-model-id="${modelId}" class="node-row">
					<td width="9%" class="checkbox-div sorting_1"> <div class="c-checkbox"> <label> <input type="checkbox" name="node_checkbox[]" class="checkall"> <span class="fa fa-check"></span> </label> </div> </td>
					<td width="15%"> ${node} </td>
					<td> ${cores} </td>
					<td> ${ram} </td>
					<td> ${gpu} </td>
					<td> ${gpuCompCabl} </td>
					<td> ${FC(hour)} </td>
					<td> ${FC(month)} </td>
					<td> ${FC(year)} </td>
					<td> 
						<div class="action-btns">
							<button type="button" class="btn btn-info btn-xs btn-tcenter price-btn"> Price</button>
							<button type="button" class="btn btn-info btn-xs btn-tcenter launch-btn">Launch</button> 
						</div>
					</td>
				</tr>`;
        });

        let html = `<div class="panel panel-default panel-node amis-section model${id}">
			<div class="panel-heading"><h4 class="panel-title">${llms}</h4></div>
					  <div class="panel-body">
					  <div class="row">
					  <div class="col-md-12">
					  <div class="panel panel-default">
					  <div class="panel-body">
						<table id="nodes-list${id}" class="table v-align table-striped table-hover filter-table">
							<thead>
								<tr>
								<th width="9%"> Select </th>
								<th width="15%"> AMIS </th>
								<th> Cores </th>
								<th class="text-uppercase"> RAM </th>
								<th class="text-uppercase"> GPU </th>
								<th> GPU Comp Cabl </th>
								<th> $/Hour </th>
								<th> $/Month </th>
								<th> $/Year </th>
								<th> Action </th>
								</tr>
							</thead>
							<tfoot>
							<tr>
								<th width="9%"> </th>
								<th width="15%"> Node </th>
								<th > Cores </th>
								<th class="text-uppercase"> RAM </th>
								<th class="text-uppercase"> GPU </th>
								<th> GPU Comp Cabl </th>
								<th> $/hour </th>
								<th> $/month </th>
								<th> $/year </th>
								<th> </th>
							</tr>
							</tfoot>
							<tbody>
								${rows}
							</tbody>
						</table>
					  </div>
					  </div>
					  </div>
					  </div>
					  </div>
					  </div>`;
        $('#app_form').append(html);

        // node Search functionality
        $(`#nodes-list${id} tfoot th`).each(function () {
          let title = $(`#nodes-list${id} tfoot th`)
            .eq($(this).index())
            .text()
            .trim();
          if (title != '' && title != 'Action') {
            $(this).html(
              '<input type="text" class="filter" placeholder="' + title + '" />'
            );
          }
        });
        $(`#nodes-list${id}`)
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
        tableDetails(`nodes-list${id}`);

        // summary table functionality
        summaries = summary;
        console.log('summaries: ', summaries);
        drawSummaryTable(summaries);
      } else {
        $(document).find(`.model${id}`).remove();
        summaries = summaries.filter((item) => {
          if (item.modelId != id) {
            return item;
          }
        });
        console.log('summaries: ', summaries);
        drawSummaryTable(summaries);
      }
    });

    // tab functionality
    $('#private-ai-tab').on('click', function () {
      $(document).find('.amis-section').addClass('hidden');
    });

    $('#public-ai-tab').on('click', function () {
      $(document).find('.amis-section').addClass('hidden');
    });

    $('#llms-tab').on('click', function () {
      $(document).find('.amis-section').removeClass('hidden');
    });
  }); // json end
});
