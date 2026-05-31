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
        'set-recruit-channel'
      )

      .setDescription(
        '募集チャンネル設定'
      )

      .addChannelOption(
        option =>
          option
            .setName('channel')
            .setDescription(
              '募集投稿チャンネル'
            )
            .setRequired(true)
      )

      .setDefaultMemberPermissions(
        PermissionFlagsBits.Administrator
      ),

  async execute(interaction) {

    const channel =
      interaction.options.getChannel(
        'channel'
      );

    const exists =
      db.prepare(`
        SELECT *
        FROM guild_settings
        WHERE guild_id=?
      `).get(
        interaction.guild.id
      );

    if (exists) {

      db.prepare(`
        UPDATE guild_settings
        SET recruit_channel_id=?
        WHERE guild_id=?
      `).run(
        channel.id,
        interaction.guild.id
      );

    } else {

      db.prepare(`
        INSERT INTO guild_settings (
          guild_id,
          recruit_channel_id
        )
        VALUES (?, ?)
      `).run(
        interaction.guild.id,
        channel.id
      );
    }

    await interaction.reply({
      content:
        '募集チャンネル設定完了',
      ephemeral: true
    });
  }
};
