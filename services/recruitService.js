const db = require('../db/database');

function createRecruit(data) {
  const stmt = db.prepare(`
    INSERT INTO recruits (
      guild_id,
      host_id,
      message_id,
      channel_id,
      game_name,
      start_time,
      max_players,
      expires_at,
      note,
      status,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    data.guild_id,
    data.host_id,
    data.message_id,
    data.channel_id,
    data.game_name,
    data.start_time,
    data.max_players,
    data.expires_at,
    data.note,
    data.status,
    new Date().toISOString()
  );

  return result.lastInsertRowid;
}

function getRecruit(id) {
  return db.prepare(`
    SELECT * FROM recruits WHERE id = ?
  `).get(id);
}

function addParticipant(recruitId, userId) {
  db.prepare(`
    INSERT INTO recruit_participants (recruit_id, user_id)
    VALUES (?, ?)
  `).run(recruitId, userId);
}

function removeParticipant(recruitId, userId) {
  db.prepare(`
    DELETE FROM recruit_participants
    WHERE recruit_id = ? AND user_id = ?
  `).run(recruitId, userId);
}

function getParticipants(recruitId) {
  return db.prepare(`
    SELECT * FROM recruit_participants
    WHERE recruit_id = ?
  `).all(recruitId);
}

module.exports = {
  createRecruit,
  getRecruit,
  addParticipant,
  removeParticipant,
  getParticipants
};
