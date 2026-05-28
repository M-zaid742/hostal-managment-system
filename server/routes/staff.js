import express from "express";
import { query } from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const staff = await query(
      "SELECT name, role, shift FROM staff ORDER BY name"
    );
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: "Failed to load staff", details: error.message });
  }
});

export default router;
