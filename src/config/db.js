import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI is not defined in environment");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      // use the new url parser and unified topology by default in Mongoose 6+
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Database connection failed:", error.message || error);
    process.exit(1);
  }
};

export default connectDB;