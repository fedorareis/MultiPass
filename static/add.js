/**
 *
 */
function getKey() {
  if (document.forms['Form'].elements['name'].value != '' &&
    document.forms['Form'].elements['password'].value != '') {
    const data = {};
    const temp = document.forms['Form'].elements['group'];
    data['group'] = temp.options[temp.selectedIndex].value;
    getData(data, 'add/get/');
  }
}

const el = document.getElementById('add');
el.addEventListener('click', getKey, false);

/**
 *
 * @param {*} key
 */
function add(key) {
  const data = {};
  let temp = document.forms['Form'].elements['group'];
  data['group'] = temp.options[temp.selectedIndex].value;
  data['name'] = securePass(key, document.forms['Form'].elements['name'].value);
  data['domain'] = securePass(key, document.forms['Form'].elements['domain'].value);
  data['pass'] = securePass(key, document.forms['Form'].elements['password'].value);
  temp = document.forms['Form'].elements['type'];
  data['type'] = temp.options[temp.selectedIndex].value;
  data['note'] = securePass(key, document.forms['Form'].elements['note'].value);
  sendData(data, 'add');
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
        add(JSON.parse(XHR.responseText));
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
