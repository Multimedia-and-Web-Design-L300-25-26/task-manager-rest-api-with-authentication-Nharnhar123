import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

dotenv.config();

// validate required env vars
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET must be set in .env");
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});