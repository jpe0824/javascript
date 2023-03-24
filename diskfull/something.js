const chalk = require('chalk');

const files = [
  'dir1/dir2/dir3/file1.txt',
  'dir1/dir2/dir3/file2.txt',
  'dir1/dir2/dir3/file3.txt',
  'file4.txt',
  'file5.txt',
];

files.forEach((file) => {
  const fileName = file.split('/').slice(-1)[0];
  const coloredFileName = chalk.blueBright(fileName);
  const coloredFileString = file.replace(fileName, coloredFileName);

  console.log(coloredFileString);
});
