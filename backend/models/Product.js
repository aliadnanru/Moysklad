const mongoose = require("mongoose");
const joi = require("joi");
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        minLength: 4,
        maxLength: 200,
    },description: {
        type: String,
        default:"No description"
    },qt: {
        type: Number,
    },price: {
        type: Number,
        required: true,
    },PurchasingPrice: {
        type: Number,
    }, user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }, category: {
        type: String,
        required: true,
    }, image: {
        type: Object,
        default: {
            url: "",
            publicId: null
        }
    }


},{timestamps: true})
const Product = mongoose.model("Product", productSchema);
// Validate Create Post
function validateCreateProduct(obj){
    const schema = joi.object({
        name:joi.string().trim().min(4).max(200).required(),
        qt:joi.number(),
        price:joi.number().required(),
        description:joi.string(),
        PurchasingPrice:joi.number(),
        category:joi.string().trim().required(),
    })
    return schema.validate(obj)
}// Validate Update Post
function validateUpdateProduct(obj){
    const schema = joi.object({
        name:joi.string().trim().min(4).max(200),
        qt:joi.number(),
        price:joi.number(),
        description:joi.string(),
        PurchasingPrice:joi.number(),
        category:joi.string().trim(),
    })
    return schema.validate(obj)
}
module.exports = {
    Product,
    validateCreateProduct,
    validateUpdateProduct
}