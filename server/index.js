import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initializeDatabase, pingDatabase } from "./db.js";
import dashboardRouter from "./routes/dashboard.js";
import roomsRouter from "./routes/rooms.js";
import bookingsRouter from "./routes/bookings.js";
import paymentsRouter from "./routes/payments.js";
import staffRouter from "./routes/staff.js";
import maintenanceRouter from "./routes/maintenance.js";
import hostelsRouter from "./routes/hostels.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import subscriptionsRouter from "./routes/subscriptions.js";
import adminRouter from "./routes/admin.js";
import messagesRouter from "./routes/messages.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5000);

app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : "*"
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hostel Management API is running. Try /api/health");
});

app.get("/api/health", async (req, res) => {
  try {
    await pingDatabase();
    res.json({ status: "ok" });
  } catch (error) {
    res.status(500).json({ status: "error", details: error.message });
  }
});

app.use("/api/dashboard", dashboardRouter);
app.use("/api/rooms", roomsRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/staff", staffRouter);
app.use("/api/maintenance", maintenanceRouter);
app.use("/api/hostels", hostelsRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/subscriptions", subscriptionsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/messages", messagesRouter);

try {
  await initializeDatabase();

  app.listen(port, () => {
    console.log(`API server listening on http://localhost:${port}`);
  });
} catch (error) {
  console.error("Failed to initialize database:", error);
  process.exit(1);
}
