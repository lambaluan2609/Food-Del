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
        const food = await foodModel.findByIdAndDelete(req.body.id);
        fs.unlinkSync(`uploads/${food.image}`,()=>{});
        
        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success: true, message: "Food Removed"})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"})
    }
}
    
export {addFood, listFood, removeFood}
