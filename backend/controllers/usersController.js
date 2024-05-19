const {User, validateUpdateUser} = require("../models/User");
const bcrypt = require("bcryptjs");
const path = require("path");
const dotenv = require('dotenv');
const fs = require("fs")
dotenv.config();
const {cloudinaryUploadImage, cloudinaryRemoveImage} = require("../utils/cloudinary");
/**---------------------------------
 *@desc Get All Users
 *@router /app/users/profile
 * @method get
 --------------------------------*/
module.exports.getAllUsersCtrl = async (req, res) => {
    try {
        const getUser = await User.find().select("-password")
            .populate("bio")
            .populate("products")
            .populate("Orders")
        res.status(200).json(getUser)
    } catch (e) {
        console.log(e)
    }
}
/**---------------------------------
 *@desc Get User By Id
 *@router /app/users/profile
 * @method get
 --------------------------------*/
module.exports.getUserByIdCtrl = async (req, res) => {
    try {
        const getUserById = await User.findById(req.params.id).select("-password")
            .populate("products") // Ensure the name matches the virtual definition in User model
            .populate("categories")
            .populate("storeName")
            .populate("bio")
            .populate("VacationmMode")
            .populate("Orders")

        // Ensure the name matches the virtual definition in User model
        if (!getUserById) {
            return res.status(404).json({message: "user not found"})
        }
        res.status(200).json(getUserById)
    } catch (e) {
        console.log(e)
    }
}
/**---------------------------------
 *@desc update User profile
 *@router /app/users/profile/:id
 * @method put
 --------------------------------*/
module.exports.updateUserProfileCtrl = async (req, res) => {
    try {
        // const {error} = validateUpdateUser(req.body)
        // if (error) {
        //     return res.status(400).json({message: error.details[0].message})
        // }
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt)
        }
        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                storeName: req.body.storeName,
                password: req.body.password,
                bio: req.body.bio,
                VacationmMode:req.body.VacationmMode,
                bioVisibility:req.body.bioVisibility,

            }
        }, {new: true}
        ).populate("products").populate("bio")
        res.status(200).json(updateUser)


    } catch (e) {
        console.log(e)
    }
}
/**---------------------------------
 *@desc get users count
 *@router /app/users/count
 * @method get
 --------------------------------*/
module.exports.getUserCount = async (req, res) => {
    const count = await User.countDocuments();
    res.status(200).json(count)
}
/**---------------------------------
 *@desc Upload Profile Photo
 *@router /app/users/profile/Upload-Profile-Photo
 * @method post
 --------------------------------*/
module.exports.ProfileUploadPhotoCtrl = async (req, res) => {
    try {
        //1-Validation
        if (!req.file) {
            return res.status(400).json({message: 'no file provided'});
        }
        //2-Get the path to the image
        const pathImage = path.join(__dirname, `../images/${req.file.filename}`)
        //3- Upload to cloudinary
        const result = await cloudinaryUploadImage(pathImage)
        console.log(result)
        //4-Get the user from DB
        //هنا استخدمنا req.user.id لانني نريد المستخدم الذي سجل الدخول وليس مستخدم اخر
        const user = await User.findById(req.userToken.id)

        if (!req.userToken || !req.userToken.id) {
            return res.status(401).json({message: "Unauthorized, user not logged in"});
        }
        //5-Delete the old profile photo if exist
        if (user.profilePhoto?.publicId !== null) {
            console.log("cloudinaryRemoveImage")
            await cloudinaryRemoveImage(user.profilePhoto.publicId);
        }
        //6-Change the profilePhoto field in the DB
        user.profilePhoto = {
            url: result.secure_url,
            publicId: result.public_id
        }
        await user.save()

        console.log(req.file)
        //7-Send response to client

        res.status(200).json({
            message: "your profile photo uploaded successfully",
            profilePhoto: { url: result.secure_url, publicId: result.public_id },
        })
        // 8. Remove image from the server
        fs.unlinkSync(pathImage)
    } catch (e) {
        console.log(e)

    }

}
/**---------------------------------
 *@desc Delete Profile
 *@router /app/users/profile/:id
 * @method delete
 --------------------------------*/
module.exports.deleteUserProfileCtr = async (req, res) => {
    // 1. Get the user from DB
    const getUser = await User.findById(req.params.id)
    if (!getUser) {
        return res.status(404).json({message: "User Not Found"})
    }
    // @TODO - 2. Get all posts from DB
    // @TODO - 3. Get the public ids from the posts
    // @TODO - 4. Delete all posts image from cloudinary that belong to this us
    // 5. Delete the profile picture from cloudinary
    await cloudinaryRemoveImage(getUser.profilePhoto.publicId)
    // @TODO - 6. Delete user posts & comments
    // 7. Delete the user himself
    await User.findByIdAndDelete(req.params.id)
    // 8. Send a response to the client
    res.status(200).json({message: "your profile has been deleted"})
}