const pair = generateKeyPair('bob');
const pair2 = generateKeyPair('password');
const gKey = secureGKey(pair[1], 'bob');
const cyphertext = testEcrypt('password', pair[0], gKey);
const decrypted = testDcrypt('password', pair[0], gKey, cyphertext);
console.log(decrypted);

const gKey2 = shareGKey(getPKey('password', pair[0]), pair2[1], gKey);
console.log(getGKey(getPKey('password', pair2[0]), gKey2));

/**
 *
 */
function test() {
  const password = 'password';

  const random = sjcl.random.randomWords(5, 6);

  const key = sjcl.ecc.elGamal.generateKeys(256);
  const privateKey = key.sec.get();
  const publicKey = key.pub.get();
  const serialPubKey = sjcl.codec.base64.fromBits(publicKey.x.concat(publicKey.y));
  const serialPrivateKey = sjcl.codec.base64.fromBits(privateKey);

  // Recreates the public key from the bitstring after converting it to a bitstring from base64
  const pub = new sjcl.ecc.elGamal.publicKey(sjcl.ecc.curves.c256, sjcl.codec.base64.toBits(serialPubKey));

  // Recreates the private key from the bitstring after converting it to a bitstring from base64
  const sec = new sjcl.ecc.elGamal.secretKey(sjcl.ecc.curves.c256, sjcl.ecc.curves.c256.field.fromBits(sjcl.codec.base64.toBits(serialPrivateKey)));

  const ciphertext = sjcl.encrypt(pub, 'Hello World', {mode: 'gcm'});
  const decrypt = sjcl.decrypt(sec, ciphertext);

  // const masterKey = sjcl.misc.cachedPbkdf2(password, 5000)
  const ciphertextSym = sjcl.encrypt(password, 'Hello World', {mode: 'gcm'});
  const decryptSym = sjcl.decrypt(password, ciphertextSym);

  console.log('Password & Key:');
  console.log(password);
  // console.log(masterKey)

  console.log('\nRandom & Key Pair:');
  // console.log(random)
  // console.log(key)
  console.log(privateKey);
  console.log(publicKey);

  console.log('\nRecreated keys:');
  console.log(sec);
  console.log(pub);

  console.log('\nSerialized Keys:');
  console.log(serialPubKey);
  console.log(serialPrivateKey);

  console.log('\nCrypto Test:');
  console.log(ciphertext);
  console.log(decrypt);
  console.log(ciphertextSym);
  console.log(decryptSym);
}