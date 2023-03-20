/*
Project bigstuff V2
Jason Edman
CS3380-001
*/

/*
TODO
drop block size - done
print abs path
colors, chalk.js
animation while loading
inefficiencies
write in i18n and i10n
    command line arg
    config file specified as a command line arg
    default config file
    lang and locale
    default
Globbing
error handling
more error handling
*/

const fs = require("fs")
const filesize = require("filesize")
const chalk = require("chalk")

const THRESHOLD_MULT = 1_000_000_000

const dirArr = []
const commands = {
  path: "test",
  help: false,
  sort: false,
  metric: false,
  threshold: false,
}

let errorCheck = false;

const sortAlpha = (a, b) => (a.name.toLowerCase() === b.name.toLowerCase()) ? 0
                            : (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1)
const sortExten = (a, b) => (a.name.split(".").pop() === b.name.split(".").pop()) ? 0
                            : (a.name.split(".").pop() < b.name.split(".").pop() ? -1 : 1)
const sortSize = (a, b) => b.size - a.size
const sortOrder = {
  "alpha": sortAlpha,
  "exten": sortExten,
  "size": sortSize
}

function walkDirTree(path) {
  let dirEntries
  try{
    dirEntries = fs.readdirSync(path, { withFileTypes: true })
  } catch(error) {
    errorCheck = true
    console.log(chalk.bold.red('\nError: Cannot find or access path.  Please verify path name is correct.'))
    callHelp()
    return
  }
  for(let dirEntry of dirEntries) {
    //ignore hidden directories
    if(dirEntry.name.startsWith(".")) continue;
    //directories
    if(dirEntry.isDirectory()) {
      let dir = {
        name: `${dirEntry.name}/`,
        size: 0,
        fileChildren: [],
        dirChildren: [],
      }
      dirArr.push(dir)
      let splitPath = path.split("/")
      splitPath.pop()
      let parent = splitPath.pop() + "/"
      //assign dir children to parent
      for(let tmpDir of dirArr) {
        if(parent == tmpDir.name) tmpDir.dirChildren.push(dir)
      }
      walkDirTree(`${path}${dir.name}`)
      //files
    } if(dirEntry.isFile()) {
      let size = fs.statSync(`${path}${dirEntry.name}`).size
      let file = {
        name: `${dirEntry.name}`,
        size: size,
      }
      let splitPath = path.split("/")
      splitPath.pop()
      let parent = splitPath.pop() + '/'
      //assign dir children and add file size to dir
      for(let tmpDir of dirArr) {
        if(tmpDir.name == parent) {
          tmpDir.size += file.size
          tmpDir.fileChildren.push(file)
        }
      }
    }
  }
}

function sumDirSize(dir) {
  for(let dirChild of dir.dirChildren) {
    sumDirSize(dirChild)
    dir.size += dirChild.size
  }
}

function displayDir(dir) {
  if(errorCheck) return
  if(commands.sort) {
    dir.dirChildren.sort(sortOrder[commands.sort])
    dir.fileChildren.sort(sortOrder[commands.sort])
  }
  if(commands.threshold) if(dir.size < commands.threshold) return
  if(commands.metric) dir.size = filesize(dir.size)
  //display directories
  console.group(chalk.blue(`${dir.name}   ${dir.size.toLocaleString()}`))
  dir.dirChildren.forEach((dirChild) => {
    displayDir(dirChild)
  })
  //display files
  dir.fileChildren.forEach((fileChild) => {
    if(commands.threshold) if(fileChild.size < commands.threshold) return
    if(commands.metric) fileChild.size = filesize(fileChild.size)
    console.log(chalk.green(`${fileChild.name}   ${fileChild.size.toLocaleString()}`))
  })
  console.groupEnd()
}

function callHelp() {
  let helpText = fs.readFileSync("help.txt", "utf8")
  console.log(`\n${helpText}\n`)
  return
}

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
  if(errorCheck) {
    const progressBarLength = 60;
    const completedLength = Math.round(progressBarLength * (completed / total));
    const remainingLength = progressBarLength - completedLength;
    const progressBar = '[' + chalk.bgRed(`${' '.repeat(completedLength)}`) + chalk.bgGray(`${' '.repeat(remainingLength)}`) + ']';
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(chalk.red(`Loading... ${completed}%`) + (`${progressBar}`));
    return;
  }
  const progressBarLength = 60;
  const completedLength = Math.round(progressBarLength * (completed / total));
  const remainingLength = progressBarLength - completedLength;
  const progressBar = '[' + chalk.bgGreen(`${' '.repeat(completedLength)}`) + chalk.bgGray(`${' '.repeat(remainingLength)}`) + ']';
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(chalk.green(`Loading... ${completed}%`) + (`${progressBar}`));
}

function main() {
  const args = process.argv.slice(2)
  args.forEach((arg, index, commandsArr) => {
    nextArg = commandsArr[index + 1]
    switch(arg) {
      case "-h":
      case "--help":
        commands.help = true
        break
      case "-p":
      case "--path":
        if(!nextArg) commands.path = "test"
        else if(nextArg.includes("-")) commands.path = "test"
        else commands.path = nextArg
        break
      case "-s":
      case "--sort":
        if(nextArg === "alpha") commands.sort = "alpha"
        else if(nextArg === "exten") commands.sort = "exten"
        else if(nextArg === "size") commands.sort = "size"
        else{
          console.log(chalk.yellow(`\nWARNING: Not sorted. Arg '${arg} ${nextArg}' not accepted, use: 'alpha', 'exten', 'size'.\n`))
        }
        break
      case "-t":
      case "--threshold":
        if(!nextArg) commands.threshold = 1 * THRESHOLD_MULT
        else if(nextArg.includes("-")) commands.threshold = 1 * THRESHOLD_MULT
        else commands.threshold = nextArg * THRESHOLD_MULT
        break
      case "-m":
      case "--metric":
        commands.metric = true
        break
      default:
        if(arg.includes('-')) {
          console.log(chalk.yellow(`WARNING: Arg '${arg}' not accepted`))
          callHelp()
        }
        break
    }
  })
  if(commands.help) callHelp()
  let parentName = commands.path.split("/")
  if(parentName[parentName.length - 1] === "") parentName.pop()
  //creates dir for starting point
  parentDir = {
    name: `${parentName.pop()}/`,
    size: 0,
    fileChildren: [],
    dirChildren: [],
  }

  try{
    const loadInterval1 = startLoadingBar()
    clearInterval(loadInterval1)
    updateLoadingBar(33,100)
    const loadInterval2 = startLoadingBar()

    dirArr.push(parentDir)
    walkDirTree(parentDir.name)

    clearInterval(loadInterval2)
    updateLoadingBar(66,100)
    const loadInterval3 = startLoadingBar()

    sumDirSize(parentDir)

    clearInterval(loadInterval3)
    updateLoadingBar(100,100)
    console.log()

    displayDir(parentDir)
  } catch(error) {
    errorCheck = true
    console.log(error)
    // if(error.code == 'ENOENT') console.log('....')
  }
}

main()
