const { Events } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { request } = require("undici");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isSelectMenu()) return;

    const selected = interaction.values[0];
    const user = interaction.user.id;
    var response, data, status, word;

    selected === "**Secret Network**"
      ? (response = await request("https://api.scrt.network/syncing"))
      : selected === "**Evmos**"
      ? (response = await request("https://evmos-api.polkachu.com/syncing"))
      : selected === "**Akash Network**"
      ? (response = await request(
          "https://api-akash-ia.cosmosia.notional.ventures/syncing"
        ))
      : console.log("Interaction value does not exist.");

    data = (await response.body.json())["syncing"];

    if (data === false) {
      status = "online";
      word = "not ";
    } else {
      status = "offline";
      word = "";
    }

    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Some title")
      .setURL("https://discord.js.org/")
      .setAuthor({
        name: "Some name",
        iconURL: "https://i.imgur.com/AfFp7pu.png",
        url: "https://discord.js.org",
      })
      .setDescription("Some description here")
      .setThumbnail("https://i.imgur.com/AfFp7pu.png")
      .addFields(
        { name: "Regular field title", value: "Some value here" },
        { name: "\u200B", value: "\u200B" },
        { name: "Inline field title", value: "Some value here", inline: true },
        { name: "Inline field title", value: "Some value here", inline: true }
      )
      .addFields({
        name: "Inline field title",
        value: "Some value here",
        inline: true,
      })
      .setImage("https://i.imgur.com/AfFp7pu.png")
      .setTimestamp()
      .setFooter({
        text: "Some footer text here",
        iconURL: "https://i.imgur.com/AfFp7pu.png",
      });

    return interaction.reply({ embeds: [exampleEmbed] });
    // `<@${user}>, the ${selected} node is currently ${status} (${word}syncing).`
  },
};
