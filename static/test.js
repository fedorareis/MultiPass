var pair = generateKeyPair("bob")
var pair2 = generateKeyPair("password")
var gKey = secureGKey(pair[1], "bob")
var cyphertext = testEcrypt("password", pair[0], gKey)
var decrypted = testDcrypt("password", pair[0], gKey, cyphertext)
console.log(decrypted)

var gKey2 = shareGKey(getPKey("password", pair[0]), pair2[1], gKey)
console.log(getGKey(getPKey("password", pair2[0]), gKey2))


function test(){
	var password = "password"

	var random = sjcl.random.randomWords(5, 6)

	var key = sjcl.ecc.elGamal.generateKeys(256)
	var privateKey = key.sec.get()
	var publicKey = key.pub.get()
	var serialPubKey = sjcl.codec.base64.fromBits(publicKey.x.concat(publicKey.y))
	var serialPrivateKey = sjcl.codec.base64.fromBits(privateKey)

	//Recreates the public key from the bitstring after converting it to a bitstring from base64
	var pub = new sjcl.ecc.elGamal.publicKey(sjcl.ecc.curves.c256, sjcl.codec.base64.toBits(serialPubKey))

	//Recreates the private key from the bitstring after converting it to a bitstring from base64
	var sec = new sjcl.ecc.elGamal.secretKey(sjcl.ecc.curves.c256, sjcl.ecc.curves.c256.field.fromBits(sjcl.codec.base64.toBits(serialPrivateKey)))

	var ciphertext = sjcl.encrypt(pub, "Hello World", {mode: "gcm"})
	var decrypt = sjcl.decrypt(sec, ciphertext)

	//var masterKey = sjcl.misc.cachedPbkdf2(password, 5000)
	var ciphertextSym = sjcl.encrypt(password, "Hello World", {mode: "gcm"})
	var decryptSym = sjcl.decrypt(password, ciphertextSym)

	console.log("Password & Key:")
	console.log(password)
	//console.log(masterKey)

	console.log("\nRandom & Key Pair:")
	//console.log(random)
	//console.log(key)
	console.log(privateKey)
	console.log(publicKey)

	console.log("\nRecreated keys:")
	console.log(sec)
	console.log(pub)

	console.log("\nSerialized Keys:")
	console.log(serialPubKey)
	console.log(serialPrivateKey)

	console.log("\nCrypto Test:")
	console.log(ciphertext)
	console.log(decrypt)
	console.log(ciphertextSym)
	console.log(decryptSym)
}