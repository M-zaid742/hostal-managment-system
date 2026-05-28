#!/usr/bin/env node

import pg from "pg";
import bcrypt from "bcryptjs";

const { Client } = pg;

async function debugLogin() {
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

    // Get the current hash from database
    const result = await client.query(
      "SELECT id, name, email, password_hash, role FROM users WHERE email = $1",
      ["admin7173@gmail.com"]
    );
    
    if (result.rows.length === 0) {
      console.log("❌ Admin user not found!");
      return;
    }

    const user = result.rows[0];
    const testPassword = "zaid1234";
    
    console.log("📋 Current Admin User:");
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Hash: ${user.password_hash}\n`);

    // Test password match
    console.log("🔐 Testing password...");
    const matches = await bcrypt.compare(testPassword, user.password_hash);
    
    if (matches) {
      console.log(`✅ Password "zaid1234" is CORRECT!`);
    } else {
      console.log(`❌ Password "zaid1234" is WRONG!`);
      console.log("\n🔄 Generating new hash for 'zaid1234'...");
      const newHash = await bcrypt.hash(testPassword, 10);
      console.log(`New hash: ${newHash}`);
      
      console.log("\n📝 Updating database with new hash...");
      await client.query(
        "UPDATE users SET password_hash = $1 WHERE email = $2",
        [newHash, "admin7173@gmail.com"]
      );
      console.log("✅ Database updated!");
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await client.end();
  }
}

debugLogin();
