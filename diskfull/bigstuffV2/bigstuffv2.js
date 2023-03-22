/*
Project bigstuff V2
Jason Edman
CS3380-001
*/

const fs = require("fs")
const filesize = require("filesize")
const chalk = require("chalk")
const { globIterateSync } = require("glob")

const THRESHOLD_MULT = 1_000_000_000

const fileArr = []
const commands = {
  path: "./**/*",
  help: false,
  helpLang: "en",
  sort: false,
  metric: false,
  threshold: false,
}

let fileCount = 0
let totalSize = 0

const sortAlpha = (a, b) => (a.fileName.toLowerCase() === b.fileName.toLowerCase()) ? 0
                            : (a.fileName.toLowerCase() < b.fileName.toLowerCase() ? -1 : 1)
const sortExten = (a, b) => (a.fileName.split(".").pop() === b.fileName.split(".").pop()) ? 0
                            : (a.fileName.split(".").pop() < b.fileName.split(".").pop() ? -1 : 1)
const sortSize = (a, b) => b.size - a.size
const sortOrder = {
  "alpha": sortAlpha,
  "exten": sortExten,
  "size": sortSize
}

function callHelp(lang="en") {
  let helpText = fs.readFileSync("help.txt", "utf8")
  if(lang == "es") helpText = fs.readFileSync("help_es.txt", "utf8")
  console.log(`\n${helpText}\n`)
  return
}

function globFiles(path="./**/*") {
  const tick = makeAnimation()
  for(const file of globIterateSync(path)) {
    try {
      tick()
      let size = fs.statSync(file).size

      fileCount += 1
      totalSize += size
      if(size < commands.threshold) continue

      if(file.includes(".")) {
        fileObj = {
          fileName: file,
          size: size,
        }
        fileArr.push(fileObj)
      }
    } catch {
      continue
    }
  }
}

function displayFiles() {
  if(commands.sort) fileArr.sort(sortOrder[commands.sort])
  let total = 0

  if(commands.metric) total = filesize(totalSize)
  else total = totalSize

  const longestPathLen = Math.max(...fileArr.map(item => item.fileName.length))
  const longestSizeLen = Math.max(...fileArr.map(item => item.size.length))

  for(const file of fileArr) {
    if(commands.metric) file.size = filesize(file.size)
    else file.size = file.size.toString()

    console.log(`${chalk.green(file.fileName.padEnd(longestPathLen+2))}${chalk.yellow(file.size.padStart(longestSizeLen))}`)
  }
  console.log(`\nTotal size: ${chalk.yellow(total)} between ${chalk.yellow(fileCount)} files, in directory: ${commands.path}`)
}

function makeAnimation() {
  let chars = ["⠙", "⠘", "⠰", "⠴", "⠤", "⠦", "⠆", "⠃", "⠋", "⠉"]
  let n = 0
  return () => {
      if(n % 2131) process.stdout.write(`\r${chars[n % chars.length]} Loading...`)
      n++
  }
}

function main() {
  const args = process.argv.slice(2)
  args.forEach((arg, index, commandsArr) => {
    nextArg = commandsArr[index + 1]
    switch(arg) {
      case "-h":
      case "--help":
        if(!nextArg) commands.helpLang = "en"
        else if(nextArg.includes("-")) commands.helpLang = "en"
        else commands.helpLang = nextArg
        commands.help = true
        break
      case "-p":
      case "--path":
        if(!nextArg) break
        else if(nextArg.includes("-")) break
        else commands.path = nextArg
        break
      case "-s":
      case "--sort":
        if(nextArg === "alpha") commands.sort = "alpha"
        else if(nextArg === "exten") commands.sort = "exten"
        else if(nextArg === "size") commands.sort = "size"
        else if(nextArg.includes("-")) console.log(chalk.yellow(`\nWARNING: Not sorted. use: -s 'alpha', 'exten', 'size'.\n`))
        else console.log(chalk.yellow(`\nWARNING: Not sorted. Arg '${arg} ${nextArg}' not accepted, use: 'alpha', 'exten', 'size'.\n`))
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
        break
    }
  })
  if(commands.help) {
    callHelp(commands.helpLang)
    return
  }

  try{
    globFiles(commands.path)
  } catch {
    console.log(chalk.red("An error occured while trying to glob files. Please check all args"))
    callHelp(commands.helpLang)
    return
  }

  if(fileCount < 1){
    console.log(chalk.red(`Error: Could not find files, please check file path or glob pattern.  use: -p "dir/**/*"`))
    return
  }

  process.stdout.clearLine()
  process.stdout.cursorTo(0)
  displayFiles()
}

main()