#!/usr/bin/env node

import pg from "pg";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  const client = new Client({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "zaid1972",
    database: process.env.DB_NAME || "hostel_management",
    port: Number(process.env.DB_PORT || 5432)
  });

  try {
    await client.connect();
    console.log("✅ Connected to database");

    // Read and execute the migration file
    const migrationPath = path.join(__dirname, "migrations", "002_setup_admin.sql");
    const sql = await readFile(migrationPath, "utf-8");
    
    // Split by semicolon and execute each statement
    const statements = sql.split(";").filter(s => s.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`\n📝 Executing: ${statement.substring(0, 60)}...`);
        await client.query(statement);
      }
    }

    console.log("\n✅ Admin setup completed successfully!");
    console.log("\n📝 Admin Credentials:");
    console.log("   Email: admin");
    console.log("   Password: zaid1234");
    console.log("   Role: admin");
    console.log("\n🔗 Access dashboard at: http://localhost:5173/admin/dashboard");

  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
