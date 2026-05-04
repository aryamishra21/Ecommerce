import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import authRoutes from "./modules/auth/routes/auth.route.js";
import userRoutes from "./modules/user/routes/user.routes.js";
import addressRoutes from "./modules/address/routes/address.route.js";
import categoryRoutes from "./modules/category/routes/category.routes.js";
import productRoutes from "./modules/product/routes/product.routes.js";
import cartRoutes from "./modules/cart/routes/cart.routes.js";
import orderRoutes from "./modules/order/routes/order.routes.js";

const app = express();
/** CORS */
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

/** Body parsing */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/** Cookies */
app.use(cookieParser());

/** Logging */
app.use(morgan("dev"));

app.use(express.json());

/** Security headers */
app.use(helmet());

/** Rate Limiter (basic protection) */
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    limit: 200, // 200 requests per IP
    message: "Too many requests, please try again later",
  }),
);
app.get("/health", (req, res) => {
  res.json({ success: true, message: "API is running" });
});

// auth routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

/** Error middleware */
app.use(errorMiddleware);

export default app;
