require('dotenv').config();

const fs = require('fs');

const {
  Client,
  GatewayIntentBits,
  Collection
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();

const commandFiles = fs
  .readdirSync('./commands')
  .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {

  const command =
    require(`./commands/${file}`);

  client.commands.set(
    command.data.name,
    command
  );
}

const eventFiles = fs
  .readdirSync('./events')
  .filter(file => file.endsWith('.js'));

for (const file of eventFiles) {

  const event =
    require(`./events/${file}`);

  if (event.once) {

    client.once(
      event.name,
      (...args) =>
        event.execute(...args, client)
    );

  } else {

    client.on(
      event.name,
      (...args) =>
        event.execute(...args, client)
    );
  }
}

require('./jobs/autoCloseJob')(client);

client.login(process.env.DISCORD_TOKEN);
