const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const fs = require("fs");
const bcrypt = require("bcryptjs");
const words = require("./mcupws.json");

const alphaNum =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const HASH_FILE = "./braden.2k.hashes.txt";

const encryptedHashes = fs
  .readFileSync(HASH_FILE, "utf8")
  .split(/\n|\r\n/gm)
  .map((line) => line);

function makeAnimation() {
  const numBars = 50;
  return (progress, totalProg) => {
    const percent = progress / (totalProg + 1);
    const numFilledBars = Math.floor(percent * numBars);
    const numEmptyBars = numBars - numFilledBars;
    const filledBar = "█".repeat(numFilledBars);
    const emptyBarLength = numEmptyBars > 0 ? numEmptyBars - 1 : 0;
    const emptyBar = " ".repeat(emptyBarLength);
    const bar = `[${filledBar}${emptyBar}]`;
    process.stdout.write(`\r${bar} Cracking... ${Math.floor(percent * 100)}%`);
  };
}

function crackPws(encryptedHashes, startIndex, endIndex) {
  let results = {
    startIndex: startIndex,
    endIndex: endIndex,
    cracked: [],
  };

  allLoop: for (let i = startIndex; i < endIndex; i++) {
    const hash = encryptedHashes[i];

    if (bcrypt.compareSync("", hash)) {
      results.cracked.push(`${hash} ''`);
      continue allLoop;
    }
    for (const char of alphaNum) {
      if (bcrypt.compareSync(char, hash)) {
        results.cracked.push(`${hash} ${char}`);
        continue allLoop;
      }
    }
    for (const pw of words) {
      if (bcrypt.compareSync(pw, hash)) {
        results.cracked.push(`${hash} ${pw}`);
        continue allLoop;
      }
    }
    for (const char1 of alphaNum) {
      for (const char2 of alphaNum) {
        let twoChar = `${char1}${char2}`;
        if (bcrypt.compareSync(twoChar, hash)) {
          results.cracked.push(`${hash} ${twoChar}`);
          continue allLoop;
        }
      }
    }
    for (const char1 of alphaNum) {
      for (const char2 of alphaNum) {
        for (const char3 of alphaNum) {
          let threeChar = `${char1}${char2}${char3}`;
          if (bcrypt.compareSync(threeChar, hash)) {
            results.cracked.push(`${hash} ${threeChar}`);
            continue allLoop;
          }
        }
      }
    }
  }
  return results;
}

if (cluster.isMaster) {
  const tick = makeAnimation();
  console.time(`${numCPUs} cores sync`);

  // Divide the tasks into smaller chunks
  const totTaskCount = numCPUs;
  const chunkSize = Math.ceil(encryptedHashes.length / totTaskCount);
  let startIndex = 0;
  let tasks = [];

  for (let i = 0; i < numCPUs; i++) {
    const endIndex = Math.min(startIndex + chunkSize, encryptedHashes.length);
    const workerTask = {
      startIndex,
      endIndex,
      taskId: i,
    };
    tasks.push(workerTask);
    startIndex = endIndex;
  }

  // Spawn worker processes
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();

    // Send each worker its task
    worker.send(tasks[i]);
  }
  tick(0, numCPUs);

  let tasksCompleted = 0;
  let results = [];
  let totTaskComplete = 0;

  // Collect results from worker processes
  cluster.on("message", (worker, message) => {
    if (message.type === "result") {
      results = results.concat(message.results);
      totTaskComplete++;
    }
    if (message.type === "done") {
      tick(totTaskComplete, totTaskCount);

      if (totTaskComplete < totTaskCount) {
        tasksCompleted++;
        tasks = [];

        if (tasksCompleted === numCPUs) {
          for (let i = 0; i < numCPUs; i++) {
            const endIndex = Math.min(
              startIndex + chunkSize,
              encryptedHashes.length
            );
            const workerTask = {
              startIndex,
              endIndex,
              taskId: i,
            };
            tasks.push(workerTask);
            startIndex = endIndex;
          }
          for (const id in cluster.workers) {
            cluster.workers[id].send(tasks[id - 1]);
            tasksCompleted--;
          }
        }
      } else {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);

        sortedResults = results.sort((a, b) => a.startIndex - b.startIndex);
        // Write results to output file
        const allHashes = [];
        for (const result of sortedResults) {
          for (const hash of result.cracked) {
            allHashes.push(hash);
          }
        }

        const file = fs.createWriteStream("./braden.2K.hashes.answers.txt");
        allHashes.forEach((value) => file.write(`${value}\n`));
        console.timeEnd(`${numCPUs} cores sync`);

        for (const id in cluster.workers) {
          cluster.workers[id].kill();
        }
      }
    }
  });
} else {
  // Worker process
  process.on("message", async (task) => {
    const results = crackPws(encryptedHashes, task.startIndex, task.endIndex);

    process.send({
      type: "result",
      results,
    });

    process.send({
      type: "done",
      workerId: cluster.worker.id,
    });
  });
}
