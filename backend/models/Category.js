const mongoose = require("mongoose");
const joi = require("joi");
const CategorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Adding a reference to the User model if you have one
        required: true
    }, title: {
        type: String,
        required: true
    }
},{timestamps:true})

const Category = mongoose.model("Category",CategorySchema);
// validate Create Category
function validateCreateCategory(obj){
    const schema = joi.object({
        title:joi.string().trim().required().label("Title")
    })
    return schema.validate(obj)
}
module.exports={
    Category,
    validateCreateCategory
}