import express from "express";
import { query } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/me", requireAuth, requireRole("owner"), async (req, res) => {
  try {
    const rows = await query(
      `SELECT id, plan_id AS planId, status, payment_method AS paymentMethod,
              transaction_ref AS transactionRef, started_at AS startedAt, expires_at AS expiresAt
       FROM owner_subscriptions
       WHERE user_id = $1
       ORDER BY id DESC
       LIMIT 1`,
      [req.user.id]
    );

    if (!rows.length) {
      return res.json({ hasActive: false, subscription: null });
    }

    const subscription = rows[0];
    const hasActive = subscription.status === "active" && (!subscription.expiresAt || new Date(subscription.expiresAt) > new Date());

    return res.json({ hasActive, subscription });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load subscription", details: error.message });
  }
});

router.post("/activate/:id", requireAuth, requireRole("owner"), async (req, res) => {
  try {
    const subscriptionId = Number(req.params.id);

    if (Number.isNaN(subscriptionId)) {
      return res.status(400).json({ message: "Invalid subscription id" });
    }

    await query(
      "UPDATE owner_subscriptions SET status = 'active', expires_at = NOW() + INTERVAL '30 days' WHERE id = $1 AND user_id = $2",
      [subscriptionId, req.user.id]
    );

    return res.json({ message: "Subscription activated for 30 days." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to activate subscription", details: error.message });
  }
});

export default router;
