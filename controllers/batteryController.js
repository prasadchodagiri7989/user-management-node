const db = require('../database/db');

exports.insertBatteryData = (req, res) => {
  const { battery_id, current, voltage, temperature, time } = req.body;
  if (!battery_id || current == null || voltage == null || temperature == null || !time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `
    INSERT INTO battery_data (battery_id, current, voltage, temperature, time)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(query, [battery_id, current, voltage, temperature, time], function (err) {
    if (err) return res.status(500).json({ error: 'Database insert failed' });
    res.status(201).json({ message: 'Data inserted successfully', id: this.lastID });
  });
};

exports.getBatteryData = (req, res) => {
  const { id } = req.params;
  db.all(
    `SELECT * FROM battery_data WHERE battery_id = ? ORDER BY time DESC`,
    [id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch data' });
      res.json({ data: rows });
    }
  );
};

exports.getBatteryFieldData = (req, res) => {
  const { id, field } = req.params;
  const { start, end } = req.query;

  const allowedFields = ['current', 'voltage', 'temperature'];
  if (!allowedFields.includes(field)) {
    return res.status(400).json({ error: 'Invalid field requested' });
  }

  let query = `SELECT time, ${field} FROM battery_data WHERE battery_id = ?`;
  const params = [id];

  if (start && end) {
    query += ` AND time BETWEEN ? AND ?`;
    params.push(start, end);
  }

  query += ` ORDER BY time ASC`;

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Query error' });
    res.json({ data: rows });
  });
};
