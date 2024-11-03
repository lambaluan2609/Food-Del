import foodModel from "../model/foodModel.js";
import fs from "fs";
import {getFirebaseStorage} from "../config/firebase.js"

//add food item

const addFood = async (req, res) => {

    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }

        const bucket = getFirebaseStorage("food-del");
        const blob = bucket.file(`${new Date().getTime()}_${req.file.originalname}`);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: req.file.mimetype,
            },
        });

        blobStream.on("error", (err) => {
            console.error(err);
            res.status(500).send("Unable to upload at the moment.");
        });

        blobStream.on("finish", async () => {
            // Make the file public
            await blob.makePublic();
            // Get the public URL
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            const food = new foodModel({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                category: req.body.category,
                image: publicUrl
            })

            await food.save();
            res.json({success: true, message: "Food Added"})
        });

        blobStream.end(req.file.buffer);

    } catch (err) {
        console.error(err)
    }

    // let image_filename = `${req.file.filename}`
    //
    // const food = new foodModel({
    //     name: req.body.name,
    //     description: req.body.description,
    //     price: req.body.price,
    //     category: req.body.category,
    //     image: image_filename
    // })
    // try {
    //     await food.save();
    //     res.json({success: true, message: "Food Added"})
    // } catch (error) {
    //     console.log(error);
    //     res.json({success: false, message: "Food Not Added"})
    // }
}

// all food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find();
        res.json({success: true, data:foods})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"})
    }
}

// remove food item

const removeFood = async (req, res) => {
    try {
        // Find the food item by ID
        const food = await foodModel.findById(req.body.id);

        if (!food) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }

        // Extract the file name from the Firebase URL
        const fileName = food.image.split("/").pop();
        const bucket = getFirebaseStorage("food-del");
        const file = bucket.file(fileName);

        // Delete the file from Firebase Storage
        await file.delete();

        // Delete the food item from the database
        await foodModel.findByIdAndDelete(req.body.id);

        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error" });
    }
};

    
export {addFood, listFood, removeFood}
