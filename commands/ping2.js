const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping2")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    return interaction.reply(`<@${interaction.user.id}> Pong2!`);
  },
};
