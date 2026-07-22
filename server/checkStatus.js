import pg from 'pg';

const pool = new pg.Pool({
  user: 'postgres',
  password: 'zaid1972',
  host: 'localhost',
  database: 'hostel_management'
});

const test = async () => {
  try {
    // Check total count
    const count = await pool.query('SELECT COUNT(*) as count FROM hostels');
    console.log('Total hostels:', count.rows[0].count);
    
    // Check by status
    const byStatus = await pool.query(
      'SELECT approval_status, COUNT(*) as count FROM hostels GROUP BY approval_status'
    );
    console.log('By status:');
    byStatus.rows.forEach(row => {
      console.log(`  ${row.approval_status}: ${row.count}`);
    });
    
    // List all hostels
    const all = await pool.query('SELECT id, name, approval_status FROM hostels ORDER BY id');
    console.log('\nAll hostels:');
    all.rows.forEach(h => {
      console.log(`  ${h.id}. ${h.name} - ${h.approval_status}`);
    });
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    pool.end();
  }
};

test();
