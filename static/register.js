function register() {
      sendData([document.forms["Form"].elements["account"].value], 'login')
      console.log(document.forms["Form"].elements["account"].value)
}

var el = document.getElementById("register");
el.addEventListener("click", register, false);