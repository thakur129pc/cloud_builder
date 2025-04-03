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
      console.log('chat_version', currentVersion);
    } else {
      console.log('chat_version', currentVersion);
    }
  }

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

  $.getJSON('data/guardrails-list.json', function (data) {
    let initialData = data;

    if (localStorage.getItem('guardrails list') === null) {
      localStorage.setItem('guardrails list', JSON.stringify(initialData));
    } else {
      let data = {
        ...initialData,
        ...JSON.parse(localStorage.getItem('guardrails list')),
      };
      localStorage.setItem('guardrails list', JSON.stringify(data));
    }
    // custom functions

    if (localStorage.getItem('guardrails list') !== null) {
      let LinkData = JSON.parse(localStorage.getItem('guardrails list'));

      // Search functionality
      $('#guardrails_list tfoot th').each(function () {
        let title = $('#guardrails_list thead th')
          .eq($(this).index())
          .text()
          .trim();
        if (title != '' && title) {
          $(this).html(
            '<input type="text" class="filter" placeholder="' + title + '" />'
          );
        }
      });
      $('#guardrails_list')
        .DataTable({
          iDisplayLength: 25, // Set the default number of rows to display
          language: {
            info: 'Showing _START_ to _END_ of _TOTAL_ list',
          },
        })
        .columns()
        .every(function () {
          var that = this;

          $('input', this.footer()).on('keyup change', function () {
            that.search(this.value).draw();
          });
        });
      tableDetails('guardrails_list');
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
          $('#' + selector + '_info').hide();
          $('#' + selector + '_paginate').hide();
        }
      }

      function trimStringTo100Chars(inputString) {
        // Check if the input string is longer than 300 characters
        if (inputString.length > 100) {
          // Trim the string to 300 characters and add "..." to indicate truncation
          return inputString.substring(0, 100) + '...';
        } else {
          // If the string is 300 characters or shorter, return it as is
          return inputString;
        }
      }

      $.each(LinkData, function (key, value) {
        let { guardrailSet, description, tokens } = value;
        $('#guardrails_list')
          .DataTable()
          .row.add(
            $(
              `<tr role="row" data-id="${guardrailSet}"> <td width="15%"><a href="guardrails-view.html?v=${guardrailSet}"> ${guardrailSet} </a></td> <td width="25%"> ${description} </td> <td> ${tokens} </td> </tr>`
            )
          )
          .draw();
      });
      tableDetails('guardrails_list');
    }
  });
});
