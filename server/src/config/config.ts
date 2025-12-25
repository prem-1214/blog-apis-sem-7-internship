import { config as conf } from "dotenv";
import ms from "ms";

conf();

const _config: { [key: string]: string } = {
  PORT: process.env.PORT as string,
  NODE_ENV: process.env.NODE_ENV as string,
  MONGODB_URI: process.env.MONGODB_URI as string,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as ms.StringValue,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY as ms.StringValue,
  REDIS_URL: process.env.REDIS_URL as string,
};

export const config = {
  get(key: string): string {
    const value = _config[key];

    if (!value) {
      console.log(`${key} not found, please provide valid key.`);
      process.exit();
    }

    return value;
  },
};
