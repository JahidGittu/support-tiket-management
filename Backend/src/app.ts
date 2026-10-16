import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import ticketRoutes from "./routes/ticketRoutes";
import aiRoutes from "./routes/aiRoutes";
import queueRoutes from "./routes/queueRoutes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    name: "ResolveDesk AI - Ticket Management API",
    status: "active",
    health: "/api/v1/health",
  });
});

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "ResolveDesk AI Backend",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tickets", ticketRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/queue", queueRoutes);

app.use(errorHandler);

export default app;
