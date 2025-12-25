import mongoose from "mongoose";

import { config } from "@/config/config";
import { DB_NAME } from "@/constants/index";

export const connectDb = async () => {
  await mongoose.connect(`${config.get("MONGODB_URI")}${DB_NAME}`);
};
