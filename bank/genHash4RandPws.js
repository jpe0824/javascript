// const crypto = require('crypto');
const bcrypt = require("bcryptjs");
const fs = require("fs");

// Load words from mcupws.json file
const words = require("./mcupws.json");

const salt = bcrypt.genSaltSync(10);

// Generate 1000 random passwords from the words list
const randomPasswords = new Array(1000).fill("").map(() => {
  const index = Math.floor(Math.random() * words.length);
  return words[index];
});

// Hash the random passwords with the salt
const hashedPasswords = randomPasswords.map((password) =>
  bcrypt.hashSync(password, 4)
);

// Generate 500 empty string hashes
const empty_hashes = new Array(500).fill("").map(() => bcrypt.hashSync("", 4));

// Generate 390 1-character alphanumeric hashes
const one_char_hashes = new Array(390).fill("").map(() => {
  const randChar = Math.random().toString(36).substr(2, 1);
  return bcrypt.hashSync(randChar, 4);
});

// Generate 100 2-character alphanumeric hashes
const two_char_hashes = new Array(100).fill("").map(() => {
  const randChars = Math.random().toString(36).substr(2, 2);
  return bcrypt.hashSync(randChars, 4);
});

// Generate 10 3-character alphanumeric hashes
const three_char_hashes = new Array(10).fill("").map(() => {
  const randChars = Math.random().toString(36).substr(2, 3);
  return bcrypt.hashSync(randChars, 4);
});

// Concatenate all hashes and shuffle the list
const all_hashes = hashedPasswords.concat(
  empty_hashes,
  one_char_hashes,
  two_char_hashes,
  three_char_hashes
);
const shuffled_hashes = all_hashes.sort(() => Math.random() - 0.5);

// Write hashes to file
fs.writeFile("my.2K.hashes.txt", shuffled_hashes.join("\n"), (err) => {
  if (err) throw err;
  console.log("Hashes saved to 2K.hashes.txt");
});
