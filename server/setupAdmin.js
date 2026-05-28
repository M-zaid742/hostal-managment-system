import bcryptjs from "bcryptjs";
import { query } from "./db.js";

async function setupAdmin() {
  try {
    const password = "123";
    const saltRounds = 10;
    
    // Hash the password
    const passwordHash = await bcryptjs.hash(password, saltRounds);
    console.log(`Hashed password for "123": ${passwordHash}`);
    
    // Check if admin already exists
    const existing = await query(
      `SELECT id FROM users WHERE email = $1`,
      ["admin@localhost"]
    );
    
    if (existing.rows.length > 0) {
      // Update existing admin
      await query(
        `UPDATE users SET password_hash = $1, role = $2 WHERE email = $3`,
        [passwordHash, "admin", "admin@localhost"]
      );
      console.log("✅ Admin user updated successfully!");
    } else {
      // Insert new admin
      await query(
        `INSERT INTO users (full_name, email, password_hash, role) 
         VALUES ($1, $2, $3, $4)`,
        ["Admin User", "admin@localhost", passwordHash, "admin"]
      );
      console.log("✅ Admin user created successfully!");
    }
    
    console.log("\n📝 Admin Credentials:");
    console.log("   Email: admin@localhost");
    console.log("   Password: 123");
    console.log("   Role: admin");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

setupAdmin();
