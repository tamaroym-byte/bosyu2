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
    'set-mention-role-list'
  )

  .setDescription(
    '募集用メンションロール一覧'
  )

  .setDefaultMemberPermissions(
    PermissionFlagsBits.Administrator
  ),
```

async execute(interaction) {

```
const rows =
  db.prepare(`
    SELECT *
    FROM mention_roles
    WHERE guild_id=?
  `).all(
    interaction.guild.id
  );

if (!rows.length) {

  return interaction.reply({
    content:
      '登録ロールなし',
    flags: 64
  });
}

const text =
  rows
    .map(
      r =>
        `<@&${r.role_id}>`
    )
    .join('\n');

await interaction.reply({
  content:
    `登録ロール一覧\n\n${text}`,
  flags: 64
});
```

}
};
