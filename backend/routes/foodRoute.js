import express from "express"
import { addFood, getFoodDetail, listFood, removeFood, updateFood } from "../controller/foodController.js"
import multer from "multer"

const foodRouter = express.Router()

// Image Storage Engine
const upload = multer({ storage: multer.memoryStorage() });

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.get("/detail/:id", getFoodDetail);
foodRouter.delete("/remove", removeFood);
foodRouter.put("/update/:id", upload.single("image"), updateFood);

export default foodRouter
