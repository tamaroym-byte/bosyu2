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
    'set-mention-role-remove'
  )

  .setDescription(
    '募集用メンションロール削除'
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
  DELETE
  FROM mention_roles
  WHERE guild_id=?
  AND role_id=?
`).run(
  interaction.guild.id,
  role.id
);

await interaction.reply({
  content:
    `${role} を削除しました`,
  flags: 64
});
```

}
};
