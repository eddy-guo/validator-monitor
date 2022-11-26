const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
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
      status: "",
      tokens: "",
    };
    const evmos = {
      operator_address: "evmosvaloper1fpjf8aywxg9qxexfwu9lanlgw58f5fhqfu348k",
      consensus_address: "evmosvalcons1tu64shxp6m94nsc5uefs3agay8gjne0r0t0ux3",
      api: "https://evmos-api.polkachu.com",
      status: "",
      tokens: "",
    };
    const secret = {
      operator_address: "secretvaloper1vp05jj9t0u228j3ph8qav642mh84lp2q6r8vhx",
      consensus_address: "secretvalcons1qz6dgmf0rgk8p08wznlnmqe7hnm4qydftvaajj",
      api: "https://api.scrt.network",
      status: "",
      tokens: "",
    };
    async function getValidatorStatus(chain) {
      const response = await request(
        `${chain.api}/cosmos/staking/v1beta1/validators?status=BOND_STATUS_BONDED`
      );
      const data = (await response.body.json())["validators"];
      for (let i = 0; i < data.length; i++) {
        if (data[i]["operator_address"] == chain.operator_address) {
          chain.status = data[i]["status"];
          chain.tokens = data[i]["tokens"];
        }
      }
    }
    await getValidatorStatus(akash)
    
    const akashEmbed = new EmbedBuilder()
      .setColor(0x000000)
      .setTitle(`AKASH`)
      .setURL(`https://rekt.news`)
      .setDescription(`AKASH STATUS: ${akash.status} \n
                       AKASH TOKENS: ${akash.tokens} \n
                       `);

    await interaction.deferReply();
    await interaction.deleteReply();
    await interaction.channel.send({ embeds: [akashEmbed] });
  },
};
