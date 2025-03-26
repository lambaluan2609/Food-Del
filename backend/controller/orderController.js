import orderModel from "../model/orderModel.js";
import productModel from "../model/productModel.js";

const createOrder = async (req, res) => {
    const { orderInfo, items, deliveryFee, cartAmount } = req.body;
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
        res.status(500).json({ success: false, message: "Error" })
    }
}

const getDetailOrder = async (req, res) => {
    const { id } = req.params
    try {
        const order = await orderModel.findById(id)
        if (!order) return res.status(404).json({ success: false, message: "Order not found" })
        const listProductId = order.items.map(item => item._id)
        const products = await productModel.find({ _id: { $in: listProductId } });
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
                    createdAt: order.createdAt,
                    customer: {
                        firstName: order.firstName,
                        lastName: order.lastName,
                        email: order.email,
                        phone: order.phone,
                        address: `${order.street}, ${order.city}, ${order.state}`,
                    },
                }
            ]
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error" })
    }
}

const listOrder = async (req, res) => {
    try {
        const orders = await orderModel
            .find({})
            .select("firstName lastName email phone cartTotal status createdAt");

        const totalItems = orders.length; // Đếm số lượng từ kết quả trả về

        res.json({
            success: true,
            totalItems,
            data: orders,
        });
    } catch (error) {
        console.error("Error fetching orders:", error.message);
        res.status(500).json({ success: false, message: "Error fetching orders" });
    }
};
// Cập nhật trạng thái đơn hàng
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['IN_PROGRESS', 'SHIPPED', 'DELIVERED', 'CANCELLED'].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const order = await orderModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.json({
            success: true,
            message: "Order status updated",
            data: {
                ...order._doc,
                createdAt: order.createdAt, // Đảm bảo trả về createdAt
            },
        });
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ success: false, message: "Error updating order" });
    }
};

export { createOrder, getDetailOrder, listOrder, updateOrderStatus };
