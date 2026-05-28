import express from "express";
import { query } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth);

// Send a message
router.post("/", async (req, res) => {
  try {
    const { receiver_id, hostel_id, message_text } = req.body;
    const sender_id = req.user.id;

    if (!receiver_id || !message_text) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await query(
      `INSERT INTO messages (sender_id, receiver_id, hostel_id, message_text)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [sender_id, receiver_id, hostel_id || null, message_text]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get conversation between two users
router.get("/conversation/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const currentUserId = req.user.id;

    const result = await query(
      `SELECT * FROM messages 
      WHERE (sender_id = $1 AND receiver_id = $2) 
        OR (sender_id = $2 AND receiver_id = $1)
      ORDER BY created_at DESC
      LIMIT 50`,
      [currentUserId, userId]
    );

    res.json(result.rows.reverse());
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all conversations for current user
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT DISTINCT ON (CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END)
        CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END as other_user_id,
        u.full_name,
        m.message_text as last_message,
        m.created_at as last_message_time,
        COUNT(CASE WHEN receiver_id = $1 AND is_read = false THEN 1 END) as unread_count
      FROM messages m
      JOIN users u ON (
        CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END = u.id
      )
      WHERE sender_id = $1 OR receiver_id = $1
      GROUP BY other_user_id, u.full_name, m.message_text, m.created_at
      ORDER BY other_user_id, m.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: error.message });
  }
});

// Mark message as read
router.put("/:messageId/read", async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const result = await query(
      `UPDATE messages 
      SET is_read = true, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND receiver_id = $2
      RETURNING *`,
      [messageId, userId]
    );

    res.json(result.rows[0] || { message: "Message not found or not yours" });
  } catch (error) {
    console.error("Error marking message as read:", error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a message
router.delete("/:messageId", async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const result = await query(
      `DELETE FROM messages 
      WHERE id = $1 AND (sender_id = $2 OR receiver_id = $2)
      RETURNING id`,
      [messageId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get messages for a specific hostel
router.get("/hostel/:hostelId", async (req, res) => {
  try {
    const { hostelId } = req.params;
    const userId = req.user.id;

    const result = await query(
      `SELECT m.*, 
        u_sender.full_name as sender_name,
        u_receiver.full_name as receiver_name
      FROM messages m
      JOIN users u_sender ON m.sender_id = u_sender.id
      JOIN users u_receiver ON m.receiver_id = u_receiver.id
      WHERE m.hostel_id = $1 AND (m.sender_id = $2 OR m.receiver_id = $2)
      ORDER BY m.created_at DESC
      LIMIT 100`,
      [hostelId, userId]
    );

    res.json(result.rows.reverse());
  } catch (error) {
    console.error("Error fetching hostel messages:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
