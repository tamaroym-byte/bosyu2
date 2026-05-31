const {
  SlashCommandBuilder
} = require('discord.js');

const db =
  require('../db/database');

module.exports = {

  data:
    new SlashCommandBuilder()

      .setName(
        'recruit-close'
      )

      .setDescription(
        '募集を終了'
      )

      .addIntegerOption(option =>
        option
          .setName('id')
          .setDescription(
            '募集ID'
          )
          .setRequired(true)
      ),

  async execute(interaction) {

    const id =
      interaction.options.getInteger(
        'id'
      );

    const recruit =
      db.prepare(`
        SELECT *
        FROM recruits
        WHERE id=?
      `).get(id);

    if (!recruit) {

      return interaction.reply({
        content:
          '募集が見つかりません',
        ephemeral: true
      });
    }

    db.prepare(`
      UPDATE recruits
      SET status='CLOSED'
      WHERE id=?
    `).run(id);

    await interaction.reply({
      content:
        `募集ID:${id} を終了しました`,
      ephemeral: true
    });
  }
};
