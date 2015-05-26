function generateKeyPair(){
	//Generates keys
	var key = sjcl.ecc.elGamal.generateKeys(256)
	var privateKey = key.sec.get()
	var publicKey = key.pub.get()

	// Converts keys to Base64 for storage
	var serialPubKey = sjcl.codec.base64.fromBits(publicKey.x.concat(publicKey.y))
	var serialPrivateKey = sjcl.codec.base64.fromBits(privateKey)
	privateKey = securePKey("password", serialPrivateKey)

	return [privateKey, serialPubKey]
}

function securePKey(password, pKey){
	return sjcl.encrypt(password, pKey, {mode: "gcm"})
}

function secureGKey(pubKey, gKey){
	var pub = new sjcl.ecc.elGamal.publicKey(sjcl.ecc.curves.c256, sjcl.codec.base64.toBits(pubKey))
	return sjcl.encrypt(pub, gKey, {mode: "gcm"})
}

function securePass(gKey, pass){
	return sjcl.encrypt(gKey, pass, {mode: "gcm"})
}

function getPKey(password, cyphertext){
	return sjcl.decrypt(password, cyphertext)
}

function getGKey(pKey, cyphertext){
	var sec = new sjcl.ecc.elGamal.secretKey(sjcl.ecc.curves.c256, sjcl.ecc.curves.c256.field.fromBits(sjcl.codec.base64.toBits(pKey)))
	return sjcl.decrypt(sec, cyphertext)
}

function getPass(gKey, cyphertext){
	return sjcl.decrypt(gKey, cyphertext)
}

function testEcrypt(pass, pKey, gKey){
	var pkey = getPKey(pass, pKey)
	var dcGkey = getGKey(pkey, gKey)
	return securePass(dcGkey, "This is Awkward")
}

function testDcrypt(pass, pKey, gKey, cyphertext){
	var pkey = getPKey(pass, pKey)
	var dcGkey = getGKey(pkey, gKey)
	return getPass(dcGkey, cyphertext)
}

function shareGKey(pKey, pubKey, gKey){
	var dcGKey = getGKey(pKey, gKey)
	return secureGKey(pubKey, dcGKey)
}

function generateGKey(){
	rand = sjcl.random.randomWords(8, 6)
	console.log(rand)
	//console.log("GET THIS DONE!!!!!! (generate group key)")
	return rand
}

function testGEcrypt(){
	rand = generateGKey()
	cypher = securePass(rand, "password")
	console.log(cypher)
	plain = getPass(rand, cypher)
	console.log(plain)
}