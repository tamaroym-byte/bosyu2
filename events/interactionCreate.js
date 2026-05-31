const db =
  require('../db/database');

const buildEmbed =
  require('../ui/recruitEmbed');

const buildButtons =
  require('../ui/recruitButtons');

const recruitService =
  require('../services/recruitService');

const xpService =
  require('../services/xpService');

const {
  parseJST,
  nowJST
} = require('../utils/time');

module.exports = {
  name: 'interactionCreate',

  async execute(
    interaction,
    client
  ) {

    // Slash Command
    if (
      interaction.isChatInputCommand()
    ) {

      // /rec
      if (
        interaction.commandName ===
        'rec'
      ) {

        const game =
          interaction.options.getString(
            'game'
          );

        const day =
          interaction.options.getInteger(
            'day'
          );

        const time =
          interaction.options.getString(
            'time'
          );

        const max =
          interaction.options.getInteger(
            'max'
          );

        const note =
          interaction.options.getString(
            'note'
          ) || '';

        if (day && !time) {

          return interaction.reply({
            content:
              '時間も入力してください',
            flags: 64
          });
        }

        const isNow =
          !day && !time;

        let startTime;

        if (isNow) {

          startTime =
            nowJST();

        } else {

          const now =
            nowJST();

          const year =
            now.year();

          const month =
            String(
              now.month() + 1
            ).padStart(2, '0');

          const dayText =
            String(autoDay)
              .padStart(2, '0');

          startTime =
            parseJST(
              `${year}-${month}-${dayText} ${time}`
            );
        }

        const expiresAt =
          startTime.add(
            24,
            'hour'
          );

        const setting =
          db.prepare(`
            SELECT *
            FROM guild_settings
            WHERE guild_id = ?
          `).get(
            interaction.guild.id
          );

        if (
          !setting?.recruit_channel_id
        ) {

          return interaction.reply({
            content:
              '募集チャンネル未設定',
            flags: 64
          });
        }

        const channel =
          interaction.guild.channels.cache.get(
            setting.recruit_channel_id
          );

        const tempRecruit = {

          id: 'TEMP',

          guild_id:
            interaction.guild.id,

          host_id:
            interaction.user.id,

          game_name: game,

          start_time:
            startTime.toISOString(),

          expires_at:
            expiresAt.toISOString(),

          max_players: max,

          note,

          status: 'OPEN',

          is_now:
            isNow ? 1 : 0
        };

        const embed =
          buildEmbed(
            tempRecruit,
            []
          );

        const buttons =
          buildButtons(
            'OPEN'
          );

        const message =
          await channel.send({
            embeds: [embed],
            components: [buttons]
          });

        const recruitId =
          recruitService.createRecruit({

            guild_id:
              interaction.guild.id,

            host_id:
              interaction.user.id,

            message_id:
              message.id,

            channel_id:
              channel.id,

            game_name: game,

            start_time:
              startTime.toISOString(),

            expires_at:
              expiresAt.toISOString(),

            max_players: max,

            note,

            status: 'OPEN',

            is_now:
              isNow ? 1 : 0
          });

        return interaction.reply({
          content:
            `募集作成完了 ID:${recruitId}`,
          flags: 64
        });
      }

      // 他コマンド
      const command =
        client.commands.get(
          interaction.commandName
        );

      if (!command)
        return;

      await command.execute(
        interaction
      );
    }

    // Button
    if (
      interaction.isButton()
    ) {

      const messageId =
        interaction.message.id;

      const recruit =
        db.prepare(`
          SELECT *
          FROM recruits
          WHERE message_id = ?
        `).get(messageId);

      if (!recruit)
        return;

      // 募集主のみ停止/終了
      if (
        (
          interaction.customId ===
          'pause'

          ||

          interaction.customId ===
          'resume'

          ||

          interaction.customId ===
          'close'
        )

        &&

        interaction.user.id !==
        recruit.host_id
      ) {

        return interaction.reply({
          content:
            '募集主のみ操作できます',
          flags: 64
        });
      }

      let participants =
        recruitService.getParticipants(
          recruit.id
        );

      switch (
        interaction.customId
      ) {

        case 'join': {

          const exists =
            participants.find(
              p =>
                p.user_id ===
                interaction.user.id
            );

          if (exists) {

            return interaction.reply({
              content:
                '既に参加済みです',
              flags: 64
            });
          }

          if (
            recruit.status ===
            'CLOSED'
          ) {

            return interaction.reply({
              content:
                '募集終了済みです',
              flags: 64
            });
          }

          recruitService.addParticipant(
            recruit.id,
            interaction.user.id
          );

          xpService.addXP(
            interaction.guild.id,
            interaction.user.id,
            10
          );

          participants =
            recruitService.getParticipants(
              recruit.id
            );

          if (
            participants.length >=
            recruit.max_players
          ) {

            recruit.status =
              'FULL';

            db.prepare(`
              UPDATE recruits
              SET status='FULL'
              WHERE id=?
            `).run(recruit.id);
          }

          break;
        }

        case 'leave': {

          recruitService.removeParticipant(
            recruit.id,
            interaction.user.id
          );

          participants =
            recruitService.getParticipants(
              recruit.id
            );

          if (
            recruit.status ===
            'FULL'
          ) {

            recruit.status =
              'OPEN';

            db.prepare(`
              UPDATE recruits
              SET status='OPEN'
              WHERE id=?
            `).run(recruit.id);
          }

          break;
        }

        case 'pause': {

          recruit.status =
            'PAUSED';

          db.prepare(`
            UPDATE recruits
            SET status='PAUSED'
            WHERE id=?
          `).run(recruit.id);

          break;
        }

        case 'resume': {

          recruit.status =
            'OPEN';

          db.prepare(`
            UPDATE recruits
            SET status='OPEN'
            WHERE id=?
          `).run(recruit.id);

          break;
        }

        case 'close': {

          recruit.status =
            'CLOSED';

          db.prepare(`
            UPDATE recruits
            SET status='CLOSED'
            WHERE id=?
          `).run(recruit.id);

          break;
        }
      }

      const embed =
        buildEmbed(
          recruit,
          participants
        );

      const buttons =
        buildButtons(
          recruit.status
        );

      if (
        recruit.status ===
        'CLOSED'
      ) {

        buttons.components.forEach(
          btn =>
            btn.setDisabled(true)
        );
      }

      await interaction.update({
        embeds: [embed],
        components: [buttons]
      });
    }
  }
};
