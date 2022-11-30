const { Events } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { request } = require("undici");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isSelectMenu()) return;

    const selected = interaction.values[0];
    var response, data, status, word, image, website;
    if (selected == "Akash Network") {
      response = await request("https://api-akash-ia.cosmosia.notional.ventures/syncing");
      image = "https://assets.coingecko.com/coins/images/12785/small/akash-logo.png?1615447676";
      website = "https://akash.network/";
    } else if (selected == "Evmos") {
      response = await request("https://evmos-api.polkachu.com/syncing");
      image = "https://assets.coingecko.com/coins/images/24023/small/evmos.png?1653958927";
      website = "https://evmos.org/";
    } else if (selected == "Secret Network") {
      response = await request("https://api.scrt.network/syncing");
      image = "https://assets.coingecko.com/coins/images/11871/small/Secret.png?1595520186";
      website = "https://scrt.network/";
    }
    data = (await response.body.json())["syncing"];

    if (data == false) {
      status = "ONLINE";
      word = "not ";
    } else {
      status = "OFFLINE";
      word = "";
    }

    const statusEmbed = new EmbedBuilder()
      .setColor(0x000000)
      .setTitle(`${selected}`)
      .setURL(`${website}`)
      .setDescription(`STATUS: **${status}** (${word}syncing).`)
      .setThumbnail(`${image}`);
    
    await interaction.deferReply();
    await interaction.deleteReply();
    await interaction.channel.send({ embeds: [statusEmbed] });
  },
};
