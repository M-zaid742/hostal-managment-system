import bcrypt from 'bcryptjs';
import pg from 'pg';

const { Pool } = pg;

async function updateAdmin() {
  const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'zaid1972',
    database: 'hostel_management',
    port: 5432
  });

  try {
    const hash = await bcrypt.hash('zaid1234', 10);
    const result = await pool.query(
      'UPDATE users SET email = $1, password_hash = $2 WHERE role = $3',
      ['admin7173@gmail.com', hash, 'admin']
    );
    console.log('✅ Admin credentials updated successfully');
    console.log('Email: admin7173@gmail.com');
    console.log('Password: zaid1234');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

updateAdmin();
