

function startLoadingBar() {
  let progress = 0;
  const progressBarLength = 60;
  const interval = setInterval(() => {
    progress += 2;
    const completed = Math.round(progressBarLength * (progress / 100));
    const remaining = progressBarLength - completed;
    const progressBar = (`[${' '.repeat(completed)}${' '.repeat(remaining)}]`);
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(chalk.green('Loading... ') + chalk.bgGreen(`${progress}% ${progressBar}`));
  }, 100);

  // Return the interval ID so we can clear it later
  return interval;
}

function updateLoadingBar(completed, total) {
  const progressBarLength = 60;
  const completedLength = Math.round(progressBarLength * (completed / total));
  const remainingLength = progressBarLength - completedLength;
  const progressBar = '[' + chalk.bgGreen(`${' '.repeat(completedLength)}`) + chalk.bgGray(`${' '.repeat(remainingLength)}`) + ']';
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(chalk.green(`Loading... ${completed}%`) + (`${progressBar}`));
}

function myFunction() {
  console.log('Function started!');

  // Start the loading bar
  const interval = startLoadingBar();

  let i = 0;
  while (i < 1000000000) {
    i++;
  }
  clearInterval(interval);
  updateLoadingBar(33, 100);

  // Start the loading bar again
  const interval2 = startLoadingBar();

  while (i < 2000000000) {
    i++;
  }
  clearInterval(interval2);
  updateLoadingBar(66, 100);

  // Start the loading bar again
  const interval3 = startLoadingBar();

  while (i < 3000000000) {
    i++;
  }
  clearInterval(interval3);
  updateLoadingBar(100, 100);

  // Print the completed message
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  console.log('Function completed!');
}

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');

function printFileSize(filepath, depth) {
  let stats = fs.statSync(filepath);
  let size = stats.size;

  if (stats.isDirectory()) {
    console.log(chalk.blue(`${' '.repeat(depth)}${path.basename(filepath)}/`));
    let files = glob.sync(`${filepath}/**/*`, {nodir: true});
    let dirSize = 0;
    for (let i = 0; i < files.length; i++) {
      let fileStats = fs.statSync(files[i]);
      dirSize += fileStats.size;
    }
    size = dirSize;
  } else {
    console.log(`${' '.repeat(depth)}${path.basename(filepath)}`);
  }

  console.log(`${' '.repeat(depth + 2)} ${chalk.green(`${size}`)}`);
}

let args = process.argv.slice(2);
let filepath = args[0] || './';

console.log(chalk.yellow(`Calculating file sizes in ${filepath}\n`));

let files = glob.sync(`${filepath}/**/*`);
let dirCount = 0;
let fileCount = 0;
let totalSize = 0;

for (let i = 0; i < files.length; i++) {
  let stats = fs.statSync(files[i]);
  if (stats.isDirectory()) {
    dirCount++;
  } else {
    fileCount++;
    totalSize += stats.size;
  }
  printFileSize(files[i], files[i].split('/').length - 1);
}
console.log(chalk.yellow(`\n${fileCount} file${fileCount === 1 ? '' : 's'}, ${dirCount} director${dirCount === 1 ? 'y' : 'ies'}, ${chalk.green(`${totalSize}`)}`));

