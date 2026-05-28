import express from "express";
import { query } from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const rooms = await query(
      "SELECT number, type, beds, occupied, status FROM rooms ORDER BY number"
    );
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Failed to load rooms", details: error.message });
  }
});

export default router;
