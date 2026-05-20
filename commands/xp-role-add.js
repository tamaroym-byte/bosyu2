const {
  SlashCommandBuilder,
  PermissionFlagsBits
} = require('discord.js');

const db = require('../db/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('xp-role-add')
    .setDescription('XPロール追加')
    .addRoleOption(option =>
      option
        .setName('role')
        .setDescription('ロール')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('xp')
        .setDescription('必要XP')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator
    ),

  async execute(interaction) {
    const role = interaction.options.getRole('role');
    const xp = interaction.options.getInteger('xp');

    db.prepare(`
      INSERT INTO xp_roles (
        guild_id,
        role_id,
        required_xp
      ) VALUES (?, ?, ?)
    `).run(interaction.guild.id, role.id, xp);

    await interaction.reply({
      content: 'XPロール追加完了',
      ephemeral: true
    });
  }
};
