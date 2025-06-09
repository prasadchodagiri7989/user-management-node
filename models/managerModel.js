const db = require('./db');

// Create table for managers
db.run(`CREATE TABLE IF NOT EXISTS managers (
  manager_id TEXT PRIMARY KEY,
  is_active INTEGER
)`);

// Insert sample managers (if not already present)
db.run(`INSERT OR IGNORE INTO managers (manager_id, is_active) VALUES 
  ('1111-aaaa', 1),
  ('2222-bbbb', 1)
`);

// Check if manager exists and is active
const isValidManager = (manager_id, callback) => {
  const query = `SELECT * FROM managers WHERE manager_id = ? AND is_active = 1`;
  db.get(query, [manager_id], (err, row) => {
    if (err) return callback(err, null);
    if (!row) return callback(null, null);
    callback(null, row);
  });
};

// Optional: add manager (for testing or admin use)
const addManager = (manager_id, callback) => {
  const query = `INSERT INTO managers (manager_id, is_active) VALUES (?, 1)`;
  db.run(query, [manager_id], function (err) {
    callback(err);
  });
};

// Optional: deactivate manager
const deactivateManager = (manager_id, callback) => {
  const query = `UPDATE managers SET is_active = 0 WHERE manager_id = ?`;
  db.run(query, [manager_id], function (err) {
    callback(err, this.changes);
  });
};

module.exports = {
  isValidManager,
  addManager,
  deactivateManager
};
