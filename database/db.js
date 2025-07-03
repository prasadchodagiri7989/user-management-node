const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./battery.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS battery_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      battery_id TEXT NOT NULL,
      current REAL NOT NULL,
      voltage REAL NOT NULL,
      temperature REAL NOT NULL,
      time TEXT NOT NULL
    )
  `);

  db.run(`CREATE INDEX IF NOT EXISTS idx_battery_time ON battery_data (battery_id, time)`);
});

module.exports = db;
