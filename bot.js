// import dependencies
const { Client, Intents } = require("discord.js");
const fs = require("fs");
const path = require("path");

// import variables
const auth = require("./auth.json");
const config = require("./config.json");

let commands = {};
let commandsList = [];
const directoryPath = path.join("./", "commands");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
  partials: ["CHANNEL"],
});

const prefix = config.prefix;

let available = true;

client.login(auth.TOKEN);

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
      commandsList.push(file.slice(0, -3).toLowerCase());
    });
  });
});

// Listen for message
client.on("messageCreate", async (msg) => {
  // Check if author of message is authorized to do shtuff
  if (msg.author.id === config.me || msg.author.id === config.bot) {
    // Check if message has bot's prefix
    if (
      msg.content.substring(0, prefix.length).toLowerCase() ===
      prefix.toLowerCase()
    ) {
      let args = msg.content.substring(prefix.length).split(" ");
      args.shift();
      processMsg(msg, args);
      if (msg.channel.type !== "DM" || msg.guild !== null) {
        msg.delete();
      }
      if (msg.author.id === config.bot) {
        msg.delete();
      }
    }
  }
});

// Process the message by dynamically calling the correct function
async function processMsg(msg, args) {
  if (args[0] !== null) {
    let cmd = args[0].toLowerCase();
    if (cmd === "h" || cmd === "help") {
      let out = "";
      commandsList.forEach((c) => {
        out += `**- ${c.toUpperCase()}**\n${commands[c](msg, args, true)}\n`;
      });
      msg.channel.send(out);
    }
    try {
      commands[cmd](msg, args);
    } catch {}
  }

  setStatus();
}

function setStatus() {
  client.user.setActivity(`Spotify`, {
    type: "LISTENING",
  });
}
