import orderModel from "../model/orderModel.js";
import productModel from "../model/productModel.js";

const createOrder = async (req, res) => {
    const {orderInfo, items, deliveryFee, cartAmount} = req.body;
    try {
        const newOrder = new orderModel({
            firstName: orderInfo.firstName,
            lastName: orderInfo.lastName,
            email: orderInfo.email,
            street: orderInfo.street,
            city: orderInfo.city,
            state: orderInfo.state,
            zipcode: orderInfo.zipcode,
            country: orderInfo.country,
            phone: orderInfo.phone,
            items,
            deliveryFee,
            cartAmount,
            cartTotal: cartAmount + deliveryFee
        })
        const savedOrder = await newOrder.save();
        return res.json({
            success: true,
            orderId: savedOrder.id
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Error"})
    }
}

const getDetailOrder = async (req, res) => {
    const {id} = req.params
    try {
        const order = await orderModel.findById(id)
        if (!order) return res.status(404).json({success: false, message: "Order not found"})
        const listProductId = order.items.map(item => item._id)
        const products = await productModel.find({_id: {$in: listProductId}});
        return res.status(200).json({
            success: true,
            data: [
                {
                    _id: order.id,
                    cartAmount: order.cartAmount,
                    cartTotal: order.cartTotal,
                    deliveryFee: order.deliveryFee,
                    items: order.items,
                    products: products,
                    status: order.status,
                }
            ]
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Error"})
    }
}

export {createOrder, getDetailOrder}
