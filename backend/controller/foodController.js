import foodModel from "../model/foodModel.js";
import { getFirebaseStorage } from "../config/firebase.js";

// Add food recipe
const addFood = async (req, res) => {
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

            // **Tách các bước nấu ăn thành từng phần tử**
            const formattedSteps = req.body.steps.split("\r\n").filter(step => step.trim() !== "");

            const food = new foodModel({
                name: req.body.name,
                description: req.body.description,
                image: publicUrl,
                fileName,
                category: req.body.category,
                ingredients: req.body.ingredients,
                steps: formattedSteps,  // 🔥 Lưu danh sách đã format
                cookingTime: req.body.cookingTime,
                servings: req.body.servings,
                difficulty: req.body.difficulty,
                author: req.body.author,
                youtubeUrl: req.body.youtubeUrl,
            });

            await food.save();
            res.json({ success: true, message: "Food Recipe Added" });
        });

        blobStream.end(req.file.buffer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error adding food recipe" });
    }
};


// List all food recipes
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find();

        // Format lại ingredients & steps trước khi trả về
        const formattedFoods = foods.map(food => ({
            ...food._doc,
            ingredients: food.ingredients.flatMap(ingredient => ingredient.split(/\r\n|\n/).map(i => i.trim()).filter(i => i !== "")),
            steps: food.steps.flatMap(step => step.split(/\r\n|\n/).map(s => s.trim()).filter(s => s !== "")),
        }));

        res.json({ success: true, data: formattedFoods });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error fetching food recipes" });
    }
};


const getFoodDetail = async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra ID có hợp lệ hay không
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: "Invalid food ID" });
        }

        const food = await foodModel.findById(id);

        if (!food) {
            return res.status(404).json({ success: false, message: "Food recipe not found" });
        }

        // Kiểm tra ingredients có phải là mảng không trước khi format
        const formattedFood = {
            ...food._doc,
            ingredients: Array.isArray(food.ingredients)
                ? food.ingredients
                    .flatMap(ingredient => 
                        ingredient
                            .split(/\r\n|\n/)
                            .map(i => i.trim())
                            .filter(i => i !== "")
                    )
                : [],
        };

        return res.json({ success: true, data: formattedFood });

    } catch (error) {
        console.error("Error fetching food recipe:", error.message);
        return res.status(500).json({ success: false, message: "Error fetching food recipe" });
    }
};


// Remove food recipe
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);

        if (!food) {
            return res.status(404).json({ success: false, message: "Food recipe not found" });
        }

        console.log("Food Image URL:", food.image);

        if (!food.image) {
            return res.status(400).json({ success: false, message: "Food image URL is missing" });
        }

        const fileName = food.image.split("/").pop();
        if (!fileName) {
            return res.status(400).json({ success: false, message: "Invalid image URL" });
        }

        const bucket = getFirebaseStorage("food-del");
        const file = bucket.file(fileName);

        await file.delete();
        await foodModel.findByIdAndDelete(req.body.id);

        res.json({ success: true, message: "Food Recipe Removed" });
    } catch (error) {
        console.error("Error removing food:", error);
        res.status(500).json({ success: false, message: "Error removing food recipe", error: error.message });
    }
};

const updateFood = async (req, res) => {
    try {
        const { id } = req.params;  // Lấy ID từ tham số URL
        const updatedData = req.body;  // Lấy dữ liệu mới từ req.body

        // Kiểm tra xem có file hình ảnh không (nếu cần update hình ảnh)
        if (req.file) {
            const bucket = getFirebaseStorage();
            const fileName = `${new Date().getTime()}_${req.file.originalname}`;
            const blob = bucket.file(fileName);
            const blobStream = blob.createWriteStream({
                metadata: { contentType: req.file.mimetype },
            });

            // Khi tải hình ảnh lên thành công, cập nhật URL hình ảnh
            await new Promise((resolve, reject) => {
                blobStream.on("finish", resolve);
                blobStream.on("error", reject);
                blobStream.end(req.file.buffer);
            });

            await blob.makePublic();
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            updatedData.image = publicUrl;  // Cập nhật hình ảnh
            updatedData.fileName = fileName;  // Cập nhật tên file
        }

        // **Tách các bước nấu ăn thành từng phần tử nếu có** (nếu không thay đổi cấu trúc, có thể bỏ qua)
        if (updatedData.steps) {
            updatedData.steps = updatedData.steps.split("\r\n").filter(step => step.trim() !== "");
        }

        // **Cập nhật youtubeUrl** nếu có trong req.body
        if (updatedData.youtubeUrl) {
            updatedData.youtubeUrl = updatedData.youtubeUrl.trim();
        }

        // Cập nhật công thức nấu ăn theo ID
        const food = await foodModel.findByIdAndUpdate(id, updatedData, { new: true });

        if (!food) {
            return res.status(404).json({ success: false, message: "Food recipe not found" });
        }

        res.json({ success: true, message: "Food Recipe Updated", data: food });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error updating food recipe" });
    }
};


export { addFood, listFood, removeFood, getFoodDetail, updateFood };
