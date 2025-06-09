const { v4: uuidv4 } = require('uuid');
const db = require('../models/db');
const { validateUser, normalizeMobile } = require('../utils/validators');


exports.createUser = (req, res) => {
  const data = req.body;
  const errors = validateUser(data);
  if (errors.length) return res.status(400).json({ errors });

  const mob_num = normalizeMobile(data.mob_num);
  const pan_num = data.pan_num.toUpperCase();
  const user_id = uuidv4();
  const timestamp = new Date().toISOString();

  db.get(`SELECT * FROM managers WHERE manager_id = ? AND is_active = 1`, [data.manager_id], (err, manager) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!manager) return res.status(400).json({ error: 'Manager not found or inactive' });

    const query = `INSERT INTO users 
      (user_id, full_name, mob_num, pan_num, manager_id, created_at, updated_at, is_active) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(query, [user_id, data.full_name, mob_num, pan_num, data.manager_id, timestamp, timestamp, 1], (err) => {
      if (err) return res.status(500).json({ error: 'Failed to create user' });
      res.status(201).json({ message: 'User created successfully', user_id });
    });
  });
};

exports.getUsers = (req, res) => {
  const { user_id, mob_num, manager_id } = req.body;
  let query = `SELECT * FROM users WHERE is_active = 1`;
  const params = [];

  if (user_id) {
    query += ` AND user_id = ?`;
    params.push(user_id);
  }
  if (mob_num) {
    query += ` AND mob_num = ?`;
    params.push(normalizeMobile(mob_num));
  }
  if (manager_id) {
    query += ` AND manager_id = ?`;
    params.push(manager_id);
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to retrieve users' });
    res.json({ users: rows });
  });
};

exports.deleteUser = (req, res) => {
  const { user_id, mob_num } = req.body;

  if (!user_id && !mob_num) {
    return res.status(400).json({ error: 'Provide user_id or mob_num' });
  }

  const query = `UPDATE users SET is_active = 0 WHERE ${user_id ? 'user_id = ?' : 'mob_num = ?'}`;
  const value = user_id || normalizeMobile(mob_num);

  db.run(query, [value], function (err) {
    if (err) return res.status(500).json({ error: 'Failed to delete user' });
    if (this.changes === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  });
};

exports.updateUser = (req, res) => {
  const { user_ids, update_data } = req.body;
  if (!user_ids || !Array.isArray(user_ids) || user_ids.length === 0) {
    return res.status(400).json({ error: 'user_ids array is required' });
  }

  const errors = validateUser(update_data);
  if (errors.length) return res.status(400).json({ errors });

  const updatedFields = {
    full_name: update_data.full_name,
    mob_num: normalizeMobile(update_data.mob_num),
    pan_num: update_data.pan_num.toUpperCase(),
    manager_id: update_data.manager_id
  };

  db.get(`SELECT * FROM managers WHERE manager_id = ? AND is_active = 1`, [update_data.manager_id], (err, manager) => {
    if (err || !manager) return res.status(400).json({ error: 'Invalid manager ID' });

    let completed = 0;
    user_ids.forEach((id) => {
      const timestamp = new Date().toISOString();

      db.run(`UPDATE users SET is_active = 0 WHERE user_id = ?`, [id], (err) => {
        if (err) return res.status(500).json({ error: 'Error deactivating old user' });

        const newUserId = uuidv4();
        const query = `INSERT INTO users (user_id, full_name, mob_num, pan_num, manager_id, created_at, updated_at, is_active)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        db.run(query, [newUserId, updatedFields.full_name, updatedFields.mob_num, updatedFields.pan_num, updatedFields.manager_id, timestamp, timestamp, 1], (err) => {
          if (err) return res.status(500).json({ error: 'Failed to update user' });

          completed++;
          if (completed === user_ids.length) {
            res.json({ message: 'Users updated successfully' });
          }
        });
      });
    });
  });
};
