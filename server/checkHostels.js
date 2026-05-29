import pg from 'pg';

const pool = new pg.Pool({
  user: 'postgres',
  password: 'zaid1972',
  host: 'localhost',
  database: 'hostel_management'
});

const checkHostels = async () => {
  try {
    const result = await pool.query('SELECT id, name, approval_status FROM hostels');
    console.log('All hostels:');
    console.log(JSON.stringify(result.rows, null, 2));
  } catch (err) {
    console.log('❌ Error:', err.message);
  } finally {
    pool.end();
  }
};

checkHostels();
