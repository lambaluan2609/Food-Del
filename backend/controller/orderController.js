import orderModel from "../model/orderModel.js"
import userModel from "../model/userModel.js";
import Stripe from "stripe";
import axios from "axios";
import crypto from "crypto-js";
import moment from "moment"
import foodModel from "../model/foodModel.js";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const zlPayConfig = {
    app_id: process.env.ZALOPAY_APP_ID,
    key1: process.env.ZALOPAY_KEY1,
    key2: process.env.ZALOPAY_KEY2,
    endpoint: process.env.ZALOPAY_ENDPOINT
}


// placing user order for frontend // this is for stripe
const placeOrder = async (req, res) => {

    const frontend_url = process.env.FRONTEND_URL

    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "sgd",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 * 1.32
            },
            quantity: item.quantity
        }));


        line_items.push({
            price_data: {
                currency: "sgd",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: 2 * 100 * 1.32
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        })

        res.json({ success: true, session_url: session.url })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// placing user order for frontend // this is for zalo
const zaloPaymentCheck = async (req, res) => {
    try {
        console.log("zaloPaymentCheck", req.query.order_id);
        const orderId = req.query.order_id
        let result = false;
        if(orderId) {
            const orderInfo = await orderModel.findById(orderId);
            console.log('orderInfo', orderInfo)
            if(orderInfo.payment) {
                result = true;
            }
        }

        res.json({ success: result })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

const zaloPayCallbackHandler = async (req, res) => {
    try {
        console.log("zaloPayCallbackHandler", req.body);
        const data = JSON.parse(req.body.data)
        const embedData = JSON.parse(data.embed_data);
        await orderModel.findByIdAndUpdate(embedData.order._id, {payment: true})
        res.json({ success: true })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

const createZalopayOrder = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        })
        const savedOrder = await newOrder.save();
        console.log('savedOrder', savedOrder)
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        let amount = 0

        // ship
        amount += req.body.shipAmount || 0 * 25000;

        const items = req.body.items.map((item) => {
            amount += item.price * item.quantity * 25000;
            return {
                price_data: {
                    product_data: {
                        name: item.name
                    },
                    unit_amount: item.price
                },
                quantity: item.quantity
            }
        });

        const embed_data = {order: savedOrder};

        const transID = Math.floor(Math.random() * 1000000);
        const order = {
            app_id: zlPayConfig.app_id,
            app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
            app_user: req.body.userId,
            app_time: Date.now(), // miliseconds
            item: JSON.stringify(items),
            embed_data: JSON.stringify(embed_data),
            amount: amount,
            description: `Tomato - Payment for the order #${transID}`,
            bank_code: "zalopayapp",
            callback_url: process.env.ZALOPAY_CALLBACK_URL
        };

        const data = zlPayConfig.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
        order.mac = crypto.HmacSHA256(data, zlPayConfig.key1).toString();

        const response = await axios.post(zlPayConfig.endpoint, null, { params: order })
            .then(res => {
                console.log(res.data);
                return res.data;
            })
            .catch(err => console.log(err));

        res.json({ success: true, data: {...response, order_id: savedOrder._id} })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

const verifyOrder = async (req, res) => {
    const {orderId, success} = req.body
    try {
        if (success=="true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true })
            res.json({ success: true, message:"Paid" })
        }
        else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({ success: false, message:"Payment Failed" })
        }
    } catch (error) {
        console.log(error);
    }
}

//user orders for frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId, payment: true });
        res.json({ success: true, data:orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })      
    }
}

// Listing orders for admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({payment: true});
        res.json({ success: true, data:orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })       
    }
}

// api for updating order status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, data:"Status Updated", message:"Updated Status Successfully" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}


export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, createZalopayOrder, zaloPayCallbackHandler, zaloPaymentCheck }
