const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

let count = 0;

if (cluster.isMaster) {
  const qty = 24;
  const splitQty = qty / numCPUs;
  console.log("Master: I have %d things to do", qty);
  console.log("Master: I will get my workers to do it for me.");

  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();
    let msg = { id: i, start: i * splitQty, end: i * splitQty + splitQty };
    console.log(msg);
    worker.send(msg);
    worker.on("message", (text) =>
      console.log('Master: my minion says "%s"', text)
    );
  }
} else {
  //worker
  process.on("message", ({ id, start, end }) => {
    console.log(`Worker ${id}: I have work to do from ${start} to ${end}`);

    // Sometime later ...
    process.send(`Worker ${id} all done with my ${end - start + 1} things`);
    process.exit();
  });
}
