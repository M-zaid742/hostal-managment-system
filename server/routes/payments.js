import express from "express";
import jwt from "jsonwebtoken";
import { query } from "../db.js";

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET || "dev_secret";

router.get("/", async (req, res) => {
  try {
    const payments = await query(
      "SELECT guest_name AS guest, invoice, amount, status FROM payments ORDER BY due_date DESC"
    );
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Failed to load payments", details: error.message });
  }
});

router.post("/owner-subscription", async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, jwtSecret);
    const { planId, paymentMethod, transactionRef } = req.body;

    if (!planId || !paymentMethod) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    await query(
      "INSERT INTO owner_subscriptions (user_id, plan_id, status, payment_method, transaction_ref) VALUES ($1, $2, $3, $4, $5)",
      [decoded.id, planId, "pending", paymentMethod, transactionRef || null]
    );

    res.json({ message: "Subscription submitted. Our team will verify it soon." });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit subscription", details: error.message });
  }
});

export default router;
