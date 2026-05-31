async function notifyParticipants(
  channel,
  participants,
  message
) {

  if (!participants.length)
    return;

  const mentions =
    participants
      .map(
        p => `<@${p.user_id}>`
      )
      .join(' ');

  await channel.send({
    content:
      `${mentions}\n${message}`
  });
}

module.exports = {
  notifyParticipants
};
