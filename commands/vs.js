const config = require("../config.json");
const { exec } = require("child_process");

module.exports = {
  vsFunc: function vs(msg, args, description) {
    if (!description) {
      try {
        msg.channel.send(`Volume set to ${args[1]}%`);
        exec(`nircmd setsysvolume ${(65535 / 100) * args[1]}`);
      } catch {
        msg.channel.send(config.stdError);
      }
    } else {
      return "Set volume to amount";
    }
  },
};
