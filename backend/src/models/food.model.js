const mongoose = require('mongoose');


const foodSchema = new mongoose.Schema({
    fileId : {
        type:String
    },
    name : {
        type:String,
        required:true
    },
    video:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    foodPartner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"foodPartner"
    },
    likeCount:{
        type:Number,
        default:0
    },
    saveCounts:{
        type:Number,
        default:0
    }
});

const foodModel = mongoose.model("food", foodSchema)

module.exports = foodModel;