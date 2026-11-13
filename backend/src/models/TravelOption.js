import mongoose from "mongoose";

const travelOptionSchema = new mongoose.Schema({
  kind: { type: String, enum: ["train", "flight"], required: true, index: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
  from: { type: String, required: true, index: true },
  to: { type: String, required: true, index: true },
  departure: { type: String, required: true },
  arrival: { type: String, required: true },
  duration: { type: String, required: true },
  date: { type: String, required: true, index: true },
  price: { type: Number, required: true, min: 0 },
  seatsAvailable: { type: Number, required: true, min: 0 },
  classOrCabin: { type: String, required: true },
  isMock: { type: Boolean, default: true }
}, { timestamps: true });

travelOptionSchema.index({ kind: 1, from: 1, to: 1, date: 1 });
export default mongoose.model("TravelOption", travelOptionSchema);
