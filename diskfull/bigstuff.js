const fs = require("fs");
const filesize = require("filesize");

const writeConsole = new console.Console(
  fs.createWriteStream("./bigstuff.txt")
);

const dirArr = [];
let commands = {
  p: "test",
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

        //files
      } else if (dirEntry.isFile()) {
        let size = fs.statSync(`${path}${dirEntry.name}`).size;
        let parent = path.split("/");
        let exten = dirEntry.name.split(".");
        parent.pop();

        //handles blocksize if set
        if (commands.b) {
          size = 4096 * Math.ceil(size / 4096);
        }

        let file = {
          name: `${dirEntry.name}`,
          size: size,
          exten: `${exten[exten.length - 1]}`,
          parent: `${parent.pop()}/`,
        };

        //handle size and asigns parents/children
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
  //handles sorting commands if set
  if (commands.s) {
    switch (commands.s) {
      //sort by name
      case "alpha":
        dirArr.children.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
        break;
      //sort by extenstion
      case "exten":
        dirArr.children.sort((a, b) => {
          if (a.exten < b.exten) return -1;
          if (a.exten > b.exten) return 1;
          return 0;
        });
        break;
      //sort by size;
      default:
        dirArr.children.sort((a, b) => b.size - a.size);
        break;
    }
  }
  //handles threshold if set for dir
  if (commands.t) {
    if (dirArr.size < commands.t) {
      return;
    }
  }
  //handles metrics if set for dir
  let bytes = "bytes";
  if (commands.m) {
    bytes = "";
    dirArr.size = filesize(dirArr.size);
  }
  //display directories
  writeConsole.group(
    `${dirArr.name}   ${dirArr.size.toLocaleString()} ${bytes}`
  );
  //display children
  dirArr.children.forEach((child) => {
    //handles metrics for files
    if (commands.m) child.size = filesize(child.size);
    //handles threshold for files
    if (commands.t) {
      if (child.size < commands.t);
      else
        writeConsole.log(
          `${child.name}   ${child.size.toLocaleString()} ${bytes}`
        );
    } else
      writeConsole.log(
        `${child.name}   ${child.size.toLocaleString()} ${bytes}`
      );
  });
  dirArr.dirChildren.forEach((child) => {
    displayDir(child);
  });
  writeConsole.groupEnd();
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
        if (!nextArg) commands.p = ".";
        else if (nextArg.includes("-")) commands.p = ".";
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
        break;
      case "-t":
      case "--threshold":
        if (!nextArg) commands.t = 1;
        else if (nextArg.includes("-")) commands.t = 1;
        else commands.t = nextArg;
        break;
      case "-m":
      case "--metric":
        commands.m = true;
        break;
      case "-b":
      case "--blocksize":
        commands.b = true;
        break;
      default:
        break;
    }
  });

  //handle help call if set
  if (commands.h) {
    let text = fs.readFileSync("help.txt", "utf8");
    console.log(`\n${text}\n`);
    return;
  }

  let parentName = commands.p.split("/");
  //creates dir for starting point
  parentDir = {
    name: `${parentName.pop()}/`,
    size: 0,
    children: [],
    dirChildren: [],
  };
  dirArr.push(parentDir);

  walkTree(parentDir.name);
  displayDir(dirArr[0]);
}

main();
