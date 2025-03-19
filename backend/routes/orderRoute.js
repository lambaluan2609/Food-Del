import express from 'express'
import {createOrder, getDetailOrder} from '../controller/orderController.js'

const orderRoute = express.Router()

orderRoute.post('/place', createOrder)
orderRoute.get('/:id', getDetailOrder)

export default orderRoute
