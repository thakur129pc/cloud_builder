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

//JS DOCUMENT
$(document).ready(function () {
  $.getJSON('data/machine-type.json', function (machineType) {
    console.log('machineType: ', machineType);

    function FC(amount) {
      // Check if the input is a valid number
      if (isNaN(amount)) {
        return '-';
      }

      // Use toFixed(2) to ensure the number has two decimal places
      const formattedAmount = parseFloat(amount).toFixed(2);

      // Use Intl.NumberFormat to format the number as currency
      const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      });

      return (
        '$ ' + currencyFormatter.format(formattedAmount).replace(/\$/g, '')
      );
    }

    // $('#machine-types').DataTable({
    // 	'paging': false,  // Table pagination
    // 	'info': false,  // Bottom left status text
    // });
    let row = '';
    $.each(machineType, function (key, item) {
      let {
        id,
        machineType,
        cores,
        ram,
        gpu,
        gpu_qty,
        gpuparameters,
        gpuType,
        hourly_spot_price,
        hour_cost,
        month_cost,
        year_cost,
        os,
        osVersion,
      } = item;

      row += `<tr data-id="${id}" class="macList r${id}">
			<td class="model-name freeze-columns" width="20%"> <a>${machineType} </a></td> 
			<td width="9%"> ${cores} </td> 
			<td width="7%"> ${ram} </td> 
			<td>${gpu}</td>
			<td width="7%">${gpu_qty}</td>
			<td width="10%">${gpuparameters}</td>
			<td width="9%">${gpuType}</td>
			<td width="12%"> ${FC(hourly_spot_price)}</td>
			<td width="9%"> ${FC(hour_cost)}</td>
			<td width="10%"> ${FC(month_cost)}</td>
			<td width="10%"> ${FC(year_cost)}</td>
			<td width="10%" class="os">${os}</td>
			<td width="10%">${osVersion}</td>
			</tr>`;
    });
    $('#machine-types tbody').html(row);
  });
});
