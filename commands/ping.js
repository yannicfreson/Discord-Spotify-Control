// import variables
const config = require("../config.json");

module.exports = {
  pingFunc: function ping(msg, args) {
    try {
      msg.channel.send("Pong");
    } catch {
      console.log(config.stdError);
    }
  },
};
