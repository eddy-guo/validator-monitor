const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { request } = require("undici");
const { parse } = require("node-html-parser");

// Redis setup
const redis = require("redis");
const client = redis.createClient({
  socket: {
    host: "redis-14719.c274.us-east-1-3.ec2.cloud.redislabs.com",
    port: 14719,
  },
  password: `${process.env.REDIS_PASSWORD}`,
});

client.on("error", (err) => {
  console.log("Error " + err);
});

console.log(process.env.REDIS_PASSWORD);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rekt")
    .setDescription("Get DeFi news from rekt.news."),
  async execute(interaction) {
    await interaction.deferReply();

    const response = await request("https://rekt.news/");
    const data = await response.body.text();
    const title =
      parse(data).querySelectorAll(".post-title")[0].firstChild.structuredText;
    const post = parse(data)
      .querySelectorAll(".post-excerpt")[0]
      .structuredText.slice(0, -4);
    const href =
      parse(data).querySelectorAll(".post-excerpt-more")[0].firstChild
        .attributes["href"];

    const rektEmbed = new EmbedBuilder()
      .setColor(0x000000)
      .setTitle(`${title}`)
      .setURL(`https://rekt.news`)
      .setDescription(`${post} \n [MORE](https://rekt.news${href})`)
      .setThumbnail(
        "https://pbs.twimg.com/profile_images/1320861494112854018/7-zRzzum_400x400.jpg"
      )
      .setImage(
        "https://pbs.twimg.com/profile_banners/1297925400090337280/1607454177/1500x500"
      )
      .setTimestamp();

    await interaction.deleteReply();
    await interaction.channel.send({ embeds: [rektEmbed] });
  },
};
