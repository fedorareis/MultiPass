/**
 *
 */
function register() {
  if (document.forms['Form'].elements['password'].value != '' &&
      document.forms['Form'].elements['first_name'].value != '' &&
      document.forms['Form'].elements['last_name'].value != '' &&
      document.forms['Form'].elements['email'].value != '' &&
      document.forms['Form'].elements['verify'].value != '') {
    if (document.forms['Form'].elements['password'].value === document.forms['Form'].elements['verify'].value) {
      const data = {};
      let iteration = {iter: 5000};
      data['first_name'] = document.forms['Form'].elements['first_name'].value;
      data['last_name'] = document.forms['Form'].elements['last_name'].value;
      data['email'] = document.forms['Form'].elements['email'].value.toLowerCase();
      let pass = sjcl.misc.cachedPbkdf2(document.forms['Form'].elements['password'].value, iteration);
      data['password'] = sjcl.codec.base64.fromBits(pass.key.concat(pass.salt));
      data['salt'] = pass.salt;
      const temp = generateKeyPair(document.forms['Form'].elements['password'].value);
      data['pKey'] = temp[0];
      data['pubKey'] = temp[1];
      data['kSalt'] = temp[2];
      data['gKey'] = generateGKey(temp[1]);
      iteration = {iter: 5000, salt: temp[2]};
      pass = sjcl.misc.cachedPbkdf2(document.forms['Form'].elements['password'].value, iteration);
      data['key'] = getGKey(getPKey(pass.key, temp[0]), data['gKey']);
      sendData(data, 'register/');
    }
  }
}

const el = document.getElementById('register');
el.addEventListener('click', register, false);

/**
 *
 * @param {*} data
 * @param {*} page
 */
function sendData(data, page) {
  const XHR = new XMLHttpRequest();
  let urlEncodedData = '';
  const urlEncodedDataPairs = [];

  // We turn the data object into an array of URL encoded key value pairs.
  for (name in data) {
    urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
  }

  // We combine the pairs into a single string and replace all encoded spaces to
  // the plus character to match the behaviour of the web browser form submit.
  urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');

  // We define what will happen if the data is successfully sent
  XHR.addEventListener('load', function(event) {
    console.log('Yeah! Data sent and response loaded.');
  });

  // We define what will happen in case of error
  XHR.addEventListener('error', function(event) {
    console.log('Oups! Something goes wrong.');
  });

  XHR.onreadystatechange = function() { // Call a function when the state changes.
    if (XHR.readyState == 4 && XHR.status == 200) {
      try {
        document.getElementById('error').style.display = 'inline';
        document.getElementById('error').textContent = 'Error: ' + JSON.parse(XHR.responseText)['error'];
      } catch (error) {
        window.location.href = 'http://127.0.0.1:5000' + XHR.responseText;
      }
    }
  };

  // We setup our request
  XHR.open('POST', 'http://127.0.0.1:5000/' + page);

  // We add the required HTTP header to handle a form data POST request
  XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  // XHR.setRequestHeader('Content-Length', urlEncodedData.length);

  // And finally, We send our data.
  XHR.send(urlEncodedData);
}
