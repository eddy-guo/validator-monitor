const { Events } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { request } = require("undici");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isSelectMenu()) return;

    const selected = interaction.values[0];
    var response, data, status, word, image;

    if (selected === "Secret Network") {
      response = await request("https://api.scrt.network/syncing");
      image = "https://assets.coingecko.com/coins/images/11871/small/Secret.png?1595520186";
    } else if (selected === "Evmos") {
      response = await request("https://evmos-api.polkachu.com/syncing");
      image = "https://assets.coingecko.com/coins/images/24023/small/evmos.png?1653958927";
    } else if (selected === "Akash Network") {
      response = await request("https://api-akash-ia.cosmosia.notional.ventures/syncing");
      image = "https://assets.coingecko.com/coins/images/12785/small/akash-logo.png?1615447676";
    }
    data = (await response.body.json())["syncing"];

    if (data === false) {
      status = "ONLINE";
      word = "not ";
    } else {
      status = "OFFLINE";
      word = "";
    }

    const exampleEmbed = new EmbedBuilder()
      .setColor(0xe3ddff)
      .setTitle(`${selected}`)
      .setURL("https://google.ca")
      .setDescription(`STATUS: **${status}** (${word}syncing).`)
      .setThumbnail(`${image}`);
    return interaction.reply({ embeds: [exampleEmbed] });
  },
};
