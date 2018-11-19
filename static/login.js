/**
 * Gets the data from the form and passes it into the function for attempting a login
 */
function login() {
  const form = document.getElementById('LoginForm');
  const FD = new FormData(form);
  const data = {
    username: FD.get('username').toLowerCase(),
  };
  sendData(data, 'login/get/', hash);
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

  // Use the salt from the response to get the PBKDF
  const salt = JSON.parse(response['salt']);
  const iteration = {iter: 5000, salt: salt};
  const pass = sjcl.misc.cachedPbkdf2(FD.get('password'), iteration);
  const password = sjcl.codec.base64.fromBits(pass.key.concat(pass.salt));

  /* 0 = pKey
     1 = gKey
     2 = salt */
  const log = response['data'];
  const groups = [];
  log.forEach((element) => {
    groups.push(getGKey(getPKey(pass.key, element[0]), element[1]));
  }, this);

  const request = {
    username: FD.get('username').toLowerCase(),
    password: password,
    groups: groups,
  };
  sendData(request, 'login/');
}
