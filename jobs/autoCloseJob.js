const cron =
  require('node-cron');

const db =
  require('../db/database');

const dayjs =
  require('dayjs');

const {
  nowJST
} = require('../utils/time');

module.exports = client => {

  cron.schedule(
    '* * * * *',

    async () => {

      const recruits =
        db.prepare(`
          SELECT *
          FROM recruits
          WHERE status IN (
            'OPEN',
            'FULL',
            'PAUSED'
          )
        `).all();

      const now = nowJST();

      for (const recruit of recruits) {

        const expiresAt =
          dayjs(
            recruit.expires_at
          );

        if (
          now.isAfter(
            expiresAt
          )
        ) {

          db.prepare(`
            UPDATE recruits
            SET status='CLOSED'
            WHERE id=?
          `).run(recruit.id);

          try {

            const channel =
              await client.channels.fetch(
                recruit.channel_id
              );

            const message =
              await channel.messages.fetch(
                recruit.message_id
              );

            await message.reply({
              content:
                '募集の有効期限が切れたため自動終了しました'
            });

          } catch (err) {

            console.error(err);
          }
        }
      }
    }
  );
};
