const config = require("../config.json");
const { exec } = require("child_process");

module.exports = {
  hibFunc: function hib(msg, args, description) {
    if (!description) {
      try {
        msg.channel.send(`Night night :zzz:`);
        exec(`shutdown /h`);
      } catch {
        msg.channel.send(config.stdError);
      }
    } else {
      return "Puts pc in hibernate";
    }
  },
};
