require("dotenv").config(); //to start process from .env file
const fs = require("fs");
const lorem = require("lorem-ipsum");
const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client();

client.on("ready", () => {
  console.log(`logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {
  // console.log(`message recieved: ${msg.content}`);
  if (msg.content === "!help") {
    let helpText = fs.readFileSync("help.txt", "utf8");
    msg.channel.send(`\n${helpText}\n\n`);
  }
  if (msg.content === "!lorem") {
    msg.channel.send(lorem());
  }
});

client.login(process.env.TOKEN);
