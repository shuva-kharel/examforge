import "dotenv/config";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import { config } from "./config/app.config";
import connectDatabase from "./database/database";
import { errorHandler } from "./middlewares/errorHandler";
import { HTTPSTATUS } from "./config/http.config";
import { asyncHandler } from "./middlewares/asyncHandler";
import authRoutes from "./modules/auth/auth.routes";
import passport from "./middlewares/passport";
import sessionRoutes from "./modules/session/session.routes";
import { authenticateJWT } from "./common/strategies/jwt.strategy";
import mfaRoutes from "./modules/mfa/mfa.routes";

// Import your paper routes
import paperRoutes from "./modules/paper/paper.routes"; // Adjust path as needed

const app = express();
const BASE_PATH = config.BASE_PATH;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: config.APP_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(passport.initialize());

// Health check endpoint
app.get(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.status(HTTPSTATUS.OK).json({
      message: "Hello Subscribers!!!",
      service: "ExamForge API",
      version: "1.0.0",
      status: "operational",
      endpoints: {
        auth: `${BASE_PATH}/auth`,
        papers: `${BASE_PATH}/papers`,
        session: `${BASE_PATH}/session`,
        mfa: `${BASE_PATH}/mfa`,
      },
    });
  })
);

// API Documentation endpoint
app.get(
  "/api-docs",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    res.status(HTTPSTATUS.OK).json({
      message: "API Documentation",
      endpoints: [
        {
          method: "POST",
          path: `${BASE_PATH}/auth/login`,
          description: "User login",
          auth: false,
        },
        {
          method: "POST",
          path: `${BASE_PATH}/auth/register`,
          description: "User registration",
          auth: false,
        },
        {
          method: "POST",
          path: `${BASE_PATH}/papers/generate`,
          description: "Generate question paper",
          auth: true,
          body: {
            subject: "string (chemistry, physics, etc.)",
            classLevel: "string (11, 12)",
            chapters: "string[] (optional)",
            difficulties: "string[] (optional)",
            settings: "object (optional)",
          },
        },
        {
          method: "GET",
          path: `${BASE_PATH}/papers/:paperId`,
          description: "Get paper preview",
          auth: true,
        },
        {
          method: "GET",
          path: `${BASE_PATH}/papers/:paperId/pdf`,
          description: "Download paper as PDF",
          auth: true,
        },
        {
          method: "GET",
          path: `${BASE_PATH}/papers/filters/available`,
          description: "Get available filters",
          auth: true,
          query: {
            subject: "required",
            classLevel: "required",
          },
        },
      ],
    });
  })
);

// Routes
app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/mfa`, mfaRoutes);
app.use(`${BASE_PATH}/session`, authenticateJWT, sessionRoutes);
app.use(`${BASE_PATH}/papers`, authenticateJWT, paperRoutes); // Added paper routes

// Error handling
app.use(errorHandler);

// 404 handler
app.use("*", (req: Request, res: Response) => {
  res.status(HTTPSTATUS.NOT_FOUND).json({
    success: false,
    error: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

// Start server
app.listen(config.PORT, async () => {
  console.log(
    `🚀 Server listening on port ${config.PORT} in ${config.NODE_ENV}`
  );
  console.log(`🌐 Base path: ${BASE_PATH}`);
  console.log(
    `📄 Paper API: http://localhost:${config.PORT}${BASE_PATH}/papers`
  );
  await connectDatabase();
});
