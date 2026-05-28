import express from "express";
import { query } from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const tickets = await query(
      "SELECT issue, room_number AS room, status FROM maintenance_tickets ORDER BY created_at DESC"
    );
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Failed to load maintenance tickets", details: error.message });
  }
});

export default router;
