function testClick() {
      alert("the button was clicked")
      sendData([document.forms["Form"].elements["account"].value], 'login')
      console.log(document.forms["Form"].elements["account"].value)
}

var el = document.getElementById("Magic");
el.addEventListener("click", testClick, false);