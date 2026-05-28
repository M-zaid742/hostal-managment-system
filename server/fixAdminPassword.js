#!/usr/bin/env node

import pg from "pg";

const { Client } = pg;

async function fixAdmin() {
  const client = new Client({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "zaid1972",
    database: process.env.DB_NAME || "hostel_management",
    port: Number(process.env.DB_PORT || 5432)
  });

  try {
    await client.connect();
    console.log("✅ Connected to database\n");

    // Update admin user with correct hash
    const correctHash = "$2a$10$wFlbMTcutYk0RkcmC4MW9uFd/66KM6CdVg756aB0o/XeDVZ0SAoqS";
    
    console.log("🔄 Updating admin password hash...");
    await client.query(
      "UPDATE users SET password_hash = $1 WHERE email = $2",
      [correctHash, "admin7173@gmail.com"]
    );
    
    console.log("✅ Admin password updated!\n");
    
    console.log("📋 Verifying admin user:");
    const result = await client.query(
      "SELECT id, name, email, role FROM users WHERE email = $1",
      ["admin7173@gmail.com"]
    );
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      console.log(`   ✅ Email: ${user.email}`);
      console.log(`   ✅ Name: ${user.name}`);
      console.log(`   ✅ Role: ${user.role}`);
      console.log("\n🔐 Admin Credentials:");
      console.log("   Email: admin7173@gmail.com");
      console.log("   Password: zaid1234");
      console.log("\n✨ Ready to login!");
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await client.end();
  }
}

fixAdmin();
