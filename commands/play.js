const config = require("../config.json");
const fs = require("fs");
const path = require("path");
const spotify = require("../helpers/spotify");
const TEMP_PATH = path.resolve(__dirname, "../", "temp.txt");
const { exec } = require("child_process");

module.exports = {
  playFunc: function play(msg, args) {
    let data = fs.readFileSync(TEMP_PATH, "utf8");
    spotify(
      "/me/player/play?device_id=5b21680fddd005d05441c762ac9d14c8862d051e",
      "PUT",
      data
    ).then((data) => {
      if (data !== "Request_Error") {
        try {
          exec(`nircmd mutesysvolume 0`);
          spotify("/me/player/volume?volume_percent=100", "PUT");
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
