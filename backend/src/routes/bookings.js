import { Router } from "express";
import { nanoid } from "nanoid";
import Booking from "../models/Booking.js";
import TravelOption from "../models/TravelOption.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/", asyncHandler(async (req, res) => {
  const { optionId, passenger, email, phone } = req.body || {};
  if (!optionId || !passenger?.name || !Number.isInteger(Number(passenger?.age)) || !email) {
    return res.status(400).json({ success: false, message: "optionId, passenger name, valid passenger age and email are required." });
  }
  const normalizedEmail = String(email).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return res.status(400).json({ success: false, message: "Please provide a valid email address." });
  }
  const option = await TravelOption.findById(optionId);
  if (!option) return res.status(404).json({ success: false, message: "Travel option not found." });
  if (option.seatsAvailable < 1) return res.status(409).json({ success: false, message: "No seats are currently available." });

  option.seatsAvailable -= 1;
  await option.save();

  try {
    const booking = await Booking.create({
      bookingRef: `TM-${nanoid(8).toUpperCase()}`,
      travelOption: option._id,
      kind: option.kind,
      passenger: { name: String(passenger.name).trim(), age: Number(passenger.age) },
      email: normalizedEmail,
      phone: phone ? String(phone).trim() : "",
      totalAmount: option.price,
      paymentStatus: "MOCK_PAID",
      status: "CONFIRMED",
      isMockInventory: true
    });
    const populated = await booking.populate("travelOption");
    res.status(201).json({
      success: true,
      message: "Demo booking confirmed. No real ticket or payment was processed.",
      data: populated
    });
  } catch (error) {
    option.seatsAvailable += 1;
    await option.save();
    throw error;
  }
}));

router.get("/", asyncHandler(async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ success: false, message: "Provide an email query parameter." });
  const bookings = await Booking.find({ email: String(email).trim().toLowerCase() })
    .populate("travelOption").sort({ createdAt: -1 }).lean();
  res.json({ success: true, count: bookings.length, data: bookings });
}));

router.get("/:bookingRef", asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ bookingRef: req.params.bookingRef.toUpperCase() })
    .populate("travelOption");
  if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });
  res.json({ success: true, data: booking });
}));

router.patch("/:bookingRef/cancel", asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ bookingRef: req.params.bookingRef.toUpperCase() });
  if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });
  if (booking.status === "CANCELLED") {
    return res.status(409).json({ success: false, message: "This booking is already cancelled." });
  }
  booking.status = "CANCELLED";
  booking.paymentStatus = "NOT_CHARGED";
  await booking.save();
  await TravelOption.findByIdAndUpdate(booking.travelOption, { $inc: { seatsAvailable: 1 } });
  await booking.populate("travelOption");
  res.json({
    success: true,
    message: "Demo booking cancelled. No real refund was needed because no real payment was taken.",
    data: booking
  });
}));

export default router;
