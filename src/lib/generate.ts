// const temp = generateKeyPair(FD.get('password'));
// const publicKey = temp[1];
// const privateKey = temp[0];
// const salt = temp[2];
// const iteration = {iter: 5000, salt: salt};
// const pass = sjcl.misc.cachedPbkdf2(FD.get('password'), iteration);
// const groupKey = generateGKey(publicKey);
// // This is a security issue, the only unencrypted key the server should have
// // access to is the public key. This is tricky because the private key is
// // needed to decrypt the group key.
// // TODO: refactor app to not expose the group key
// const decryptedGroupKey = getGKey(getPKey(pass.key, privateKey), groupKey);

// const request = {
//   first_name: FD.get('first_name'),
//   last_name: FD.get('last_name'),
//   email: FD.get('email').toLowerCase(),
//   password: sjcl.codec.base64.fromBits(pass.key.concat(pass.salt)),
//   salt: salt,
//   pKey: privateKey,
//   pubKey: publicKey,
//   gKey: groupKey,
//   key: decryptedGroupKey,
// };

/*
Get some key material to use as input to the deriveKey method.
The key material is a password supplied by the user.
*/
function getKeyMaterial(password: string) {
  let enc = new TextEncoder();
  return window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );
}

async function generateUserKey(password: string) {
  let salt = window.crypto.getRandomValues(new Uint8Array(16));
  let keyMaterial = await getKeyMaterial(password);
  let key = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  return [key, salt];
}

export async function generateKeys(password: string) {
  const userKey = await generateUserKey(password);

  return {
    userKey: userKey,
  };
}

interface UserKeys {
  userKey: string;
}
