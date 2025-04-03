// add username
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
      let name = userData[0]['name'];
      $('.option').text(name);
    }
  } else {
    window.location.href = 'login.html';
  }
});

// logout functionality
$('#logout-link').on('click', function () {
  function deleteCookie(cookieName) {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
  // Clear the "username" cookie
  deleteCookie('logged-in');
  localStorage.clear();
  window.location.href = 'login.html';
});

$('.wizard-menu-link').on('click', function (e) {
  e.preventDefault();
  let url = $(this).attr('href');
  console.log('works');
  window.sessionStorage.clear();
  window.location.href = url;
});
