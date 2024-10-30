import express from 'express'
import authMiddleware from "../middleware/auth.js";
import { listOrders, placeOrder, updateStatus, userOrders, verifyOrder, createZalopayOrder, zaloPayCallbackHandler, zaloPaymentCheck } from "../controller/orderController.js";

const orderRouter = express.Router();

// orderRouter.post('/place', authMiddleware,placeOrder);
orderRouter.post('/place', authMiddleware, createZalopayOrder);
orderRouter.post('/zalo/callback', zaloPayCallbackHandler);
orderRouter.get('/zalo/payment-check', zaloPaymentCheck);
orderRouter.post('/verify', verifyOrder)
orderRouter.post("/userorders",authMiddleware,userOrders)
orderRouter.get("/list",listOrders)
orderRouter.post("/status",updateStatus )

export default orderRouter
