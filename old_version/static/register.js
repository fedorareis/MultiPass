/**
 *
 */
function register() {
  const form = document.getElementById('RegisterForm');
  const FD = new FormData(form);

  // While the form already checks that the fields are filled, that can easily be tampered with.
  if (FD.get('password') != '' &&
      FD.get('first_name') != '' &&
      FD.get('last_name') != '' &&
      FD.get('email') != '' &&
      FD.get('verify') != '') {
    if (FD.get('password') === FD.get('verify')) {
      const temp = generateKeyPair(FD.get('password'));
      const publicKey = temp[1];
      const privateKey = temp[0];
      const salt = temp[2];
      const iteration = {iter: 5000, salt: salt};
      const pass = sjcl.misc.cachedPbkdf2(FD.get('password'), iteration);
      const groupKey = generateGKey(publicKey);
      // This is a security issue, the only unencrypted key the server should have
      // access to is the public key. This is tricky because the private key is
      // needed to decrypt the group key.
      // TODO: refactor app to not expose the group key
      const decryptedGroupKey = getGKey(getPKey(pass.key, privateKey), groupKey);

      const request = {
        first_name: FD.get('first_name'),
        last_name: FD.get('last_name'),
        email: FD.get('email').toLowerCase(),
        password: sjcl.codec.base64.fromBits(pass.key.concat(pass.salt)),
        salt: salt,
        pKey: privateKey,
        pubKey: publicKey,
        gKey: groupKey,
        key: decryptedGroupKey,
      };
      sendData(request, 'register/');
    }
  }
}

const el = document.getElementById('RegisterForm');
el.addEventListener('submit', (event) => {
  event.preventDefault();
  register();
});
