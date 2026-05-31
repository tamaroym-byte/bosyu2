const db =
  require('../db/database');

function addXP(
  guildId,
  userId,
  amount
) {

  const existing = db.prepare(`
    SELECT *
    FROM user_xp
    WHERE guild_id = ?
    AND user_id = ?
  `).get(
    guildId,
    userId
  );

  if (!existing) {

    db.prepare(`
      INSERT INTO user_xp (
        guild_id,
        user_id,
        xp
      )
      VALUES (?, ?, ?)
    `).run(
      guildId,
      userId,
      amount
    );

    return amount;
  }

  const newXP =
    existing.xp + amount;

  db.prepare(`
    UPDATE user_xp
    SET xp = ?
    WHERE guild_id = ?
    AND user_id = ?
  `).run(
    newXP,
    guildId,
    userId
  );

  return newXP;
}

module.exports = {
  addXP
};
