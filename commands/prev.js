// import variables
const config = require("../config.json");
const fetch = require("node-fetch");
let spotify = require("../spotify");

module.exports = {
  prevFunc: function prev(msg, args) {
    try {
      spotify("/me/player/previous", "POST").then((data) => {
        msg.channel.send("Playing previous song ...");
      });
    } catch {
      msg.channel.send(config.stdError);
    }
  },
};
