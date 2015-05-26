function testClick() {
      alert("the button was clicked")
      sendData([document.forms["Form"].elements["account"].value], 'login')
}

var el = document.getElementById("Magic");
el.addEventListener("click", testClick, false);

function sendData(data, page) {
  var XHR = new XMLHttpRequest();
  var urlEncodedData = "";
  var urlEncodedDataPairs = [];

  // We turn the data object into an array of URL encoded key value pairs.
  for(name in data) {
    urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data));
  }

  // We combine the pairs into a single string and replace all encoded spaces to 
  // the plus character to match the behaviour of the web browser form submit.
  urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');

  // We define what will happen if the data is successfully sent
  XHR.addEventListener('load', function(event) {
    alert('Yeah! Data sent and response loaded.');
  });

  // We define what will happen in case of error
  XHR.addEventListener('error', function(event) {
    alert('Oups! Something goes wrong.');
  });

  // We setup our request
  XHR.open('POST', 'http://127.0.0.1:5000/' + page);

  // We add the required HTTP header to handle a form data POST request
  XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  //XHR.setRequestHeader('Content-Length', urlEncodedData.length);

  // And finally, We send our data.
  XHR.send(urlEncodedData);
}