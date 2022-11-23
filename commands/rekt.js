const { SlashCommandBuilder } = require("discord.js");
const { request } = require("undici");
const { parse } = require("node-html-parser");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rekt")
    .setDescription("Get DeFi news from rekt.news."),
  async execute(interaction) {
    const response = await request("https://rekt.news/");
    const data = await response.body.text();
    console.log(parse(data).querySelectorAll(".post-excerpt")[0].rawText);
    console.log(parse(data).querySelectorAll(".post-excerpt")[1].rawText);
    return interaction.reply("REKT RESPONSE");
  },
};
