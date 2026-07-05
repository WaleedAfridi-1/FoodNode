const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");


const authRoute = require("./routes/auth.route");
const foodRoute = require("./routes/food.route");
const foodPartnerRoute = require("./routes/food-partner.route");
const userRouter = require("./routes/user.route");
const otpRouter = require("./routes/otp.route");

const app = express();


app.use((req, res, next) => {
  console.log("METHOD:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("ORIGIN:", req.headers.origin);
  next();
});

// app.use(cors({
//     origin: [
//         "https://food-node.vercel.app", 
//         "http://localhost:3000"
//     ],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"]
// }))

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://food-node.vercel.app",
      "http://localhost:3000"
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use("/api/auth", authRoute);
app.use("/api/food", foodRoute);
app.use("/api/food-partner", foodPartnerRoute);
app.use("/api/user", userRouter);
app.use("/api/otp", otpRouter);


module.exports = app;
