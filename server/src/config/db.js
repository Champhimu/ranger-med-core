import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    if (uri === "memory") {
      console.log("Starting in-memory MongoDB...");
      const mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
    }

    await mongoose.connect(uri);
    console.log("MongoDB connected to", uri === process.env.MONGO_URI ? "external cluster" : "in-memory database");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectDB;
