import express from "express";
import { addProduct, getProductDetail, listProducts, removeProduct, updateProduct } from "../controller/productController.js";
import multer from "multer";

const productRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

productRouter.post("/add", upload.single("image"), addProduct);
productRouter.get("/list", listProducts);
productRouter.get("/detail/:id", getProductDetail);
productRouter.delete("/remove", removeProduct);
productRouter.put("/update/:id", upload.single("image"), updateProduct);

export default productRouter;
