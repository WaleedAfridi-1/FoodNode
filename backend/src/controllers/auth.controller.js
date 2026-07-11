const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodPartner.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// User Auth 
const userRegister = async (req, res) => {
    try {
        const { fName, email, password } = req.body;

        // 1. Check if user exists
        const userExist = await userModel.findOne({ email });
        if (userExist) {
            return res.status(400).json({
                message: "User already exist please login."
            });
        }

        // 2. Hash Password
        const hashPassword = await bcrypt.hash(password, 10);

        // 3. Create User
        const user = await userModel.create({
            fName,
            email,
            password: hashPassword
        });

        // 4. Generate Token
        if (!process.env.JWT_SECRET_KEY) {
            throw new Error("JWT_SECRET_KEY is missing in env variables");
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
        const StringUserId = user._id.toString()
        // 5. Set Cookie
        res.cookie("token", token, {
            httpOnly: false,
            secure: true,
            sameSite: "lax",
            path: "/"
        });
        res.cookie("userId", StringUserId,
            {
                httpOnly:false, 
                path: "/" 
            });
        res.cookie("userRole", "user", 
            { 
                httpOnly:false,
                path: "/" 
            });
        // 6. Send Success Response
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

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExist = await userModel.findOne({ email });

        if (!userExist) {

            return res.status(400).json({ message: "Invalid Email Or Password" })
        }

        const userValid = await bcrypt.compare(password, userExist.password)

        if (userValid) {

            const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET_KEY)

            res.cookie("token", token, {
                httpOnly: false,
                secure: true,
                sameSite: "lax",
                path: "/"
            })
            res.cookie("userId", userExist._id.toString(), { httpOnly: false, path: "/" });
            res.cookie("userRole", "user", { httpOnly: false, path: "/" });

            return res.status(200).json({
                message: "Login Successfully.",
                user: {
                    fName: userExist.fName,
                    email: userExist.email,
                    id: userExist._id
                }
            })
        } else {
            return res.status(403).json({ message: "Invalid Email or Password" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }


}

const userLogout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: false,
            sameSite: "lax",
            path: "/"
        });

        res.clearCookie("userRole", {
            sameSite: "lax",
            path: "/"
        });

        res.clearCookie("userId", {
            sameSite: "lax",
            path: "/"
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully."
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};



// auth.controller.js
const registerFoodPartner = async (req, res) => {
    try {
        const { fName, email, password, phone, address, businessName, verificationToken } = req.body;

        if (!verificationToken) {
            return res.status(403).json({ message: "Email verification required before registration." });
        }

        try {
            // Verify JWT temporary token
            const decoded = jwt.verify(verificationToken, process.env.JWT_SECRET_KEY);
            if (decoded.email !== email || !decoded.verified) {
                return res.status(403).json({ message: "Invalid or forged verification data." });
            }
        } catch (err) {
            return res.status(403).json({ message: "Verification token expired. Please verify email again." });
        }

        // 2. Main account generation pipeline
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
        
        res.cookie("token", token, { httpOnly: false, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/" });
        res.cookie("userId", createdFoodPartner._id.toString(), { httpOnly: false, path: "/" });
        res.cookie("userRole", "food-partner", { httpOnly: false, path: "/" });

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

            res.cookie("token", token, { httpOnly: false, path: "/" });
            res.cookie("userId", foodPartnerExist._id.toString(), { httpOnly: false, path: "/" });
            res.cookie("userRole", "food-partner", { httpOnly: false, sameSite: "lax", path: "/" });
            
            return res.status(200).json({
                message: "Login Successfully.",
                foodPartnerExist
            });
        }

        return res.status(400).json({ message: "Invalid Email or Password" });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
const logoutFoodPartner = (req, res) => {
    res.clearCookie("token", {
        httpOnly: false,
        sameSite: "lax",
        path: "/"
    });

    res.clearCookie("userRole", {
        sameSite: "lax",
        path: "/"
    });

    res.clearCookie("userId", {
        sameSite: "lax",
        path: "/"
    });
    res.status(200).json("Logout Successfully.")
}
module.exports = {
    userRegister,
    userLogin,
    userLogout,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
}
