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

      const command =
        client.commands.get(
          interaction.commandName
        );

      if (!command) return;

      await command.execute(
        interaction
      );
    }

    // Modal Submit
    if (
      interaction.isModalSubmit()
    ) {

      if (
        interaction.customId !==
        'recruit-modal'
      ) return;

      const game =
        interaction.fields
          .getTextInputValue('game');

      const startInput =
        interaction.fields
          .getTextInputValue('start');

      const max = Number(
        interaction.fields
          .getTextInputValue('max')
      );

      const note =
        interaction.fields
          .getTextInputValue('note');

      const startTime =
        parseJST(startInput);

      if (!startTime.isValid()) {

        return interaction.reply({
          content:
            '日時形式が不正です',
          ephemeral: true
        });
      }

      const now = nowJST();

      if (
        startTime.isBefore(now)
      ) {

        return interaction.reply({
          content:
            '過去の時間では募集できません',
          ephemeral: true
        });
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
          ephemeral: true
        });
      }

      const channel =
        interaction.guild.channels.cache.get(
          setting.recruit_channel_id
        );

      const tempRecruit = {
        game_name: game,
        start_time:
          startTime.toISOString(),
        expires_at:
          expiresAt.toISOString(),
        max_players: max,
        host_id:
          interaction.user.id,
        status: 'OPEN',
        note,
        id: 'TEMP'
      };

      const embed =
        buildEmbed(
          tempRecruit,
          []
        );

      const buttons =
        buildButtons('OPEN');

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

          status: 'OPEN'
        });

      await interaction.reply({
        content:
          `募集作成完了 ID:${recruitId}`,
        ephemeral: true
      });
    }

    // Button
    if (interaction.isButton()) {

      const messageId =
        interaction.message.id;

      const recruit =
        db.prepare(`
          SELECT *
          FROM recruits
          WHERE message_id = ?
        `).get(messageId);

      if (!recruit) return;

      let participants =
        recruitService.getParticipants(
          recruit.id
        );

      switch (
        interaction.customId
      ) {

        // 参加
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
              ephemeral: true
            });
          }

          if (
            recruit.status ===
            'CLOSED'
          ) {

            return interaction.reply({
              content:
                '募集は終了しています',
              ephemeral: true
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

        // 退出
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

        // 停止
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

        // 再開
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

        // 終了
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
