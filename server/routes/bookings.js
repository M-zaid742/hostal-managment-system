import express from "express";
import { query } from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const bookings = await query(
      "SELECT guest_name AS guest, room_number AS room, to_char(check_in, 'Mon DD') AS checkIn, to_char(check_out, 'Mon DD') AS checkOut, status FROM bookings ORDER BY check_in DESC"
    );
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to load bookings", details: error.message });
  }
});

export default router;
