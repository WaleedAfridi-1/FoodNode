const mongoose = require("mongoose");
const userModel = require("./user.model");


const likeSchema = new mongoose.Schema({
    foodItem : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"food",
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    userModel:{
        type:String,
        required:true,
        enum:['user',"food-partner"]
    }
}, {timestamps:true});

likeSchema.index({foodItem:1, user:1}, {unique:true});

const likeModel = mongoose.model("like",likeSchema);
module.exports = likeModel