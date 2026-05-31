const {
  SlashCommandBuilder
} = require('discord.js');

const db =
  require('../db/database');

module.exports = {

  data:
    new SlashCommandBuilder()
      .setName('xp')
      .setDescription(
        'XP確認'
      ),

  async execute(interaction) {

    const data =
      db.prepare(`
        SELECT *
        FROM user_xp
        WHERE guild_id=?
        AND user_id=?
      `).get(
        interaction.guild.id,
        interaction.user.id
      );

    const xp =
      data?.xp || 0;

    await interaction.reply({
      content:
        `あなたのXP: ${xp}`,
      ephemeral: true
    });
  }
};
