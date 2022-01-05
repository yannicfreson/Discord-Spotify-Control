// import dependencies
const { Client, Intents } = require("discord.js");
const fs = require("fs");
const path = require("path");

// import variables
const auth = require("./auth.json");
const config = require("./config.json");

let commands = {};
const directoryPath = path.join("./", "commands");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
});

const prefix = config.prefix;

let available = true;

client.login(auth.token);

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
  console.log("Ready!");
  setStatus();

  // Load available commands
  fs.readdir(directoryPath, function (err, files) {
    files.forEach((file) => {
      let func = require(`./commands/${file}`);
      commands[`${file.slice(0, -3).toLowerCase()}`] =
        func[`${file.slice(0, -3)}Func`];
    });
  });
});

// Listen for message
client.on("messageCreate", async (msg) => {
  // Check if author of message is authorized to do shtuff
  if (msg.author.id === config.me) {
    // Check if message has bot's prefix
    if (msg.content.substring(0, prefix.length) === prefix) {
      let args = msg.content.substring(prefix.length).split(" ");
      args.shift();
      processMsg(msg, args);
    }
  }
});

// Process the message by dynamically calling the correct function
async function processMsg(msg, args) {
  if (args[0] !== null) {
    let cmd = args[0];
    try {
      commands[cmd](msg, args);
    } catch {
      msg.channel.send(config.stdError);
    }
  }

  setStatus();
}

function setStatus() {
  client.user.setActivity(`Spotify`, {
    type: "LISTENING",
  });
}
