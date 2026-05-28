import express from "express";
import { query } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Middleware: Require admin role
router.use(requireAuth);
router.use(requireRole("admin"));

// Get all pending hostels
router.get("/hostels/pending", async (req, res) => {
  try {
    const result = await query(
      `SELECT 
        h.id, h.name, h.city, h.area, h.address, h.phone, h.email, 
        h.gender, h.approval_status, h.created_at,
        u.name as ownerName
      FROM hostels h
      LEFT JOIN users u ON h.owner_id = u.id
      WHERE h.approval_status = $1
      ORDER BY h.created_at DESC`,
      ["pending"]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching pending hostels:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all approved hostels
router.get("/hostels/approved", async (req, res) => {
  try {
    const result = await query(
      `SELECT 
        h.id, h.name, h.city, h.area, h.address, h.phone, h.email, 
        h.gender, h.approval_status, h.subscription_status, h.subscription_end_date,
        u.name as ownerName
      FROM hostels h
      LEFT JOIN users u ON h.owner_id = u.id
      WHERE h.approval_status = $1
      ORDER BY h.created_at DESC`,
      ["approved"]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching approved hostels:", error);
    res.status(500).json({ error: error.message });
  }
});

// Approve a hostel
router.put("/hostels/:hostelId/approve", async (req, res) => {
  try {
    const { hostelId } = req.params;
    
    // Update approval status and set subscription
    const result = await query(
      `UPDATE hostels 
      SET approval_status = $1, 
          subscription_status = $2,
          subscription_end_date = CURRENT_TIMESTAMP + INTERVAL '30 days',
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *`,
      ["approved", "active", hostelId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Hostel not found" });
    }
    
    res.json({ 
      message: "Hostel approved successfully",
      hostel: result.rows[0]
    });
  } catch (error) {
    console.error("Error approving hostel:", error);
    res.status(500).json({ error: error.message });
  }
});

// Reject a hostel
router.put("/hostels/:hostelId/reject", async (req, res) => {
  try {
    const { hostelId } = req.params;
    
    const result = await query(
      `UPDATE hostels 
      SET approval_status = $1, 
          subscription_status = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *`,
      ["rejected", "inactive", hostelId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Hostel not found" });
    }
    
    res.json({ 
      message: "Hostel rejected successfully",
      hostel: result.rows[0]
    });
  } catch (error) {
    console.error("Error rejecting hostel:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get admin dashboard stats
router.get("/stats", async (req, res) => {
  try {
    const [pendingCount, approvedCount, totalUsers, totalBookings] = await Promise.all([
      query("SELECT COUNT(*) FROM hostels WHERE approval_status = $1", ["pending"]),
      query("SELECT COUNT(*) FROM hostels WHERE approval_status = $1", ["approved"]),
      query("SELECT COUNT(*) FROM users"),
      query("SELECT COUNT(*) FROM bookings")
    ]);
    
    res.json({
      pendingApprovals: parseInt(pendingCount.rows[0].count),
      approvedHostels: parseInt(approvedCount.rows[0].count),
      totalUsers: parseInt(totalUsers.rows[0].count),
      totalBookings: parseInt(totalBookings.rows[0].count)
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
