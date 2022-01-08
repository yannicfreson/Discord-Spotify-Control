const config = require("../config.json");
const spotify = require("../helpers/spotify");
const lyricsSearcher = require("lyrics-searcher");
const { MessageEmbed } = require("discord.js");

module.exports = {
  lyrFunc: function lyr(msg, args) {
    spotify("/me/player/currently-playing").then((data) => {
      if (data !== "Request_Error") {
        try {
          lyricsSearcher(
            `${data.item.artists[0].name.toLowerCase()}`,
            `${data.item.name
              .replace(" - Radio Edit", "")
              .replace(" - Remix", "")
              .replace(" (Original Mix)", "")
              .replace("(", "")
              .replace(")", "")
              .toLowerCase()}`
          )
            .then((lyrics) => {
              if (lyrics.length < config.MAX_LYRIC_LENGTH_PER_EMBED) {
                const embed = new MessageEmbed()
                  .setColor("#000000")
                  .setTitle(
                    `${data.item.name
                      .replace(" - Radio Edit", "")
                      .replace(" - Remix", "")
                      .replace(" (Original Mix)", "")
                      .replace("(", "")
                      .replace(")", "")} by ${data.item.artists[0].name}`
                  )
                  .setDescription(lyrics)
                  .setTimestamp();

                msg.channel.send({ embeds: [embed] });
              } else {
                lyricsLines = lyrics.split("\n");
                for (
                  let i = 0;
                  i <
                  Math.ceil(lyrics.length / config.MAX_LYRIC_LENGTH_PER_EMBED);
                  i++
                ) {
                  lyricsContent = "";
                  while (
                    lyricsContent.length < config.MAX_LYRIC_LENGTH_PER_EMBED &&
                    lyricsLines.length > 0
                  ) {
                    lyricsContent += `${lyricsLines.shift()}\n`;
                  }
                  if (i === 0) {
                    const embed = new MessageEmbed()
                      .setColor("#000000")
                      .setTitle(
                        `${data.item.name
                          .replace(" - Radio Edit", "")
                          .replace(" - Remix", "")
                          .replace(" (Original Mix)", "")
                          .replace("(", "")
                          .replace(")", "")} by ${data.item.artists[0].name}`
                      )
                      .setDescription(lyricsContent);

                    msg.channel.send({ embeds: [embed] });
                  } else if (
                    i + 1 >=
                    Math.ceil(lyrics.length / config.MAX_LYRIC_LENGTH_PER_EMBED)
                  ) {
                    const embed = new MessageEmbed()
                      .setColor("#000000")
                      .setDescription(lyricsContent)
                      .setTimestamp();

                    msg.channel.send({ embeds: [embed] });
                  } else {
                    const embed = new MessageEmbed()
                      .setColor("#000000")
                      .setDescription(lyricsContent);

                    msg.channel.send({ embeds: [embed] });
                  }
                }
              }
            })
            .catch((error) => {
              msg.channel.send(config.lyrError);
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
