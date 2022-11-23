const { SlashCommandBuilder, SelectMenuBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("Get syncing state (uptime status) of a node."),
  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder()
        .setCustomId("select")
        .setPlaceholder("Select a validator")
        .addOptions(
          {
            label: "Akash",
            value: "**Akash Network**",
          },
          {
            label: "Evmos",
            value: "**Evmos**",
          },
          {
            label: "Secret",
            value: "**Secret Network**",
          }
        )
    );
    await interaction.reply({ ephemeral: true, components: [row] });
  },
};
