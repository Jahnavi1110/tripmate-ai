import mongoose from "mongoose";

const passengerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 1, max: 120 }
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  bookingRef: { type: String, required: true, unique: true, index: true },
  travelOption: { type: mongoose.Schema.Types.ObjectId, ref: "TravelOption", required: true },
  kind: { type: String, enum: ["train", "flight"], required: true },
  passenger: { type: passengerSchema, required: true },
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  phone: { type: String, trim: true },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ["MOCK_PAID", "NOT_CHARGED"], default: "MOCK_PAID" },
  status: { type: String, enum: ["CONFIRMED", "CANCELLED"], default: "CONFIRMED" },
  isMockInventory: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
