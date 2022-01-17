const config = require("../config.json");
const fs = require("fs");
const path = require("path");
const LAST_ITEM_PATH = path.resolve(__dirname, "../", "lastItem.txt");
const { MessageEmbed } = require("discord.js");
const spotify = require("../helpers/spotify");
const Vibrant = require("node-vibrant");

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

let running;

module.exports = {
  listenFunc: function listen(msg, args, description) {
    if (!description) {
      if (args[1] === "start") {
        running = true;
        msg.channel.send("Started listening");
        let checkLoop = setInterval(function () {
          if (!running) {
            clearInterval(checkLoop);
          }
          let lastItem = fs.readFileSync(LAST_ITEM_PATH, "utf8");
          spotify("/me/player/currently-playing").then((data) => {
            if (data !== "Request_Error") {
              try {
                if (
                  lastItem !==
                  `${data.item.name
                    .replace(" - Radio Edit", "")
                    .replace(" - Remix", "")} by ${data.item.artists[0].name}`
                ) {
                  fs.writeFileSync(
                    LAST_ITEM_PATH,
                    `${data.item.name
                      .replace(" - Radio Edit", "")
                      .replace(" - Remix", "")} by ${
                      data.item.artists[0].name
                    }`,
                    "utf8"
                  );

                  let accentColor;
                  let vibrant = new Vibrant(data.item.album.images[0].url);
                  vibrant.getPalette().then((palette) => {
                    accentColor = palette.Vibrant.hex;

                    const embed = new MessageEmbed()
                      .setColor(accentColor)
                      .setTitle(
                        `${data.item.name
                          .replace(" - Radio Edit", "")
                          .replace(" - Remix", "")} by ${
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
                            data.item.duration_ms
                          )}`,
                          inline: true,
                        }
                      )
                      .setImage(data.item.album.images[0].url)
                      .setTimestamp();

                    msg.channel.send({ embeds: [embed] });
                  });
                }
              } catch {
                msg.channel.send(config.stdError);
              }
            } else {
              msg.channel.send(config.reqError);
            }
          });
        }, 36000);
      } else if (args[1] === "stop") {
        try {
          running = false;
          msg.channel.send("Stopped listening");
        } catch {}
      } else if (args[1] === undefined) {
        msg.channel.send("You need to specify start or stop");
      }
    } else {
      return "Listens along and sends you embeds of the currently playing as it starts*";
    }
  },
};
