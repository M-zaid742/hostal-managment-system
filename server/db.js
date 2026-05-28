import pg from "pg";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const { Pool } = pg;
let pool;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.join(__dirname, "schema.sql");

function getPool() {
  if (!pool) {
    pool = new Pool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "hostel_management",
      port: Number(process.env.DB_PORT || 5432)
    });
  }

  return pool;
}

async function ensureDatabaseExists() {
  const client = new pg.Client({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    port: Number(process.env.DB_PORT || 5432)
  });

  try {
    await client.connect();
    const dbName = process.env.DB_NAME || "hostel_management";
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName]
    );

    if (result.rows.length === 0) {
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database '${dbName}' created successfully`);
    }
  } catch (error) {
    console.error("Error ensuring database exists:", error);
    throw error;
  } finally {
    await client.end();
  }
}

async function ensureSchema() {
  try {
    // Drop all foreign key constraints first
    const tables = [
      'user_favorites',
      'hostel_rules',
      'hostel_facilities',
      'hostel_images',
      'owner_subscriptions',
      'hostel_rooms',
      'hostels',
      'maintenance_tickets',
      'staff',
      'payments',
      'bookings',
      'rooms',
      'occupancy_trend',
      'room_status_overview',
      'users'
    ];

    for (const table of tables) {
      try {
        await getPool().query(`DROP TABLE IF EXISTS ${table} CASCADE`);
      } catch (e) {
        // Table doesn't exist, continue
      }
    }

    const schemaSql = await readFile(schemaPath, "utf8");
    const statements = schemaSql
      .split(/;\s*(?:\r?\n|$)/)
      .map((statement) => statement.trim())
      .filter(Boolean);

    for (const statement of statements) {
      await getPool().query(statement);
    }
    console.log("Database schema initialized successfully");
  } catch (error) {
    console.error("Error ensuring schema:", error);
    throw error;
  }
}

export async function query(sql, params = []) {
  const result = await getPool().query(sql, params);
  return result.rows;
}

export async function pingDatabase() {
  await query("SELECT 1");
}

export async function initializeDatabase() {
  try {
    await ensureDatabaseExists();
    pool = new Pool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "hostel_management",
      port: Number(process.env.DB_PORT || 5432)
    });

    await ensureSchema();
    console.log("Database initialization complete");
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
}
