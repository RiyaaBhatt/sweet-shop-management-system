/**
 * @fileoverview Main application configuration and setup
 * This file sets up the Express application with middleware, routes, and configurations.
 * It includes CORS setup, Swagger documentation, and route registrations.
 */
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./routes/auth.routes";
import sweetRoutes from "./routes/sweet.routes";
import orderRoutes from "./routes/order.routes";
import cartRoutes from "./routes/cart.routes";
import adminRoutes from "./routes/admin.routes";
import dotenv from "dotenv";
import { specs } from "./config/swagger";
dotenv.config();
const app = express();
// Configure CORS
const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            process.env.FRONTEND_URL || "http://localhost:8080/",
            process.env.API_URL || "http://localhost:8000",
            "http://localhost:8000", // Swagger UI
        ];
        if (process.env.NODE_ENV !== "production") {
            callback(null, true); // Allow all in development
        }
        else if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
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
app.use("/uploads", express.static("uploads"));
// Parse cookies so controllers can read req.cookies.refreshToken. Try to use
// cookie-parser if installed; otherwise fall back to a tiny parser for tests.
try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const cookieParser = require("cookie-parser");
    app.use(cookieParser());
}
catch (err) {
    // Lightweight cookie parser fallback used only when cookie-parser isn't
    // available (keeps tests runnable without an extra npm install).
    app.use((req, _res, next) => {
        const header = (req.headers && req.headers.cookie) || "";
        const cookies = {};
        header.split(";").forEach((pair) => {
            const [rawName, ...rawVal] = pair.split("=");
            const name = rawName && rawName.trim();
            if (!name)
                return;
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
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, {
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        tryItOutEnabled: true,
        filter: true,
        withCredentials: true,
    },
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Sweet Shop API Documentation",
}));
// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);
export default app;
