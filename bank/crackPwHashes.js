const bcrypt = require("bcryptjs");
const fs = require("fs");
const words = require("./mcupws.json");

const alphaNum =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const WRITE_CONSOLE = console.Console(
  fs.createWriteStream("./braden.2K.hashes.answers.txt")
);
const HASH_FILE = "./braden.2k.hashes.txt";

function makeAnimation() {
  const numBars = 50;
  return (progress, totalProg) => {
    const percent = progress / (totalProg + 1);
    const numFilledBars = Math.floor(percent * numBars);
    const numEmptyBars = numBars - numFilledBars;
    const filledBar = "█".repeat(numFilledBars);
    const emptyBarLength = numEmptyBars > 0 ? numEmptyBars - 1 : 0;
    const emptyBar = " ".repeat(emptyBarLength);
    const bar = `[${filledBar}${emptyBar}]`;
    process.stdout.write(`\r${bar} Cracking... ${Math.floor(percent * 100)}%`);
  };
}

function crackPws() {
  const tick = makeAnimation();
  let encryptedHashes = fs
    .readFileSync(HASH_FILE, "utf8")
    .split(/\n|\r\n/gm)
    .map((line) => line);

  console.time("cracking");
  let counter = 0;
  allLoop: for (const hash of encryptedHashes) {
    counter++;
    tick(counter, 2000);
    if (bcrypt.compareSync("", hash)) {
      WRITE_CONSOLE.log(`${hash} ''`);
      continue allLoop;
    }
    for (const char of alphaNum) {
      if (bcrypt.compareSync(char, hash)) {
        WRITE_CONSOLE.log(`${hash} ${char}`);
        continue allLoop;
      }
    }
    for (const char1 of alphaNum) {
      for (const char2 of alphaNum) {
        let twoChar = `${char1}${char2}`;
        if (bcrypt.compareSync(twoChar, hash)) {
          WRITE_CONSOLE.log(`${hash} ${twoChar}`);
          continue allLoop;
        }
      }
    }
    for (const pw of words) {
      if (bcrypt.compareSync(pw, hash)) {
        WRITE_CONSOLE.log(`${hash} ${pw}`);
        continue allLoop;
      }
    }
    for (const char1 of alphaNum) {
      for (const char2 of alphaNum) {
        for (const char3 of alphaNum) {
          let threeChar = `${char1}${char2}${char3}`;
          if (bcrypt.compareSync(threeChar, hash)) {
            WRITE_CONSOLE.log(`${hash} ${threeChar}`);
            continue allLoop;
          }
        }
      }
    }
  }
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  console.timeEnd("cracking");
}

function main() {
  crackPws();
}

main();
