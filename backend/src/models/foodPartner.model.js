const mongoose = require("mongoose");


const foodPartnerSchema = new mongoose.Schema({
    fName:{
        type:String,
        required:true
    },
    businessName:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    address:{
        type:String,
        required:true
    },
    password:{
        type:String
    },
    role:{
        type:String,
        default:"FoodPartner"
    },
    image:{
        type:String
    },
    isVerified : {
        type : Boolean,
        default : false
    }
}, {timestamps:true}
)

const foodPartnerModel = mongoose.model("foodPartner", foodPartnerSchema)
module.exports = foodPartnerModel;