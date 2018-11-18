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
  const data = {};

  // Use the salt from the response to get the PBKDF
  let salt = response['salt'];
  salt = salt.split(',');
  let saltArr = [];
  salt.forEach(function(element) {
    saltArr.push(parseInt(element));
  }, this);
  let iteration = {iter: 5000, salt: saltArr};
  let pass = sjcl.misc.cachedPbkdf2(FD.get('password'), iteration);
  data['username'] = FD.get('username').toLowerCase();
  data['password'] = sjcl.codec.base64.fromBits(pass.key.concat(pass.salt));

  /* 0 = pKey
     1 = gKey
     2 = salt */
  const log = response['data'];
  const groups = [];
  log.forEach(function(element) {
    salt = element[2].split(',');
    saltArr = [];
    salt.forEach(function(element2) {
      saltArr.push(parseInt(element2));
    }, this);
    iteration = {iter: 5000, salt: saltArr};
    pass = sjcl.misc.cachedPbkdf2(FD.get('password'), iteration);
    groups.push(getGKey(getPKey(pass.key, element[0]), element[1]));
  }, this);

  data['groups'] = groups;
  sendData(data, 'login/');
}
