const db = require('./db');

// Create users table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY,
  full_name TEXT,
  mob_num TEXT,
  pan_num TEXT,
  manager_id TEXT,
  created_at TEXT,
  updated_at TEXT,
  is_active INTEGER
)`);

const createUser = (user, callback) => {
  const query = `
    INSERT INTO users (user_id, full_name, mob_num, pan_num, manager_id, created_at, updated_at, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    user.user_id,
    user.full_name,
    user.mob_num,
    user.pan_num,
    user.manager_id,
    user.created_at,
    user.updated_at,
    user.is_active
  ];
  db.run(query, params, function (err) {
    callback(err);
  });
};

const getUserById = (user_id, callback) => {
  db.get(`SELECT * FROM users WHERE user_id = ? AND is_active = 1`, [user_id], callback);
};

const getUsers = (filters, callback) => {
  let query = `SELECT * FROM users WHERE is_active = 1`;
  const params = [];

  if (filters.user_id) {
    query += ` AND user_id = ?`;
    params.push(filters.user_id);
  }
  if (filters.mob_num) {
    query += ` AND mob_num = ?`;
    params.push(filters.mob_num);
  }
  if (filters.manager_id) {
    query += ` AND manager_id = ?`;
    params.push(filters.manager_id);
  }

  db.all(query, params, callback);
};

const deleteUser = (filter, callback) => {
  const condition = filter.user_id ? 'user_id = ?' : 'mob_num = ?';
  const value = filter.user_id || filter.mob_num;

  const query = `UPDATE users SET is_active = 0 WHERE ${condition}`;
  db.run(query, [value], function (err) {
    callback(err, this.changes);
  });
};

const deactivateUser = (user_id, callback) => {
  db.run(
    `UPDATE users SET is_active = 0 WHERE user_id = ?`,
    [user_id],
    function (err) {
      callback(err, this.changes);
    }
  );
};

const insertUpdatedUser = (user, callback) => {
  const query = `
    INSERT INTO users (user_id, full_name, mob_num, pan_num, manager_id, created_at, updated_at, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    user.user_id,
    user.full_name,
    user.mob_num,
    user.pan_num,
    user.manager_id,
    user.created_at,
    user.updated_at,
    user.is_active
  ];
  db.run(query, params, function (err) {
    callback(err);
  });
};

module.exports = {
  createUser,
  getUserById,
  getUsers,
  deleteUser,
  deactivateUser,
  insertUpdatedUser
};
