const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoute = require("./routes/auth.route");
const foodRoute = require("./routes/food.route");
const foodPartnerRoute = require("./routes/food-partner.route");
const userRouter = require("./routes/user.route");
const otpRouter = require("./routes/otp.route");

const app = express();

// 1. Request logging middleware
app.use((req, res, next) => {
  console.log("METHOD:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("ORIGIN:", req.headers.origin);
  next();
});

// 2. Manual Header Override Middleware (Yeh Browser ko shanti dega!)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Jo origin request kar raha hai (Vercel ya Localhost), hum use exact allow karenge
  if (origin === "https://food-node.vercel.app" || origin?.includes("localhost")) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  
  // ERROR KI ASLI WAJAH KA HAL: Forcefully credentials true bhej rahe hain
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept");

  // Agar OPTIONS (Preflight) request ho, toh foran 200 OK karke return kar do, aage route pe mat bhejo
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  
  next();
});

// 3. Backup CORS Setup
app.use(cors({
  origin: "https://food-node.vercel.app",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routing Setup
app.use("/api/auth", authRoute);
app.use("/api/food", foodRoute);
app.use("/api/food-partner", foodPartnerRoute);
app.use("/api/user", userRouter);
app.use("/api/otp", otpRouter);

module.exports = app;
