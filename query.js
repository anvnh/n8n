const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'finance_db',
  user: 'n8n_user',
  password: 'n8n_password'
});
pool.query('SELECT * FROM users', (err, res) => {
  if (err) console.error(err);
  else console.log(res.rows);
  pool.end();
});
