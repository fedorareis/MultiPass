var salt

function setSalt(data){
  temp = []
  salt = data.split(',')
  salt.forEach(function(element) {
    temp.push(parseInt(element))
  }, this);
  salt = temp
  console.log(salt)
}

function share() {
  if (document.forms["Form"].elements["password"].value != ""){
      var data = {};
      var temp = document.forms["Form"].elements["username"]
      var username = temp.options[temp.selectedIndex].value
      temp = document.forms["Form"].elements["group"]
      var group = temp.options[temp.selectedIndex].value
      data["username"] = username;
      data["group"] = group;
      getData(data, 'share/get');
  }
}

var el = document.getElementById("share");
el.addEventListener("click", share, false);

function transfer(keys) {
  var data = {}
  var temp = document.forms["Form"].elements["username"]
  var username = temp.options[temp.selectedIndex].value
  temp = document.forms["Form"].elements["group"]
  var group = temp.options[temp.selectedIndex].value
  data["username"] = username
  data["group"] = group
  console.log(keys)
  /* 0 = Group Key
     1 = Private Key
     2 = Public Key */
  var PBK = sjcl.misc.pbkdf2(document.forms["Form"].elements["password"].value, salt, 5000)
  var PKey = getPKey(PBK, keys[1])
  data["GKey"] = shareGKey(PKey, keys[2], keys[0])
  console.log("transfering")
  sendData(data, 'share')
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
        //alert(XHR.responseText)
        //alert(XHR.response["error"])
        try {
          var temp = JSON.parse(XHR.responseText)
          var keys = []
          /* 0 = Group Key
             1 = Private Key
             2 = Public Key */
          keys.push(temp[0])
          keys.push(temp[1])
          keys.push(temp[2])
          console.log(keys)
          console.log("call transfer")
          test = keys
          transfer(keys)
        } catch (error) {
          console.log(error)
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
        window.location.href = 'http://127.0.0.1:5000' + XHR.responseText;
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