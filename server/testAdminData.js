import pg from 'pg';

const pool = new pg.Pool({
  user: 'postgres',
  password: 'zaid1972',
  host: 'localhost',
  database: 'hostel_management'
});

pool.query(
  "SELECT id, email, approval_status FROM hostels LIMIT 5",
  (err, res) => {
    if (err) {
      console.error('Error:', err.message);
    } else {
      console.log('Sample hostels:');
      res.rows.forEach(row => {
        console.log(`  - ${row.id}: approval_status = ${row.approval_status}`);
      });
    }
    pool.end();
  }
);
