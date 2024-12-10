import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoURI =
  process.env.MONGO_URI ||
  "mongodb+srv://anaskazay:kazay-2011@cluster0.6jb7b.mongodb.net/BarberShop?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  console.log("Connecting to MongoDB...");
  console.log("mongoURI:", mongoURI);
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

export default connectDB;
