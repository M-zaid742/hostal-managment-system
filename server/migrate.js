import pg from 'pg';

const pool = new pg.Pool({
  user: 'postgres',
  password: 'zaid1972',
  host: 'localhost',
  database: 'hostel_management'
});

async function migrate() {
  try {
    console.log('🔄 Starting migration...');
    
    // Check if columns exist
    const result = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='hostels' 
      AND column_name IN ('approval_status', 'subscription_status', 'subscription_end_date', 'created_at', 'updated_at')
    `);
    
    const existingColumns = result.rows.map(r => r.column_name);
    console.log('Existing columns:', existingColumns);
    
    // Add missing columns
    if (!existingColumns.includes('approval_status')) {
      console.log('Adding approval_status...');
      await pool.query(`
        ALTER TABLE hostels ADD COLUMN approval_status VARCHAR(20) DEFAULT 'pending'
      `);
      console.log('✅ Added approval_status');
    }
    
    if (!existingColumns.includes('subscription_status')) {
      console.log('Adding subscription_status...');
      await pool.query(`
        ALTER TABLE hostels ADD COLUMN subscription_status VARCHAR(20) DEFAULT 'inactive'
      `);
      console.log('✅ Added subscription_status');
    }
    
    if (!existingColumns.includes('subscription_end_date')) {
      console.log('Adding subscription_end_date...');
      await pool.query(`
        ALTER TABLE hostels ADD COLUMN subscription_end_date TIMESTAMP NULL
      `);
      console.log('✅ Added subscription_end_date');
    }
    
    if (!existingColumns.includes('created_at')) {
      console.log('Adding created_at...');
      await pool.query(`
        ALTER TABLE hostels ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `);
      console.log('✅ Added created_at');
    }
    
    if (!existingColumns.includes('updated_at')) {
      console.log('Adding updated_at...');
      await pool.query(`
        ALTER TABLE hostels ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `);
      console.log('✅ Added updated_at');
    }
    
    // Update all existing hostels to approved status since they already exist
    console.log('Updating existing hostels to approved status...');
    await pool.query(`
      UPDATE hostels SET approval_status = 'approved' WHERE approval_status = 'pending'
    `);
    console.log('✅ Updated existing hostels');
    
    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
