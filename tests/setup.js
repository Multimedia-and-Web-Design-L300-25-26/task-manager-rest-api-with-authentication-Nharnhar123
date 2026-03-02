import dotenv from "dotenv";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../src/app.js";
import connectDB from "../src/config/db.js";
import User from "../src/models/User.js";
import Task from "../src/models/Task.js";

// load any env variables (primarily not needed since we override MONGO_URI)
dotenv.config({ path: ".env.test" });

let mongoServer;

// connect to in‑memory database before tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongoServer.getUri();
  await connectDB();
  // start with clean collections
  await User.deleteMany();
  await Task.deleteMany();
});

// close connection and stop mongo server after all tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

export default app;