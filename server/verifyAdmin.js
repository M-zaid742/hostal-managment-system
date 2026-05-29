import pg from 'pg';
import bcrypt from 'bcryptjs';

const pool = new pg.Pool({
  user: 'postgres',
  password: 'zaid1972',
  host: 'localhost',
  database: 'hostel_management'
});

const checkAdmin = async () => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', ['admin7173@gmail.com']);
    
    if (result.rows.length === 0) {
      console.log('No admin user found. Creating one...');
      // Create the admin user
      const hash = '$2a$10$oojZUBoIuRNWgf.AR1rr8uBprGA/qyCIwmtC4I5xKZj5WB6C0meb.';
      const createResult = await pool.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *',
        ['Admin User', 'admin7173@gmail.com', hash, 'admin']
      );
      console.log('✅ Admin created:', JSON.stringify(createResult.rows[0], null, 2));
    } else {
      const user = result.rows[0];
      console.log('✅ Admin exists:', JSON.stringify(user, null, 2));
      
      // Test password
      const passwordMatches = await bcrypt.compare('zaid1234', user.password_hash);
      console.log('Password matches zaid1234:', passwordMatches);
    }
  } catch (err) {
    console.log('❌ Error:', err.message);
  } finally {
    pool.end();
  }
};

checkAdmin();
