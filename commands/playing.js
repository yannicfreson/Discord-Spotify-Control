// import variables
const config = require("../config.json");
const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
let spotify = require("../spotify");

module.exports = {
  playingFunc: function playing(msg, args) {
    spotify("/me/player/currently-playing").then((data) => {
      try {
        //console.dir(data, { depth: null });
        const embed = new MessageEmbed()
          .setColor("#000000")
          .setTitle(`${data.item.name} by ${data.item.artists[0].name}`)
          .addFields(
            {
              name: "Release date",
              value: data.item.album.release_date,
              inline: true,
            },
            {
              name: "Album",
              value: data.item.album.name,
              inline: true,
            }
          )
          .setImage(data.item.album.images[0].url)
          .setTimestamp();

        msg.channel.send({ embeds: [embed] });
      } catch {
        msg.channel.send(config.stdError);
      }
    });
  },
};
