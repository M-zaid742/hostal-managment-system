import bcrypt from 'bcryptjs';
import pg from 'pg';

const pool = new pg.Pool({
  user: 'postgres',
  password: 'zaid1972',
  host: 'localhost',
  database: 'hostel_management'
});

async function setupAdmin() {
  try {
    const password = 'zaid1234';
    const hash = await bcrypt.hash(password, 10);
    
    // Update existing admin or create new one
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role) 
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE SET password_hash = $3, role = $4
       RETURNING id, email, role`,
      ['Admin User', 'admin7173@gmail.com', hash, 'admin']
    );
    
    console.log('✅ Admin user setup:');
    console.log('  Email:', result.rows[0].email);
    console.log('  Role:', result.rows[0].role);
    console.log('  Password: zaid1234');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await pool.end();
  }
}

setupAdmin();
