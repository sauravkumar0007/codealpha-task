const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const apiRoutes = require('./routes/api');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

const PORT = 3000;

(async () => {
  try {
    await sequelize.sync({ force: true }); // This will drop and recreate tables
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();