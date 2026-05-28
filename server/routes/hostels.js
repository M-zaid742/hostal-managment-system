import express from "express";
import { query } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

async function ownerHasActiveSubscription(ownerId) {
  const rows = await query(
    `SELECT id
     FROM owner_subscriptions
     WHERE user_id = $1
       AND status = 'active'
       AND (expires_at IS NULL OR expires_at > NOW())
     ORDER BY id DESC
     LIMIT 1`,
    [ownerId]
  );

  return rows.length > 0;
}

router.get("/", async (req, res) => {
  try {
    const {
      gender,
      city,
      area,
      roomType,
      minRent,
      maxRent
    } = req.query;

    let paramCount = 1;
    const params = [];
    const conditions = ["h.is_active = true", "h.approved = true"];

    if (gender && gender !== "all") {
      conditions.push(`h.gender = $${paramCount++}`);
      params.push(gender);
    }

    if (city) {
      conditions.push(`h.city ILIKE $${paramCount++}`);
      params.push(`%${city}%`);
    }

    if (area) {
      conditions.push(`h.area ILIKE $${paramCount++}`);
      params.push(`%${area}%`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const hostels = await query(
      `SELECT h.id AS id,
        h.name,
        h.area,
        h.city,
        h.address,
        h.lat,
        h.lng,
        h.gender,
        MIN(r.rent) AS min_rent, 
        MAX(r.rent) AS max_rent,
        SUM(r.beds_available) AS beds_available,
        MIN(r.available_from) AS available_from,
        MAX(r.available_to) AS available_to,
        STRING_AGG(DISTINCT r.room_type, ',') AS room_types
       FROM hostels h
       LEFT JOIN hostel_rooms r ON r.hostel_id = h.id
       ${whereClause}
       GROUP BY h.id
       ORDER BY h.name`,
      params
    );

    let filtered = hostels.map((hostel) => ({
      ...hostel,
      beds_available: Number(hostel.beds_available) || 0,
      room_types: hostel.room_types ? hostel.room_types.split(",").map((type) => type.trim()) : []
    }));

    if (roomType && roomType !== "all") {
      filtered = filtered.filter((hostel) => hostel.room_types.includes(roomType));
    }

    const minRentValue = Number(minRent);
    const maxRentValue = Number(maxRent);

    if (!Number.isNaN(minRentValue) && minRentValue > 0) {
      filtered = filtered.filter((hostel) => hostel.min_rent >= minRentValue);
    }

    if (!Number.isNaN(maxRentValue) && maxRentValue > 0) {
      filtered = filtered.filter((hostel) => hostel.max_rent <= maxRentValue);
    }

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: "Failed to load hostels", details: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const hostelId = Number(req.params.id);

    const hostels = await query(
      `SELECT h.id, h.name, h.area, h.city, h.address, h.lat, h.lng, h.gender, h.description, h.phone, h.email, h.is_active
       FROM hostels h 
       WHERE h.id = $1`,
      [hostelId]
    );

    if (!hostels.length) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    const hostel = hostels[0];
    const rooms = await query(
      "SELECT id, room_type, occupants_per_room, beds_total, beds_available, available_from, available_to, rent FROM hostel_rooms WHERE hostel_id = $1 ORDER BY rent",
      [hostelId]
    );
    const images = await query(
      "SELECT id, url FROM hostel_images WHERE hostel_id = $1",
      [hostelId]
    );
    const facilities = await query(
      "SELECT id, name FROM hostel_facilities WHERE hostel_id = $1",
      [hostelId]
    );
    const rules = await query(
      "SELECT id, rule FROM hostel_rules WHERE hostel_id = $1",
      [hostelId]
    );

    const bedsAvailable = rooms.reduce((sum, room) => sum + Number(room.beds_available), 0);

    res.json({
      ...hostel,
      is_active: hostel.is_active,
      beds_available: bedsAvailable,
      rooms,
      images,
      facilities,
      rules
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load hostel", details: error.message });
  }
});

router.get("/owner/mine", requireAuth, requireRole("owner"), async (req, res) => {
  try {
    const rows = await query(
      `SELECT h.id, h.name, h.area, h.city, h.address, h.lat, h.lng, h.gender, h.description, h.phone, h.email, h.is_active
       FROM hostels h
       WHERE h.owner_id = $1
       ORDER BY h.id DESC`,
      [req.user.id]
    );

    res.json(rows.map((row) => ({ ...row, isActive: Boolean(row.is_active) })));
  } catch (error) {
    res.status(500).json({ message: "Failed to load owner hostels", details: error.message });
  }
});

router.post("/", requireAuth, requireRole("owner"), async (req, res) => {
  try {
    const activeSub = await ownerHasActiveSubscription(req.user.id);

    if (!activeSub) {
      return res.status(403).json({ message: "Active subscription required to list hostel" });
    }

    const {
      name,
      city,
      area,
      address,
      gender,
      description,
      phone,
      email,
      lat,
      lng,
      facilities = []
    } = req.body;

    if (!name || !area || !address || lat === undefined || lng === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await query(
      `INSERT INTO hostels (owner_id, name, area, city, address, lat, lng, gender, description, phone, email, approved, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true, true)
       RETURNING id`,
      [req.user.id, name, area, city, address, Number(lat), Number(lng), gender || "co-ed", description || "", phone || "", email || ""]
    );

    const hostelId = result[0].id;

    if (Array.isArray(facilities) && facilities.length) {
      for (const facilityName of facilities) {
        await query(
          "INSERT INTO hostel_facilities (hostel_id, name) VALUES ($1, $2)",
          [hostelId, facilityName]
        );
      }
    }

    res.status(201).json({ message: "Hostel created", id: hostelId });
  } catch (error) {
    res.status(500).json({ message: "Failed to create hostel", details: error.message });
  }
});

router.put("/:id", requireAuth, requireRole("owner"), async (req, res) => {
  try {
    const hostelId = Number(req.params.id);

    if (Number.isNaN(hostelId)) {
      return res.status(400).json({ message: "Invalid hostel id" });
    }

    const owned = await query(
      "SELECT id FROM hostels WHERE id = $1 AND owner_id = $2",
      [hostelId, req.user.id]
    );

    if (!owned.length) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    const {
      name,
      city,
      area,
      address,
      gender,
      description,
      phone,
      email,
      lat,
      lng,
      isActive,
      facilities
    } = req.body;

    const updates = [];
    const updateParams = [];
    let paramCount = 1;

    if (name) {
      updates.push(`name = $${paramCount++}`);
      updateParams.push(name);
    }
    if (area) {
      updates.push(`area = $${paramCount++}`);
      updateParams.push(area);
    }
    if (city) {
      updates.push(`city = $${paramCount++}`);
      updateParams.push(city);
    }
    if (address) {
      updates.push(`address = $${paramCount++}`);
      updateParams.push(address);
    }
    if (lat !== undefined) {
      updates.push(`lat = $${paramCount++}`);
      updateParams.push(Number(lat));
    }
    if (lng !== undefined) {
      updates.push(`lng = $${paramCount++}`);
      updateParams.push(Number(lng));
    }
    if (gender) {
      updates.push(`gender = $${paramCount++}`);
      updateParams.push(gender);
    }
    if (description) {
      updates.push(`description = $${paramCount++}`);
      updateParams.push(description);
    }
    if (phone) {
      updates.push(`phone = $${paramCount++}`);
      updateParams.push(phone);
    }
    if (email) {
      updates.push(`email = $${paramCount++}`);
      updateParams.push(email);
    }
    if (isActive !== undefined) {
      updates.push(`is_active = $${paramCount++}`);
      updateParams.push(Boolean(isActive));
    }

    if (updates.length) {
      updateParams.push(hostelId);
      await query(
        `UPDATE hostels SET ${updates.join(", ")} WHERE id = $${paramCount}`,
        updateParams
      );
    }

    if (Array.isArray(facilities)) {
      await query("DELETE FROM hostel_facilities WHERE hostel_id = $1", [hostelId]);
      for (const facilityName of facilities) {
        await query(
          "INSERT INTO hostel_facilities (hostel_id, name) VALUES ($1, $2)",
          [hostelId, facilityName]
        );
      }
    }

    res.json({ message: "Hostel updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update hostel", details: error.message });
  }
});

router.delete("/:id", requireAuth, requireRole("owner"), async (req, res) => {
  try {
    const hostelId = Number(req.params.id);

    if (Number.isNaN(hostelId)) {
      return res.status(400).json({ message: "Invalid hostel id" });
    }

    const owned = await query(
      "SELECT id FROM hostels WHERE id = $1 AND owner_id = $2",
      [hostelId, req.user.id]
    );

    if (!owned.length) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    await query("DELETE FROM hostels WHERE id = $1", [hostelId]);

    res.json({ message: "Hostel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete hostel", details: error.message });
  }
});

export default router;

