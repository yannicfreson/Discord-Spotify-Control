const config = require("../config.json");

module.exports = {
  pingFunc: function ping(msg, args, description) {
    if (!description) {
      try {
        msg.channel.send("Pong");
      } catch {
        msg.channel.send(config.stdError);
      }
    } else {
      return "Tests connection";
    }
  },
};
