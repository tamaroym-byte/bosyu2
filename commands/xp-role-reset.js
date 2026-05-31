const {
  SlashCommandBuilder,
  PermissionFlagsBits
} = require('discord.js');

const db =
  require('../db/database');

module.exports = {

  data:
    new SlashCommandBuilder()

      .setName(
        'xp-role-reset'
      )

      .setDescription(
        'XPロール全削除'
      )

      .setDefaultMemberPermissions(
        PermissionFlagsBits.Administrator
      ),

  async execute(interaction) {

    db.prepare(`
      DELETE FROM xp_roles
      WHERE guild_id=?
    `).run(
      interaction.guild.id
    );

    await interaction.reply({
      content:
        'XPロールを全削除しました',
      ephemeral: true
    });
  }
};
