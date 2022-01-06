// import variables
const config = require("../config.json");
const fetch = require("node-fetch");
let spotify = require("../spotify");

module.exports = {
  meFunc: function me(msg, args) {
    try {
      spotify("/me").then((data) => {
        msg.channel.send(data.display_name);
      });
    } catch {
      msg.channel.send(config.stdError);
    }
  },
};
