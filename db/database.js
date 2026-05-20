const Database = require('better-sqlite3');
const fs = require('fs');

const db = new Database('database.sqlite');

const schema = fs.readFileSync('./db/schema.sql', 'utf8');
db.exec(schema);

module.exports = db;
