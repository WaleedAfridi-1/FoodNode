const mongoose = require("mongoose");
const { applyTimestamps } = require("./user.model");


const saveSchema = new mongoose.Schema({
    foodItem : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"food",
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    userModel:{
        type:String,
        enum:['user', "food-partner"]
    }
}, {timestamps:true});

saveSchema.index({foodItem:1, user:1}, {unique:true});
const saveModel = mongoose.model("save", saveSchema);

module.exports = saveModel;
