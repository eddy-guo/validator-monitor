require('dotenv').config()
const { REST, Routes } = require("discord.js");

const commands = [
    {
      name: "ping",
      description: "Replies with Pong!",
    },
    {
      name: "status",
      description: "Get syncing state (uptime status) of a node.",
    },
  ];
  
  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
  
  (async () => {
    try {
      console.log("Started refreshing application (/) commands.");
  
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: commands,
      });
  
      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
    }
  })();