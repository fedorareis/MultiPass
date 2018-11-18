
/**
 *
 * @param {object} data The object with the data to get passed to the page.
 * @param {string} page The endpoint to send the data to.
 * @param {function} callback The function to call on success.
 *                            Gets passed 1 parameter, the response.
 */
function sendData(data, page, callback = null) {
  const XHR = new XMLHttpRequest();
  const request = JSON.stringify(data);

  // We define what will happen in case of error
  XHR.addEventListener('error', function(event) {
    console.error('Oups! Something went wrong with the request.');
  });

  XHR.onreadystatechange = function() { // Call a function when the state changes.
    if (XHR.readyState == 4 && XHR.status == 200) {
      try {
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
      } catch (error) {
        window.location.replace(XHR.responseURL);
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
