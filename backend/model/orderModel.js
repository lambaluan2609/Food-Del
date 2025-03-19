import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    street: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    phone: {type: String, required: true},
    items:{type:Object, default:{}},
    cartAmount: {type: Number, default:0},
    cartTotal: {type: Number, default:0},
    deliveryFee: {type: Number, default:0},
    status: {type: String, default: "IN_PROGRESS"},
},{minimize:false})

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema)

export default orderModel;
