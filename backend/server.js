import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import productRouter from "./routes/productRoute.js"
import 'dotenv/config'
import orderRoute from "./routes/orderRoute.js";

//app config
const app = express()
const port = process.env.PORT || 4000

//middlewares
app.use(express.json())
app.use(cors())

//db connection
connectDB();

//api endpoints
app.use("/api/food", foodRouter)
app.use("/images", express.static("uploads"))
app.use("/api/user", userRouter)
app.use("/api/product", productRouter)
app.use("/api/order", orderRoute)

app.get("/", (req, res) => {
    res.status(200).send("API WORKING")
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})



