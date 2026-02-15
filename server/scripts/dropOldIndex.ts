import mongoose from "mongoose";

import { config } from "../src/config/config";
import { DB_NAME } from "../src/constants/index";

const dropOldIndex = async () => {
  await mongoose.connect(`${config.get("MONGODB_URI")}${DB_NAME}`);

  const db = mongoose.connection.db;
  if (!db) {
    console.log("Database connection not established");
    process.exit(1);
  }

  try {
    await db.collection("users").dropIndex("username_1");
    console.log("Old 'username_1' index dropped successfully!");
  } catch (err: unknown) {
    const error = err as Error;
    console.log("No index to drop or error:", error.message);
  }

  process.exit(0);
};

dropOldIndex();
