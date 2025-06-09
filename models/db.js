const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.resolve(__dirname, '../users.db');

// Connect to SQLite database
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("❌ Error connecting to SQLite database:", err.message);
    process.exit(1);
  } else {
    console.log("✅ Connected to SQLite database at:", DB_PATH);
    initializeTables(); // Create tables on startup
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Function to initialize all required tables
function initializeTables() {
  // Create managers table
  db.run(`
    CREATE TABLE IF NOT EXISTS managers (
      manager_id TEXT PRIMARY KEY,
      is_active INTEGER
    )
  `, (err) => {
    if (err) console.error("❌ Failed to create managers table:", err.message);
    else {
      console.log("✅ Managers table ready");
      // Insert sample managers
      db.run(`
        INSERT OR IGNORE INTO managers (manager_id, is_active) VALUES
        ('1111-aaaa', 1),
        ('2222-bbbb', 1)
      `);
    }
  });

  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      user_id TEXT PRIMARY KEY,
      full_name TEXT,
      mob_num TEXT,
      pan_num TEXT,
      manager_id TEXT,
      created_at TEXT,
      updated_at TEXT,
      is_active INTEGER,
      FOREIGN KEY(manager_id) REFERENCES managers(manager_id)
    )
  `, (err) => {
    if (err) console.error("❌ Failed to create users table:", err.message);
    else console.log("✅ Users table ready");
  });
}

// Export database instance
module.exports = db;
