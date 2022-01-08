// import variables
const config = require("../config.json");
const spotify = require("../helpers/spotify");

module.exports = {
  prevFunc: function prev(msg, args) {
    spotify("/me/player/previous", "POST").then((data) => {
      if (data !== "Request_Error") {
        try {
          msg.channel.send("Playing previous song ...");
        } catch {
          msg.channel.send(config.stdError);
        }
      } else {
        msg.channel.send(config.reqError);
      }
    });
  },
};
