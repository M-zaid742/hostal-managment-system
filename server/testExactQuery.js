import pg from 'pg';

const pool = new pg.Pool({
  user: 'postgres',
  password: 'zaid1972',
  host: 'localhost',
  database: 'hostel_management'
});

const testExactQuery = async () => {
  try {
    // Run exact same query as API
    const result = await pool.query(
      `SELECT 
        h.id, h.name, h.city, h.area, h.address, h.phone, h.email, 
        h.gender, h.approval_status, h.created_at,
        u.name as ownerName
      FROM hostels h
      LEFT JOIN users u ON h.owner_id = u.id
      WHERE h.approval_status = $1
      ORDER BY h.created_at DESC`,
      ["pending"]
    );
    
    console.log('Query result:');
    console.log(JSON.stringify(result.rows, null, 2));
    console.log('\nTotal rows:', result.rows.length);
    
  } catch (err) {
    console.log('❌ Error:', err.message);
  } finally {
    pool.end();
  }
};

testExactQuery();
