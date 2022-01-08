// import variables
const config = require("../config.json");
const fetch = require("node-fetch");
const spotify = require("../spotify");
const nodeHtmlParser = require("node-html-parser");
let fs = require("fs");
let path = require("path");
let TEMP_PATH = path.resolve(__dirname, "../", "output.txt");
let lyricsSearcher = require("lyrics-searcher");
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
              msg.channel.send(
                `**Lyrics for ${data.item.name
                  .replace(" - Radio Edit", "")
                  .replace(" - Remix", "")
                  .replace(" (Original Mix)", "")
                  .replace("(", "")
                  .replace(")", "")} by ${data.item.artists[0].name}**`
              );
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
              console.error(error);
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
