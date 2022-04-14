require('dotenv').config();
const discord = require('discord.js');
const { registerEvents, registerCommands } = require('./utils/registry');
const client = new discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] });

(async () => {
    client.login(process.env.BOT_TOKEN);
    client.commands = new Map();
    client.cachedMessageReactions = new Map();
    await registerEvents(client, '../events');
    await registerCommands(client, '../commands');
})();
