require("dotenv").config(); //to start process from .env file
const fs = require("fs");
const lorem = require("lorem-ipsum");
const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client();

const twilioClient = require("twilio")(process.env.SID, process.env.AUTH_TOKEN);

function text(message, to) {
  try {
    twilioClient.messages
      .create({
        body: message,
        from: "+18775890753",
        to: `+1${to}`,
      })
      .then((message) => console.log(message.sid));
  } catch (e) {
    console.log(e);
  }
}

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
  if (msg.content.includes("!text")) {
    try {
      const content = msg.content.split(" ");
      content.shift();
      const phoneNum = content.shift();
      console.log(phoneNum);
      const message = content.join(" ");
      text(message, phoneNum);
    } catch (error) {
      msg.reply(`ERROR: Usage - !text 1234567891 message to send`);
    }
    msg.reply(`Message sent to ${phoneNum}`);

    // console.log(msg.content[0])
  }
  //text to send to a phone
  //email to send an email
  //music to stream music remotely
  //weather gets local weather blurb
});

client.login(process.env.TOKEN);
