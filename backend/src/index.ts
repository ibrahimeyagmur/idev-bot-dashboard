import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "croxydb";

import authRoutes from "./routes/auth";
import commandsRoutes from "./routes/commands";
import premiumRoutes from "./routes/premium";
import guildsRoutes from "./routes/guilds";
import dashboardRoutes from "./routes/dashboard";
import botRoutes from "./routes/bot";
import guildSettingsRoutes from "./routes/guildSettings";
import { seedData } from "./seed";
import { startBot } from "./bot/client";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

seedData();

startBot();

app.use("/auth", authRoutes);
app.use("/api/commands", commandsRoutes);
app.use("/api/premium", premiumRoutes);
app.use("/api/guilds", guildsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/bot", botRoutes);
app.use("/api/server", guildSettingsRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

declare module "express-session" {
  interface SessionData {
    userId?: string;
    accessToken?: string;
  }
}

export default app;
