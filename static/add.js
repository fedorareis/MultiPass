/**
 * Gets the group key from the server
 */
function getKey() {
  const form = document.getElementById('addForm');
  const FD = new FormData(form);
  if (FD.get('name') != '' &&
    FD.get('password') != '') {
    const request = {
      group: FD.get('group'),
    };
    sendData(request, 'add/get/', add);
  }
}

const el = document.getElementById('addForm');
el.addEventListener('submit', (event) => {
  event.preventDefault();
  getKey();
});

/**
 * Encrypts the data and sends it to the server to be stored
 * To avoid data leakage only group and type are left unencrypted.
 *
 * @param {bitArray} key
 */
function add(key) {
  const form = document.getElementById('addForm');
  const FD = new FormData(form);
  const request = {
    group: FD.get('group'),
    name: securePass(key, FD.get('name')),
    domain: securePass(key, FD.get('domain')),
    pass: securePass(key, FD.get('password')),
    type: FD.get('type'),
    note: securePass(key, FD.get('note')),
  };
  sendData(request, 'add/');
}
