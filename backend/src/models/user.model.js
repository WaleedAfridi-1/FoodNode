const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    fName : {
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    role:{
        type:String,
        default:"user"
    },
    password:{
        type:String
    },
     isVerified : {
        type : Boolean,
        default : false
    },
    image:{
        type:String
    }},
    {
        timestamps:true
    });

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;