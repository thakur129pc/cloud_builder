$(document).ready(function () {
  $.getJSON('data/database-details.json', function (subSchema) {
    $.getJSON('data/user-list.json', function (userJson) {
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

      let userData = userJson;
      if (localStorage.getItem('user_list') !== null) {
        userData = {
          ...userData,
          ...JSON.parse(localStorage.getItem('user_list')),
        };
      } else {
        localStorage.setItem('user_list', JSON.stringify(userData));
      }
      // table data
      let tableData = {};
      if (localStorage.getItem('Link Data') !== null) {
        subSchema = {
          ...subSchema,
          ...JSON.parse(localStorage.getItem('Link Data')),
        };
      }
      $.each(subSchema, function (key, value) {
        let id = value.uniqueId;
        let dbName = value.dbName;
        let dbNickname = value.dbNickname;
        $.each(value.sub_schemas, function (k, item) {
          let uid = item.replace(/\s+/g, '') + '_' + id;
          tableData[uid] = {
            id,
            uid,
            dbName,
            dbNickname,
            sub_schema: item,
            access: false,
          };
        });
      });

      function tableCheckStatus() {
        $.each(tableData, function (i, item) {
          let { dbName, sub_schema, access, uid, dbNickname, id } = item;
          $('#database_list')
            .DataTable()
            .row.add(
              $(
                `<tr data-sub-schema-id="${uid}" class="database-row"><td><a href="database-view.html?v=${id}"> ${dbName}</a></td><td width="25%">${dbNickname}</td><td width="25%"><a href="subschema-view.html?v=${id}&d=${sub_schema}">${sub_schema}</a></td><td width="10%"><div class="c-checkbox"> <label> <input type="checkbox" class="checkbox" name="sub_schema_select[]" ${access ? 'checked' : ''}> <span class="fa fa-check"></span> </label> </div></td></tr>`
              )
            )
            .draw();
        });
      }

      let mainData = {};

      if (localStorage.getItem('role list') !== null) {
        mainData = JSON.parse(localStorage.getItem('role list'));
      }

      // For todays date;
      Date.prototype.today = function () {
        return (
          (this.getMonth() + 1 < 10 ? '0' : '') +
          (this.getMonth() + 1) +
          '/' +
          (this.getDate() < 10 ? '0' : '') +
          this.getDate() +
          '/' +
          this.getFullYear()
        );
      };

      // For the time now
      Date.prototype.timeNow = function () {
        return this.toLocaleString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        });
      };

      // random number generator
      function randomString() {
        //generate random number
        var randomNumber = Math.floor(100000 + Math.random() * 100000);
        return randomNumber;
      }

      $(document)
        .find('[name="userId"]')
        .each(function () {
          $(this).val(randomString());
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

      // custom functions
      function tableDetails(selector) {
        let count = $('#' + selector)
          .DataTable()
          .column(0)
          .data().length;
        if (count > 10) {
          $('#' + selector + '_length').show();
          $('#' + selector + '_filter').show();
          $('#' + selector + '_info').show();
          $('#' + selector + '_paginate').show();
        } else {
          $('#' + selector + '_length').hide();
          $('#' + selector + '_filter').hide();
          $('#' + selector + '_info').hide();
          $('#' + selector + '_paginate').hide();
        }
      }

      // cookies functions
      function setCookie(key, value, expiry) {
        var expires = new Date();
        expires.setTime(expires.getTime() + expiry * 24 * 60 * 60 * 1000);
        document.cookie =
          key + '=' + value + ';expires=' + expires.toUTCString() + ';path=/';
      }

      function getCookie(key) {
        var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
        return keyValue ? keyValue[2] : null;
      }

      function eraseCookie(key) {
        var keyValue = getCookie(key);
        setCookie(key, keyValue, '-1');
      }

      // page table && Search functionality
      $('#database_list tfoot th').each(function () {
        let title = $('#database_list thead th')
          .eq($(this).index())
          .text()
          .trim();
        if (title != '' && title && title != 'AI access') {
          $(this).html(
            '<input type="text" class="filter" placeholder="' + title + '" />'
          );
        }
      });
      var table = $('#database_list')
        .DataTable({
          iDisplayLength: 25, // Set the default number of rows to display
          language: {
            info: 'Showing _START_ to _END_ of _TOTAL_ subschema',
          },
        })
        .columns()
        .every(function () {
          var that = this;

          $('input', this.footer()).on('keyup change', function () {
            that.search(this.value).draw();
          });
        });

      $.each(tableData, function (i, item) {
        let { dbName, sub_schema, access, uid, dbNickname, id } = item;
        $('#database_list')
          .DataTable()
          .row.add(
            $(
              `<tr data-sub-schema-id="${uid}" class="database-row"><td><a href="database-view.html?v=${id}"> ${dbName}</a></td><td width="25%">${dbNickname}</td><td width="25%"><a href="subschema-view.html?v=${id}&d=${sub_schema}">${sub_schema}</a></td><td width="10%"><div class="c-checkbox"> <label> <input type="checkbox" class="checkbox" name="sub_schema_select[]" ${access ? 'checked' : ''}> <span class="fa fa-check"></span> </label> </div></td></tr>`
            )
          )
          .draw();
      });
      tableDetails('database_list');

      // user table
      $('#user_list tfoot th').each(function () {
        let title = $('#user_list thead th').eq($(this).index()).text().trim();
        if (title != '' && title && title != 'AI access') {
          $(this).html(
            '<input type="text" class="filter" placeholder="' + title + '" />'
          );
        }
      });
      var user_table = $('#user_list')
        .DataTable({
          iDisplayLength: 25, // Set the default number of rows to display
          language: {
            info: 'Showing _START_ to _END_ of _TOTAL_ users',
          },
        })
        .columns()
        .every(function () {
          var that = this;

          $('input', this.footer()).on('keyup change', function () {
            that.search(this.value).draw();
          });
        });
      $.each(userData, function (i, item) {
        let {
          userId,
          first_name,
          last_name,
          phone_number,
          role,
          user_email,
          tel_country_code,
        } = item;
        let phoneCode = '';
        switch (tel_country_code) {
          case 'us':
            phoneCode = '+1';
            break;
          case 'in':
            phoneCode = '+91';
            break;
        }
        $('#user_list')
          .DataTable()
          .row.add(
            $(
              `<tr> <td width="25%"><a href="users-view.html?v=${userId}">${first_name} ${last_name}</a></td> <td width="25%">${role}</td>  <td width="25%">${user_email}</td> <td width="25%">${phoneCode} ${phone_number}</td></tr>`
            )
          )
          .draw();
      });
      tableDetails('user_list');

      $(document).on('click', '#alert_popup_cancel_btn', function () {
        $('.default_close_button').trigger('click');
      });

      // checkbox data store
      $(document).on('change', '.access-checkbox', function () {
        let form = $(this).closest('form.table-form');
        let id = $(this).closest('form.table-form').attr('data-sub-schema-id');
        let list = form.find('[name="list"]').is(':checked');
        let create = form.find('[name="create"]').is(':checked');
        let view = form.find('[name="view"]').is(':checked');
        let edit = form.find('[name="edit"]').is(':checked');
        let data = tableData[id];
        tableData[id] = { ...data, list, create, view, edit };
      });

      // saving functionality
      $('.save_screen').on('click', function () {
        let form = $('[name="role_details_form"]');
        form.parsley().validate();
        let data = SerializeArrToJson(form.serializeArray());

        if (form.parsley().isValid()) {
          let userId = data['userId'];
          data['accessData'] = tableData;
          data['status'] = 'Active';
          mainData[userId] = data;
          localStorage.setItem('role list', JSON.stringify(mainData));
          window.location.href = `role-view.html?v=${userId}`;
        }
      });

      // tab functionality
      $('#role_create__link').click(function () {
        $('.role_create_otr, .users_data_outer').removeClass('active');
        $(this).parent('li').addClass('active');
        $('.main_tab').show();
        $('.secondTab').hide();
      });

      $('#role_details__link').click(function () {
        $('.role_create_otr, .users_data_outer').removeClass('active');
        $(this).parent('li').addClass('active');
        $('.secondTab').show();
        $('.main_tab').hide();
      });

      // page table access checkboxes functionality
      $('[name="main_checkbox"]').on('click', function () {
        let value = $(this).is(':checked');
        $('#main_checkbox').val(value);
        $.each(tableData, function (i, item) {
          let { dbName, sub_schema, access, uid } = item;
          tableData[uid] = { ...item, access: value };
        });
        table.clear().draw();
        tableCheckStatus();
        tableDetails('database_list');
      });

      // page table single checkbox functionality
      $(document).on('click', '[name="sub_schema_select[]"]', function () {
        let pageId = $(this)
          .parents('tr.database-row')
          .attr('data-sub-schema-id');

        let value = $(this).is(':checked');
        tableData[pageId] = { ...tableData[pageId], access: value };
        table.clear().draw();
        tableCheckStatus();
        tableDetails('database_list');
      });
    }); // ends
  });
});
