let text = fs.readFileSync('./test.js', 'utf8');
let lines = text.split(/\n|\r\n/gm)
    .map((line, i) => i + 1 + ' ' + line)
    .filter((line) => !/^\d+\s*$/gm.test(line));

// lines.forEach((line, i) => {
//     if(!/^\s*$/gm.test(line)) lines2.push(i + 1 + ' ' + line);
// });

for (let i = 0; i < lines2.length; i++) {
    // RULE no var
    if (lines2[i].includes('\bvar ')) {
        console.log(lines2[i]);
        console.log('No var\n');
    }
    // RULE ... other rules
}