/**
 * @fileoverview Main application configuration and setup
 * This file sets up the Express application with middleware, routes, and configurations.
 * It includes CORS setup, Swagger documentation, and route registrations.
 */

import express from "express";
import cors from "cors";
import type { CorsOptions } from "cors";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./routes/auth.routes";
import sweetRoutes from "./routes/sweet.routes";
import dotenv from "dotenv";
import { specs } from "./config/swagger";

dotenv.config();

const app = express();

// Configure CORS
const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL || "http://localhost:5173",
      process.env.API_URL || "http://localhost:8000",
      "http://localhost:8000", // Swagger UI
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));
app.use(express.json());
// Parse cookies so controllers can read req.cookies.refreshToken. Try to use
// cookie-parser if installed; otherwise fall back to a tiny parser for tests.
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const cookieParser = require("cookie-parser");
  app.use(cookieParser());
} catch (err) {
  // Lightweight cookie parser fallback used only when cookie-parser isn't
  // available (keeps tests runnable without an extra npm install).
  app.use((req, _res, next) => {
    const header = (req.headers && req.headers.cookie) || "";
    const cookies: Record<string, string> = {};
    header.split(";").forEach((pair) => {
      const [rawName, ...rawVal] = pair.split("=");
      const name = rawName && rawName.trim();
      if (!name) return;
      const val = rawVal.join("=").trim();
      cookies[name] = decodeURIComponent(val);
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req.cookies = cookies;
    next();
  });
}

// Configure Swagger UI with CORS
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      tryItOutEnabled: true,
      filter: true,
      withCredentials: true,
    },
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Sweet Shop API Documentation",
  })
);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetRoutes);

export default app;
