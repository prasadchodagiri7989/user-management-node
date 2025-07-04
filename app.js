const express = require('express');
const bodyParser = require('body-parser');
const batteryRoutes = require('./routes/batteryRoutes');

const app = express();
app.use(bodyParser.json());
app.use('/api/battery', batteryRoutes);

module.exports = app;
