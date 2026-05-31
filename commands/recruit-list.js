const {
  SlashCommandBuilder
} = require('discord.js');

module.exports = {

  data:
    new SlashCommandBuilder()

      .setName('recruit-list')

      .setDescription(
        '募集一覧表示'
      ),

  async execute(interaction) {

    await interaction.reply({
      content:
        '募集一覧',
      ephemeral: true
    });
  }
};
