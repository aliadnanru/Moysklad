const {Category, validateCreateCategory} = require("../models/Category")
/**---------------------------------
 *@desc Create Categorise
 *@router /app/Categorise/
 * @method post
 --------------------------------*/
// module.exports.createCategorCtrl = async (req, res) => {
//     try {
//         const {error} = validateCreateCategory(req.body)
//         if (error) {
//             return res.status(400).json({message: error.details[0].message})
//         }
//         const createCategor = await Categor.create({
//
//             title: req.body.title,
//             user: req.userToken.id
//
//         })
//         res.status(200).json(createCategor)
//
//     } catch (e) {
//         console.log(e)
//     }
// }
exports.createCategorCtrl = async (req, res) => {
    try {
        const { error } = validateCreateCategory(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const newCategory = new Category({
            title: req.body.title,
            user: req.userToken.id, // Assuming the user ID is stored in req.user
        });

        await newCategory.save();
        res.status(201).json(newCategory);
        console.log(req.userToken.id);
    } catch (e) {
        res.status(500).json({ message: 'Server error while creating category' });
        console.log(e)


    }
};
/**---------------------------------
 *@desc Get All  Categorise
 *@router /app/Categorise/
 * @method get
 --------------------------------*/
module.exports.getAllCategorise = async (req, res) => {
    try {
        const categor = await Category.find()
        res.status(200).json(categor)

    } catch (e) {
        console.log(e)
    }
}
/**---------------------------------
 *@desc Get All  Categorise
 *@router /app/Categorise/
 * @method get
 --------------------------------*/
module.exports.getCategoriseByIdCtrl = async (req, res) => {
    try {
        const categor = await Category.findById(req.params.id)
        if (!categor) {
            return res.status(404).json({message: "Not Found Categor"})
        }
        res.status(200).json(categor)

    } catch (e) {

    }
}
/**---------------------------------
 *@desc Get All  Categorise
 *@router /app/Categorise/
 * @method get
 --------------------------------*/
module.exports.deleteCategoriseCtrl = async (req, res) => {
    try {
        const getCategor = await Category.findById(req.params.id)
        if (!getCategor) {
            return res.status(404).json({message: "Not Found Categor"})
        }
        await Category.findByIdAndDelete(getCategor)
        res.status(200).json("Categor Deleting")

    } catch (e) {
        console.log(e)
    }
}