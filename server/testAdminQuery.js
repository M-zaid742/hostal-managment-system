import pg from 'pg';

const pool = new pg.Pool({
  user: 'postgres',
  password: 'zaid1972',
  host: 'localhost',
  database: 'hostel_management'
});

const testQuery = async () => {
  try {
    // Test the pending query
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
    
    console.log('Pending hostels:');
    console.log(JSON.stringify(result.rows, null, 2));
    
    // Test the approved query
    const approved = await pool.query(
      `SELECT 
        h.id, h.name, h.city, h.area, h.address, h.phone, h.email, 
        h.gender, h.approval_status, h.subscription_status, h.subscription_end_date,
        u.name as ownerName
      FROM hostels h
      LEFT JOIN users u ON h.owner_id = u.id
      WHERE h.approval_status = $1
      ORDER BY h.created_at DESC`,
      ["approved"]
    );
    
    console.log('\n\nApproved hostels:');
    console.log(JSON.stringify(approved.rows, null, 2));
  } catch (err) {
    console.log('❌ Error:', err.message);
  } finally {
    pool.end();
  }
};

testQuery();
