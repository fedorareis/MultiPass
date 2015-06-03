function login() {
	var data = {}
	data["username"] = document.forms["Form"].elements["username"].value.toLowerCase();
	var temp = getData(data, 'login/get');
}

var el = document.getElementById("submit");
el.addEventListener("click", login, false);

var test
var test2

// Generates the validation key to see if the user credentials are correct
function hash(response) {
  var salt = response["salt"]
  var data = {};
  salt = salt.split(",")
  var saltArr = []
  salt.forEach(function(element) {
    saltArr.push(parseInt(element))
  }, this);
  var iteration = {iter: 5000, salt: saltArr};
  var pass = sjcl.misc.cachedPbkdf2(document.forms["Form"].elements["password"].value, iteration);
  data["username"] = document.forms["Form"].elements["username"].value.toLowerCase();
  data["password"] = sjcl.codec.base64.fromBits(pass.key.concat(pass.salt))
  
  /* 0 = pKey
     1 = gKey
     2 = salt */
  var log = response["data"]
  test2 = response
  var groups = []
  if(log.length > 1)
  {
    log.forEach(function(element) {
      salt = element[2].split(",")
      saltArr = []
      salt.forEach(function(element2) {
        saltArr.push(parseInt(element2))
      }, this);
      iteration = {iter: 5000, salt: saltArr};
      pass = sjcl.misc.cachedPbkdf2(document.forms["Form"].elements["password"].value, iteration);
      groups.push(getGKey(getPKey(pass.key, element[0]), element[1]))
    }, this);
  } else {
    log = log[0]
    salt = log[2].split(",")
    saltArr = []
    salt.forEach(function(element) {
      saltArr.push(parseInt(element))
    }, this);
    iteration = {iter: 5000, salt: saltArr};
    pass = sjcl.misc.cachedPbkdf2(document.forms["Form"].elements["password"].value, iteration);
    groups.push(getGKey(getPKey(pass.key, log[0]), log[1]))
  }
  data["groups"] = groups
  test = data
  sendData(data, 'login')
}

function getData(data, page) {
  var XHR = new XMLHttpRequest();
  var urlEncodedData = "";
  var urlEncodedDataPairs = [];

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
  
  XHR.onreadystatechange = function() {//Call a function when the state changes.
    if(XHR.readyState == 4 && XHR.status == 200) {
        var temp = JSON.parse(XHR.responseText)
        if(temp["error"] != null){
          document.getElementById("error").style.display = "inline"
          document.getElementById("error").textContent = "Error: " + temp["error"]
        } else {
          hash(temp);
        }
    }
  }

  // We setup our request
  XHR.open('POST', 'http://127.0.0.1:5000/' + page);

  // We add the required HTTP header to handle a form data POST request
  XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  //XHR.setRequestHeader('Content-Length', urlEncodedData.length);

  // And finally, We send our data.
  XHR.send(urlEncodedData);
}

function sendData(data, page) {
  var XHR = new XMLHttpRequest();
  var urlEncodedData = "";
  var urlEncodedDataPairs = [];

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
  
  XHR.onreadystatechange = function() {//Call a function when the state changes.
    if(XHR.readyState == 4 && XHR.status == 200) {
        //alert(XHR.responseText)
        //alert(XHR.response["error"])
        try {
          document.getElementById("error").style.display = "inline"
          document.getElementById("error").textContent = "Error: " + JSON.parse(XHR.responseText)["error"]
        } catch (error) {
          window.location.href = 'http://127.0.0.1:5000' + XHR.responseText;
        }
    }
  }

  // We setup our request
  XHR.open('POST', 'http://127.0.0.1:5000/' + page);

  // We add the required HTTP header to handle a form data POST request
  XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  //XHR.setRequestHeader('Content-Length', urlEncodedData.length);

  // And finally, We send our data.
  XHR.send(urlEncodedData);
}