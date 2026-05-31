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
        'recruit-delete'
      )

      .setDescription(
        '募集削除'
      )

      .addIntegerOption(option =>
        option
          .setName('id')
          .setDescription(
            '募集ID'
          )
          .setRequired(true)
      )

      .setDefaultMemberPermissions(
        PermissionFlagsBits.Administrator
      ),

  async execute(interaction) {

    const id =
      interaction.options.getInteger(
        'id'
      );

    db.prepare(`
      DELETE FROM recruits
      WHERE id=?
    `).run(id);

    db.prepare(`
      DELETE FROM recruit_participants
      WHERE recruit_id=?
    `).run(id);

    await interaction.reply({
      content:
        `募集ID:${id} を削除しました`,
      ephemeral: true
    });
  }
};
