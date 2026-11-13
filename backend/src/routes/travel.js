import { Router } from "express";
import TravelOption from "../models/TravelOption.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

function validateSearch(req, res, next) {
  const { from, to, date } = req.query;
  if (!from || !to || !date) {
    return res.status(400).json({ success: false, message: "Please provide from, to and date (YYYY-MM-DD)." });
  }
  if (String(from).trim().toLowerCase() === String(to).trim().toLowerCase()) {
    return res.status(400).json({ success: false, message: "Origin and destination must be different." });
  }
  next();
}

function makeSearch(kind) {
  return asyncHandler(async (req, res) => {
    const { from, to, date } = req.query;
    const options = await TravelOption.find({
      kind,
      from: new RegExp(`^${escapeRegex(String(from).trim())}$`, "i"),
      to: new RegExp(`^${escapeRegex(String(to).trim())}$`, "i"),
      date: String(date).trim(),
      seatsAvailable: { $gt: 0 }
    }).sort({ price: 1 }).lean();

    res.json({
      success: true,
      source: "MOCK_INVENTORY",
      count: options.length,
      data: options
    });
  });
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

router.get("/trains", validateSearch, makeSearch("train"));
router.get("/flights", validateSearch, makeSearch("flight"));

export default router;
