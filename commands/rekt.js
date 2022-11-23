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
    console.log(parse(data).querySelectorAll(".post-excerpt")[0].rawText.slice(0, -4));
    console.log(parse(data).querySelectorAll(".post-excerpt")[1].rawText.slice(0, -4));
    return interaction.reply("REKT RESPONSE");
  },
};
