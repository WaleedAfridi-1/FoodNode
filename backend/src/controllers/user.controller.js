const userModel = require("../models/user.model");
const storageService = require("../services/storage.service");
const { v4: uuid } = require("uuid");

const getUser = async (req, res) => {
    const user = await userModel.findById(req.params.id).select("-password");
    res.status(200).json(user)

}

const getProfileUser = async (req, res) => {
    const userId = req.params.id;
    const user = await userModel
        .findOne({ _id: userId })
        .select("-password");
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User Not Found!",
        })
    }
    return res.status(200).json({
        success: true,
        message: "User Fetched.",
        user
    })
}


const updateProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const { fName, email } = req.body;
        const formData = { fName, email };


        if (req.file) {
            const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid());
            formData.image = fileUploadResult.url;
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            formData,
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User Not Found!."
            });
        }

        // 4. Success Response 
        return res.status(200).json({
            success: true,
            message: "Profile Updated Successfully.",
            user: updatedUser
        });

    } catch (error) {
        console.error("Update Profile Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};


const deleteUser = async (req, res) => {
    const id = req.params.id;
    try {
        const deleted = await userModel.findByIdAndDelete(id);
        if (deleted) {
            return res.status(200).json({
                success: true,
                message: "Account Deleted Permanently.",
                deleted
            });
        }

    } catch (error) {
        res.status(500).json({
            success : true,
            error : error.message
        })
    }
}

module.exports = {
    getUser,
    getProfileUser,
    updateProfile,
    deleteUser
}