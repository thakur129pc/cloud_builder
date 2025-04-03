$(document).ready(function () {
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
      console.log('currentVersion', currentVersion);
    } else {
      console.log('currentVersion', currentVersion);
    }
  }

  // custom functions
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
      $('.dataTables_filter').show();
      $('#' + selector + '_info').show();
      $('#' + selector + '_paginate').show();
    }
  }

  // Search functionality
  $('#role_lists tfoot th').each(function () {
    let title = $('#role_lists thead th').eq($(this).index()).text().trim();
    if (title != '' && title && title != 'Action') {
      $(this).html(
        '<input type="text" class="filter" placeholder="' + title + '" />'
      );
    }
  });
  var table = $('#role_lists')
    .DataTable({
      iDisplayLength: 25, // Set the default number of rows to display
      language: {
        info: 'Showing _START_ to _END_ of _TOTAL_ roles',
      },
    })
    .columns()
    .every(function () {
      var that = this;

      $('input', this.footer()).on('keyup change', function () {
        that.search(this.value).draw();
      });
    });
  tableDetails('role_lists');

  $.getJSON('data/database-details.json', function (data) {
    let initialData = data;

    if (localStorage.getItem('Link Data') === null) {
      localStorage.setItem('Link Data', JSON.stringify(initialData));
    } else {
      let data = {
        ...initialData,
        ...JSON.parse(localStorage.getItem('Link Data')),
      };
      localStorage.setItem('Link Data', JSON.stringify(data));
    }
  });

  $.getJSON('data/roles-list.json', function (json) {
    let roleListData = json;
    $.getJSON('data/user-list.json', function (userJson) {
      let userData = userJson;
      if (localStorage.getItem('user_list') !== null) {
        userData = {
          ...userData,
          ...JSON.parse(localStorage.getItem('user_list')),
        };
      } else {
        localStorage.setItem('user_list', JSON.stringify(userData));
      }

      if (localStorage.getItem('role list') === null) {
        localStorage.setItem('role list', JSON.stringify(roleListData));
      } else {
        localStorage.setItem(
          'role list',
          JSON.stringify({
            ...roleListData,
            ...JSON.parse(localStorage.getItem('role list')),
          })
        );
      }

      if (localStorage.getItem('role list') !== null) {
        let role_lists = JSON.parse(localStorage.getItem('role list'));

        if (!jQuery.isEmptyObject(role_lists)) {
          $.each(role_lists, function (i, item) {
            let {
              userId,
              name,
              email_address,
              role,
              status,
              role_description,
              accessData,
            } = item;
            let x = '';
            if (status == 'Active') {
              x = 'Active';
            } else {
              x = 'Inactive';
            }
            let subSchema = '';
            $.each(accessData, function (key, value) {
              if (value.access == true) {
                subSchema += value.sub_schema + ', ';
              }
            });

            $('#role_lists')
              .DataTable()
              .row.add(
                $(
                  `<tr data-id="${userId}"> <td><a href="role-view.html?v=${userId}">${role}</a></td><td>${role_description}</td> <td>${subSchema.trim().slice(0, -1)}</td> <td>${x}</td> </tr>`
                )
              )
              .draw();
            tableDetails('role_lists');
          });
        }
      }
    });
  });

  $(document).on('click', '.remove__row', function () {
    $('#alert_popup').modal('show');
    $('tr').removeClass('activeRow');
    $(this).parents('tr[role="row"]').addClass('activeRow');
  });

  $(document).on('click', '#alert_popup_cancel_btn', function () {
    $('.default_close_button').trigger('click');
  });

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
        if (n.value != '') {
          jsonObj[n.name] = n.value;
        }
      }
    });
    return jsonObj;
  }

  // delete row
  $('#alert_popup_btn').on('click', function () {
    let form = $('[name="verify_password_form"]');
    form.parsley().validate();
    let data = SerializeArrToJson(form.serializeArray());

    if (form.parsley().isValid()) {
      let role_lists = JSON.parse(localStorage.getItem('role list'));
      let id = $('tr.activeRow').attr('data-id');
      if (data.loginPassword == '12345') {
        delete role_lists[id];
        $('#role_lists')
          .DataTable()
          .row($('tr.activeRow'))
          .remove()
          .draw(false);
        form.trigger('reset');
        $('tr').removeClass('activeRow');
        localStorage.setItem('role list', JSON.stringify(role_lists));
        $('#alert_popup').modal('hide');
      }
    }
  });
});
