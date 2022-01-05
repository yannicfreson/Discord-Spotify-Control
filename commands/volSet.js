// import variables
const config = require("../config.json");
const { exec } = require("child_process");

module.exports = {
  volSetFunc: function vol(msg, args) {
    try {
      msg.channel.send(`Volume set to ${args[1]}%`);
      exec(`nircmd setsysvolume ${(65535 / 100) * args[1]}`);
    } catch {
      console.log(config.stdError);
    }
  },
};
