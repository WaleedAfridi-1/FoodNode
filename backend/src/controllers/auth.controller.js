const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodPartner.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Centralized cookie options helper function
const getCookieOptions = () => {
    return {
        httpOnly: false, // Taki agar user login status front-end se direct read karna ho toh masla na ho
        secure: true,    // Railway (HTTPS) aur Vercel (HTTPS) ke liye compulsory hai
        sameSite: "none", // Cross-origin cookies transfer ke liye compulsory hai
        path: "/"
    };
};

// ================= USER REGISTER =================
const userRegister = async (req, res) => {
    try {
        const { fName, email, password } = req.body;

        const userExist = await userModel.findOne({ email });
        if (userExist) {
            return res.status(400).json({
                message: "User already exist please login."
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            fName,
            email,
            password: hashPassword
        });

        if (!process.env.JWT_SECRET_KEY) {
            throw new Error("JWT_SECRET_KEY is missing in env variables");
        }
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
        const StringUserId = user._id.toString();
        
        const cookieOpts = getCookieOptions();

        res.cookie("token", token, cookieOpts);
        res.cookie("userId", StringUserId, cookieOpts);
        res.cookie("userRole", "user", cookieOpts);

        return res.status(201).json({
            message: "User Registered successfully.",
            user
        });

    } catch (error) {
        console.error("Backend Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// ================= USER LOGIN =================
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExist = await userModel.findOne({ email });

        if (!userExist) {
            return res.status(400).json({ message: "Invalid Email Or Password" });
        }

        const userValid = await bcrypt.compare(password, userExist.password);

        if (userValid) {
            const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET_KEY);
            const cookieOpts = getCookieOptions();

            res.cookie("token", token, cookieOpts);
            res.cookie("userId", userExist._id.toString(), cookieOpts);
            res.cookie("userRole", "user", cookieOpts);

            return res.status(200).json({
                message: "Login Successfully.",
                user: {
                    fName: userExist.fName,
                    email: userExist.email,
                    id: userExist._id
                }
            });
        } else {
            return res.status(403).json({ message: "Invalid Email or Password" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ================= USER LOGOUT =================
const userLogout = async (req, res) => {
    try {
        const cookieOpts = getCookieOptions();
        res.clearCookie("token", cookieOpts);
        res.clearCookie("userRole", cookieOpts);
        res.clearCookie("userId", cookieOpts);

        return res.status(200).json({
            success: true,
            message: "Logged out successfully."
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ================= REGISTER FOOD PARTNER =================
const registerFoodPartner = async (req, res) => {
    try {
        const { fName, email, password, phone, address, businessName, verificationToken } = req.body;

        if (!verificationToken) {
            return res.status(403).json({ message: "Email verification required before registration." });
        }

        try {
            const decoded = jwt.verify(verificationToken, process.env.JWT_SECRET_KEY);
            if (decoded.email !== email || !decoded.verified) {
                return res.status(403).json({ message: "Invalid or forged verification data." });
            }
        } catch (err) {
            return res.status(403).json({ message: "Verification token expired. Please verify email again." });
        }

        const foodPartner = await foodPartnerModel.findOne({ email });
        if (foodPartner) {
            return res.status(400).json({ message: "User Already Exist, Please Login" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const createdFoodPartner = await foodPartnerModel.create({
            fName,
            email,
            phone,
            address,
            businessName,
            password: hashPassword,
            isVerified: true 
        });

        const token = jwt.sign({ id: createdFoodPartner._id }, process.env.JWT_SECRET_KEY);
        const cookieOpts = getCookieOptions();
        
        res.cookie("token", token, cookieOpts);
        res.cookie("userId", createdFoodPartner._id.toString(), cookieOpts);
        res.cookie("userRole", "food-partner", cookieOpts);

        return res.status(201).json({
            message: "Account Created Successfully, Please Login Your Account.",
            foodPartner: {
                _id: createdFoodPartner._id.toString(),
                fName: createdFoodPartner.fName,
                email: createdFoodPartner.email
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// ================= LOGIN FOOD PARTNER =================
const loginFoodPartner = async (req, res) => {
    try {
        const { email, password } = req.body;
        const foodPartnerExist = await foodPartnerModel.findOne({ email });
        
        if (!foodPartnerExist) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }
        
        const validFoodPartner = await bcrypt.compare(password, foodPartnerExist.password);
        
        if (validFoodPartner) {
            const token = jwt.sign({ id: foodPartnerExist._id }, process.env.JWT_SECRET_KEY);
            const cookieOpts = getCookieOptions();

            res.cookie("token", token, cookieOpts);
            res.cookie("userId", foodPartnerExist._id.toString(), cookieOpts);
            res.cookie("userRole", "food-partner", cookieOpts);
            
            return res.status(200).json({
                message: "Login Successfully.",
                foodPartnerExist
            });
        }

        return res.status(400).json({ message: "Invalid Email or Password" });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// ================= LOGOUT FOOD PARTNER =================
const logoutFoodPartner = (req, res) => {
    const cookieOpts = getCookieOptions();
    res.clearCookie("token", cookieOpts);
    res.clearCookie("userRole", cookieOpts);
    res.clearCookie("userId", cookieOpts);
    
    return res.status(200).json("Logout Successfully.");
};

module.exports = {
    userRegister,
    userLogin,
    userLogout,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
};
