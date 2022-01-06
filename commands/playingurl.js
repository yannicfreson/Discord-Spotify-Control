// import variables
const config = require("../config.json");
const fetch = require("node-fetch");
let spotify = require("../spotify");

module.exports = {
  playingurlFunc: function playingurl(msg, args) {
    spotify("/me/player/currently-playing").then((data) => {
      try {
        msg.channel.send(`${data.item.external_urls.spotify}`);
        console.dir(data, { depth: null });
      } catch {
        msg.channel.send(config.stdError);
      }
    });
  },
};
