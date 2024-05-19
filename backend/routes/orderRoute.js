const express = require('express');
const router = express.Router();
const {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder, getOrdersByID, getOrderByStatus, getOrderByStatusPending, getOrderByStatusDone, addNoteOrder,
    deleteOrderItem
} = require('../controllers/orderControllers');
const {verifyToken} = require("../middlewares/verifyToken");

// Create a new order
router.post('/orders/', verifyToken,createOrder);

// getOrdersByID
router.get('/orders/:userID', getOrdersByID);
// add Note Order
router.put('/addnote/:orderID', addNoteOrder);
// Get all orders
router.get('/orders/', getAllOrders);

// Get order by ID
router.get('/orders/:id', getOrderById);
// Get order by ID
router.get('/status/done/:userID', getOrderByStatusDone);
// Get order by Pending
router.get('/status/pending/:userID', getOrderByStatusPending);

// Update order status
router.put('/orders/:id', updateOrderStatus);

// Delete order
router.delete('/orders/:id', deleteOrder);
router.delete('/:orderId/items/:itemId', deleteOrderItem);

module.exports = router;
