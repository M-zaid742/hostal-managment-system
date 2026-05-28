#!/usr/bin/env node

import pg from "pg";

const { Client } = pg;

async function checkAdmin() {
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

    // Check all admin users
    const result = await client.query("SELECT id, name, email, role FROM users WHERE role = 'admin'");
    
    console.log("📋 Admin users in database:");
    if (result.rows.length === 0) {
      console.log("   No admin users found!");
    } else {
      result.rows.forEach(user => {
        console.log(`   - ID: ${user.id}, Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
      });
    }

    // Check specific email
    console.log("\n🔍 Checking for admin7173@gmail.com:");
    const check = await client.query("SELECT id, name, email, role FROM users WHERE email = $1", ["admin7173@gmail.com"]);
    if (check.rows.length > 0) {
      console.log("   ✅ Found!");
      console.log(`   Email: ${check.rows[0].email}`);
    } else {
      console.log("   ❌ Not found!");
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await client.end();
  }
}

checkAdmin();
