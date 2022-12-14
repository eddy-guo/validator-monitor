const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { request } = require("undici");
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

// global objects
const akash = {
  operator_address: "akashvaloper1mryswr20mxltwhlqulsk0hnscmmxw32th0szkv",
  consensus_address: "akashvalcons1au2nql99wn2k27qt8fzlj9anzksj22typhcywv",
  api: "https://api-akash-ia.cosmosia.notional.ventures",
  image:
    "https://assets.coingecko.com/coins/images/12785/small/akash-logo.png?1615447676",
  banner:
    "https://pbs.twimg.com/profile_banners/922670090834780162/1649432360/1500x500",
  status: "",
  jailedStatus: "",
  tokens: "",
  rank: "",
  block: "",
};
const evmos = {
  operator_address: "evmosvaloper1fpjf8aywxg9qxexfwu9lanlgw58f5fhqfu348k",
  consensus_address: "evmosvalcons1tu64shxp6m94nsc5uefs3agay8gjne0r0t0ux3",
  api: "https://evmos-api.polkachu.com",
  image:
    "https://assets.coingecko.com/coins/images/24023/small/evmos.png?1653958927",
  banner:
    "https://pbs.twimg.com/profile_banners/921975418315448321/1648257433/1500x500",
  status: "",
  jailedStatus: "",
  tokens: "",
  rank: "",
  block: "",
};
const secret = {
  operator_address: "secretvaloper1vp05jj9t0u228j3ph8qav642mh84lp2q6r8vhx",
  consensus_address: "secretvalcons1qz6dgmf0rgk8p08wznlnmqe7hnm4qydftvaajj",
  api: "https://api.scrt.network",
  image:
    "https://assets.coingecko.com/coins/images/11871/small/Secret.png?1595520186",
  banner:
    "https://pbs.twimg.com/profile_banners/3305325070/1642007357/1500x500",
  status: "",
  jailedStatus: "",
  tokens: "",
  rank: "",
  block: "",
};

async function getChainStatus(chain, key, cacheTitle, embedTitle) {
  const response = await request(
    `${chain.api}/cosmos/staking/v1beta1/validators/${chain.operator_address}`
  );
  const data = (await response.body.json())["validator"];

  const current = data[key].toString();
  const cached = await redis.get(cacheTitle, (err, reply) => {
    if (err) throw err;
    return reply;
  });

  const chainEmbed = new EmbedBuilder()
    .setColor(0x000000)
    // .setTitle()
    .setDescription(`${key}: [**${current}**](${chain.api}/cosmos/staking/v1beta1/validators/${chain.operator_address})`) 
    .setThumbnail(`${chain.image}`)
    .setTimestamp();

  if (current == cached) {
    console.log(`${embedTitle}: No update.`);
  } else if (current == "false") {
    const tempEmbed = chainEmbed.setTitle(`:white_check_mark: UPDATE: ${embedTitle} VALIDATOR IS UNJAILED :white_check_mark:`);
    client.channels.cache
      .get("1046953428489883719")
      .send({ embeds: [tempEmbed] });
    redis.set(cacheTitle, current);
    console.log(`${embedTitle} Jailed: false`);
  } else if (current == "true") {
    const tempEmbed = chainEmbed.setTitle(`:no_entry_sign: UPDATE: ${embedTitle} VALIDATOR IS JAILED :no_entry_sign:`);
    client.channels.cache
      .get("1046953428489883719")
      .send({ embeds: [tempEmbed] });
    redis.set(cacheTitle, current);
    console.log(`${embedTitle} Jailed: true`);
  } else if (current == "BOND_STATUS_BONDED") {
    const tempEmbed = chainEmbed.setTitle(`:green_circle: UPDATE: ${embedTitle} VALIDATOR IS BONDED :green_circle:`);
    client.channels.cache
      .get("1046953428489883719")
      .send({ embeds: [tempEmbed] });
    redis.set(cacheTitle, current);
    console.log(`${embedTitle} Status: Bonded`);
  } else if (current == "BOND_STATUS_UNBONDING") {
    const tempEmbed = chainEmbed.setTitle(`:yellow_circle: UPDATE: ${embedTitle} VALIDATOR IS UNBONDING :yellow_circle:`);
    client.channels.cache
      .get("1046953428489883719")
      .send({ embeds: [tempEmbed] });
    redis.set(cacheTitle, current);
    console.log(`${embedTitle} Status: Unbonding`);
  } else if (current == "BOND_STATUS_UNBONDED") {
    const tempEmbed = chainEmbed.setTitle(`:red_circle: UPDATE: ${embedTitle} VALIDATOR IS UNBONDED :red_circle:`);
    client.channels.cache
      .get("1046953428489883719")
      .send({ embeds: [tempEmbed] });
    redis.set(cacheTitle, current);
    console.log(`${embedTitle} Status: Unbonded`);
  } else if (current == "BOND_STATUS_UNSPECIFIED") {
    const tempEmbed = chainEmbed.setTitle(`:purple_circle: UPDATE: ${embedTitle} VALIDATOR IS INVALID :purple_circle:`);
    client.channels.cache
      .get("1046953428489883719")
      .send({ embeds: [tempEmbed] });
    redis.set(cacheTitle, current);
    console.log(`${embedTitle} Status: Unspecified`);
  }
}

async function main() {
  getChainStatus(
    akash,
    "status",
    "akashStatus",
    "AKASH",
  );
  getChainStatus(
    akash,
    "jailed",
    "akashJailed",
    "AKASH",
  );
  getChainStatus(
    evmos,
    "status",
    "evmosStatus",
    "EVMOS",
  );
  getChainStatus(
    evmos,
    "jailed",
    "evmosJailed",
    "EVMOS",
  );
  // remember to add secret (when they decide to start working...)
}

// cron setup
var CronJob = require("cron").CronJob;
var job = new CronJob(
  "*/30 * * * * *",
  async () => await main(),
  null,
  true,
  "America/Toronto"
);
// Use this if the 4th param is default value(false)
// job.start()

client.login(process.env.TOKEN);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("jackal")
    .setDescription(
      "Get the status of our validator on other Cosmos blockchains."
    ),
  async execute(interaction) {
    await interaction.deferReply();

    async function getCurrentBlock(api) {
      const response = await request(`${api}/blocks/latest`);
      const data = await response.body.json();
      return data["block"]["header"]["height"];
    }

    async function getValidators(api) {
      const response = await request(`${api}/validatorsets/latest`);
      const data = await response.body.json();
      return data;
    }

    async function getMaxValidators(api) {
      const response = await request(`${api}/validatorsets/latest`);
      const data = await response.body.json();
      return data["result"]["total"];
    }

    async function getMoreValidators(api) {
      const response = await request(`${api}/validatorsets/latest?page=2`);
      const data = await response.body.json();
      return data;
    }

    async function getRank(chain) {
      const validators = await getValidators(chain.api);
      const maxValidators = await getMaxValidators(chain.api);
      const moreValidators = await getMoreValidators(chain.api);
      var jackalRank;
      if (
        validators["result"]["total"] ==
        validators["result"]["validators"].length
      ) {
        for (let i = 0; i < maxValidators; i++) {
          if (
            validators["result"]["validators"][i]["address"] ==
            chain.consensus_address
          ) {
            jackalRank = i + 1;
          }
        }
      } else {
        for (
          let i = 0;
          i < moreValidators["result"]["validators"].length;
          i++
        ) {
          if (
            moreValidators["result"]["validators"][i]["address"] ==
            chain.consensus_address
          ) {
            jackalRank = validators["result"]["validators"].length + i + 1;
          }
        }
      }
      return jackalRank;
    }

    akash.block = await getCurrentBlock(akash.api);
    evmos.block = await getCurrentBlock(evmos.api);
    // secret.block = await getCurrentBlock(secret.api);

    akash.rank = await getRank(akash);
    evmos.rank = await getRank(evmos);
    // secret.rank = await getRank(secret);

    async function getValidatorStatus(chain) {
      const response = await request(
        `${chain.api}/cosmos/staking/v1beta1/validators/${chain.operator_address}`
      );
      const data = (await response.body.json())["validator"];
      chain.status = data["status"];
      chain.jailedStatus = data["jailed"];
      chain.tokens = data["tokens"];
    }

    await getValidatorStatus(akash);
    await getValidatorStatus(evmos);
    // await getValidatorStatus(secret);

    const akashEmbed = new EmbedBuilder()
      .setColor(0x000000)
      .setTitle(`JACKAL'S VALIDATOR ON AKASH`)
      .setURL(`https://akash.network`)
      .setDescription(
        `**STATUS:** ${akash.status} \n 
        **JAILED STATUS:** ${akash.jailedStatus} \n 
        **TOKENS:** ${Math.round(
          akash.tokens / 1000000
        ).toLocaleString()} AKT \n
        **JACKAL RANK:** ${akash.rank} out of 100 \n 
        **BLOCK HEIGHT:** ${akash.block} \n
        [Ping Dashboard Link](https://ping.pub/akash/staking)`
      )
      .setThumbnail(`${akash.image}`)
      .setImage(`${akash.banner}`);

    const evmosEmbed = new EmbedBuilder()
      .setColor(0x000000)
      .setTitle(`JACKAL'S VALIDATOR ON EVMOS`)
      .setURL(`https://evmos.org`)
      .setDescription(
        `**STATUS:** ${evmos.status} \n 
        **JAILED STATUS:** ${evmos.jailedStatus} \n
        **TOKENS:** ${Math.round(
          evmos.tokens / 1000000000000000000
        ).toLocaleString()} EVMOS \n 
        **JACKAL RANK:** ${evmos.rank} out of 150 \n 
        **BLOCK HEIGHT:** ${evmos.block} \n 
        [Ping Dashboard Link](https://ping.pub/evmos/staking)`
      )
      .setThumbnail(`${evmos.image}`)
      .setImage(`${evmos.banner}`)
      .setTimestamp();

    // const secretEmbed = new EmbedBuilder()
    //   .setColor(0x000000)
    //   .setTitle(`SECRET`)
    //   .setURL(`https://scrt.network`)
    //   .setDescription(
    //     `STATUS: ${secret.status} \n
    //     JAILED STATUS: ${secret.jailedStatus} \n
    //     TOKENS: ${secret.tokens} \n
    //     JACKAL RANK: ${secret.rank} \n
    //     BLOCK HEIGHT: ${secret.block}`
    //   );

    await interaction.deleteReply();
    await interaction.channel.send({ embeds: [akashEmbed] });
    await interaction.channel.send({ embeds: [evmosEmbed] });
    // await interaction.channel.send({ embeds: [secretEmbed] });
  },
};
