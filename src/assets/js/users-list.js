//Wait for window load
$(window).load(function () {
  // Animate loader off screen
  $('.pre-loader').fadeOut('slow');
});

// init mask
$('[data-masked]').inputmask();

function onlyAlphabets(e, t) {
  try {
    if (window.event) {
      var charCode = window.event.keyCode;
    } else if (e) {
      var charCode = e.which;
    } else {
      return true;
    }
    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123))
      return true;
    else return false;
  } catch (err) {
    console.log(err.Description);
  }
}

jQuery(document).ready(function () {
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

  $.getJSON('data/roles-list.json', function (json) {
    let roleListData = json;
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
  });

  $.getJSON('data/default-roles.json', function (rolesData) {
    let roles_list = rolesData;

    if (localStorage.getItem('role list') !== null) {
      let roles = JSON.parse(localStorage.getItem('role list'));
      $.each(roles, function (i, item) {
        if (!roles_list.includes(item.role)) {
          roles_list.push(item.role);
        }
      });
    }

    let option = '<option value="">Select Role</option>';
    if (roles_list.length > 0) {
      $.each(roles_list, function (i, item) {
        option += `<option value="${item}">${item}</option>`;
      });
    }
    $('[name="role"]').append(option);
    $('.chosen-select').trigger('chosen:updated');

    $.getJSON('data/user-list.json', function (userList) {
      // Extend the DataTable's default search functionality

      // global variables
      let mainData = userList;

      if (localStorage.getItem('user_list') !== null) {
        mainData = JSON.parse(localStorage.getItem('user_list'));
      } else {
        localStorage.setItem('user_list', JSON.stringify(mainData));
      }

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
          $('#' + selector + '_paginate').show();
        }
      }

      // random number generator
      function randomString() {
        //generate random number
        var randomNumber = Math.floor(100 + Math.random() * 100);
        return randomNumber;
      }
      $('#userId').val(randomString());

      $('#user-list tfoot th').each(function () {
        let title = $(this).text().trim();
        if (title != '') {
          $(this).html(
            '<input type="text" class="filter" placeholder="' + title + '" />'
          );
        }
      });

      // Search functionality
      $('#table-list tfoot th').each(function () {
        let title = $('#table-list thead th').eq($(this).index()).text().trim();
        if (title != '' && title) {
          $(this).html(
            '<input type="text" class="filter" placeholder="' + title + '" />'
          );
        }
      });
      var table = $('#user-list')
        .DataTable({
          iDisplayLength: 25, // Set the default number of rows to display
          language: {
            info: 'Showing _START_ to _END_ of _TOTAL_ user',
          },
        })
        .columns()
        .every(function () {
          var that = this;

          $('input', this.footer()).on('keyup change', function () {
            that.search(this.value).draw();
          });
        });
      tableDetails('user-list');

      // initial data
      if (!jQuery.isEmptyObject(mainData)) {
        $.each(mainData, function (key, data) {
          const {
            first_name,
            last_name,
            user_email,
            userId,
            createdDate,
            role,
          } = data;
          let html = `<tr data-id="${userId}"> <td width="9%"><a href="users-view.html?v=${userId}"> ${userId} </a> </td> <td>${first_name}</td> <td>${last_name}</td> <td>${user_email}</td> <td>${role.join(', ')}</td> <td>${createdDate.replaceAll('/', '-')}</td></tr>`;
          $('#user-list').DataTable().row.add($(html)).draw();
        });
        tableDetails('user-list');
      }

      //Column Search
      table
        .columns()
        .eq(0)
        .each(function (colIdx) {
          $('input', table.column(colIdx).footer()).on(
            'keyup change',
            function () {
              table.column(colIdx).search(this.value).draw();
            }
          );
        });
    });
  });
});
