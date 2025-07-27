/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const sjcl = require('sjcl');

/**
 * Generates a key pair and encrypts the private key using the PBKDF results
 *
 * @param {string} password
 *
 * @return {array} An array consisting of the encrypted private key
 *                 the base64 encoded public key
 *                 and the salt used by PBKDF2
 */
export function generateKeyPair(password: string) {
  // Generates keys
  const key = sjcl.ecc.elGamal.generateKeys(256)
  const privateKey = key.sec.get()
  const publicKey = key.pub.get()

  // Converts keys to Base64 for storage
  const serialPubKey = sjcl.codec.base64.fromBits(
    publicKey.x.concat(publicKey.y),
  )
  const serialPrivateKey = sjcl.codec.base64.fromBits(privateKey)
  const rand = sjcl.random.randomWords(3, 10)
  const PBK = sjcl.misc.pbkdf2(password, rand, 5000)

  // Encrypts the private key for storage
  const encPrivateKey = securePKey(PBK, serialPrivateKey)

  return [encPrivateKey, serialPubKey, rand]
}

/**
 * Encrypts the private key for storage
 *
 * @param {bitArray} password A PBKDF2 bitArray
 * @param {base64} pKey THe private key to encrypt
 *
 * @return {string} The encrypted private key
 */
export function securePKey(password: any, pKey: any): string {
  return sjcl.encrypt(password, pKey, { mode: 'gcm' })
}

/**
 * Encrypts the group key using a public key for storage
 *
 * @param {base64} pubKey The public key to use to encrypt the group key
 * @param {bitArray} gKey The group key to encrypt
 *
 * @return {string}
 */
export function secureGKey(pubKey: any, gKey: any): string {
  const pub = new sjcl.ecc.elGamal.publicKey(
    sjcl.ecc.curves.c256,
    sjcl.codec.base64.toBits(pubKey),
  )
  return sjcl.encrypt(pub, sjcl.codec.base64.fromBits(gKey), { mode: 'gcm' })
}

/**
 * Encrypts a password using the group key for the group the password belongs to
 *
 * @param {bitArray} gKey The group key to use to encrypt the password
 * @param {string} pass The password to encrypt
 *
 * @return {string} The encrypted password
 */
export function securePass(gKey: any, pass: any): string {
  return sjcl.encrypt(gKey, pass, { mode: 'gcm' })
}

/**
 * Decrypts the private key using the PBKDF2 bitArray
 *
 * @param {bitArray} password The PBK to use to decrypt the private key
 * @param {string} cyphertext THe private key to decrypt
 *
 * @return {string} The decrypted private key
 */
export function getPKey(password: any, cyphertext: any): string {
  return sjcl.decrypt(password, cyphertext)
}

/**
 * Decrypts a group key and returns it as a bit array
 *
 * @param {base64} pKey
 * @param {string} cyphertext
 *
 * @return {bitArray} The group key
 */
export function getGKey(pKey: any, cyphertext: string) {
  const sec = new sjcl.ecc.elGamal.secretKey(
    sjcl.ecc.curves.c256,
    sjcl.ecc.curves.c256.field.fromBits(sjcl.codec.base64.toBits(pKey)),
  )
  return sjcl.codec.base64.toBits(sjcl.decrypt(sec, cyphertext))
}

/**
 * Decrypts the password using the group key for the group the password is in
 *
 * @param {bitArray} gKey The group key
 * @param {string} cyphertext The cyphertext to decrypt
 *
 * @return {string} The decrypted password
 */
export function getPass(gKey: any, cyphertext: string): string {
  return sjcl.decrypt(gKey, cyphertext)
}

/**
 * Encrypts the group key with another users public key
 *
 * @param {base64} pKey The private key to decrypt the group key
 * @param {base64} pubKey The public key to encrypt the group key with
 * @param {bitArray} gKey The group key to share
 *
 * @return {string} The encrypted group key
 */
export function shareGKey(pKey: any, pubKey: any, gKey: string): string {
  const dcGKey = getGKey(pKey, gKey)
  return secureGKey(pubKey, dcGKey)
}

/**
 * Generates a new group key and encrypts it
 *
 * @param {base64} pubKey The public key to use to encrypt the group key
 *
 * @return {string} The encrypted group key
 */
export function generateGKey(pubKey: any): string {
  const rand = sjcl.random.randomWords(8, 10)
  return secureGKey(pubKey, rand)
}
