// import variables
const config = require("../config.json");
const { exec } = require("child_process");

module.exports = {
  vFunc: function v(msg, args) {
    try {
      msg.channel.send(`Volume changed by ${args[1]}%`);
      exec(`nircmd changesysvolume ${(65535 / 100) * args[1]}`);
    } catch {
      msg.channel.send(config.stdError);
    }
  },
};
