const {
    createProductCtrl,
    getProductById,
    getAllProductsCtrl,
    getProductCountCtrl,
    deleteProductCtrl,
    updateProductCtrl, uploadImageCtrl, searchProducts
} = require("../controllers/productController");
const {verifyToken} = require("../middlewares/verifyToken")
const photoUplode = require("../middlewares/photoUpload")
const {validateObjectld} = require("../middlewares/validateObjectld");
const {deleteOrderItem} = require("../controllers/orderControllers");
const router = require("express").Router();
// api/posts
router.route("/")
    .post(verifyToken, photoUplode.single("image"), createProductCtrl)// api/posts
router.route("/")
    .get(getAllProductsCtrl)
router.route("/searchProducts")
    .get(searchProducts)
//api/posts/Count
router.route("/count/:id")
    .get(getProductCountCtrl)
// api/posts/:id
router.route("/:id")
    .get(validateObjectld, getProductById)
    .delete(validateObjectld, verifyToken, deleteProductCtrl)
    .put(validateObjectld, verifyToken, updateProductCtrl)
//upload-image/:id
router.route("/upload-image/:id")
    .put(validateObjectld,verifyToken,photoUplode.single("image"),uploadImageCtrl)


module.exports = router