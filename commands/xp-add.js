const {
  SlashCommandBuilder,
  PermissionFlagsBits
} = require('discord.js');

const xpService =
  require('../services/xpService');

module.exports = {

  data:
    new SlashCommandBuilder()

      .setName('xp-add')

      .setDescription(
        'XP付与'
      )

      .addUserOption(option =>
        option
          .setName('user')
          .setDescription(
            '対象ユーザー'
          )
          .setRequired(true)
      )

      .addIntegerOption(option =>
        option
          .setName('amount')
          .setDescription(
            'XP量'
          )
          .setRequired(true)
      )

      .setDefaultMemberPermissions(
        PermissionFlagsBits.Administrator
      ),

  async execute(interaction) {

    const user =
      interaction.options.getUser(
        'user'
      );

    const amount =
      interaction.options.getInteger(
        'amount'
      );

    const total =
      xpService.addXP(
        interaction.guild.id,
        user.id,
        amount
      );

    await interaction.reply({
      content:
        `${user.username} に ${amount}XP付与 (合計:${total})`,
      ephemeral: true
    });
  }
};
