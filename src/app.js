const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const port = 3000
const userRoutes = require('./routes/userRoutes')
const authRoutes = require('./routes/authRoutes')

const { resErrorHandler } = require('./commons/exceptions/resHandler');

app.use(cors());
app.use(bodyParser.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Centralized error handler middleware
app.use((err, req, res, next) => {
  return resErrorHandler(res, err);
});

const { sequelize } = require('../models');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully.');
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
})();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
