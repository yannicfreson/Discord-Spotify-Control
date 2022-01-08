const config = require("../config.json");
const { exec } = require("child_process");

module.exports = {
  hibFunc: function hib(msg, args) {
    try {
      msg.channel.send(`Night night :zzz:`);
      exec(`shutdown /h`);
    } catch {
      msg.channel.send(config.stdError);
    }
  },
};
