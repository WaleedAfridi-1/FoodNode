const foodModel = require('../models/food.model');
const foodPartnerModel = require('../models/foodPartner.model');
const storageService = require("../services/storage.service");
const { v4: uuid } = require("uuid");
const likeModel = require("../models/like.model");
const saveModel = require("../models/save.model");

const createFood = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Video file is required!" });
        }

        const { name, description } = req.body;

        // 2. Upload file to cloud storage
        const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid());

        const foodPartnerId = req.cookies.userId;
        // 3. Create Item in DB
        const foodItem = await foodModel.create({
            name,
            description,
            video: fileUploadResult.url,
            foodPartner: foodPartnerId,
            fileId : fileUploadResult.fileId
        });

        return res.status(201).json({
            message: "Item created successfully",
            foodItem: foodItem
        });

    } catch (error) {
        console.error("Create Food Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};


const getFoodItems = async (req, res) => {
    try {
        const foods = await foodModel.find().lean();
        const userId = req.cookies.userId;

        const updatedFoods = await Promise.all(foods.map(async (item) => {
            let isLiked = false;
            let isSaved = false;

            if (userId) {
                const exists = await likeModel.findOne({ foodItem: item._id, user: userId });
                isLiked = exists ? true : false;

                const saveExists = await saveModel.findOne({ foodItem: item._id, user: userId });
                isSaved = saveExists ? true : false;
            }

            return {
                ...item,
                isLiked: isLiked,
                isSaved: isSaved
            };
        }));

        

        return res.status(200).json(updatedFoods);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const getItem = async (req, res) => {
    try {
        const { id } = req.params;
        
        const userId = req.cookies.userId; 

        // Single food item dhoondo
        const item = await foodModel.findById(id).lean();

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Food item not found."
            });
        }

        let isLiked = false;
        let isSaved = false;

        if (userId) {
            const likeExist = await likeModel.findOne({
                user: userId,
                foodItem: item._id
            });
            isLiked = likeExist ? true : false;

            const saveExist = await saveModel.findOne({
                foodItem: item._id,
                user: userId
            });
            isSaved = saveExist ? true : false;
        }

        // Final response object taiyar karein
        const finalData = {
            ...item,
            isLiked,
            isSaved
        };

        // 🎯 FIX 3: 'success: true' add kiya taake frontend crash na ho
        return res.status(200).json({
            success: true,
            message: "Item Fetched.",
            item: finalData
        });

    } catch (error) {
        console.error("Error in getItem:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

const isLike = async (req, res) => {
    try {
        const userId = req.cookies.userId;
        const foodId = req.params.id;
        const userRole = req.cookies.userRole

        if (!userId || !userRole) {
            return res.status(401).json({ success: false, message: "Unauthorized Access Please Login." })
        }

        const likeExist = await likeModel.findOne({
            foodItem: foodId,
            user: userId
        });

        if (likeExist) {
            await likeModel.deleteOne({ _id: likeExist._id });

            await foodModel.findByIdAndUpdate(foodId,
                {
                    $inc:
                        { likeCount: -1 }
                });

            return res.status(200).json({
                success: true,
                like: false,
                message: "Video Unlike Successfully."
            })
        } else {
            const videoLiked = await likeModel.create({
                foodItem: foodId,
                user: userId,
                userModel: userRole
            });
            await foodModel.findByIdAndUpdate(foodId, {
                $inc: {
                    likeCount: + 1
                }
            })
            return res.status(200).json({
                message: "Video Liked Successfully.",
                success: true,
                like: true
            })
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }

}


const getSave = async (req, res) => {
    try {
        const userId = req.cookies.userId;
        const userRole = req.cookies.userRole;
        const foodId = req.params.id;

        if (!userId || !userRole) {
            return res.status(401).json({ success: false, message: "Unauthorized Access Please Login" })
        }

        const exist = await saveModel.findOne({
            foodItem: foodId,
            user: userId
        })

        if (exist) {
            await saveModel.deleteOne({
                foodItem: foodId,
                user: userId
            })
            await foodModel.findByIdAndUpdate(foodId, {
                $inc: {
                    saveCounts: -1
                }
            })

            return res.status(200).json({ success: true, saved: false, message: "Video Unsaved Successfully." })
        } else {
            const saved = await saveModel.create({
                foodItem: foodId,
                user: userId,
                userModel: userRole
            })

            await foodModel.findByIdAndUpdate(foodId, {
                $inc: {
                    saveCounts: +1
                }
            })

            return res.status(201).json({ success: true, saved: true, message: "Video Saved Successfully." })
        }

    } catch (error) {
        return res.status(500).json({ success: false, try: "fail", message: error.message })
    }
}

const savedFood = async (req, res) => {
    try {
        const userId = req.params.id;

        const savedReels = await saveModel
            .find({ user: userId })
            .populate('foodItem')
            .lean();

        const updatedFoods = await Promise.all(savedReels.map(async (item) => {
            if (!item.foodItem) return item;

            let isLiked = false;
            let isSaved = false;

            if (userId) {

                const likeExists = await likeModel.findOne({
                    user: userId,
                    foodItem: item.foodItem._id 
                });
                isLiked = likeExists ? true : false;

                const saveExists = await saveModel.findOne({
                    user: userId,
                    foodItem: item.foodItem._id // Target video match karein
                });
                isSaved = saveExists ? true : false;
            }

    
            return {
                ...item,
                foodItem: {
                    ...item.foodItem,
                    isSaved: isSaved,
                    isLiked: isLiked
                }
            };
        }));    

        return res.status(200).json({
            success: true,
            savedReels: updatedFoods
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Saved reels fetch error.",
            error: error.message
        });
    }
}


const deleteItem = async (req, res ) => {
    const foodId = req.params.id;
    const item = await foodModel.findByIdAndDelete(foodId)
    res.status(200).json({
        success : true,
        message : "Item Deleted Successfully.",
        item
    })
}

module.exports = {
    createFood,
    getFoodItems,
    getItem,
    isLike,
    getSave,
    savedFood,
    deleteItem
}