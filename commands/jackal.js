const { SlashCommandBuilder } = require("discord.js");
const { request } = require("undici");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("jackal")
    .setDescription(
      "Get the status of our validator on other Cosmos blockchains."
    ),
  async execute(interaction) {
    const akash = {
      operator_address: "akashvaloper1mryswr20mxltwhlqulsk0hnscmmxw32th0szkv",
      consensus_address: "akashvalcons1au2nql99wn2k27qt8fzlj9anzksj22typhcywv",
      api: "https://api-akash-ia.cosmosia.notional.ventures",
    };
    const evmos = {
      operator_address: "evmosvaloper1fpjf8aywxg9qxexfwu9lanlgw58f5fhqfu348k",
      consensus_address: "evmosvalcons1tu64shxp6m94nsc5uefs3agay8gjne0r0t0ux3",
      api: "https://evmos-api.polkachu.com",
    };
    const secret = {
      operator_address: "secretvaloper1vp05jj9t0u228j3ph8qav642mh84lp2q6r8vhx",
      consensus_address: "secretvalcons1qz6dgmf0rgk8p08wznlnmqe7hnm4qydftvaajj",
      api: "https://api.scrt.network",
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

    async function getRank(api, chain) {
      const validators = await getValidators(api);
      const maxValidators = await getMaxValidators(api);
      const moreValidators = await getMoreValidators(api);
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

    async function getValidatorStatus(api, address) {
      const response = await request(`${api}/cosmos/staking/v1beta1/validators?status=BOND_STATUS_BONDED`);
      const data = (await response.body.json())["validators"];
      for (let i = 0; i < data.length; i++) {
        if (data[i]["operator_address"] == address) {
          console.log("TITLE: " + data[i]["description"]["moniker"]);
          console.log("STATUS: " + data[i]["status"]);
          console.log("TOKENS: " + data[i]["tokens"]);
        }
      }
    }

    return interaction.reply("Check terminal.");
  },
};
