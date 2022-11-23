const { Events } = require("discord.js");
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

    if (interaction.customId === "select") {
      await interaction.reply(
        `<@${user}>, the ${selected} node is currently ${status} (${word}syncing).`
      );
    }
  },
};
