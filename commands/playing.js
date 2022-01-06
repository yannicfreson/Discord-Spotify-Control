// import variables
const config = require("../config.json");
const fetch = require("node-fetch");
let spotify = require("../spotify");

module.exports = {
  playingFunc: function playing(msg, args) {
    spotify("/me/player/currently-playing").then((data) => {
      try {
        msg.channel.send(`**${data.item.name}**\n${data.item.artists[0].name}`);
        msg.channel.send(`${data.item.album.images.pop().url}`);
        console.dir(data, { depth: null });
      } catch {
        msg.channel.send(config.stdError);
      }
    });
  },
};
