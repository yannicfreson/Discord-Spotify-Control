// import variables
const config = require("../config.json");
let spotify = require("../spotify");

module.exports = {
  nextFunc: function next(msg, args) {
    spotify("/me/player/next", "POST").then((data) => {
      if (data !== "Request_Error") {
        try {
          msg.channel.send("Playing next song ...");
        } catch {
          msg.channel.send(config.stdError);
        }
      } else {
        msg.channel.send(config.reqError);
      }
    });
  },
};
