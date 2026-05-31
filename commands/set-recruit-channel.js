const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType
} = require('discord.js');

const db =
  require('../db/database');

module.exports = {

  data:
    new SlashCommandBuilder()

      .setName(
        'set-recruit-channel'
      )

      .setDescription(
        '募集チャンネル設定'
      )

      .addChannelOption(option =>
        option
          .setName('channel')
          .setDescription(
            '募集チャンネル'
          )
          .setRequired(true)
          .addChannelTypes(
            ChannelType.GuildText
          )
      )

      .setDefaultMemberPermissions(
        PermissionFlagsBits.Administrator
      ),

  async execute(interaction) {

    const channel =
      interaction.options.getChannel(
        'channel'
      );

    db.prepare(`
      INSERT OR REPLACE
      INTO guild_settings (
        guild_id,
        recruit_channel_id
      )
      VALUES (?, ?)
    `).run(
      interaction.guild.id,
      channel.id
    );

    await interaction.reply({
      content:
        `募集チャンネルを ${channel} に設定しました`,
      flags: 64
    });
  }
};
