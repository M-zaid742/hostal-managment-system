#!/usr/bin/env node

import pg from "pg";

const { Client } = pg;

async function addHostels() {
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

    const hostels = [
      {
        name: "Mountain View Hostel",
        city: "Gilgit",
        area: "Downtown",
        address: "123 Mountain Road",
        phone: "+923454567890",
        email: "info@mountainview.pk",
        lat: 35.9281,
        lng: 74.3055,
        gender: "Co-ed",
        description: "Beautiful mountain views with comfortable rooms and friendly staff."
      },
      {
        name: "Coastal Waves Hostel",
        city: "Karachi",
        area: "Clifton",
        address: "456 Beach Street",
        phone: "+923334567890",
        email: "info@coastalwaves.pk",
        lat: 24.7711,
        lng: 66.9976,
        gender: "Girls",
        description: "Beachfront hostel with stunning sea views and water sports activities."
      },
      {
        name: "Heritage Valley Hostel",
        city: "Peshawar",
        area: "Old City",
        address: "789 Heritage Lane",
        phone: "+923214567890",
        email: "info@heritagevalley.pk",
        lat: 34.0151,
        lng: 71.5249,
        gender: "Boys",
        description: "Traditional hostel in historic area with cultural experiences."
      },
      {
        name: "Urban Escape Hostel",
        city: "Multan",
        area: "City Center",
        address: "321 Urban Plaza",
        phone: "+923454123890",
        email: "info@urbanescape.pk",
        lat: 30.1575,
        lng: 71.4247,
        gender: "Co-ed",
        description: "Modern hostel in city center with excellent amenities."
      },
      {
        name: "Garden Paradise Hostel",
        city: "Lahore",
        area: "Garden Town",
        address: "654 Garden Avenue",
        phone: "+923454987890",
        email: "info@gardenparadise.pk",
        lat: 31.5497,
        lng: 74.3436,
        gender: "Girls",
        description: "Peaceful hostel surrounded by lush gardens and greenery."
      }
    ];

    console.log("📝 Adding 5 new hostels...\n");

    for (const hostel of hostels) {
      const result = await client.query(
        `INSERT INTO hostels (owner_id, name, area, city, address, lat, lng, gender, description, phone, email, approved, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true, true)
         RETURNING id, name, city`,
        [
          2, // owner_id (use existing owner)
          hostel.name,
          hostel.area,
          hostel.city,
          hostel.address,
          hostel.lat,
          hostel.lng,
          hostel.gender,
          hostel.description,
          hostel.phone,
          hostel.email
        ]
      );

      const newHostel = result.rows[0];
      console.log(`   ✅ Added: ${newHostel.name} (${newHostel.city}) - ID: ${newHostel.id}`);
    }

    console.log("\n✨ All 5 hostels added successfully!");

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await client.end();
  }
}

addHostels();
