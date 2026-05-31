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
        'xp-role-remove'
      )

      .setDescription(
        'XPロール削除'
      )

      .addRoleOption(option =>
        option
          .setName('role')
          .setDescription('ロール')
          .setRequired(true)
      )

      .setDefaultMemberPermissions(
        PermissionFlagsBits.Administrator
      ),

  async execute(interaction) {

    const role =
      interaction.options.getRole(
        'role'
      );

    db.prepare(`
      DELETE FROM xp_roles
      WHERE guild_id=?
      AND role_id=?
    `).run(
      interaction.guild.id,
      role.id
    );

    await interaction.reply({
      content:
        'XPロール削除完了',
      ephemeral: true
    });
  }
};
