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



app.use(cors({
    origin: function (origin, callback) {
        // Agar request local se hai ya Vercel se, ya origin exists karta hai:
        if (!origin) {
            callback(null, true);
        } else {
            callback(null, origin); // exact same origin allow karega jo request bhej raha hai
        }
    },
    credentials: true,
}));


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.use("/api/auth", authRoute);
app.use("/api/food", foodRoute);
app.use("/api/food-partner", foodPartnerRoute);
app.use("/api/user", userRouter);
app.use("/api/otp", otpRouter);


module.exports = app;
