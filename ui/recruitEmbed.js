const { EmbedBuilder } =
  require('discord.js');

const dayjs =
  require('dayjs');

const utc =
  require('dayjs/plugin/utc');

const timezone =
  require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

function buildEmbed(
  recruit,
  participants
) {

  const remain =
    recruit.max_players -
    participants.length;

  let color = 0x3498db;

  if (recruit.status === 'PAUSED') {
    color = 0xf39c12;
  }
  else if (
    recruit.status === 'CLOSED'
  ) {
    color = 0x7f8c8d;
  }
  else if (remain === 0) {
    color = 0x2ecc71;
  }
  else if (remain === 1) {
    color = 0xf1c40f;
  }

  let title =
    `${recruit.game_name} 参加者募集`;

  switch (recruit.status) {

    case 'OPEN':
      title +=
        ` あと${remain}名募集中！`;
      break;

    case 'FULL':
      title += ' 【満員】';
      break;

    case 'PAUSED':
      title += ' 【一時停止中】';
      break;

    case 'CLOSED':
      title +=
        ' は終了しました';
      break;
  }

  const startText =
    recruit.is_now
      ? 'いまから'
      : dayjs(recruit.start_time)
          .tz('Asia/Tokyo')
          .format('MM/DD HH:mm');

  const expireText =
    dayjs(recruit.expires_at)
      .tz('Asia/Tokyo')
      .format('MM/DD HH:mm');

  return new EmbedBuilder()
    .setTitle(title)
    .setColor(color)
    .setDescription(

      `開始日時\n${startText}\n\n` +

      `募集状況\n` +
      `${participants.length}` +
      ` / ${recruit.max_players}\n\n` +

      `募集主: <@${recruit.host_id}>\n\n` +

      `募集ID: ${recruit.id}\n` +

      `有効期限: ${expireText}\n\n` +

      `備考\n` +
      `${recruit.note || 'なし'}`
    );
}

module.exports =
  buildEmbed;
