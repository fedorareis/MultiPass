function generateKeyPair(password){
	//Generates keys
	var key = sjcl.ecc.elGamal.generateKeys(256)
	var privateKey = key.sec.get()
	var publicKey = key.pub.get()

	// Converts keys to Base64 for storage
	var serialPubKey = sjcl.codec.base64.fromBits(publicKey.x.concat(publicKey.y))
	var serialPrivateKey = sjcl.codec.base64.fromBits(privateKey)
	var rand = sjcl.random.randomWords(3, 10);
	var PBK = sjcl.misc.pbkdf2(password, rand, 5000)
	console.log(serialPrivateKey)
	privateKey = securePKey(PBK, serialPrivateKey)

	return [privateKey, serialPubKey, rand]
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

function generateGKey(pubKey){
	var rand = sjcl.codec.base64.fromBits(sjcl.random.randomWords(8, 10))
	return secureGKey(pubKey, rand)
}

function testPassEcrypt(){
	rand = generateGKey()
	cypher = securePass(rand, "password")
	console.log(cypher)
	plain = getPass(rand, cypher)
	console.log(plain)
}

function testGEcrypt(){
	var keys = generateKeyPair("bob")
	var otherKeys = generateKeyPair("password")
	var GKey = generateGKey(keys[1])
	var cypher = secureGKey(keys[1], GKey)
	data = {};
	data["keys"] = keys
	data["otherKeys"] = otherKeys
	data["GKey"] = GKey
	data["cypher"] = cypher
	return data
}