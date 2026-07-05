const mongoose = require("mongoose");



const otpVerificationSchema  = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true
    },
    otp : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    expiresAt : {
        type :Date,
        required : true,
        index : { expires : 0}
    }
})

module.exports = mongoose.model("otpVerification", otpVerificationSchema )