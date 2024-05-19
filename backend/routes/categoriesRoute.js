const {verifyToken, verifyTokenAndAdmin} = require("../middlewares/verifyToken");
const {createCategorCtrl, getAllCategorise, getCategoriseByIdCtrl, deleteCategoriseCtrl} = require("../controllers/categoriesController");
const {validateObjectld} = require("../middlewares/validateObjectld");

const router= require("express").Router();
router.route("/")
    .post(verifyToken,createCategorCtrl)
    .get(getAllCategorise)
router.route("/:id")
    .get(verifyTokenAndAdmin,validateObjectld,getCategoriseByIdCtrl)
    .delete(verifyTokenAndAdmin,validateObjectld,deleteCategoriseCtrl)
module.exports = router