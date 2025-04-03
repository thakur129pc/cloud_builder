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
  let hipaa = `graph TD; DNS["DNS"]; VPC["VPC"]; KM["KMS"]; LB["Load Balancer"];NAT["NAT Gateway"];
	DB["RDS MySQL"];
	S3["S3 Bucket"];
	EC2["App Server"];
	LF["Processing Lambda"];
	CT["CloudTrail"];
	CW["CloudWatch"];
	IAM["IAM Roles"];

	VPC -->|Contains| KM;
	VPC -->|Contains| LB;
	VPC -->|Contains| NAT;

	VPC -->|Contains| DB;
	VPC -->|Contains| S3;

	VPC -->|Contains| EC2;
	VPC -->|Contains| LF;

	LB --> NAT;
	NAT --> EC2;

	DB --> KM;
	S3 --> KM;
	EC2 --> DB;
	EC2 --> IAM;
	LF --> IAM;
	S3 --> IAM;
	DB --> IAM;

	EC2 -->|Sends Data To| LF;

	DNS --> LB;`;

  let SOC2 = ` graph TD;

    subgraph "Restrict AccessA"
        bucketa[S3 Bucket A];
        cloudtraila[AWS CloudTrail];
        cloudwatcha[AWS CloudWatch];
        aws_configa[AWS Config];
    end

    route53[Route 53];

    subgraph "VPC" 
        waf[WAF];
        shield[Shield];
        igw[Internet Gateway];

        subgraph "Availability Zone A"
            acmA[ACM];
            kmsA[KMS];
            natA[NAT Gateway];
            elbA[ELB];
            
            subgraph "Private Subnets"
                ec2privateA[EC2];
            end

            rdsA[RDS];
        end

        subgraph "Availability Zone B (redundant)"
            kmsB[KMS];
            acmB[ACM];
            natB[NAT Gateway];
            elbB[ELB];

            subgraph "Private Subnets"
                ec2privateB[EC2];
            end

            rdsB[RDS Standby];
        end
    end

    subgraph "Restrict AccessB"
        bucketb[S3 Bucket B];
        cloudtrailb[AWS CloudTrail];
        cloudwatchb[AWS CloudWatch];
        aws_configb[AWS Config];
    end

    route53 --> waf;
    waf --> shield;
    shield --> igw;
   
    elbA --> ec2privateA;
    elbB --> ec2privateB;
    natA --> ec2privateA;
    natB --> ec2privateB;
    ec2privateA --> rdsA;
    ec2privateB --> rdsB;
    ec2privateA --> bucketa;
    ec2privateB --> bucketb;
    
    cloudtraila --> bucketa;
    cloudtrailb --> bucketb;
    cloudwatcha --> bucketa;
    cloudwatchb --> bucketb;
    aws_configa --> bucketa;
    aws_configb --> bucketb;
    acmA --> elbA;
    acmB --> elbB;`;

  let IS270001 = `graph TD;

dns[Route 53];

subgraph "VPC"
	lb[Load Balancer];
	nat[NAT Gateway];
	waf[Web Application Firewall];
	shield[DDoS Protection];
	bastion[Bastion Host];
	
	subgraph "Public Subnet"
		waf -.-> shield;
		shield -.-> bastion;
		bastion -.-> web_server;
		lb -.-> waf;
		nat -.-> web_server;
	end

	subgraph "Private Subnet"
		web_server[Web Server];
		db_master[Master DB];
		db_slave[Slave DB];
	end

	subgraph "Security Services"
		kms[KMS];
		logs[Log Storage];
		cloudtrail[AWS CloudTrail];
		cloudwatch[AWS CloudWatch];
		aws_config[AWS Config];
	end
end`;

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
      var myWizard;
      // create new wizard
      setTimeout(function () {
        myWizard = new Wizard($('#myWizard'));
        $('[data-choice="true"]').css('display', 'none');
      }, 900);

      // console.log("modelPara: ", modelPara);
      // console.log("InfraData: ", InfraData);

      // let url = window.location.href;
      // if (url.indexOf('e=') !== -1) {
      // 	let params = new URLSearchParams(window.location.search);
      // 	let uniqueId = params.get('e');
      // 	// goto specified step
      // 	myWizard.step(uniqueId);
      // 	console.log("uniqueId: ", uniqueId);
      // }

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

      // Add event listener for opening and closing details
      $('#InfraDataList tbody').on('click', 'td.details-control', function () {
        $(this).find('.fa-plus-circle').toggle();
        $(this).find('.fa-minus-circle').toggle();
        var tr = $(this).closest('tr');
        let id = tr.attr('data-id');
        let [data] = InfraData.filter((item) => {
          if (item.id == id) {
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
          row.child(format(data)).show();
          tr.addClass('shown');
        }
      });

      /* Formatting function for row details - modify as you need */
      function format(d) {
        let { inferences } = d;
        let tr = '';
        $.each(inferences, (i, item) => {
          tr += `<tr data-id="${item.id}" class="sub-table">
				<td width="7%" class="checkbox-div"><div class="c-checkbox"> <label> <input type="checkbox" name="inf_checkbox[]" class="checkall"> <span class="fa fa-check"></span> </label> </div></td>
				<td style="text-align:center;">${item.quantization}</td>
				<td style="text-transform: none;">${item.method}</td>
				<td>${item.perplexity}</td>
				<td>${item.tps}</td>
				<td>${item.throughput}</td>
				<td width="19%">${item.latency}</td>
				</tr>`;
        });

        return `<table border="0" class="data-child-row sub-table-main" >
			<thead>
				<tr>
					<th width="7%" class="checkbox-div" style="text-align:center;"><div class="c-checkbox" style="text-align:center;"> <label> <input type="checkbox" name="main_inf_checkbox[]" class="checkall"> <span class="fa fa-check"></span> </label> </div></th>
					<th>#quantization</th>
					<th>Inference Method</th>
					<th>Perplexity</th>
					<th>TPS (A100)</th>
					<th>Throughput (A100)</th>
					<th width="19%" >Latency <span style="text-transform:lowercase;">(ms)</span></th>
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
        if (status) {
          $(this)
            .parents('.sub-table-main')
            .find('input[type="checkbox"]')
            .prop('checked', true);
        } else {
          $(this)
            .parents('.sub-table-main')
            .find('input[type="checkbox"]')
            .prop('checked', false);
        }
      });

      // view model list
      $(document).on('click', '.model-view', function () {
        let id = $(this).parents('tr.dataList').attr('data-id');
        $('[name="view_mode"]').val(id);

        let [data] = InfraData.filter((item) => {
          if (item.id == id) {
            return item;
          }
        });

        $('#ModelDataList').DataTable().clear().draw();

        let { inferences, model_name } = data;
        // console.log("data: ", data);
        let tr = '';
        $.each(inferences, (i, item) => {
          let { id, method, quantization, ttft, tpot, latency, throughput } =
            item;
          console.log('item: ', item);
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
        });

        $('.screen-title').text(model_name);

        tableDetails('ModelDataList');
        // goto specified step
        myWizard.step(9);
      });

      $('#back-model1').on('click', function () {
        // goto specified step
        myWizard.step(2);
      });

      // validate model selection to view machine types
      $('#model-validate').on('click', function () {
        let value = $('[name="model_select"]').val();
        if (value != '' && value) {
          let modelsArr = value.split(',');

          if (modelsArr.length > 0) {
            if (modelsArr != undefined) {
              // $('#NodesList').DataTable().clear().draw();
              $('#selected-models-wrapper').html('');
              let html = '';
              let modelId = '';
              $.each(modelsArr, function (i, option) {
                let [CurrentModel] = InfraData.filter((item, i) => {
                  if (item.id == option) {
                    return item;
                  }
                });
                let rows = '';
                let modelName = CurrentModel.model_name;

                modelId = modelName.replace(/[ .]/g, '').toLowerCase();
                console.log('modelId: ', modelId);

                // inferences
                $.each(CurrentModel.inferences, function (i, elem) {
                  let {
                    id,
                    machineType,
                    gpu,
                    gpuMemory,
                    CPU,
                    tps,
                    memory,
                    hour_cost,
                  } = elem;
                  rows += `<tr data-id="${id}" class="machineList"> 
									<td width="7%" class="checkbox-div"> <div class="c-checkbox"> <label> <input type="checkbox" name="sub_checkbox[]" class="checkall"> <span class="fa fa-check"></span> </label> </div> </td>
									<td class="" width="25%"><a class=""> ${machineType} </a></td> 
									<td width="15%"> ${hour_cost} </td> 
									<td> ${gpu} </td> 
									<td width="15%"> ${gpuMemory} </td> 
									<td> ${CPU} </td> 
									<td>${memory}</td>
									<td>${tps}</td>
									</tr>`;
                });

                html = `<div class="model-inner" data-id="${modelId}" data-table-name="${modelId}"><h4 class="title">${modelName}</h4><div class="table-main-div"><table class="table table-striped table-hover pb" id="${modelId}" cellspacing="0" width="100%"><thead><tr><th width="7%"></th><th width="25%">Machine type</th><th width="15%">
								<select name="cost_selection" class="form-control">
								<option value="Hourly" seleced >Hourly</option>
								<option value="Monthly">Monthly</option>
								</select>
								</th><th> GPUs </th><th> GPU memory (GiB) </th><th> vCPUs </th><th> Memory (GiB) </th><th> TPS </th></tr></thead><tbody>${rows}</tbody></table></div></div>`;

                $('#selected-models-wrapper').append(html);
                $('#' + modelId).DataTable({
                  iDisplayLength: 50,
                  order: [[1, 'asc']],
                  columnDefs: [
                    { targets: [0, 2], orderable: false }, // First column (index 0) will not be sortable
                  ],
                });
                tableDetails(modelId);
                $(document)
                  .find('.dataTables_filter')
                  .children('label')
                  .children('input')
                  .attr('placeholder', 'Filter');
              });
            }
            // goto specified step
            myWizard.step(3);
          }
        } else {
          $.notification(['Please select model'], {
            position: ['top', 'right'],
            timeView: 4000,
            messageType: 'error',
          });
        }
      });

      // machine selection save
      let machineSelect = [];
      $(document).on(
        'click',
        '#NodesList [name="sub_checkbox[]"]',
        function () {
          let checked = $(this).is(':checked');
          let modelId = $(this).parents('tr.machineList').attr('data-id');
          if (checked) {
            machineSelect.push(modelId);
            $('[name="machineSelect"]').val(machineSelect.join(','));
          } else {
            machineSelect = machineSelect.filter((item, i) => {
              if (item != modelId) {
                return item;
              }
            });
            if (machineSelect.length > 0) {
              $('[name="machineSelect"]').val(machineSelect.join(','));
            } else {
              $('[name="machineSelect"]').val('');
            }
          }
        }
      );

      let modelCompareList = [];
      $(document).on(
        'click',
        '#InfraDataList [name="sub_checkbox[]"]',
        function () {
          let checked = $(this).is(':checked');
          let modelId = $(this).parents('tr.dataList').attr('data-id');
          if (checked) {
            // $(document).find('[name="sub_checkbox[]"]').prop('checked', false);
            // $(this).prop('checked', true);
            modelCompareList.push(modelId);
            $('[name="model_select"]').val(modelCompareList.join(','));
          } else {
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

                $('[name="modelsCompare"]')
                  .find('option[value="' + CurrentModel.model_name + '"]')
                  .attr('selected', true);
              });
              $('#compare-table1 > tbody').html(compareTable);
              $('[name="modelsCompare"]').trigger('chosen:updated');
            }

            // goto specified step
            myWizard.step(10);
          } else {
            // $('.error-compare').text('Please select  models.');
            $.notification(['Please select model'], {
              position: ['top', 'right'],
              timeView: 4000,
              messageType: 'error',
            });
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

      // get details on multiple selection
      $('[name="modelsCompare"]').on('change', function () {
        let names = $(this).val();
        let modelsArr = [];
        $.each(names, function (i, item) {
          console.log('item: ', item);
          let id = $('[name="modelsCompare"]')
            .find('option[value="' + item + '"]')
            .attr('data-id');
          modelsArr.push(id);
        });
        if (modelsArr.length > 0) {
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

              $('[name="modelsCompare"]')
                .find('option[value="' + CurrentModel.model_name + '"]')
                .attr('selected', true);
            });
            $('#compare-table1 > tbody').html(compareTable);
            $('[name="modelsCompare"]').trigger('chosen:updated');
          }

          // goto specified step
          // myWizard.step(10);
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
        // goto specified step
        myWizard.step(2);
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
          // localStorage.setItem('AWS Item List', JSON.stringify(mainData));
          // window.location.href = 'supplier-view.html?v=' + uvid;
        }
      });

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

      // redirect
      $('#relaunch').on('click', function () {
        // Get the modal
        var modal = $('#myModal');

        modal.css('display', 'block');

        // let form = $("#app_form").parsley();
        // let formData = $("#app_form").serializeArray();
        // let data = SerializeArrToJson(formData);
        // form.validate();

        // if (form.isValid()) {
        // 	let route = 'infrastructure-dashboard.html';
        // 	window.location.href = `${route}`;
        // }

        setTimeout(function () {
          // modal.css("display", "none");
          // Redirect to another page
          window.location.href = 'infrastructure-dashboard.html';
        }, 5000);
      });

      // card click functionality
      $(document).on('click', '.card-wrapper:not(.selected)', function (e) {
        e.stopPropagation();
        let type = $(this).attr('data-type');
        let value = $(this).attr('data-value');

        $(`[data-type="${type}"]`).removeClass('selected');
        $(`[name="${type}"]`).prop('checked', false);
        $(this).find(`[name="${type}"]`).prop('checked', true);
        $(this).addClass('selected');

        if (type == 'text') {
          $(`[name="llm_${type}"]`).val(value);
        }

        if (type == 'media') {
          $(`[name="llm_${type}"]`).val(value);
        }

        if (type == 'aitoolkit') {
          $(document)
            .find('.card-checkbox')
            .find('[type="checkbox"]')
            .prop('checked', false);
          $('[name="llm_aitoolkit"]').val(value);
        }

        if (type == 'cert_level') {
          $(`[name="llm_cert_level"]`).val(value);
        }

        if (type == 'destination') {
          $(`[name="llm_destination"]`).val(value);
        }
      });

      $('.card-checkbox label').on('click', function (event) {
        console.log('crd');
        $(`[data-type="aitoolkit"]`).removeClass('selected');
        $(this).parents(`[data-type="aitoolkit"]`).addClass('selected');
        $(this)
          .parents('.card-wrapper')
          .find('[name="aitoolkit"]')
          .prop('checked', true);
        $('.ai-check-outer .card-wrapper:not(.selected)')
          .find('input[type="checkbox"]')
          .prop('checked', false);
        let value = $(this)
          .parents(`[data-type="aitoolkit"]`)
          .attr('data-value');
        $('[name="aitoolkit"]').val(value);
        event.stopPropagation();
      });

      $(document).on('click', '.selected', function (e) {
        e.stopPropagation();
        console.log('sel');
        let type = $(this).attr('data-type');
        // $(`[data-type="${type}"]`).removeClass('selected');
        $(this).removeClass('selected');
        $(`[name="${type}"]`).prop('checked', false);
        $(`[type="hidden"][name="llm_${type}"]`).val('');
      });

      $('.custom-grid-select label').on('click', function (event) {
        event.stopImmediatePropagation();
        let status = $(this).find('.custom-radio-select').is(':checked');
        console.log(status);
        let type = $(this).parents('.card-wrapper').attr('data-type');
        let value = $(this).parents('.card-wrapper').attr('data-value');
        console.log(type);
        console.log(value);
        if (status) {
          $(`[name="${type}"]`).prop('checked', false);
          $(this).find(`[name="${type}"]`).prop('checked', true);
          $(`[data-type="${type}"]`).removeClass('selected');
          $(this).parents('.card-wrapper').addClass('selected');

          if (type == 'cert_level') {
            $(`[name="llm_cert_level"]`).val(value);
          }

          if (type == 'destination') {
            $(`[name="llm_destination"]`).val(value);
          }
        } else {
          $(`[name="${type}"]`).prop('checked', false);
          $(this).parents('.card-wrapper').removeClass('selected');
          $(`[type="hidden"][name="llm_${type}"]`).val('');
        }
      });

      // projected cost table
      var cost = $('#cost-table-list').DataTable({
        iDisplayLength: 50, // Set the default number of rows to display
      });
      tableDetails('cost-table-list');

      // parameter details
      $(document).on('click', '.para-desc', function () {
        let id = $(this).attr('data-id');
        let text = $(this).text().trim();
        let desc = modelPara[id];
        $('.modelParameterDescription').text(desc);
        $('.current-param-details').text(text);
        $('#model_desc_popup').modal('show');
        console.log('id: ', id);
      });

      $('.dismiss_btn').on('click', function () {
        $('.default_close_button').trigger('click');
      });

      $('#vpc').DataTable({
        paging: false, // Disable pagination
        ordering: false, // Disable sorting on all columns
        searching: false, // Disable searching
        info: false, // Disable information display
      });

      $('#networking').DataTable({
        paging: false, // Disable pagination
        ordering: false, // Disable sorting on all columns
        searching: false, // Disable searching
        info: false, // Disable information display
      });

      $('#security').DataTable({
        paging: false, // Disable pagination
        ordering: false, // Disable sorting on all columns
        searching: false, // Disable searching
        info: false, // Disable information display
      });

      $('#server').DataTable({
        paging: false, // Disable pagination
        ordering: false, // Disable sorting on all columns
        searching: false, // Disable searching
        info: false, // Disable information display
      });

      $('#core').DataTable({
        paging: false, // Disable pagination
        ordering: false, // Disable sorting on all columns
        searching: false, // Disable searching
        info: false, // Disable information display
      });

      $('#vector').DataTable({
        paging: false, // Disable pagination
        ordering: false, // Disable sorting on all columns
        searching: false, // Disable searching
        info: false, // Disable information display
      });

      $(document)
        .find('.dataTables_filter')
        .children('label')
        .children('input')
        .attr('placeholder', 'Filter');

      // $('[data-action="jump"]').on('click', function(){
      // 	let screenId = $(this).attr('data-id');
      // 	$('[data-type="wizard"]').css('display', 'none');
      // 	$(`[data-screen="${screenId}"]`).css('display', 'block');
      // });

      // setTimeout(function(){
      // 	$('[data-type="wizard"]').css('display', 'none');
      // 	$('[data-init="screen"]').css('display', 'block');
      // }, 500);

      $('[data-action="certification"]').on('click', function () {
        let certificate = $(`[type="hidden"][name="llm_cert_level"]`).val();
        let destination = $(`[type="hidden"][name="llm_destination"]`).val();

        console.log(certificate);
        console.log(destination);
        if (certificate != '' && destination != '') {
          $('.choosen-level').html(certificate);
          $('[data-choice="true"]').css('display', 'none');
          $(`[data-mermaid-id="${certificate}"]`).css('display', 'block');
          myWizard.step(2);
        } else {
          $.notification(['Please Certification level and Destination'], {
            position: ['top', 'right'],
            timeView: 3000,
            messageType: 'error',
          });
        }
      });
    }); // json end
  });
});
