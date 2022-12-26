const { Order } = require('../models/Order')
const errorHandler = require('../utils/errorHandler')
const { OrderItem } = require('../models/OrderItem')
const { User } = require('../models/User')

exports.placeOrder = async (req, res) => {
    try {
        const orderItemsIds = Promise.all(req.body.orderItems.map(async orderItem => {
            let newOrderItem = new OrderItem({
                quantity: orderItem.quantity,
                product: orderItem.product
            })
            newOrderItem = await newOrderItem.save()
            return newOrderItem._id
        }))
        req.body.orderItems = await orderItemsIds

        const totalPrices = await Promise.all(
            req.body.orderItems.map(async (orderItemId) => {
                const orderItem = await OrderItem.findById(orderItemId).populate(
                    "product",
                    "price"
                );

                const totalPrice = orderItem.product.price * orderItem.quantity;

                return totalPrice;
            })
        );

        const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
        console.log(totalPrice)

        req.body.user = req.user._id
        req.body.totalPrice = totalPrice
        let order = new Order(req.body);
        order = await order.save();
        res.status(201).json({ success: true, order })
    } catch (error) {
        console.log(error)
        return errorHandler(res)
    }
}

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name').sort({ 'dateOrdered': 1 })
        res.status(200).json({ success: true, count: orders.length, orders })
    } catch (error) {
        console.log(error)
        return errorHandler(res)
    }
}

exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name').populate({ path: 'orderItems', populate: { path: 'product', populate: 'category' } })
        if (!order) { return errorHandler(res, "Order not found", 404) }
        // if (order.user.id !== req.user.id) {
        //     return errorHandler(res, "You cannot view other user's orders", 403)
        // }
        res.status(200).json({ success: true, order })
    } catch (error) {
        console.log(error)
        return errorHandler(res)
    }
}

exports.updateStatusOfOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
        if (!order) { return errorHandler(res, "Order not found", 404) }

        res.status(200).json({ success: true, message: "Order updated successfully", order })
    } catch (error) {
        console.log(error)
        return errorHandler(res)
    }
}

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndRemove(req.params.id)
        if (!order) { return errorHandler(res, "Order not found", 404) }

        //deleting all the orderitems linked with this order
        await order.orderItems.map(async (orderItem) => {
            let item = await OrderItem.findByIdAndRemove(orderItem);
        });

        res.status(200).json({ success: true, message: "Order deleted successfully" })
    } catch (error) {
        console.log(error)
        return errorHandler(res)
    }
}

exports.getTotalSales = async (req, res) => {
    try {
        const total = await Order.aggregate([
            { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } }
        ])
        if (!total) return errorHandler(res, "total sales can't be generated", 500)
        res.status(200).json({ success: true, totalSales: total })
    } catch (error) {
        console.log(error)
        return errorHandler(res)
    }
}

exports.getUserOrders = async (req, res) => {
    try {
        if (req.params.userId !== req.user.id) {
            return errorHandler(res, "You cannot view other user's orders", 403)
        }
        const orders = await Order.find({ user: req.params.userId }).populate({ path: 'orderItems', populate: { path: 'product', populate: 'category' } }).sort({ 'dateOrdered': -1 })
        res.status(200).json({ success: true, count: orders.length, orders })
    } catch (error) {
        console.log(error)
        return errorHandler(res)
    }
}
