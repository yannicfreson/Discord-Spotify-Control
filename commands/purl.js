const config = require("../config.json");
const spotify = require("../helpers/spotify");

module.exports = {
  purlFunc: function purl(msg, args) {
    spotify("/me/player/currently-playing").then((data) => {
      if (data !== "Request_Error") {
        try {
          msg.channel.send(`${data.item.external_urls.spotify}`);
          //console.dir(data, { depth: null });
        } catch {
          msg.channel.send(config.stdError);
        }
      } else {
        msg.channel.send(config.reqError);
      }
    });
  },
};
