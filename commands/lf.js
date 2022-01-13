const config = require("../config.json");
const spotify = require("../helpers/spotify");
const lyricsSearcher = require("lyrics-searcher");
const Image = require("ascii-art-image");
const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");
const http = require("http");
const https = require("https");

var Stream = require("stream").Transform;

const outPath = path.resolve(__dirname, "../", "tempImage", "out.png");
const outPathAsciiArt = path.resolve(__dirname, "../", "tempImage", "out.txt");

const canvasWidth = 4000;
const canvasHeight = 4000;
const canvas = createCanvas(canvasWidth, canvasHeight);
const ctx = canvas.getContext("2d");

module.exports = {
  lfFunc: function lf(msg, args, description) {
    if (!description) {
      spotify("/me/player/currently-playing").then((data) => {
        if (data !== "Request_Error") {
          try {
            var downloadImageFromURL = (url, filename, callback) => {
              var client = http;
              if (url.toString().indexOf("https") === 0) {
                client = https;
              }

              client
                .request(url, function (response) {
                  var data = new Stream();

                  response.on("data", function (chunk) {
                    data.push(chunk);
                  });

                  response.on("end", function () {
                    fs.writeFileSync(filename, data.read());
                  });
                })
                .end();
            };
            downloadImageFromURL(
              data.item.album.images[0].url,
              "./tempImage/asciiArtInput.png"
            );

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
                try {
                  let lyricsLetters = lyrics.toUpperCase().split("");

                  var image = new Image({
                    filepath: "./tempImage/asciiArtInput.png",
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
                      if (/* c === "░" || */ c === " ") {
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
                      if (
                        /* asciiArtStringLetters[i] === "░" || */
                        asciiArtStringLetters[i] === " "
                      ) {
                        output +=
                          lyricsForBackgroundStringSanitized[
                            lyricsForBackgroundStringIndex
                          ];
                        lyricsForBackgroundStringIndex++;
                      } else {
                        output += asciiArtStringLetters[i];
                      }
                    }

                    ctx.font = "16px Fira Code";
                    ctx.fillStyle = "black";
                    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
                    ctx.fillStyle = "white";
                    ctx.fillText(output, 0, 14);

                    const buffer = canvas.toBuffer("image/png");
                    fs.writeFileSync(outPath, buffer);
                    msg.channel.send({
                      files: [outPath],
                    });
                  });
                } catch {
                  msg.channel.send(config.lyrError);
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
    } else {
      return "Makes ascii art of album cover and replaces darkest color with lyrics";
    }
  },
};
