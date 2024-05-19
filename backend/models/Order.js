// models/Order.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
        products: [{
            name: String,
            quantity: Number,
            price: Number
        }],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        comments: [{
            name: String,
            numberPhone: Number,
            massage: String
        }],
        note: {
            type: String,
            default:"null"
        },
        status: {
            type: String,
            // enum: ['Pending', 'Processing', 'Shipped', 'Delivered'], // List of possible status values
            default: 'Pending' // Default status value
        },
        totalPrice: {
            type: Number,
            default:
                0
        }
        ,
        image: {
            type: Object,
            default:
                {
                    url: "",
                    publicId:
                        null
                }
        }
        ,
        createdAt: {
            type: Date,
            default:
            Date.now
        }
    })
;

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
