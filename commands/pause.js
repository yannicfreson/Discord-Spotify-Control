// import variables
const config = require("../config.json");
let fs = require("fs");
let path = require("path");
const spotify = require("../helpers/spotify");
let TEMP_PATH = path.resolve(__dirname, "../", "temp.txt");

module.exports = {
  pauseFunc: function pause(msg, args) {
    spotify("/me/player/currently-playing").then((data) => {
      if (data !== "Request_Error") {
        try {
          let context_uri = data.context.uri;
          fs.writeFileSync(TEMP_PATH, context_uri, "utf8");
        } catch {
          msg.channel.send(config.stdError);
        }
      } else {
        msg.channel.send(config.reqError);
      }
      spotify("/me/player/pause", "PUT").then((data) => {
        if (data !== "Request_Error") {
          try {
            msg.channel.send("Paused");
          } catch {
            msg.channel.send(config.stdError);
          }
        } else {
          msg.channel.send(config.reqError);
        }
      });
    });
  },
};
