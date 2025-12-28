import { UserDocument } from "@/types/user.types";

declare global {
  namespace Express {
    interface Request {
      user: UserDocument;
    }
  }
}
