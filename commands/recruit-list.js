const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

const db =
  require('../db/database');

module.exports = {

  data:
    new SlashCommandBuilder()

      .setName(
        'recruit-list'
      )

      .setDescription(
        '現在の募集一覧'
      ),

  async execute(interaction) {

    const recruits =
      db.prepare(`
        SELECT *
        FROM recruits
        WHERE status IN (
          'OPEN',
          'FULL',
          'PAUSED'
        )
        ORDER BY start_time ASC
      `).all();

    if (!recruits.length) {

      return interaction.reply({
        content:
          '現在募集中の募集はありません',
        ephemeral: true
      });
    }

    const description =
      recruits
        .map(r => {

          return (
            `ID:${r.id}\n` +
            `${r.game_name}\n` +
            `状態:${r.status}\n`
          );
        })
        .join('\n');

    const embed =
      new EmbedBuilder()

        .setTitle(
          '募集一覧'
        )

        .setDescription(
          description
        );

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
};
