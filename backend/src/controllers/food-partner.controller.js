const foodPartnerModel = require("../models/foodPartner.model");
const foodModel = require("../models/food.model");
const storageService = require("../services/storage.service");
const { v4: uuid } = require('uuid');



const getFoodPartner = async (req, res) => {
    try {
        const id = req.params.id;

        const foodPartner = await foodPartnerModel.findById(id).select("-password");

        if (!foodPartner) {
            return res.status(404).json({
                message: "Restaurant/Partner not found"
            });
        }

        const foodItems = await foodModel.find({ foodPartner: id });

        return res.status(200).json({
            message: "Fetched Food-Partner Profile Successfully",
            foodPartner,
            foodItems
        });

    } catch (error) {
        console.error("Error fetching restaurant profile:", error.message);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};


const fetchedFoodPartner = async (req, res) => {
    const foodPartnerId = req.params.id;

    const foodPartner = await foodPartnerModel.findById(foodPartnerId).select("-password");
    if (foodPartner) {
        return res.status(200).json({
            success: true,
            message: "FoodPartner Fetched.",
            foodPartner: foodPartner,
        })
    }
    res.status(404).json({
        success: false,
        message: "FoodPartner Not Found",
    })

}


const updateProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const { fName, businessName, email, phone, address } = req.body;


        let updateData = { fName, businessName, email, phone, address };


        if (req.file) {
            const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid());
            updateData.image = fileUploadResult.url;
        }


        const updatedFoodPartner = await foodPartnerModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true } // runValidators 
        ).select("-password");

        if (!updatedFoodPartner) {
            return res.status(404).json({
                success: false,
                message: "FoodPartner Not Found."
            });
        }

        // Single clean response for both cases
        return res.status(200).json({
            success: true,
            message: "FoodPartner Profile Updated.",
            foodPartner: updatedFoodPartner
        });

    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};


const deleteFoodPartner = async (req, res) => {
    const id = req.params.id;
    try {
        const foodPartner = await foodPartnerModel.findById(id);
        if(!foodPartner) {
            return res.status(404).json({
                success : false,
                message : "FoodPartner Account Not Fount."
            });
        }

        const foodItems = await foodModel.find({foodPartner : id });

        for ( const  item of foodItems ){
            if(item.fileId){
                await storageService.deleteFile(item.fileId)
            }
        }
        await foodPartnerModel.findByIdAndDelete(id);
        await foodModel.deleteMany({foodPartner : id })

        return res.status(200).json({
            success: true,
            message: "Account, database records, and media files deleted permanently."
        });

    } catch (error) {
       console.error("Error in deleteFoodPartner:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        }); 
    }
}

module.exports = {
    getFoodPartner,
    fetchedFoodPartner,
    updateProfile,
    deleteFoodPartner
};