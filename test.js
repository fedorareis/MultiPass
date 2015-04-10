//var sjcl = require('./sjcl.js')

var ciphertext = sjcl.encrypt("password", "Hello World!")
var plaintext = sjcl.decrypt("password", ciphertext)

console.log(ciphertext)
console.log(plaintext)