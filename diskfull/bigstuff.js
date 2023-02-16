/*
Project bigstuff V1
Jason Edman
CS3380-001
*/

const fs = require("fs")
const filesize = require("filesize")

const WRITE_CONSOLE = console.Console(fs.createWriteStream("./bigstuff.txt"))
const THRESHOLD_MULT = 1_000_000_000

const dirArr = []
const commands = {
  path: "test",
  help: false,
  sort: false,
  metric: false,
  threshold: false,
  blocksize: false,
}

const sortAlpha = (a, b) => (a.name.toLowerCase() > a.name.toLowerCase()) - (a.name.toLowerCase() < b.name.toLowerCase())
const sortExten = (a, b) => (a.name.split(".").pop() > b.name.split(".").pop()) - (a.name.split(".").pop() < b.name.split(".").pop())
const sortSize = (a, b) => b.size - a.size

const sortOrder = {
  "alpha": sortAlpha,
  "exten": sortExten,
  "size": sortSize
}

function walkDirTree(path) {
  const dirEntries = fs.readdirSync(path, { withFileTypes: true })

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
    } else if(dirEntry.isFile()) {
      let size = fs.statSync(`${path}${dirEntry.name}`).size
      //handles blocksize if set
      if(commands.blocksize) size = 4096 * Math.ceil(size / 4096)

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

function displayDir(dirArr) {
  if(commands.sort) {
    dirArr.dirChildren.sort(sortOrder[commands.sort])
    dirArr.fileChildren.sort(sortOrder[commands.sort])
  }
  if(commands.threshold) if(dirArr.size < commands.threshold) return
  if(commands.metric) dirArr.size = filesize(dirArr.size)

  //display directories
  WRITE_CONSOLE.group(`${dirArr.name}   ${dirArr.size.toLocaleString()}`)
  dirArr.dirChildren.forEach((dirChild) => {
    displayDir(dirChild)
  })

  //display files
  dirArr.fileChildren.forEach((fileChild) => {
    if(commands.threshold) if(fileChild.size < commands.threshold) return
    if(commands.metric) fileChild.size = filesize(fileChild.size)
    WRITE_CONSOLE.log(`${fileChild.name}   ${fileChild.size.toLocaleString()}`)
  })
  WRITE_CONSOLE.groupEnd()
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
        if(nextArg === "exten") commands.sort = "exten"
        if(nextArg === "size") commands.sort = "size"
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
      case "-b":
      case "--blocksize":
        commands.blocksize = true
        break
      default:
        break
    }
  })

  //handle help call if set
  if(commands.help) {
    let helpText = fs.readFileSync("help.txt", "utf8")
    console.log(`\n${helpText}\n`)
    return
  }

  let parentName = commands.path.split("/")
  if(parentName[parentName.length - 1] === "") parentName.pop()
  //creates dir for starting point
  parentDir = {
    name: `${parentName.pop()}/`,
    size: 0,
    fileChildren: [],
    dirChildren: [],
  }
  dirArr.push(parentDir)

  walkDirTree(parentDir.name)
  sumDirSize(dirArr[0])
  displayDir(dirArr[0])
}

main()