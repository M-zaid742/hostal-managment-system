#!/usr/bin/env node

import pg from "pg";
import bcrypt from "bcryptjs";

const { Client } = pg;

async function createAdmin() {
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

    // Generate hash for zaid1234
    const password = "zaid1234";
    const hash = await bcrypt.hash(password, 10);
    
    console.log("🔐 Generating bcrypt hash...");
    console.log(`   Password: ${password}`);
    console.log(`   Hash: ${hash}\n`);

    // Delete old admin users
    console.log("🗑️  Cleaning old admin users...");
    await client.query("DELETE FROM users WHERE email IN ($1, $2, $3)", 
      ["admin@stayscout.pk", "admin", "admin@localhost"]
    );
    
    // Insert new admin user
    console.log("📝 Creating new admin user...");
    const result = await client.query(
      "INSERT INTO users (name, email, password_hash, role, created_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING id, name, email, role",
      ["Admin User", "admin7173@gmail.com", hash, "admin"]
    );

    console.log("✅ Admin user created!\n");
    
    const admin = result.rows[0];
    console.log("📋 Admin Details:");
    console.log(`   ID: ${admin.id}`);
    console.log(`   Name: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    
    console.log("\n🔐 Login Credentials:");
    console.log(`   Email: admin7173@gmail.com`);
    console.log(`   Password: zaid1234`);
    
    console.log("\n✨ Ready to login!");

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await client.end();
  }
}

createAdmin();
