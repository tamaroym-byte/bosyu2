CREATE TABLE IF NOT EXISTS recruits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT,
    host_id TEXT,
    message_id TEXT,
    channel_id TEXT,
    game_name TEXT,
    start_time TEXT,
    max_players INTEGER,
    expires_at TEXT,
    note TEXT,
    status TEXT,
    is_now INTEGER DEFAULT 0,
    created_at TEXT
);

CREATE TABLE IF NOT EXISTS recruit_participants (
    recruit_id INTEGER,
    user_id TEXT
);

CREATE TABLE IF NOT EXISTS user_xp (
    guild_id TEXT,
    user_id TEXT,
    xp INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS xp_roles (
    guild_id TEXT,
    role_id TEXT,
    required_xp INTEGER
);

CREATE TABLE IF NOT EXISTS guild_settings (
    guild_id TEXT PRIMARY KEY,
    recruit_channel_id TEXT,
    admin_channel_id TEXT
);
