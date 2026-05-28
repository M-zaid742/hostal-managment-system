import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { query } from "../db.js";

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET || "dev_secret";
const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
const googleClient = googleClientId ? new OAuth2Client(googleClientId) : null;

function createToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    jwtSecret,
    { expiresIn: "7d" }
  );
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await query("SELECT id FROM users WHERE email = $1", [email]);

    if (existing.length) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id",
      [name, email, passwordHash, role === "owner" ? "owner" : "user"]
    );

    const user = { id: result[0].id, name, email, role: role === "owner" ? "owner" : "user" };
    const token = createToken(user);

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", details: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const users = await query("SELECT id, name, email, password_hash, role FROM users WHERE email = $1", [email]);

    if (!users.length) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];
    const matches = await bcrypt.compare(password, user.password_hash);

    if (!matches) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken(user);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: "Login failed", details: error.message });
  }
});

router.post("/google", async (req, res) => {
  try {
    if (!googleClient) {
      return res.status(400).json({ message: "Google login not configured" });
    }

    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Missing Google credential" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: googleClientId
    });

    const payload = ticket.getPayload();
    const email = payload?.email;
    const name = payload?.name || "Google User";

    if (!email) {
      return res.status(400).json({ message: "Invalid Google token" });
    }

    const existing = await query("SELECT id, name, email, role FROM users WHERE email = $1", [email]);
    let user;

    if (existing.length) {
      user = existing[0];
    } else {
      const result = await query(
        "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'user') RETURNING id",
        [name, email, "google"]
      );
      user = { id: result[0].id, name, email, role: "user" };
    }

    const token = createToken(user);
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Google login failed", details: error.message });
  }
});

export default router;
