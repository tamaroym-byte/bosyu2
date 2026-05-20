const {
  SlashCommandBuilder,
  PermissionFlagsBits
} = require('discord.js');

const db = require('../db/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set-recruit-channel')
    .setDescription('募集チャンネル設定')
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('チャンネル')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator
    ),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');

    db.prepare(`
      INSERT OR REPLACE INTO guild_settings (
        guild_id,
        recruit_channel_id
      ) VALUES (?, ?)
    `).run(interaction.guild.id, channel.id);

    await interaction.reply({
      content: '募集チャンネル設定完了',
      ephemeral: true
    });
  }
};
