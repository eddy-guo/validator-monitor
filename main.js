require('dotenv').config()
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  } else if (interaction.commandName === "status") {
    await interaction.reply("INSERT_NODE_HERE is currently active (Sync Status: FALSE).");
    // api call goes here
  }
});

client.login(process.env.TOKEN);
