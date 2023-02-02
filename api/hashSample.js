// Crypto Js
// Import the crypto-js library
const crypto = require("crypto-js");

// Define the data to be encrypted
const data = "This is some secret data";

// Define the encryption key
const key = crypto.enc.Utf8.parse("1234567812345678");

// Use the AES algorithm to encrypt the data
const encryptedData = crypto.AES.encrypt(data, key).toString();

console.log("Encrypted Data:", encryptedData);

// Use the AES algorithm to decrypt the data
const decryptedData = crypto.AES.decrypt(encryptedData, key).toString(crypto.enc.Utf8);

console.log("Decrypted Data:", decryptedData)






// Import the bcrypt library
const bcrypt = require("bcrypt");

// Define the password to be hashed
const password = "mysecretpassword";

// Define the number of rounds to use in the key derivation function
const saltRounds = 10;

// Hash the password using bcrypt
bcrypt.hash(password, saltRounds, function(err, hash) {
  console.log("Hashed Password:", hash);
  
  // Compare the input password with the hashed password
  bcrypt.compare(password, hash, function(err, result) {
    console.log("Password Match:", result);
  });
});