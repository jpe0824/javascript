const Discord = require("discord.js");
const client = new Discord.client();

TOKEN = [
  MTA5Mjg1NzA4NjE1NDY0NTUzNQ.GxG8W7.F41A5RZrsYuFRAiAT6GMwTDRAHbjJfiTt3BYuA,
];

client.on("ready", () => {
  console.log(`logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {
  if (msg.content === "ping") {
    msg.reply("pong");
  }
});

client.login(TOKEN);
