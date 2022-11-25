const { SlashCommandBuilder } = require("discord.js");
const { request } = require("undici");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("jackal")
    .setDescription(
      "Get the status of our validator on other Cosmos blockchains."
    ),
  async execute(interaction) {
    async function getValidatorStatus(address, api) {
      const response = await request(api);
      const data = (await response.body.json())["validators"];
      for (let i = 0; i < data.length; i++) {
        if (data[i]["operator_address"] == address) {
          console.log("TITLE: " + data[i]["description"]["moniker"]);
          console.log("STATUS: " + data[i]["status"]);
          console.log("TOKENS: " + data[i]["tokens"]);
        }
      }
    }
    getValidatorStatus(
      "akashvaloper1mryswr20mxltwhlqulsk0hnscmmxw32th0szkv",
      "https://api-akash-ia.cosmosia.notional.ventures/cosmos/staking/v1beta1/validators?status=BOND_STATUS_BONDED"
    );
    getValidatorStatus(
      "evmosvaloper1fpjf8aywxg9qxexfwu9lanlgw58f5fhqfu348k",
      "https://evmos-api.polkachu.com/cosmos/staking/v1beta1/validators?status=BOND_STATUS_BONDED"
    );
    getValidatorStatus(
      "secretvaloper1vp05jj9t0u228j3ph8qav642mh84lp2q6r8vhx",
      "https://api.scrt.network/cosmos/staking/v1beta1/validators?status=BOND_STATUS_BONDED"
    );
    return interaction.reply("Check terminal.");
  },
};
