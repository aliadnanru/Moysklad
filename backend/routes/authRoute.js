const router = require("express").Router(); // أضف الأقواس هنا
const {registerUserCtrl, loginUserCtrl} = require("../controllers/authControllers");

// تعريف مسار API لتسجيل المستخدمين
router.post("/register", registerUserCtrl);
//login
router.post("/login", loginUserCtrl);



module.exports = router;
