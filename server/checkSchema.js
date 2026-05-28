import pg from 'pg';

const pool = new pg.Pool({
  user: 'postgres',
  password: 'zaid1972',
  host: 'localhost',
  database: 'hostel_management'
});

pool.query(
  "SELECT column_name FROM information_schema.columns WHERE table_name='hostels' ORDER BY ordinal_position",
  (err, res) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Hostels table columns:');
      res.rows.forEach(r => console.log('  ' + r.column_name));
    }
    pool.end();
  }
);
