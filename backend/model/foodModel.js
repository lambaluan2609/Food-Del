import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    ingredients: [{ type: String, required: true }], // Danh sách nguyên liệu
    steps: [{ type: String, required: true }], // Các bước nấu ăn
    cookingTime: { type: Number, required: true }, // Thời gian nấu (phút)
    servings: { type: Number, required: true }, // Số khẩu phần ăn
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true }, // Mức độ khó
    author: { type: String, required: true }, // Tên tác giả hoặc nguồn công thức
    ratings: { type: Number, min: 0, max: 5, default: 0 }, // Đánh giá trung bình
    createdAt: { type: Date, default: Date.now }, // Thời gian tạo công thức
});

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;
