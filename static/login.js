/**
 * Gets the data from the form and passes it into the function for attempting a login
 */
function login() {
  const form = document.getElementById('LoginForm');
  const FD = new FormData(form);
  const data = {
    username: FD.get('username'),
  };
  getData(data, 'login/get/', hash);
}

const el = document.getElementById('LoginForm');
el.addEventListener('submit', (event) => {
  event.preventDefault();
  login();
});

/**
 * Generates the validation key to see if the user credentials are correct
 *
 * @param {*} response
 */
function hash(response) {
  const form = document.getElementById('LoginForm');
  const FD = new FormData(form);
  let salt = response['salt'];
  const data = {};
  salt = salt.split(',');
  let saltArr = [];
  salt.forEach(function(element) {
    saltArr.push(parseInt(element));
  }, this);
  let iteration = {iter: 5000, salt: saltArr};
  let pass = sjcl.misc.cachedPbkdf2(FD.get('password'), iteration);
  data['username'] = FD.get('username').toLowerCase();
  data['password'] = sjcl.codec.base64.fromBits(pass.key.concat(pass.salt));

  /* 0 = pKey
     1 = gKey
     2 = salt */
  let log = response['data'];
  const groups = [];
  if (log.length > 1) {
    log.forEach(function(element) {
      salt = element[2].split(',');
      saltArr = [];
      salt.forEach(function(element2) {
        saltArr.push(parseInt(element2));
      }, this);
      iteration = {iter: 5000, salt: saltArr};
      pass = sjcl.misc.cachedPbkdf2(FD.get('password'), iteration);
      groups.push(getGKey(getPKey(pass.key, element[0]), element[1]));
    }, this);
  } else {
    log = log[0];
    salt = log[2].split(',');
    saltArr = [];
    salt.forEach(function(element) {
      saltArr.push(parseInt(element));
    }, this);
    iteration = {iter: 5000, salt: saltArr};
    pass = sjcl.misc.cachedPbkdf2(FD.get('password'), iteration);
    groups.push(getGKey(getPKey(pass.key, log[0]), log[1]));
  }
  data['groups'] = groups;
  sendData(data, 'login/');
}

/**
 *
 * @param {object} data The object with the data to get passed to the page.
 * @param {string} page The endpoint to send the data to.
 * @param {function} callback The function to call on success.
 *                            Gets passed 1 parameter, the response.
 */
function getData(data, page, callback = null) {
  const XHR = new XMLHttpRequest();
  const request = JSON.stringify(data);

  // We define what will happen in case of error
  XHR.addEventListener('error', function(event) {
    console.error('Oups! Something went wrong with the request.');
  });

  XHR.onreadystatechange = function() { // Call a function when the state changes.
    if (XHR.readyState == 4 && XHR.status == 200) {
      const response = JSON.parse(XHR.responseText);
      if (response['error'] != null) {
        document.getElementById('error').style.display = 'inline';
        document.getElementById('error').textContent = 'Error: ' + response['error'];
      } else {
        if (callback) {
          callback(response);
        } else {
          window.location.replace(XHR.responseURL);
        }
      }
    }
  };

  // We setup our request
  XHR.open('POST', `/${page}`);

  // We add the required HTTP header to handle a JSON POST request
  XHR.setRequestHeader('Content-Type', 'application/json');

  // And finally, We send our data.
  XHR.send(request);
}

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

  // We define what will happen in case of error
  XHR.addEventListener('error', function(event) {
    console.log('Oups! Something went wrong.');
  });

  XHR.onreadystatechange = function() { // Call a function when the state changes.
    if (XHR.readyState == 4 && XHR.status == 200) {
      try {
        document.getElementById('error').style.display = 'inline';
        document.getElementById('error').textContent = 'Error: ' + JSON.parse(XHR.responseText)['error']
      } catch (error) {
        window.location.replace(XHR.responseURL);
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
