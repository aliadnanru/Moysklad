// controllers/orderController.js

const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
    try {
        const {products, comments} = req.body;
        const order = await Order.create({
            products,
            comments,
            user: req.userToken.id,
            status: 'Pending',
            totalPrice: req.body.totalPrice

        });
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({error: error.message});
        console.log(error);
    }
};


// Get all orders
exports.getOrdersByID = async (req, res) => {
    try {
        const orders = await Order.find({user: req.params.userID});
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({error: 'Order not found'});
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};
// Get order by ID
exports.getOrderByStatusDone = async (req, res) => {
    const userId = req.params.userID; // استخراج معرّف المستخدم من الطلب
    try {
        const orders = await Order.find({ user: userId,status: "DONE" });
        if (!orders || orders.length === 0) { // التحقق من عدم فارغة القائمة
            return res.status(404).json({ error: 'Orders not found for this user' });
        }
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Get order by Pending
exports.getOrderByStatusPending = async (req, res) => {
    const userId = req.params.userID; // استخراج معرّف المستخدم من الطلب
    try {
        const orders = await Order.find({ user: userId,status: "Pending" });
        if (!orders || orders.length === 0) { // التحقق من عدم فارغة القائمة
            return res.status(404).json({ error: 'Orders not found for this user' });
        }
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, {
            $set: {status: req.body.status},
        }, {new: true});
        if (!order) {
            return res.status(404).json({error: 'Order not found'});
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};
// Add Note
exports.addNoteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.orderID, {
            $set: {note: req.body.note},
        }, {new: true});
        if (!order) {
            return res.status(404).json({error: 'Order not found note'});
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

// Delete order
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({error: 'Order not found'});
        }
        res.status(200).json({message: 'Order deleted successfully'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};
// Delete order item
exports.deleteOrderItem = async (req, res) => {
    try {
        const { orderId, itemId } = req.params;

        // العثور على الطلب بواسطة معرف الطلب
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // تصفية المنتج المحدد من قائمة المنتجات
        order.products = order.products.filter(product => product._id.toString() !== itemId);

        // حفظ التغييرات
        await order.save();

        res.status(200).json({ message: 'Product deleted successfully', order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};