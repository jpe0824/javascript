//Positive req:
const fs = require("fs");
const dirArr = [];

function postOrder(path) {
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

      postOrder(`${path}${dir.name}`);
    } else if (dirEntry.isFile()) {
      //files
      let size = fs.statSync(`${path}${dirEntry.name}`).size;
      let parent = path.split("/");
      parent.pop();

      let file = {
        name: `${dirEntry.name}`,
        size: size,
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
  //display directories
  console.group(`${arr.name} ${arr.size} bytes`);
  //display children
  arr.children.forEach((child) => {
    console.log(`${child.name} ${child.size} bytes`);
  });
  arr.dirChildren.forEach((child) => {
    displayDir(child);
  });
  console.groupEnd();
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes("-h") || args.includes("--help")) {
    let text = fs.readFileSync("help.txt", "utf8");
    console.log(`\n${text}\n`);
    return;
  }

  command = args.pop();
  postOrder(command);
  displayDir(dirArr[0]);
  
}

main();
