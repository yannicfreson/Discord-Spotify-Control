const config = require("../config.json");
const spotify = require("../helpers/spotify");
const { MessageEmbed } = require("discord.js");

module.exports = {
  meFunc: function me(msg, args) {
    spotify("/me").then((data) => {
      if (data !== "Request_Error") {
        try {
          const embed = new MessageEmbed()
            .setTitle(`${data.display_name}`)
            .addFields(
              {
                name: "Email",
                value: data.email,
              },
              {
                name: "Followers",
                value: data.followers.total.toString(),
                inline: true,
              },
              {
                name: "Subscription",
                value: data.product,
                inline: true,
              },
              {
                name: "Country",
                value: data.country,
                inline: true,
              }
            )
            .setImage(data.images[0].url)
            .setTimestamp();

          msg.channel.send({ embeds: [embed] });
        } catch {
          msg.channel.send(config.stdError);
        }
      } else {
        msg.channel.send(config.reqError);
      }
    });
  },
};
