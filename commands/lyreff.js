const config = require("../config.json");
const spotify = require("../helpers/spotify");
const lyricsSearcher = require("lyrics-searcher");
const Image = require("ascii-art-image");

const fs = require("fs");
const path = require("path");
const outPath = path.resolve(__dirname, "../", "tempImage", "out.txt");

module.exports = {
  lyreffFunc: function lyreff(msg, args, description) {
    if (!description) {
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
            ).then((lyrics) => {
              let lyricsLetters = lyrics.split("");

              var image = new Image({
                filepath: "./tempImage/test.png",
                alphabet: "greyscale",
                width: 400,
                height: 400,
              });

              image.write(function (err, rendered) {
                let output = "";
                let asciiArtString = rendered.replace(
                  /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
                  ""
                );
                let asciiArtStringLetters = asciiArtString.split("");
                let backgroundCharsLength = 0;
                asciiArtString.split("").forEach((c) => {
                  if (c === "░") {
                    backgroundCharsLength++;
                  }
                });

                lyricsCharPointer = 0;
                lyricsForBackgroundString = "";
                for (let i = 0; i < backgroundCharsLength; i++) {
                  if (lyricsCharPointer < lyricsLetters.length) {
                    lyricsForBackgroundString +=
                      lyricsLetters[lyricsCharPointer];
                    lyricsCharPointer++;
                  } else {
                    lyricsForBackgroundString += lyricsLetters[i];
                    lyricsCharPointer = 0;
                  }
                }

                let lyricsForBackgroundStringSanitized =
                  lyricsForBackgroundString.replace(/(\r\n|\n|\r)/gm, " ");

                let lyricsForBackgroundStringIndex = 0;
                for (let i = 0; i < asciiArtStringLetters.length; i++) {
                  if (asciiArtStringLetters[i] === "░") {
                    output +=
                      lyricsForBackgroundStringSanitized[
                        lyricsForBackgroundStringIndex
                      ];
                    lyricsForBackgroundStringIndex++;
                  } else {
                    output += asciiArtStringLetters[i];
                  }
                }

                fs.writeFileSync(outPath, output, "utf8");
                //msg.channel.send(rendered);
              });
            });
          } catch {
            msg.channel.send(config.stdError);
          }
        } else {
          msg.channel.send(config.reqError);
        }
      });
    } else {
      return "Shows lyrics of the currently playing song with cool effects";
    }
  },
};
