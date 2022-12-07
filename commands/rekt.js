const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { request } = require("undici");
const { parse } = require("node-html-parser");
// client for message without interaction/slash commands
const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Redis setup
const Redis = require("ioredis");

const redis = new Redis({
  host: "redis-14719.c274.us-east-1-3.ec2.cloud.redislabs.com",
  port: 14719,
  password: `${process.env.REDIS_PASSWORD}`,
});

// // redis set function - only needed once to have the old/current title in place, never again
// function setCache() {
//   return new Promise((resolve) => {
//     async () => redis.set("rektTitle", getRekt());
//     resolve("Cached");
//   });
// }
// setCache();

// helper: return title
async function getRekt() {
  const response = await request("https://rekt.news/");
  const data = await response.body.text();
  const title =
    parse(data).querySelectorAll(".post-title")[0].firstChild.structuredText;
  return title;
}

// helper: check difference between cache and rekt api call
async function getDifference() {
  const currTitle = await getRekt();
  const cachedTitle = await redis.get("rektTitle", (err, reply) => {
    if (err) throw err;
    return reply;
  });
  if (currTitle == cachedTitle) {
    console.log(currTitle);
    console.log(cachedTitle);
    client.channels.cache.get("1046953428489883719").send("No Update");
    console.log("No Update"); // make this a discord message (for testing)
  } else {
    console.log(currTitle);
    console.log(cachedTitle);
    client.channels.cache.get("1046953428489883719").send("Updated");
    console.log("Updated"); // make this a discord message
    redis.set("rektTitle", currTitle);
  }
}

client.login(process.env.TOKEN);

// cron setup
var CronJob = require("cron").CronJob;
var job = new CronJob(
  "1 * * * * *",
  async () => await getDifference(),
  null,
  true,
  "America/Toronto"
);
// Use this if the 4th param is default value(false)
// job.start()

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rekt")
    .setDescription("Get DeFi news from rekt.news."),
  async execute(interaction) {
    await interaction.deferReply();

    const response = await request("https://rekt.news/");
    const data = await response.body.text();
    const title = parse(data).querySelectorAll(".post-title")[0].firstChild.structuredText;
    const post = parse(data).querySelectorAll(".post-excerpt")[0].structuredText.slice(0, -4);
    const href =parse(data).querySelectorAll(".post-excerpt-more")[0].firstChild.attributes["href"];

    const rektEmbed = new EmbedBuilder()
      .setColor(0x000000)
      .setTitle(`${title}`)
      .setURL(`https://rekt.news`)
      .setDescription(`${post} \n [MORE](https://rekt.news${href})`)
      .setThumbnail("https://pbs.twimg.com/profile_images/1320861494112854018/7-zRzzum_400x400.jpg")
      .setImage("https://pbs.twimg.com/profile_banners/1297925400090337280/1607454177/1500x500")
      .setTimestamp();

    await interaction.deleteReply();
    await interaction.channel.send({ embeds: [rektEmbed] });
  },
};
