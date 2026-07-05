const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");


const authRoute = require("./routes/auth.route");
const foodRoute = require("./routes/food.route");
const foodPartnerRoute = require("./routes/food-partner.route");
const userRouter = require("./routes/user.route");
const otpRouter = require("./routes/otp.route");

const app = express();


// app.use(cors({
//     origin: [
//         "https://food-node.vercel.app", 
//         "http://localhost:3000"
//     ],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"]
// }))

app.use(cors({
  origin: "https://food-node.vercel.app",
  credentials: true,
}));

app.options("*", cors({
  origin: "https://food-node.vercel.app",
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use("/api/auth", authRoute);
app.use("/api/food", foodRoute);
app.use("/api/food-partner", foodPartnerRoute);
app.use("/api/user", userRouter);
app.use("/api/otp", otpRouter);


module.exports = app;
