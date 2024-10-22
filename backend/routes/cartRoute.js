import express from 'express'
import { addToCart, getCart, removeFromCart } from '../controller/cartController.js'

const cartRouter = express.Router();

cartRouter.post('/add', addToCart)
cartRouter.post('/get', getCart)
cartRouter.post('/remove', removeFromCart)

export default cartRouter