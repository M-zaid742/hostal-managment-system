import pg from 'pg';

const pool = new pg.Pool({
  user: 'postgres',
  password: 'zaid1972',
  host: 'localhost',
  database: 'hostel_management'
});

const addHostels = async () => {
  try {
    const hostels = [
      {
        owner_id: 2,
        name: 'Pearl Residences',
        area: 'Gulberg III',
        city: 'Lahore',
        address: 'Street 8, Gulberg III, Lahore',
        lat: 31.51,
        lng: 74.35,
        gender: 'co-ed',
        description: 'Modern hostel with premium facilities and rooftop terrace',
        phone: '+92-300-8889999',
        email: 'contact@pearl.pk',
        approval_status: 'approved'
      },
      {
        owner_id: 2,
        name: 'Diamond House',
        area: 'Mall Road',
        city: 'Lahore',
        address: 'Plot 123, Mall Road, Lahore',
        lat: 31.55,
        lng: 74.32,
        gender: 'boys',
        description: 'Cozy hostel near shopping district with great location',
        phone: '+92-300-9990000',
        email: 'hello@diamond.pk',
        approval_status: 'approved'
      },
      {
        owner_id: 2,
        name: 'Golden Haven',
        area: 'DHA Phase 6',
        city: 'Lahore',
        address: 'Block C, DHA Phase 6, Lahore',
        lat: 31.47,
        lng: 74.40,
        gender: 'girls',
        description: 'Secure and comfortable hostel in upscale DHA area',
        phone: '+92-300-1231234',
        email: 'info@golden.pk',
        approval_status: 'approved'
      },
      {
        owner_id: 2,
        name: 'Lakeside Retreat',
        area: 'Near Jilani Park',
        city: 'Lahore',
        address: 'Block B, Near Jilani Park, Lahore',
        lat: 31.52,
        lng: 74.38,
        gender: 'co-ed',
        description: 'Peaceful hostel with views of nearby park and lake',
        phone: '+92-300-2342345',
        email: 'stay@lakeside.pk',
        approval_status: 'approved'
      },
      {
        owner_id: 2,
        name: 'Urban Hub',
        area: 'Saddar',
        city: 'Lahore',
        address: 'Street 5, Saddar, Lahore',
        lat: 31.54,
        lng: 74.33,
        gender: 'boys',
        description: 'Vibrant hostel in the heart of Lahore city center',
        phone: '+92-300-3453456',
        email: 'contact@urban.pk',
        approval_status: 'approved'
      }
    ];

    for (const hostel of hostels) {
      const result = await pool.query(
        `INSERT INTO hostels (owner_id, name, area, city, address, lat, lng, gender, description, phone, email, approval_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING id`,
        [hostel.owner_id, hostel.name, hostel.area, hostel.city, hostel.address, hostel.lat, hostel.lng, hostel.gender, hostel.description, hostel.phone, hostel.email, hostel.approval_status]
      );
      console.log(`✅ Added: ${hostel.name} (ID: ${result.rows[0].id})`);
    }

    // Verify total count
    const count = await pool.query('SELECT COUNT(*) as total FROM hostels');
    console.log(`\n✅ Total hostels in database: ${count.rows[0].total}`);
  } catch (err) {
    console.log('❌ Error:', err.message);
  } finally {
    pool.end();
  }
};

addHostels();
