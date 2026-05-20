const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('recruit')
    .setDescription('募集を作成'),

  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('recruit-modal')
      .setTitle('ゲーム募集作成');

    const game = new TextInputBuilder()
      .setCustomId('game')
      .setLabel('ゲーム名')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const start = new TextInputBuilder()
      .setCustomId('start')
      .setLabel('開始時間 2026-05-20 21:00')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const max = new TextInputBuilder()
      .setCustomId('max')
      .setLabel('募集人数')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const expire = new TextInputBuilder()
      .setCustomId('expire')
      .setLabel('有効期限')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const note = new TextInputBuilder()
      .setCustomId('note')
      .setLabel('備考')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false);

    modal.addComponents(
      new ActionRowBuilder().addComponents(game),
      new ActionRowBuilder().addComponents(start),
      new ActionRowBuilder().addComponents(max),
      new ActionRowBuilder().addComponents(expire),
      new ActionRowBuilder().addComponents(note)
    );

    await interaction.showModal(modal);
  }
};
