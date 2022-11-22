require('dotenv').config()
const { Client, GatewayIntentBits, ActionRowBuilder, SelectMenuBuilder } = require("discord.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  } else if (interaction.commandName === "status") {
    const row = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder().setCustomId('select').setPlaceholder('Select a validator').addOptions(
        {
          label: 'Secret',
          value: 'first_option',
        },
        {
          label: 'Evmos',
          value: 'second_option',
        },
        {
          label: 'Akash',
          value: 'third_option',
        }
      )
    )
    await interaction.reply({ephemeral: true, components: [row]});
  }
});

client.login(process.env.TOKEN);
