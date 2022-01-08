// import variables
const config = require("../config.json");
let fs = require("fs");
let path = require("path");
let spotify = require("../spotify");
let TEMP_PATH = path.resolve(__dirname, "../", "temp.txt");

module.exports = {
  playFunc: function play(msg, args) {
    let data = fs.readFileSync(TEMP_PATH, "utf8");
    spotify("/me/player/play", "PUT", data).then((data) => {
      if (data !== "Request_Error") {
        try {
          spotify("/me/player/shuffle?state=true", "PUT");
          spotify("/me/player/next", "POST");
          spotify("/me/player/shuffle?state=false", "PUT");
          setTimeout(() => {
            msg.channel.send(`${config.prefix} p`);
          }, 1000);
        } catch {
          msg.channel.send(config.stdError);
        }
      } else {
        msg.channel.send(config.reqError);
      }
    });
  },
};
