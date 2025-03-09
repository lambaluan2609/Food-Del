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

            let { price, originalPrice } = req.body;

            // Nếu không nhập giá khuyến mãi, gán bằng giá niêm yết
            if (!price) {
                price = originalPrice;
            }


            const product = new productModel({
                name: req.body.name,
                description: req.body.description,
                image: publicUrl,
                category: req.body.category,
                originalPrice: req.body.originalPrice,
                price: req.body.price,
                stock: req.body.stock,
                brand: req.body.brand,
                origin: req.body.origin,
                ingredients: req.body.ingredients,
                usageInstructions: req.body.usageInstructions,
                storageInstructions: req.body.storageInstructions,
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
        let { page = 1, limit = 10 } = req.query;

        page = Math.max(parseInt(page), 1);
        limit = Math.max(parseInt(limit), 1);

        const total = await productModel.countDocuments();
        const products = await productModel
            .find()
            .skip((page - 1) * limit)
            .limit(limit);

        const formattedProducts = products.map(product => ({
            ...product._doc,
            description: product.description ? product.description.split(/\r\n|\n/).map(line => line.trim()).filter(line => line !== "") : [],
            ingredients: product.ingredients ? product.ingredients.split(/\r\n|\n/).map(i => i.trim()).filter(i => i !== "") : [],
            usageInstructions: product.usageInstructions ? product.usageInstructions.split(/\r\n|\n/).map(i => i.trim()).filter(i => i !== "") : [],
            storageInstructions: product.storageInstructions ? product.storageInstructions.split(/\r\n|\n/).map(i => i.trim()).filter(i => i !== "") : []
        }));

        res.json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            data: formattedProducts
        });
    } catch (error) {
        console.error("Error fetching products:", error.message);
        res.status(500).json({ success: false, message: "Error fetching products" });
    }
};


// 🔥 Lấy chi tiết sản phẩm theo ID có format chuẩn
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

        // 🔥 Format dữ liệu trước khi trả về
        const formattedProduct = {
            ...product._doc,

            description: product.description
                ? product.description.split(/\r\n|\n/).map(line => line.trim()).filter(line => line !== "")
                : [],

            ingredients: product.ingredients
                ? product.ingredients.split(/\r\n|\n/).map(i => i.trim()).filter(i => i !== "")
                : [],

            usageInstructions: product.usageInstructions
                ? product.usageInstructions.split(/\r\n|\n/).map(i => i.trim()).filter(i => i !== "")
                : [],

            storageInstructions: product.storageInstructions
                ? product.storageInstructions.split(/\r\n|\n/).map(i => i.trim()).filter(i => i !== "")
                : []
        };

        res.json({ success: true, data: formattedProduct });
    } catch (error) {
        console.error("Error fetching product:", error.message);
        res.status(500).json({ success: false, message: "Error fetching product" });
    }
};


// Xóa sản phẩm
const removeProduct = async (req, res) => {
    const { id } = req.params;
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
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: "Invalid product ID" });
        }

        const updatedData = req.body;
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // 🔥 Nếu có ảnh mới -> Upload lên Firebase & Xóa ảnh cũ
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

            // 🔥 Xóa ảnh cũ
            const oldFileName = product.image.split("/").pop();
            const oldFile = bucket.file(oldFileName);
            await oldFile.delete().catch(() => console.log("Old image not found in storage"));

            updatedData.image = publicUrl;
        }

        const updatedProduct = await productModel.findByIdAndUpdate(id, updatedData, { new: true });

        res.json({ success: true, message: "Product Updated", data: updatedProduct });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error updating product" });
    }
};




export { addProduct, listProducts, removeProduct, getProductDetail, updateProduct };
