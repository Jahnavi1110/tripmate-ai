import { Router } from "express";
import mongoose from "mongoose";
import { getRecentLogs } from "../middleware/requestLog.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "TripMate AI API",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  });
});

router.get("/logs", (req, res) => {
  res.json({ success: true, count: getRecentLogs().length, data: getRecentLogs() });
});

export default router;
