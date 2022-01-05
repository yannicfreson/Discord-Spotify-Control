// import variables
const config = require("../config.json");
const { exec } = require("child_process");

module.exports = {
  volFunc: function vol(msg, args) {
    try {
      console.log(args);
      msg.channel.send(`Volume changed by ${args[1]}%`);
      exec(`nircmd changesysvolume ${(65535 / 100) * args[1]}`);
    } catch {
      console.log(config.stdError);
    }
  },
};
