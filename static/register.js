/**
 *
 */
function register() {
  // While the form already checks that the fields are filled, that can easily be tampered with.
  if (document.forms['Form'].elements['password'].value != '' &&
      document.forms['Form'].elements['first_name'].value != '' &&
      document.forms['Form'].elements['last_name'].value != '' &&
      document.forms['Form'].elements['email'].value != '' &&
      document.forms['Form'].elements['verify'].value != '') {
    if (document.forms['Form'].elements['password'].value === document.forms['Form'].elements['verify'].value) {
      const data = {};
      let iteration = {iter: 5000};
      data['first_name'] = document.forms['Form'].elements['first_name'].value;
      data['last_name'] = document.forms['Form'].elements['last_name'].value;
      data['email'] = document.forms['Form'].elements['email'].value.toLowerCase();
      let pass = sjcl.misc.cachedPbkdf2(document.forms['Form'].elements['password'].value, iteration);
      data['password'] = sjcl.codec.base64.fromBits(pass.key.concat(pass.salt));
      data['salt'] = pass.salt;
      const temp = generateKeyPair(document.forms['Form'].elements['password'].value);
      data['pKey'] = temp[0];
      data['pubKey'] = temp[1];
      data['kSalt'] = temp[2];
      data['gKey'] = generateGKey(temp[1]);
      iteration = {iter: 5000, salt: temp[2]};
      pass = sjcl.misc.cachedPbkdf2(document.forms['Form'].elements['password'].value, iteration);
      data['key'] = getGKey(getPKey(pass.key, temp[0]), data['gKey']);
      sendData(data, 'register/');
    }
  }
}

const el = document.getElementById('register');
el.addEventListener('click', register, false);
