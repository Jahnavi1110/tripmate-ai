import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import { requestLogger } from "./middleware/requestLog.js";
import { notFound, errorHandler } from "./middleware/errors.js";
import travelRoutes from "./routes/travel.js";
import bookingRoutes from "./routes/bookings.js";
import systemRoutes from "./routes/system.js";

const app = express();
const PORT = Number(process.env.PORT || 5000);
const allowedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(helmet());
app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: "100kb" }));
app.use(morgan("dev"));
app.use(requestLogger);
app.use("/api", rateLimit({ windowMs: 60 * 1000, limit: 120, standardHeaders: "draft-7", legacyHeaders: false }));

app.use("/api", systemRoutes);
app.use("/api", travelRoutes);
app.use("/api/bookings", bookingRoutes);
app.use(notFound);
app.use(errorHandler);

connectDB()
  .then(() => app.listen(PORT, () => console.log(`TripMate API running at http://localhost:${PORT}`)))
  .catch((error) => {
    console.error("Failed to start API:", error.message);
    process.exit(1);
  });
