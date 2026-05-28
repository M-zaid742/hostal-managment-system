import express from "express";
import { query } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/me", requireAuth, async (req, res) => {
  try {
    const rows = await query(
      "SELECT id, name, email, role, created_at FROM users WHERE id = $1",
      [req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Failed to load profile", details: error.message });
  }
});

router.get("/favorites", requireAuth, async (req, res) => {
  try {
    const rows = await query(
      `SELECT h.id, h.name, h.area, h.city, h.address, h.gender
       FROM user_favorites f
       JOIN hostels h ON h.id = f.hostel_id
       WHERE f.user_id = $1
       ORDER BY f.created_at DESC`,
      [req.user.id]
    );

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Failed to load favorites", details: error.message });
  }
});

router.post("/favorites/:hostelId", requireAuth, async (req, res) => {
  try {
    const hostelId = Number(req.params.hostelId);

    if (Number.isNaN(hostelId)) {
      return res.status(400).json({ message: "Invalid hostel id" });
    }

    await query(
      "INSERT INTO user_favorites (user_id, hostel_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [req.user.id, hostelId]
    );

    return res.json({ message: "Hostel saved to favorites" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to save favorite", details: error.message });
  }
});

router.delete("/favorites/:hostelId", requireAuth, async (req, res) => {
  try {
    const hostelId = Number(req.params.hostelId);

    if (Number.isNaN(hostelId)) {
      return res.status(400).json({ message: "Invalid hostel id" });
    }

    await query(
      "DELETE FROM user_favorites WHERE user_id = $1 AND hostel_id = $2",
      [req.user.id, hostelId]
    );

    return res.json({ message: "Hostel removed from favorites" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to remove favorite", details: error.message });
  }
});

export default router;
