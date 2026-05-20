const db = require('../db/database');

module.exports = {
  name: 'messageCreate',

  async execute(message) {
    if (message.author.bot) return;

    if (!message.reference) return;

    const recruit = db.prepare(`
      SELECT * FROM recruits
      WHERE message_id = ?
    `).get(message.reference.messageId);

    if (!recruit) return;

    const participants = db.prepare(`
      SELECT * FROM recruit_participants
      WHERE recruit_id=?
    `).all(recruit.id);

    const mentions = participants
      .map(p => `<@${p.user_id}>`)
      .join(' ');

    if (!mentions) return;

    await message.reply({
      content: `募集に返信があります ${mentions}`
    });
  }
};
