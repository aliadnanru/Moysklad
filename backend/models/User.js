const mongoose = require("mongoose");
//jwt
const jwt = require("jsonwebtoken")
//joi
const joi = require("joi");
//dotenv
require("dotenv")
// User Schema
const UserSchema = new mongoose.Schema({

        username: {
            type: String,
            required: true,
            trim: true,
            minLength: 2,
            maxLength: 100
        }, storeName: {
            type: String,
            required: true,
            trim: true,
            minLength: 2,
            maxLength: 100
        }, email: {
            type: String,
            required: true,
            trim: true,
            minLength: 5,
            maxLength: 100,
            unique: true
        }, password: {
            type: String,
            required: true,
            trim: true,
            minLength: 8
        },
        profilePhoto: {
            type: Object,
            default: {
                url: "https://as2.ftcdn.net/v2/jpg/03/31/69/91/1000_F_331699188_lRpvqxO5QRtwOM05gR50ImaaJgBx68vi.jpg",
                publicId: null
            }
        },
        bio: {
            type: String
        },
        bioVisibility: {
            type: Boolean
        },
        VacationmMode: {
            type: Boolean,
            default: false
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        isAcoountVerified: {
            type: Boolean,
            default: false
        }
    }, {
        timestamps: true,
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
)
// Populate Posts That Belongs To This User When he/she Get his/her Profile
UserSchema.virtual("products", {
    ref: "Product",
    foreignField: "user",
    localField: "_id",

})
UserSchema.virtual("categories", {
    ref: "Category",
    foreignField: "user",
    localField: "_id",

})
UserSchema.virtual("Orders", {
    ref: "Order",
    foreignField: "user",
    localField: "_id",

})
// Generate Auth Token
UserSchema.methods.generateAuthToken = function () {
    return jwt.sign({
        id: this._id,
        isAdmin: this.isAdmin,
    }, process.env.JWT_SECRET)
}
const User = mongoose.model("User", UserSchema);

//validate Register User
function validateRegisterUser(obj) {
    const schema = joi.object({
        username: joi.string().trim().min(2).max(100).required(),
        storeName: joi.string().trim().min(2).max(100).required(),
        email: joi.string().trim().min(5).max(100).required().email(),
        password: joi.string().trim().min(8).required()
    })
    return schema.validate(obj)
}

//validate Login User
function validateLoginUser(obj) {
    const schema = joi.object({
        email: joi.string().trim().min(5).max(100).required().email(),
        password: joi.string().trim().min(8).required()
    })
    return schema.validate(obj)
}

//validate Update User
function validateUpdateUser(obj) {
    const schema = joi.object({
        username: joi.string().trim().min(2).max(100),
        storeName: joi.string().trim().min(2).max(100),
        email: joi.string().trim().min(5).max(100).email(),
        password: joi.string().trim().min(8),
        bio: joi.string()
    })
    return schema.validate(obj)
}

module.exports = {
    User,
    validateRegisterUser,
    validateLoginUser,
    validateUpdateUser
}