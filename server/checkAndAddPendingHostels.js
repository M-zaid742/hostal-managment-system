import pg from 'pg';

const pool = new pg.Pool({
  user: 'postgres',
  password: 'zaid1972',
  host: 'localhost',
  database: 'hostel_management'
});

const checkAndAddPending = async () => {
  try {
    // Check for pending hostels
    const pendingCheck = await pool.query(
      'SELECT * FROM hostels WHERE approval_status = $1',
      ['pending']
    );
    
    console.log('Current pending hostels:', pendingCheck.rows.length);
    
    // If no pending hostels, create some test ones
    if (pendingCheck.rows.length === 0) {
      console.log('\n📋 No pending hostels found. Adding test pending hostels...\n');
      
      const testHostels = [
        {
          owner_id: 2,
          name: 'Traveler\'s Haven',
          area: 'Iqbal Park',
          city: 'Lahore',
          address: 'Street 12, Iqbal Park, Lahore',
          lat: 31.53,
          lng: 74.31,
          gender: 'co-ed',
          description: 'Comfortable hostel perfect for budget travelers',
          phone: '+92-300-9999000',
          email: 'contact@travelershaven.pk',
          approval_status: 'pending'
        },
        {
          owner_id: 2,
          name: 'Paradise Backpackers',
          area: 'Lahore Fort Area',
          city: 'Lahore',
          address: 'Plot 456, Near Lahore Fort, Lahore',
          lat: 31.54,
          lng: 74.31,
          gender: 'boys',
          description: 'Budget-friendly hostel near historic Lahore Fort',
          phone: '+92-300-8888000',
          email: 'info@paradisebackpackers.pk',
          approval_status: 'pending'
        },
        {
          owner_id: 2,
          name: 'Nomad\'s Nest',
          area: 'University Road',
          city: 'Lahore',
          address: 'Block F, University Road, Lahore',
          lat: 31.55,
          lng: 74.29,
          gender: 'girls',
          description: 'Secure hostel near universities and commercial areas',
          phone: '+92-300-7777000',
          email: 'stay@nomadsnest.pk',
          approval_status: 'pending'
        }
      ];
      
      for (const hostel of testHostels) {
        const result = await pool.query(
          `INSERT INTO hostels (owner_id, name, area, city, address, lat, lng, gender, description, phone, email, approval_status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
           RETURNING id, name, approval_status`,
          [hostel.owner_id, hostel.name, hostel.area, hostel.city, hostel.address, hostel.lat, hostel.lng, hostel.gender, hostel.description, hostel.phone, hostel.email, hostel.approval_status]
        );
        console.log(`✅ Added pending hostel: ${result.rows[0].name} (ID: ${result.rows[0].id})`);
      }
    }
    
    // Show all pending hostels
    const allPending = await pool.query(
      `SELECT 
        h.id, h.name, h.city, h.area, h.address, h.phone, h.email, 
        h.gender, h.approval_status, h.created_at,
        u.name as ownerName
      FROM hostels h
      LEFT JOIN users u ON h.owner_id = u.id
      WHERE h.approval_status = 'pending'
      ORDER BY h.created_at DESC`
    );
    
    console.log('\n📊 All pending hostels:');
    console.log(JSON.stringify(allPending.rows, null, 2));
    console.log(`\n✅ Total pending: ${allPending.rows.length}`);
    
  } catch (err) {
    console.log('❌ Error:', err.message);
  } finally {
    pool.end();
  }
};

checkAndAddPending();
