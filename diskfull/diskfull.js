//Positive req:
const fs = require("fs");
const dirArr = [];
const fileArr = [];

function postOrder(path) {
  //children
  const dirEntries = fs.readdirSync(path, { withFileTypes: true });
  for (let dirEntry of dirEntries) {
    let dir = {
      name: "",
      size: 0,
      children: [],
    };
    if (dirEntry.isDirectory()) {
      dir = {
        name: `${dirEntry.name}/`,
        size: 0,
        children: [],
      };
      dirArr.push(dir);
      postOrder(`${path}${dir.name}`);
    } else if (dirEntry.isFile()) {
      let size = fs.statSync(`${path}${dirEntry.name}`).size;
      let file = {
        name: `${dirEntry.name}`,
        size: size,
        parent: path,
      };
      //TODO find a way to add children to parent object

      fileArr.push(file);
    }
  }
}

function main(path) {
  postOrder(path);
  console.log(dirArr);
  console.log(fileArr);
}

main("./");
