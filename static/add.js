function getUser() {
  if (document.forms["Form"].elements["name"].value != "" &&
      document.forms["Form"].elements["password"].value != ""){
      var data = {};
      var temp = document.forms["Form"].elements["group"]
      var group = temp.options[temp.selectedIndex].value
      data["group"] = group;
      getData(data, 'add/get');
  }
}

var el = document.getElementById("add");
el.addEventListener("click", getUser, false);

function add(user) {
  var data = {}
  var temp = document.forms["Form"].elements["username"]
  var username = temp.options[temp.selectedIndex].value
  temp = document.forms["Form"].elements["group"]
  var group = temp.options[temp.selectedIndex].value
  data["username"] = username
  data["group"] = group
  /* 0 = Name
     1 = Private Key
     2 = Public Key 
     3 = Group
     4 = Group Key
     5 = Salt */
  var PBK = sjcl.misc.pbkdf2(document.forms["Form"].elements["password"].value, user[5], 5000)
  var PKey = getPKey(PBK, user[1])
  var GKey = getGKey(PKey, user[2], user[0])
  sendData(data, 'add')
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
          add(JSON.parse(XHR.responseText))
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