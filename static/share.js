let salt;

/**
 *
 * @param {*} data
 */
function setSalt(data) {
  temp = [];
  salt = data.split(',');
  salt.forEach(function(element) {
    temp.push(parseInt(element));
  }, this);
  salt = temp;
}

/**
 *
 */
function share() {
  if (document.forms['Form'].elements['password'].value != '') {
    const data = {};
    let temp = document.forms['Form'].elements['username'];
    const username = temp.options[temp.selectedIndex].value;
    temp = document.forms['Form'].elements['group'];
    const group = temp.options[temp.selectedIndex].value;
    data['username'] = username;
    data['group'] = group;
    getData(data, 'share/get/');
  }
}

const el = document.getElementById('share');
el.addEventListener('click', share, false);

/**
 *
 * @param {*} keys
 */
function transfer(keys) {
  const data = {};
  let temp = document.forms['Form'].elements['username'];
  const username = temp.options[temp.selectedIndex].value;
  temp = document.forms['Form'].elements['group'];
  const group = temp.options[temp.selectedIndex].value;
  data['username'] = username;
  data['group'] = group;
  /* 0 = Group Key
     1 = Private Key
     2 = Public Key */
  const PBK = sjcl.misc.pbkdf2(document.forms['Form'].elements['password'].value, salt, 5000);
  const PKey = getPKey(PBK, keys[1]);
  data['GKey'] = shareGKey(PKey, keys[2], keys[0]);
  sendData(data, 'share');
}

/**
 *
 * @param {*} data
 * @param {*} page
 */
function getData(data, page) {
  const XHR = new XMLHttpRequest();
  let urlEncodedData = '';
  const urlEncodedDataPairs = [];

  // We turn the data object into an array of URL encoded key value pairs.
  for(name in data) {
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
      // alert(XHR.responseText)
      // alert(XHR.response['error'])
      try {
        const temp = JSON.parse(XHR.responseText);
        const keys = [];
        /* 0 = Group Key
            1 = Private Key
            2 = Public Key */
        keys.push(temp[0]);
        keys.push(temp[1]);
        keys.push(temp[2]);
        test = keys;
        transfer(keys);
      } catch (error) {
        console.log(error);
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
      window.location.href = 'http://127.0.0.1:5000' + XHR.responseText;
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
