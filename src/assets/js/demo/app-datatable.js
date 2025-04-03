$(document).ready(function () {
  // Setup - add a text input to each footer cell
  $('#cutomerNameTable tfoot th').each(function () {
    var title = $('#cutomerNameTable thead th, #productIdlist thead th')
      .eq($(this).index())
      .text();
    $(this).html('<input type="text" placeholder="Filter ' + title + '" />');
  });

  $('#cutomerNameTable tbody').delegate('tr', 'click', function () {
    var firstCellText = $('td:eq(2)', this).text();

    $('body').on('click', '.btn.btn-primary', function (e) {
      alert(firstCellText);
      $('#customer_name').val(firstCellText);
      $('#selectCustomer').modal('hide');
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
