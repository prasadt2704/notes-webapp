import mongoose from "mongoose";

let isConnected = false;

export async function connect() {
  if (isConnected) {
    return;
  }

  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) {
    throw new Error("MONGO_URL is not defined");
  }

  try {
    const database = await mongoose.connect(mongoUrl);
    isConnected = database.connections[0]?.readyState === 1;

    if (!isConnected) {
      throw new Error("MongoDB connection was not established");
    }
  } catch (error) {
    isConnected = false;
    throw error;
  }
}