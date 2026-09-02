import express, { type Request, type Response } from "express";
import expressSession from "express-session";
import { envConfig } from "./app/config/env";
import cors from "cors";
import router from "./app/routes/v1";
import notFound from "./app/middlewares/notFound";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import cookieParser from 'cookie-parser'

const app = express();

// Security & Cors
app.use(cors({
  credentials: true,
  origin: envConfig.FRONTEND_URL || "http://localhost:3000",
}));
app.use(cookieParser())

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Session
app.use(
  expressSession({
    secret: envConfig.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: envConfig.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      sameSite: envConfig.NODE_ENV === "production" ? "none" : "lax",
    },
  }),
);

// Routes
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to the OrbitOps server",
  });
});
app.use("/api/v1", router);

// Not found route
app.use(notFound);
// Global Error handler
app.use(globalErrorHandler);

export default app;
