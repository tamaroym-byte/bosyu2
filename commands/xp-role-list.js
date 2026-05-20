const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

const db = require('../db/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('xp-role-list')
    .setDescription('XPロール一覧'),

  async execute(interaction) {
    const rows = db.prepare(`
      SELECT * FROM xp_roles
      WHERE guild_id=?
      ORDER BY required_xp ASC
    `).all(interaction.guild.id);

    const description = rows.length
      ? rows.map(r => `<@&${r.role_id}> : ${r.required_xp}XP`).join('
')
      : '未設定';

    const embed = new EmbedBuilder()
      .setTitle('XPロール一覧')
      .setDescription(description);

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
};
