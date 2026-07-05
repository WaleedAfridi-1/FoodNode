const express = require("express");
const foodPartnerController = require('../controllers/food-partner.controller');
const middleware = require('../middlewares/auth.middleware');
const multer = require('multer');
const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
    storage:storage
})



router.get("/:id", middleware.isUser ,foodPartnerController.getFoodPartner)

router.get("/edit/:id",middleware.isUser,middleware.isFoodPartner, foodPartnerController.fetchedFoodPartner)

router.put('/update/:id', middleware.isFoodPartner , upload.single('image') ,foodPartnerController.updateProfile)

router.delete("/delete/:id", middleware.isFoodPartner, foodPartnerController.deleteFoodPartner)

module.exports = router;