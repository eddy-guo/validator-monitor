require("dotenv").config();
const { request } = require("undici");
const { parse } = require("node-html-parser");
const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  SelectMenuBuilder,
} = require("discord.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  } else if (interaction.commandName === "status") {
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
  } else if (interaction.commandName === "rekt") {
    await interaction.reply("REKT NEWS");

    const response = await request("https://rekt.news/");
    const data = await response.body.text();
    console.log(parse(data).querySelectorAll('.post-excerpt')[0].structuredText);
    console.log(parse(data).querySelectorAll('.post-excerpt')[1].structuredText);
  }
});

client.on("interactionCreate", async (interaction) => {
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
});

client.login(process.env.TOKEN);
