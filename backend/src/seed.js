import "dotenv/config";
import { connectDB } from "./config/db.js";
import mongoose from "mongoose";
import TravelOption from "./models/TravelOption.js";

const date = new Date();
date.setDate(date.getDate() + 1);
const travelDate = date.toISOString().slice(0, 10);

const rows = [
  { kind: "train", code: "12627", name: "Karnataka Express", from: "Bengaluru", to: "Delhi", departure: "19:20", arrival: "10:30", duration: "39h 10m", price: 1450, seatsAvailable: 24, classOrCabin: "Sleeper" },
  { kind: "train", code: "12028", name: "Shatabdi Express", from: "Bengaluru", to: "Chennai", departure: "06:00", arrival: "11:00", duration: "5h 00m", price: 980, seatsAvailable: 18, classOrCabin: "Chair Car" },
  { kind: "train", code: "16526", name: "Kanyakumari Express", from: "Bengaluru", to: "Chennai", departure: "20:10", arrival: "04:55", duration: "8h 45m", price: 720, seatsAvailable: 12, classOrCabin: "Sleeper" },
  { kind: "train", code: "22692", name: "Rajdhani Express", from: "Delhi", to: "Bengaluru", departure: "20:45", arrival: "05:20", duration: "32h 35m", price: 2100, seatsAvailable: 9, classOrCabin: "3A" },
  { kind: "flight", code: "TM101", name: "TripAir", from: "Bengaluru", to: "Mumbai", departure: "08:15", arrival: "10:05", duration: "1h 50m", price: 4899, seatsAvailable: 16, classOrCabin: "Economy" },
  { kind: "flight", code: "TM202", name: "SkyWays", from: "Bengaluru", to: "Delhi", departure: "13:40", arrival: "16:25", duration: "2h 45m", price: 6299, seatsAvailable: 11, classOrCabin: "Economy" },
  { kind: "flight", code: "TM303", name: "CloudJet", from: "Mumbai", to: "Delhi", departure: "17:10", arrival: "19:20", duration: "2h 10m", price: 5599, seatsAvailable: 20, classOrCabin: "Economy" },
  { kind: "flight", code: "TM404", name: "TripAir", from: "Delhi", to: "Bengaluru", departure: "09:30", arrival: "12:15", duration: "2h 45m", price: 6799, seatsAvailable: 14, classOrCabin: "Economy" }
].map((item) => ({ ...item, date: travelDate, isMock: true }));

try {
  await connectDB();
  await TravelOption.deleteMany({});
  await TravelOption.insertMany(rows);
  console.log(`Seeded ${rows.length} mock travel options for ${travelDate}.`);
} catch (error) {
  console.error("Seed failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
