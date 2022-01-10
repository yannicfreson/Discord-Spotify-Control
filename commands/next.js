const config = require("../config.json");
const spotify = require("../helpers/spotify");

module.exports = {
  nextFunc: function next(msg, args, description) {
    if (!description) {
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
    } else {
      return "Skips to next song";
    }
  },
};
