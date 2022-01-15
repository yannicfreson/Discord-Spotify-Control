const config = require("../config.json");
const fs = require("fs");
const path = require("path");
const spotify = require("../helpers/spotify");
const TEMP_PATH = path.resolve(__dirname, "../", "temp.txt");
const { exec } = require("child_process");

module.exports = {
  playFunc: function play(msg, args, description) {
    if (!description) {
      let data = fs.readFileSync(TEMP_PATH, "utf8");
      spotify(
        "/me/player/play?device_id=5b21680fddd005d05441c762ac9d14c8862d051e",
        "PUT",
        data
      ).then((data) => {
        if (data !== "Request_Error") {
          try {
            exec(`nircmd mutesysvolume 0`);
            spotify("/me/player/volume?volume_percent=0", "PUT").then(() => {
              spotify("/me/player/shuffle?state=true", "PUT").then(() => {
                spotify("/me/player/next", "POST").then(() => {
                  spotify("/me/player/volume?volume_percent=100", "PUT");
                });
              });
            });

            setTimeout(() => {
              msg.channel.send(`${config.prefix} p`);
            }, 2000);
          } catch {
            msg.channel.send(config.stdError);
          }
        } else {
          msg.channel.send(config.reqError);
        }
      });
    } else {
      return "Unmutes pc and starts playing a random song";
    }
  },
};
