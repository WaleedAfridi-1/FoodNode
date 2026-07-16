const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoute = require("./routes/auth.route");
const foodRoute = require("./routes/food.route");
const foodPartnerRoute = require("./routes/food-partner.route");
const userRouter = require("./routes/user.route");
const otpRouter = require("./routes/otp.route");

const app = express();

// Request logging middleware
app.use((req, res, next) => {
  console.log("METHOD:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("ORIGIN:", req.headers.origin);
  next();
});

// Dynamic origin handling taake local aur production dono pe bina crash kiye CORS chale
const allowedOrigins = [
  "https://food-node.vercel.app",
  "http://localhost:3000", // local development 
];

app.use(cors({
  origin: function (origin, callback) {
    // Agar local call ho ya matching origin ho toh allow karein
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, origin);
    } else {
      callback(null, origin); // Fallback to same origin
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"]
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
