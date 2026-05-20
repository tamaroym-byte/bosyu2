const db = require('../db/database');

          break;
        }

        case 'leave': {
          recruitService.removeParticipant(
            recruit.id,
            interaction.user.id
          );

          participants = recruitService.getParticipants(recruit.id);

          if (recruit.status === 'FULL') {
            recruit.status = 'OPEN';

            db.prepare(`
              UPDATE recruits SET status='OPEN'
              WHERE id=?
            `).run(recruit.id);
          }

          break;
        }

        case 'pause': {
          recruit.status = 'PAUSED';

          db.prepare(`
            UPDATE recruits SET status='PAUSED'
            WHERE id=?
          `).run(recruit.id);

          break;
        }

        case 'resume': {
          recruit.status = 'OPEN';

          db.prepare(`
            UPDATE recruits SET status='OPEN'
            WHERE id=?
          `).run(recruit.id);

          break;
        }

        case 'close': {
          recruit.status = 'CLOSED';

          db.prepare(`
            UPDATE recruits SET status='CLOSED'
            WHERE id=?
          `).run(recruit.id);

          break;
        }
      }

      const embed = buildEmbed(recruit, participants);

      const buttons = buildButtons(recruit.status);

      if (recruit.status === 'CLOSED') {
        buttons.components.forEach(btn => btn.setDisabled(true));
      }

      await interaction.update({
        embeds: [embed],
        components: [buttons]
      });
    }
  }
};
