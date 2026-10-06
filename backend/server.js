import "dotenv/config";
import express from "express";
import cors from "cors";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import { createAdminFromEnvironment } from "./controllers/adminController.js";

const app = express();

/* =========================================================
   CORS
   ========================================================= */

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

/* =========================================================
   BODY PARSER
   ========================================================= */

app.use(express.json({ limit: "1mb" }));

/* =========================================================
   HEALTH CHECK
   ========================================================= */

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "QuizNova API",
  });
});

/* =========================================================
   DATABASE CONNECTION
   ========================================================= */

/*
  Keep one MongoDB connection promise.

  This prevents multiple requests from trying to create
  separate MongoDB connections at the same time.
*/
let dbConnectionPromise = null;

/*
  Keep one admin bootstrap promise.

  This is important because Render/browser requests can
  arrive at the same time. Without this protection,
  multiple requests could call createAdminFromEnvironment()
  simultaneously and MongoDB could return:

  E11000 duplicate key error
*/
let adminBootstrapPromise = null;

async function ensureDatabaseConnection() {
  /*
    Create the MongoDB connection only once.
  */
  if (!dbConnectionPromise) {
    dbConnectionPromise = connectDB();
  }

  try {
    /*
      Wait for MongoDB.
    */
    const connection = await dbConnectionPromise;

    /*
      Run admin bootstrap only once at a time.
    */
    if (!adminBootstrapPromise) {
      adminBootstrapPromise = createAdminFromEnvironment().catch((error) => {
        /*
          Allow a future request to retry if the bootstrap
          itself fails.
        */
        adminBootstrapPromise = null;
        throw error;
      });
    }

    await adminBootstrapPromise;

    return connection;
  } catch (error) {
    /*
      If the database connection fails, allow the next
      request to retry the connection.
    */
    dbConnectionPromise = null;

    throw error;
  }
}

/* =========================================================
   DATABASE MIDDLEWARE
   ========================================================= */

app.use(async (req, res, next) => {
  try {
    await ensureDatabaseConnection();

    next();
  } catch (error) {
    console.error("Database connection failed:", error.message);

    res.status(503).json({
      message: "Database unavailable",
      detail:
        process.env.NODE_ENV === "production"
          ? "Check the MongoDB connection and environment variables."
          : error.message,
    });
  }
});

/* =========================================================
   API ROUTES
   ========================================================= */

app.use("/api/auth", authRoutes);

app.use("/api/questions", questionRoutes);

app.use("/api/quizzes", quizRoutes);

app.use("/api/progress", progressRoutes);

app.use("/api/admin", adminRoutes);

/* =========================================================
   404 HANDLER
   ========================================================= */

app.use((req, res) => {
  res.status(404).json({
    message: "API route not found",
  });
});

/* =========================================================
   GLOBAL ERROR HANDLER
   ========================================================= */

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    message: "Internal server error",
  });
});

/* =========================================================
   LOCAL SERVER
   ========================================================= */

/*
  Render provides its own PORT.

  When running locally, this falls back to port 5000.

  Vercel does not need app.listen().
*/
if (!process.env.VERCEL) {
  const port = process.env.PORT || 5000;

  app.listen(port, () => {
    console.log(
      `QuizNova API running on http://localhost:${port}`
    );
  });
}

/* =========================================================
   EXPORT APP
   ========================================================= */

export default app;