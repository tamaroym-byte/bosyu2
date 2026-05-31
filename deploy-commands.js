require('dotenv').config();

const fs = require('fs');

const {
  REST,
  Routes
} = require('discord.js');

const commands = [];

const commandFiles = fs
  .readdirSync('./commands')
  .filter(file => file.endsWith('.js'));

console.log('========================');
console.log('COMMAND DEBUG START');
console.log('========================');

for (const file of commandFiles) {

  const command =
    require(`./commands/${file}`);

  const json =
    command.data.toJSON();

  console.log('\n');
  console.log('FILE:', file);
  console.log('COMMAND NAME:', json.name);

  if (json.options) {

    console.log('OPTIONS:');

    json.options.forEach((option, index) => {

      console.log(
        `[${index}]`,
        option.name,
        'required =',
        option.required === true
      );
    });
  }

  console.log(
    JSON.stringify(
      json,
      null,
      2
    )
  );

  commands.push(json);
}

console.log('\n');
console.log('========================');
console.log('FINAL COMMAND ORDER');
console.log('========================');

commands.forEach((cmd, index) => {

  console.log(
    `[${index}]`,
    cmd.name
  );
});

const rest = new REST({
  version: '10'
}).setToken(
  process.env.DISCORD_TOKEN
);

(async () => {

  try {

    console.log('\n');
    console.log('DEPLOY START');

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      {
        body: commands
      }
    );

    console.log(
      'Commands deployed'
    );

  } catch (err) {

    console.error('\n');
    console.error('DEPLOY ERROR');
    console.error(err);

    if (err.rawError) {

      console.error('\n');
      console.error(
        JSON.stringify(
          err.rawError,
          null,
          2
        )
      );
    }
  }
})();
