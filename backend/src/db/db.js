const mongoose = require("mongoose");

const ConnectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/food-view`);
    console.log(" DB Connected Successfully");
  } catch (err) {
    console.error("MongoDB Connection Error:");
    console.error(err);
  }
};

module.exports = ConnectDB;