const args = process.argv.slice(2);
let result = 1;
args.forEach(arg => result *= arg);
console.log(result);