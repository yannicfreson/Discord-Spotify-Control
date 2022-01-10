const config = require("../config.json");
const { exec } = require("child_process");

module.exports = {
  vFunc: function v(msg, args, description) {
    if (!description) {
      try {
        msg.channel.send(`Volume changed by ${args[1]}%`);
        exec(`nircmd changesysvolume ${(65535 / 100) * args[1]}`);
      } catch {
        msg.channel.send(config.stdError);
      }
    } else {
      return "Change volume by amount";
    }
  },
};
