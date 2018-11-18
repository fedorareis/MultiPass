/**
 *
 * @param {*} pass
 * @param {*} pKey
 * @param {*} gKey
 */
function testEcrypt(pass, pKey, gKey) {
  const pkey = getPKey(pass, pKey);
  const dcGkey = getGKey(pkey, gKey);
  return securePass(dcGkey, 'This is Awkward');
}

/**
 *
 * @param {*} pass
 * @param {*} pKey
 * @param {*} gKey
 * @param {*} cyphertext
 */
function testDcrypt(pass, pKey, gKey, cyphertext) {
  const pkey = getPKey(pass, pKey);
  const dcGkey = getGKey(pkey, gKey);
  return getPass(dcGkey, cyphertext);
}

/**
 *
 */
function testPassEcrypt() {
  rand = generateGKey();
  cypher = securePass(rand, 'password');
  console.log(cypher);
  plain = getPass(rand, cypher);
  console.log(plain);
}

/**
 *
 */
function testGEcrypt() {
  const keys = generateKeyPair('bob');
  const otherKeys = generateKeyPair('password');
  const GKey = generateGKey(keys[1]);
  const cypher = secureGKey(keys[1], GKey);
  data = {};
  data['keys'] = keys;
  data['otherKeys'] = otherKeys;
  data['GKey'] = GKey;
  data['cypher'] = cypher;
  return data;
}
