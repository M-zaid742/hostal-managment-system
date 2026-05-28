#!/usr/bin/env node

import bcrypt from "bcryptjs";

const password = "zaid1234";
const hash = "$2a$10$eImiTXuWVxfaHNAVIqlFe.nJF7QJYq1NV8wXNXGKqZRm7A.uy9z0S";

async function verify() {
  try {
    console.log("🔐 Testing password hash verification\n");
    console.log(`Password: ${password}`);
    console.log(`Hash: ${hash}\n`);
    
    const matches = await bcrypt.compare(password, hash);
    
    if (matches) {
      console.log("✅ Password matches! Hash is correct.");
    } else {
      console.log("❌ Password does NOT match! Hash is wrong.");
      
      // Generate a new hash
      console.log("\n🔄 Generating new hash for 'zaid1234'...");
      const newHash = await bcrypt.hash(password, 10);
      console.log(`New hash: ${newHash}`);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

verify();
