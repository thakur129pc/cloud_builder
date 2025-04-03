$(document).ready(function () {
  // Setup - add a text input to each footer cell
  $('#cutomerNameTable tfoot th').each(function () {
    var title = $('#cutomerNameTable thead th, #productIdlist thead th')
      .eq($(this).index())
      .text();
    $(this).html('<input type="text" placeholder="Filter ' + title + '" />');
  });

  $('#cutomerNameTable tbody').delegate('tr', 'click', function () {
    var customer_name = $('#customer-name-list').val();
    if (customer_name == '') {
      var firstCellText = $('td:eq(3)', this).text();
    } else {
      var firstCellText = ', ' + $('td:eq(3)', this).text();
    }

    $('body').on('click', '.btn.btn-primary', function (e) {
      $('#selectCustomer').modal('hide');
      $('#customer-name-list')[0].value += firstCellText;
      firstCellText = '';
    });
  });

  $('#productIdlist tfoot th').each(function () {
    var title = $('#cutomerNameTable thead th, #productIdlist thead th')
      .eq($(this).index())
      .text();
    $(this).html('<input type="text" placeholder="Filter ' + title + '" />');
  });

  $('#ProductNameList tfoot th').each(function () {
    var title = $('#ProductNameList thead th, #productIdlist thead th')
      .eq($(this).index())
      .text();
    $(this).html('<input type="text" placeholder="Filter ' + title + '" />');
  });

  // DataTable
  var table = $(
    '#cutomerNameTable, #productIdlist, #ProductNameList'
  ).DataTable();

  // Apply the search
  table.columns().every(function () {
    var that = this;

    $('input', this.footer()).on('keyup change', function () {
      that.search(this.value).draw();
    });
  });
});
