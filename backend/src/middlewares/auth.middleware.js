const jwt = require("jsonwebtoken");
const foodPartnerModel = require("../models/foodPartner.model");
const userModel = require('../models/user.model');

const isFoodPartner = async (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: "Please Login First."
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

        const foodPartner = await foodPartnerModel.findById(decoded.id);

        req.user = foodPartner;

        next()
    } catch (error) {

        console.log(error.message)

        res.status(401).json({
            message: "Unauthorized Access!"
        })
    }
}

const isUser = async (req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            message:"Please Login First."
        })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

    try {
        const user = await userModel.findById(decoded.id);
        req.user = user
        next()
    } catch (error) {
        console.log(error.message)
        res.status(401).json({
            message:"Unauthorized access."
        })
    }
}


module.exports = {
    isFoodPartner,
    isUser
}