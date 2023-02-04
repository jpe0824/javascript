function main() {
  console.log("loading...");
  const fs = require("fs");
  let warningCount = 0;

  const catchingVar = /(\b|\s)var /;
  const catchingMy = /\b[mM]y[A-Z]/;

  const args = process.argv.slice(2);
  const testFile = args.pop();
  let text = fs.readFileSync(testFile, "utf8");
  let lines = text
    .split(/\n|\r\n/gm)
    .map((line, i) => `${i + 1}  ${line}`)
    .filter((line) => !/^\d+\s*$/gm.test(line));

  lines.forEach((line) => {
    // console.log(line,catchingVar.test(line),catchingMy.test(line));
    if (catchingVar.test(line)) {
      console.log(`\x1B[31mWARNING: var used on line:\t \x1b[0m${line}`);
      warningCount++;
    }
    if (catchingMy.test(line)) {
      console.log(`\x1B[31mWARNING: myName used on line:\t \x1b[0m${line}`);
      warningCount++;
    }
  });

  if (warningCount > 0) console.log(`\x1b[41mWARNING COUNT: ${warningCount}`);
  if (warningCount == 0) console.log(`\x1b[42mWARNING COUNT: ${warningCount}`);
  return;
}

main();

// lines.forEach((line, i) => {
//     if(!/^\s*$/gm.test(line)) lines2.push(i + 1 + ' ' + line);
// });

// for (let i = 0; i < lines2.length; i++) {
//     // RULE no var
//     if (lines2[i].includes('\bvar ')) {
//         console.log(lines2[i]);
//         console.log('No var\n');
//     }
//     // RULE ... other rules
// }
