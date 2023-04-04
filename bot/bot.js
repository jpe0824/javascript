require("dotenv").config(); //to start process from .env file
const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client();

client.on("ready", () => {
  console.log(`logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {
  if (msg.content === "ping") {
    msg.reply("pong");
  }
});

client.login(process.env.TOKEN);
