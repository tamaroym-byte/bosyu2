const cron = require('node-cron');
const db = require('../db/database');

module.exports = client => {
  cron.schedule('* * * * *', async () => {
    const recruits = db.prepare(`
      SELECT * FROM recruits
      WHERE status='PAUSED'
    `).all();

    for (const recruit of recruits) {
      const start = new Date(recruit.start_time);

      if (Date.now() > start.getTime()) {
        db.prepare(`
          UPDATE recruits
          SET status='CLOSED'
          WHERE id=?
        `).run(recruit.id);

        try {
          const channel = await client.channels.fetch(
            recruit.channel_id
          );

          const message = await channel.messages.fetch(
            recruit.message_id
          );

          await message.reply('募集は自動終了されました');
        } catch (err) {
          console.error(err);
        }
      }
    }
  });
};
