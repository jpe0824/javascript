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
    msg.reply(`\n${helpText}\n\n`);
  }
  if (msg.content === "!lorem") {
    msg.reply(lorem());
  }
  //TODO
  //Make webscraper for virus count in utah county https://coronavirus.utah.gov/case-counts/
  //Make random dad joke generator/ possibly webscraping, possibly just an array of dad jokes
  //Make die command to kill bot
  if (msg.content === "!die") {
    msg.channel.send("Shutting down...");
    setTimeout(() => {
      process.exit(1);
    }, 5000);
  }
  //text to send to a phone
  //email to send an email
  //music to stream music remotely
  //weather gets local weather blurb
});

client.login(process.env.TOKEN);
