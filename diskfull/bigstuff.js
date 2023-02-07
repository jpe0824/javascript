//Positive req:
const fs = require("fs");
const filesize = require("filesize");

const dirArr = [];
let commands = {
  p: "./",
  h: false,
  s: false,
  m: false,
  t: false,
  b: false,
};

function walkTree(path) {
  const dirEntries = fs.readdirSync(path, { withFileTypes: true });
  for (let dirEntry of dirEntries) {
    if (dirEntry.name.startsWith("."));
    else {
      //directories
      if (dirEntry.isDirectory()) {
        let parent = path.split("/");
        parent.pop();

        let dir = {
          name: `${dirEntry.name}/`,
          size: 0,
          parent: `${parent.pop()}/`,
          children: [],
          dirChildren: [],
        };

        dirArr.push(dir);

        for (let tmpDir of dirArr) {
          if (dir.parent == tmpDir.name) tmpDir.dirChildren.push(dir);
        }

        walkTree(`${path}${dir.name}`);
      } else if (dirEntry.isFile()) {
        //files
        let size = fs.statSync(`${path}${dirEntry.name}`).size;
        let parent = path.split("/");
        let exten = dirEntry.name.split(".");
        parent.pop();

        let file = {
          name: `${dirEntry.name}`,
          size: size,
          exten: `${exten[1]}`,
          parent: `${parent.pop()}/`,
        };

        for (let tmpDir of dirArr) {
          if (tmpDir.name == file.parent) {
            tmpDir.size += file.size;
            tmpDir.children.push(file);
            for (let nestedDir of dirArr) {
              if (nestedDir.name == tmpDir.parent) nestedDir.size += file.size;
            }
          }
        }
      }
    }
  }
}

function displayDir(dirArr) {
  if (commands.s) {
    switch (commands.s) {
      //todo - validate sorting functions actually working
      case "alpha":
        //sort by name
        dirArr.children.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
        break;
      case "exten":
        //sort by extenstion
        dirArr.children.sort((a, b) => {
          if (a.exten < b.exten) return -1;
          if (a.exten > b.exten) return 1;
          return 0;
        });
        break;
      default:
        //sort by size;
        dirArr.children.sort((a, b) => b.size - a.size);
        break;
    }
  }
  //display directories
  if (commands.t) {
    if (dirArr.size < commands.t) {
      return;
    }
  }
  // console.log(filesize(1000000000, { exponent: 2, fullform: true }));
  console.group(`${dirArr.name}   ${dirArr.size.toLocaleString()} bytes`);
  //display children
  dirArr.children.forEach((child) => {
    if (commands.t) {
      if (child.size >= commands.t)
        console.log(`${child.name}   ${child.size.toLocaleString()} bytes`);
    } else {
      console.log(`${child.name}   ${child.size.toLocaleString()} bytes`);
    }
  });
  dirArr.dirChildren.forEach((child) => {
    displayDir(child);
  });
  console.groupEnd();
}

function main() {
  const args = process.argv;

  args.forEach((arg, index, commandsArr) => {
    nextArg = commandsArr[index + 1];
    switch (arg) {
      case "-h":
      case "--help":
        commands.h = true;
        break;
      case "-p":
      case "--path":
        if (!nextArg) commands.p = "./";
        else if (nextArg.includes("-")) commands.p = "./";
        else commands.p = nextArg;
        break;
      case "-s":
      case "--sort":
        switch (nextArg) {
          case "alpha":
            commands.s = "alpha";
            break;
          case "exten":
            commands.s = "exten";
            break;
          case "size":
            commands.s = "size";
            break;
          default:
            commands.s = false;
            break;
        }
      case "-t":
      case "--threshold":
        if (!nextArg) commands.t = 1;
        else if (nextArg.includes("-")) commands.t = 1;
        else commands.t = nextArg;
        break;
      default:
        break;
    }
  });

  // console.log(commands);
  if (commands.h) {
    let text = fs.readFileSync("help.txt", "utf8");
    console.log(`\n${text}\n`);
    return;
  }

  let parentName = commands.p.split("/");
  parentName.pop();

  parentDir = {
    name: `${parentName.pop()}/`,
    size: 0,
    children: [],
    dirChildren: [],
  };
  dirArr.push(parentDir);
  walkTree(commands.p);
  console.log(dirArr);
  displayDir(dirArr[0]);
}

main();
