import express from "express"
import { addFood, listFood, removeFood } from "../controller/foodController.js"
import multer from "multer"

const foodRouter = express.Router()

// Image Storage Engine
const upload = multer({ storage: multer.memoryStorage() });

foodRouter.post("/add",upload.single("image"),addFood);
foodRouter.get("/list",listFood);
foodRouter.post("/remove", removeFood)



export default foodRouter
