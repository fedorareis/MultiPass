var password = "password"

var random = sjcl.random.randomWords(5, 6)

var key = sjcl.ecc.elGamal.generateKeys(256)
var privateKey = key.sec.get()
var publicKey = key.pub.get()
var serialPubKey = sjcl.codec.base64.fromBits(publicKey.x.concat(publicKey.y))
var serialPrivateKey = sjcl.codec.base64.fromBits(privateKey)

var pub = new sjcl.ecc.elGamal.publicKey(
    sjcl.ecc.curves.c256, 
    sjcl.codec.base64.toBits(serialPubKey)
)

var sec = new sjcl.ecc.elGamal.secretKey(
    sjcl.ecc.curves.c256,
    sjcl.ecc.curves.c256.field.fromBits(sjcl.codec.base64.toBits(serialPrivateKey))
)

var ciphertext = sjcl.encrypt(pub, "Hello World")
var decrypt = sjcl.decrypt(sec, ciphertext)

var masterKey = sjcl.misc.pbkdf2(password, )

console.log(password)

console.log(random)
console.log(key)
console.log(privateKey)
console.log(publicKey)

console.log("\nSerialized Keys:")
console.log(serialPubKey)
console.log(serialPrivateKey)

console.log("\nCrypto Test:")
console.log(ciphertext)
console.log(decrypt)