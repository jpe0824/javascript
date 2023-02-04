const fs = require("fs");
//first walk build recursive data struct --- post order
//second walk preorder to display properly

function preOrder(path) {
  // parent
  console.log(`${path}/`);

  const children = fs.readdirSync(path);
  for (let child of children) {
    const stats = fs.statSync(child);
    const dirEntry = {
      name: child,
      size: stats.size,
    };
    console.log(dirEntry);
  }
}

// preOrder(".");

function postOrder(path) {
  //children
  const dirEntries = fs.readdirSync(path, { withFileTypes: true });
  for (let dirEntry of dirEntries) {
    if (dirEntry.isDirectory()) {
      let dir = {
        name: `${dirEntry.name}/`,
        size: 0,
        children: [],
      };
      console.log(dir);
      postOrder(`${path}${dir.name}`);
    } else if (dirEntry.isFile()) {
      let size = fs.statSync(`${path}${dirEntry.name}`).size;
      let file = {
        name: `${dirEntry.name}`,
        size: size,
      };
      console.log(file);
    }
    // console.log(dirEntry);
  }
}

postOrder("./");

// ELEPHANT CODE GRAVEYARD

// let G = {value: 'G', children: []}
// let H = {value: 'H', children: []}
// let I = {value: 'I', children: []}
// let F = {value: 'F', children: [G, H, I]}
// let D = {value: 'D', children: []};
// let E = {value: 'E', children: []};
// let B = {value: 'B', children: [D]};
// let C = {value: 'C', children: [E]};
// let A = {value: 'A', children: [B,C,F]};
// let root = A;

// console.log(JSON.stringify(root, null, 2));
// console.log('Post-Order')
// postOrder(root)

// function inOrder(node) {
//     if(node === null) return;
//     inOrder(node.left);
//     // parent
//     console.log(node.value);
//     inOrder(node.right);
// }

// function breadthFirst(cur) {
//     if (cur === null) return;
//     let q = [cur];
//     while (q.length){
//         cur = q.shift();
//         if (cur.left) q.push(cur.left);
//         if (cur.right) q.push(cur.right);
//         console.log(cur.value);
//     }
// }

// breadthFirst(root);
