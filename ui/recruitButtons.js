const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

function buildButtons(status) {

  const pauseLabel =
    status === 'PAUSED'
      ? '募集再開'
      : '募集中止';

  const pauseId =
    status === 'PAUSED'
      ? 'resume'
      : 'pause';

  return new ActionRowBuilder()
    .addComponents(

      new ButtonBuilder()
        .setCustomId('join')
        .setLabel('参加')
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId('leave')
        .setLabel('退出')
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId(pauseId)
        .setLabel(pauseLabel)
        .setStyle(ButtonStyle.Warning),

      new ButtonBuilder()
        .setCustomId('close')
        .setLabel('募集終了')
        .setStyle(ButtonStyle.Danger)
    );
}

module.exports = buildButtons;
