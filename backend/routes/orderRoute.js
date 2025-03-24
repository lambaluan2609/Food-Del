import express from 'express'
import { createOrder, getDetailOrder, listOrder, updateOrderStatus } from '../controller/orderController.js'

const orderRoute = express.Router()

orderRoute.post('/place', createOrder)
orderRoute.get('/:id', getDetailOrder)
orderRoute.get('/', listOrder)
orderRoute.put('/:id', updateOrderStatus)

export default orderRoute
