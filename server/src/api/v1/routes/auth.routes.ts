import Router from "express";

import {
  loginHandler,
  logoutHandler,
  registerHandler,
  resetPasswordHandler,
} from "@/api/v1/controllers/auth.controller";
import { authenticate } from "@/middlewares/authenticate.middleware";

const authRouter = Router();

authRouter.post("/register", registerHandler);
authRouter.post("/login", loginHandler);
authRouter.post("/logout", authenticate, logoutHandler);
authRouter.post("/reset-password", authenticate, resetPasswordHandler);

export default authRouter;
