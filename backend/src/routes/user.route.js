const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");
const middleware = require("../middlewares/auth.middleware");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({
    storage:storage
})




router.get("/profile/:id",middleware.isUser , controller.getUser)


router.get("/profile/:id/edit", middleware.isUser, controller.getProfileUser )

router.put("/profile/:id/update", middleware.isUser, upload.single('image'),controller.updateProfile)

//  /api/food-partner/delete/id
router.delete("/delete/:id", middleware.isUser, controller.deleteUser)


module.exports = router;