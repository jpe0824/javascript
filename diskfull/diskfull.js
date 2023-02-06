//Positive req:
const fs = require("fs");
const dirArr = [];
let commands = {
  p: "./",
  h: false,
  s: false,
  m: false,
  t: 1,
  b: false,
};

function walkTree(path) {
  const dirEntries = fs.readdirSync(path, { withFileTypes: true });
  for (let dirEntry of dirEntries) {
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

function displayDir(arr) {
  if (commands.s) {
    switch (commands.s) {
      //todo - validate sorting functions actually working
      case "alpha":
        //sort by name
        arr.children.sort((a, b) => a.name - b.name);
        break;
      case "exten":
        //sort by extenstion
        arr.children.sort((a, b) => a.exten - b.exten);
        break;
      default:
        //sort by size;
        arr.children.sort((a, b) => b.size - a.size);
        break;
    }
  }
  //display directories
  console.group(`${arr.name}   ${arr.size.toLocaleString()} bytes`);
  //display children
  arr.children.forEach((child) => {
    console.log(`${child.name}   ${child.size.toLocaleString()} bytes`);
  });
  arr.dirChildren.forEach((child) => {
    displayDir(child);
  });
  console.groupEnd();
}

function main() {
  const args = process.argv;

  args.forEach((arg, index, array) => {
    // console.log(array);
    // console.log(index + ": " + arg);

    switch (arg) {
      case "-h":
      case "--help":
        commands.h = true;
        break;
      case "-p":
        commands.p = "./";
        break;
      case "--path":
        commands.p = array[index + 1];
        break;
      case "-s":
      case "--sort":
        switch (array[index + 1]) {
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
      default:
        break;
    }
  });

  // process.argv.forEach(function (val, index, array) {
  //   console.log(index + ": " + val);
  // });
  console.log(commands);
  if (commands.h) {
    let text = fs.readFileSync("help.txt", "utf8");
    console.log(`\n${text}\n`);
    return;
  }
  walkTree(commands.p);
  displayDir(dirArr[0]);
}

main();
