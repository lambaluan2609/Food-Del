import productModel from "../model/productModel.js";
import { getFirebaseStorage } from "../config/firebase.js";

// Thêm sản phẩm mới
const addProduct = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }

        const bucket = getFirebaseStorage();
        const fileName = `${new Date().getTime()}_${req.file.originalname}`;
        const blob = bucket.file(fileName);
        const blobStream = blob.createWriteStream({
            metadata: { contentType: req.file.mimetype },
        });

        blobStream.on("finish", async () => {
            await blob.makePublic();
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

            const product = new productModel({
                name: req.body.name,
                description: req.body.description,
                image: publicUrl,
                category: req.body.category,
                price: req.body.price,
                stock: req.body.stock,
                brand: req.body.brand,
                origin: req.body.origin,
                // weight: req.body.weight,
                // discount: req.body.discount,
                // ratings: req.body.ratings,
            });

            await product.save();
            res.json({ success: true, message: "Product Added Successfully" });
        });

        blobStream.end(req.file.buffer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error adding product" });
    }
};

// Lấy danh sách sản phẩm
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find();
        res.json({ success: true, data: products });
    } catch (error) {
        console.error("Error fetching products:", error.message);
        res.status(500).json({ success: false, message: "Error fetching products" });
    }
};

// Lấy chi tiết sản phẩm theo ID
const getProductDetail = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: "Invalid product ID" });
        }

        const product = await productModel.findById(id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.json({ success: true, data: product });
    } catch (error) {
        console.error("Error fetching product:", error.message);
        res.status(500).json({ success: false, message: "Error fetching product" });
    }
};

// Xóa sản phẩm
const removeProduct = async (req, res) => {
    try {
        const product = await productModel.findById(req.body.id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const fileName = product.image.split("/").pop();
        const bucket = getFirebaseStorage();
        const file = bucket.file(fileName);

        await file.delete();
        await productModel.findByIdAndDelete(req.body.id);

        res.json({ success: true, message: "Product Removed" });
    } catch (error) {
        console.error("Error removing product:", error);
        res.status(500).json({ success: false, message: "Error removing product" });
    }
};

// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;


        if (req.file) {
            const bucket = getFirebaseStorage();
            const fileName = `${new Date().getTime()}_${req.file.originalname}`;
            const blob = bucket.file(fileName);
            const blobStream = blob.createWriteStream({
                metadata: { contentType: req.file.mimetype },
            });

            await new Promise((resolve, reject) => {
                blobStream.on("finish", resolve);
                blobStream.on("error", reject);
                blobStream.end(req.file.buffer);
            });

            await blob.makePublic();
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            updatedData.image = publicUrl;
        }


        const product = await productModel.findByIdAndUpdate(id, updatedData, { new: true });



        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.json({ success: true, message: "Product Updated", data: product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error updating product" });
    }
};



export { addProduct, listProducts, removeProduct, getProductDetail, updateProduct };
