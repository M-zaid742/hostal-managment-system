import express from "express";
import { query } from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const totals = await query(
      "SELECT COALESCE(SUM(beds), 0) AS totalBeds, COALESCE(SUM(occupied), 0) AS occupiedBeds FROM rooms"
    );
    const pendingCheckins = await query(
      "SELECT COUNT(*) AS pending FROM bookings WHERE status = 'Pending'"
    );
    const occupancyTrend = await query(
      "SELECT month_label AS month, rate FROM occupancy_trend ORDER BY sort_order"
    );
    const roomsStatus = await query(
      "SELECT label, value FROM room_status_overview ORDER BY id"
    );
    const recentBookings = await query(
      "SELECT guest_name AS name, room_number AS room, (check_out - check_in) AS nights, status FROM bookings ORDER BY created_at DESC LIMIT 3"
    );
    const paymentsDue = await query(
      "SELECT guest_name AS name, amount, to_char(due_date, 'Mon DD') AS due FROM payments WHERE status IN ('Due', 'Overdue') ORDER BY due_date ASC LIMIT 2"
    );
    const staffOnDuty = await query(
      "SELECT role AS name, name AS person, shift FROM staff WHERE on_duty = true ORDER BY role"
    );

    const totalBeds = totals[0]?.totalBeds || 0;
    const occupiedBeds = totals[0]?.occupiedBeds || 0;
    const vacantBeds = Math.max(totalBeds - occupiedBeds, 0);
    const pending = pendingCheckins[0]?.pending || 0;

    res.json({
      kpis: [
        { label: "Total Beds", value: String(totalBeds) },
        { label: "Occupied", value: String(occupiedBeds) },
        { label: "Vacant", value: String(vacantBeds) },
        { label: "Pending Check-ins", value: String(pending) }
      ],
      occupancyTrend,
      roomsStatus,
      recentBookings,
      paymentsDue,
      staffOnDuty
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load dashboard", details: error.message });
  }
});

export default router;
