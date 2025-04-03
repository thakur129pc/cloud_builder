$(document).ready(function () {
  $.getJSON('data/login-data.json', function (customerData) {
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
          } else if (!n.name.endsWith('_length')) {
            jsonObj[n.name] = n.value;
          }
        }
      });
      return jsonObj;
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

    // saving functionality
    $('#login-btn').on('click', function () {
      // validate business form
      let $this = $('form#customer-login-form');
      let form = $('form#customer-login-form').parsley();
      form.validate();
      let data = SerializeArrToJson($this.serializeArray());
      if (form.isValid()) {
        let { user, pwd } = data;
        let userData = customerData.filter((item) => {
          if (item.email == user && item.password == pwd) {
            return item;
          }
        });
        if (userData.length > 0) {
          $('.error-message').text('');
          let id = userData[0]['id'];
          const originalText = id;
          const encryptionKey = 37;
          const encryptedText = encrypt(originalText, encryptionKey);

          setCookie('logged-in', JSON.stringify(encryptedText));
          window.location.href = 'infrastructure.html';
        } else {
          $('.error-message').text('username or password mismatch');
        }
      }
    });
  });
});
