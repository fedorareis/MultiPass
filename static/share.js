let salt;

/**
 *
 * @param {*} data
 */
function setSalt(data) {
  salt = JSON.parse(data);
}

/**
 * Sends the username and group to the server.
 */
function share() {
  const form = document.getElementById('LoginForm');
  const FD = new FormData(form);
  if (FD.get('password') != '') {
    const request = {
      username: FD.get('username'),
      group: FD.get('group'),
    };
    getData(request, 'share/get/');
  }
}

const el = document.getElementById('shareForm');
el.addEventListener('submit', (event) => {
  event.preventDefault();
  share();
});

/**
 * Encrypts the group key with the public key of the
 * user it is being shared with. Then sends the group
 * key and username to the server.
 *
 * @param {array} keys The group, private, and public keys
 */
function transfer(keys) {
  const form = document.getElementById('LoginForm');
  const FD = new FormData(form);
  /**
   * 0 = Group Key
   * 1 = Private Key
   * 2 = Public Key
   */
  const PBK = sjcl.misc.pbkdf2(FD.get('password'), salt, 5000);
  const PKey = getPKey(PBK, keys[1]);

  const request = {
    username: FD.get('username'),
    group: FD.get('group'),
    GKey: shareGKey(PKey, keys[2], keys[0]),
  };
  sendData(request, 'share');
}
