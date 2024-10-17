import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://lambaluan2609:11111@cluster0.iptid.mongodb.net/Food-Del').then(()=>console.log("DB Connected"));
}