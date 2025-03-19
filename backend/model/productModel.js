import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },  // Tên sản phẩm
    description: { type: String, required: true },  // Mô tả sản phẩm
    image: { type: String, required: true },  // Ảnh sản phẩm
    category: { type: String, required: true },  // Danh mục sản phẩm (VD: "Nước giải khát", "Thực phẩm tươi sống")
    originalPrice: { type: Number, required: true },  // Giá niêm yết
    price: { type: Number, default: 0 },  // Giá sản phẩm
    stock: { type: Number, required: true, default: 0 },  // Số lượng tồn kho
    brand: { type: String, required: true },  // Thương hiệu sản phẩm
    origin: { type: String, required: false },  // Xuất xứ sản phẩm
    ingredients: { type: String, required: false },  // Thành phần sản phẩm
    usageInstructions: { type: String, required: false },  // Hướng dẫn sử dụng
    storageInstructions: { type: String, required: false },  // Hướng dẫn bảo quản
    createdAt: { type: Date, default: Date.now },  // Thời gian thêm sản phẩm
});



const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
