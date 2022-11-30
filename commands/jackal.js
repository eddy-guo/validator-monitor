const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { request } = require("undici");
// const wait = require("node:timers/promises").setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("jackal")
    .setDescription(
      "Get the status of our validator on other Cosmos blockchains."
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const akash = {
      operator_address: "akashvaloper1mryswr20mxltwhlqulsk0hnscmmxw32th0szkv",
      consensus_address: "akashvalcons1au2nql99wn2k27qt8fzlj9anzksj22typhcywv",
      api: "https://api-akash-ia.cosmosia.notional.ventures",
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
      status: "",
      jailedStatus: "",
      tokens: "",
      rank: "",
      block: "",
    };

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
    secret.block = await getCurrentBlock(secret.api);

    akash.rank = await getRank(akash);
    evmos.rank = await getRank(evmos);
    secret.rank = await getRank(secret);

    async function getValidatorStatus(chain) {
      const response = await request(`${chain.api}/cosmos/staking/v1beta1/validators/${chain.operator_address}`);
      const data = (await response.body.json())["validator"];
      chain.status = data["status"];
      chain.jailedStatus = data["jailed"];
      chain.tokens = data["tokens"];
    }

    await getValidatorStatus(akash);
    await getValidatorStatus(evmos);
    await getValidatorStatus(secret);

    const akashEmbed = new EmbedBuilder()
      .setColor(0x000000)
      .setTitle(`AKASH`)
      .setURL(`https://rekt.news`)
      .setDescription(
        `AKASH STATUS: ${akash.status} \n 
        AKASH JAILED STATUS: ${akash.jailedStatus} \n 
        AKASH TOKENS: ${akash.tokens} \n 
        AKASH RANK: ${akash.rank} \n 
        AKASH BLOCK HEIGHT: ${akash.block}`
      );

    const evmosEmbed = new EmbedBuilder()
      .setColor(0x000000)
      .setTitle(`EVMOS`)
      .setURL(`https://rekt.news`)
      .setDescription(
        `EVMOS STATUS: ${evmos.status} \n 
        EVMOS JAILED STATUS: ${evmos.jailedStatus} \n
        EVMOS TOKENS: ${evmos.tokens} \n 
        EVMOS RANK: ${evmos.rank} \n 
        EVMOS BLOCK HEIGHT: ${evmos.block}`
      );

    const secretEmbed = new EmbedBuilder()
      .setColor(0x000000)
      .setTitle(`SECRET`)
      .setURL(`https://rekt.news`)
      .setDescription(
        `SECRET STATUS: ${secret.status} \n 
        SECRET JAILED STATUS: ${secret.jailedStatus} \n
        SECRET TOKENS: ${secret.tokens} \n 
        SECRET RANK: ${secret.rank} \n 
        SECRET BLOCK HEIGHT: ${secret.block}`
      );

    await interaction.deleteReply();
    await interaction.channel.send({ embeds: [akashEmbed] });
    await interaction.channel.send({ embeds: [evmosEmbed] });
    await interaction.channel.send({ embeds: [secretEmbed] });
  },
};