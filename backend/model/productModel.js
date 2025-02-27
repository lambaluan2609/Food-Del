import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },  // Tên sản phẩm
    description: { type: String, required: true },  // Mô tả sản phẩm
    image: { type: String, required: true },  // Ảnh sản phẩm
    category: { type: String, required: true },  // Danh mục sản phẩm (VD: "Nước giải khát", "Thực phẩm tươi sống")
    price: { type: Number, required: true },  // Giá sản phẩm
    stock: { type: Number, required: true, default: 0 },  // Số lượng tồn kho
    brand: { type: String, required: true },  // Thương hiệu sản phẩm
    origin: { type: String, required: false },  // Xuất xứ sản phẩm
    ingredients: { type: String, required: false },  // Thành phần sản phẩm
    usageInstructions: { type: String, required: false },  // Hướng dẫn sử dụng
    storageInstructions: { type: String, required: false },  // Hướng dẫn bảo quản
    // weight: { type: String, required: false },  // Khối lượng hoặc dung tích
    // discount: { type: Number, default: 0 },  // Giảm giá (%)
    // ratings: { type: Number, min: 0, max: 5, default: 0 },  // Đánh giá trung bình
    createdAt: { type: Date, default: Date.now },  // Thời gian thêm sản phẩm
});



const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
