const { Pool } = require('pg');

const dbPool = new Pool({
  database: 'b35_personal_web',
  port: '5432',
  user: 'postgres',
  password: 'root',
});

module.exports = dbPool;
