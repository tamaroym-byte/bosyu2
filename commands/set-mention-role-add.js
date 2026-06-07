const {
SlashCommandBuilder,
PermissionFlagsBits
} = require('discord.js');

const db =
require('../db/database');

module.exports = {

data:
new SlashCommandBuilder()

```
  .setName(
    'set-mention-role-add'
  )

  .setDescription(
    '募集用メンションロール追加'
  )

  .setDefaultMemberPermissions(
    PermissionFlagsBits.Administrator
  )

  .addRoleOption(option =>
    option
      .setName('role')
      .setDescription('ロール')
      .setRequired(true)
  ),
```

async execute(interaction) {

```
const role =
  interaction.options.getRole(
    'role'
  );

db.prepare(`
  INSERT OR IGNORE
  INTO mention_roles
  (
    guild_id,
    role_id
  )
  VALUES (?,?)
`).run(
  interaction.guild.id,
  role.id
);

await interaction.reply({
  content:
    `${role} を追加しました`,
  flags: 64
});
```

}
};
