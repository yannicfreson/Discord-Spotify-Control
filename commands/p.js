// import variables
const config = require("../config.json");
const { MessageEmbed } = require("discord.js");
const spotify = require("../spotify");
const Vibrant = require("node-vibrant");

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

module.exports = {
  pFunc: function p(msg, args) {
    spotify("/me/player/currently-playing").then((data) => {
      if (data !== "Request_Error") {
        try {
          let accentColor;
          let vibrant = new Vibrant(data.item.album.images[0].url);
          vibrant.getPalette().then((palette) => {
            accentColor = palette.Vibrant.hex;

            const embed = new MessageEmbed()
              .setColor(accentColor)
              .setTitle(
                `${data.item.name
                  .replace(" - Radio Edit", "")
                  .replace(" - Remix", "")
                  .replace(" (Original Mix)", "")} by ${
                  data.item.artists[0].name
                }`
              )
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
                },
                {
                  name: "Duration",
                  value: `${millisToMinutesAndSeconds(
                    data.progress_ms
                  )} / ${millisToMinutesAndSeconds(data.item.duration_ms)}`,
                  inline: true,
                }
              )
              .setImage(data.item.album.images[0].url)
              .setTimestamp();

            msg.channel.send({ embeds: [embed] });
          });
        } catch {
          msg.channel.send(config.stdError);
        }
      } else {
        msg.channel.send(config.reqError);
      }
    });
  },
};
