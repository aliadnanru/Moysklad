const {
    getAllUsersCtrl,
    getUserByIdCtrl,
    updateUserProfileCtrl,
    getUserCount, ProfileUploadPhotoCtrl, deleteUserProfileCtr
} = require("../controllers/usersController");
const photoUplode = require("../middlewares/photoUpload")
const {verifyToken, verifyTokenAndAdmin, verifyTokenAndOnlyUser} = require("../middlewares/verifyToken");
const {validateObjectld} = require("../middlewares/validateObjectld")
const router = require("express").Router(); // أضف الأقواس هنا
router.get("/profile", verifyTokenAndAdmin, getAllUsersCtrl)
router.get("/profile/:id", validateObjectld, getUserByIdCtrl)
router.put("/profile/:id", validateObjectld, verifyTokenAndOnlyUser, updateUserProfileCtrl)
router.delete("/profile/:id", deleteUserProfileCtr)
router.get("/count", getUserCount)
router.post("/profile/profile-upload-photo", verifyToken,photoUplode.single("image"), ProfileUploadPhotoCtrl)

module.exports = router