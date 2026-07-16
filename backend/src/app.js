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
  const allowedOrigins = [
  'http://localhost:3000', 
  'https://food-node.vercel.app/' 
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // This is CRITICAL because you used credentials: 'include'
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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
