const express = require('express');
const authController = require("../controllers/auth.controller");


const router = express.Router();


// User Auth APIs 
router.post("/user/register",authController.userRegister);
router.post("/user/login", authController.userLogin);
router.get("/user/logout", authController.userLogout);



// Food Partner Auth APIs 
router.post("/food-partner/register", authController.registerFoodPartner);
router.post("/food-partner/login",authController.loginFoodPartner);
router.get("/food-partner/logout", authController.logoutFoodPartner);


module.exports = router;