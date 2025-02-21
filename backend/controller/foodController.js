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
                author: req.body.author
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
        const food = await foodModel.findById(id);

        if (!food) {
            return res.status(404).json({ success: false, message: "Food recipe not found" });
        }

        // Format lại ingredients để hiển thị rõ ràng
        const formattedFood = {
            ...food._doc,
            ingredients: food.ingredients.flatMap(ingredient => ingredient.split(/\r\n|\n/).map(i => i.trim()).filter(i => i !== "")),
        };

        res.json({ success: true, data: formattedFood });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching food recipe" });
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


export { addFood, listFood, removeFood, getFoodDetail };
