import pg from 'pg';
import bcrypt from 'bcryptjs';

const pool = new pg.Pool({
  user: 'postgres',
  password: 'zaid1972',
  host: 'localhost',
  database: 'hostel_management'
});

async function checkAdmin() {
  try {
    // Get all users
    const users = await pool.query('SELECT id, name, email, role FROM users');
    console.log('All users:', users.rows);
    
    // Get admin
    const admins = await pool.query('SELECT * FROM users WHERE role = $1', ['admin']);
    console.log('\nAdmin users:', admins.rows);
    
    if (admins.rows.length > 0) {
      const admin = admins.rows[0];
      const testPassword = 'zaid1234';
      const matches = await bcrypt.compare(testPassword, admin.password_hash);
      console.log('\nPassword test:', testPassword, '-> matches:', matches);
    }
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

checkAdmin();
