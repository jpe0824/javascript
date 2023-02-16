/*
Project bigstuff V1
Jason Edman
CS3380-001
*/

const fs = require("fs")
const filesize = require("filesize")

const WRITE_CONSOLE = console.Console(fs.createWriteStream("./bigstuff.txt"))
const BLOCK_SIZE = 4096
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

function walkDirTree(path) {
  const dirEntries = fs.readdirSync(path, { withFileTypes: true })

  for(let dirEntry of dirEntries) {
    //ignore hidden directories
    if(dirEntry.name.startsWith("."));
    else {
      //directories
      if(dirEntry.isDirectory()) {
        let parent = path.split("/")
        parent.pop()

        let dir = {
          name: `${dirEntry.name}/`,
          size: 0,
          parent: `${parent.pop()}/`,
          children: [],
          dirChildren: [],
        }

        dirArr.push(dir)

        for(let tmpDir of dirArr) {
          if(dir.parent == tmpDir.name) tmpDir.dirChildren.push(dir)
        }

        walkDirTree(`${path}${dir.name}`)

        //files
      } else if(dirEntry.isFile()) {
        let size = fs.statSync(`${path}${dirEntry.name}`).size
        let parent = path.split("/")
        let exten = dirEntry.name.split(".")
        parent.pop()

        //handles blocksize if set
        if(commands.blocksize) size = BLOCK_SIZE * Math.ceil(size / BLOCK_SIZE)

        let file = {
          name: `${dirEntry.name}`,
          size: size,
          exten: `${exten[exten.length - 1]}`,
          parent: `${parent.pop()}/`,
        }

        //assign dir children and add file size to dir
        for(let tmpDir of dirArr) {
          if(tmpDir.name == file.parent) {
            tmpDir.size += file.size
            tmpDir.children.push(file)
          }
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
  //handles sorting commands if set
  if(commands.sort) {
    switch(commands.sort) {
      case "alpha":
        dirArr.children.sort((a, b) => {
          if(a.name < b.name) return -1
          if(a.name > b.name) return 1
          return 0
        })
        break
      case "exten":
        dirArr.children.sort((a, b) => {
          if(a.exten < b.exten) return -1
          if(a.exten > b.exten) return 1
          return 0
        })
        break
      case "size":
        dirArr.children.sort((a, b) => b.size - a.size)
        break
    }
  }
  //handles threshold if set for dir
  if(commands.threshold) if(dirArr.size < commands.threshold) return

  //handles metrics if set for dir
  if(commands.metric) dirArr.size = filesize(dirArr.size)

  //display directories
  WRITE_CONSOLE.group(`${dirArr.name}   ${dirArr.size.toLocaleString()}`)
  dirArr.dirChildren.forEach((dirChild) => {
    displayDir(dirChild)
  })
  //display children
  dirArr.children.forEach((fileChild) => {
    //handles threshold for files
    if(commands.threshold) {
      if(fileChild.size >= commands.threshold) {
        //handles metrics for files
        if(commands.metric) fileChild.size = filesize(fileChild.size)
        WRITE_CONSOLE.log(`${fileChild.name}   ${fileChild.size.toLocaleString()}`)
      }
    } else {
      //handles metrics for files
      if(commands.metric) fileChild.size = filesize(fileChild.size)
      WRITE_CONSOLE.log(`${fileChild.name}   ${fileChild.size.toLocaleString()}`)
    }
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
    children: [],
    dirChildren: [],
  }
  dirArr.push(parentDir)

  try {
    walkDirTree(parentDir.name)
  } catch(error) {
    console.error("ERROR: Try different path\n\n", error)
    return
  }
  sumDirSize(dirArr[0])
  displayDir(dirArr[0])
}

main()