const express = require("express");
const router = express.Router();
const middleware = require("../middlewares/auth.middleware");
const foodController = require("../controllers/food.controller");
const multer = require("multer")

const storage = multer.memoryStorage();
const upload = multer({
    storage:storage
})

// POST -> /api/food
router.post("/",middleware.isFoodPartner,upload.single("video") , foodController.createFood)

// GET -> /api/food 
router.get("/",middleware.isUser,foodController.getFoodItems)

// specific one item 
//-->  /api/food/:id
router.get("/:id", middleware.isUser , foodController.getItem)

//-->  /api/food/like/:id 
router.get("/like/:id",middleware.isUser, foodController.isLike)

//-->  /api/food/save/:id
router.get("/save/:id",middleware.isUser, foodController.getSave )

router.get("/saved/foods/:id", middleware.isUser, foodController.savedFood)

router.delete("/delete/:id", middleware.isFoodPartner, foodController.deleteItem)
module.exports = router;