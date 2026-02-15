import Router from "express";

import { authController } from "@/api/v1/controllers/auth.controller";
import { authenticate } from "@/middlewares/authenticate.middleware";

const authRouter = Router();

authRouter.post("/register", authController.registerHandler);
authRouter.post("/login", authController.loginHandler);
authRouter.post("/logout", authenticate, authController.logoutHandler);
authRouter.post(
  "/reset-password",
  authenticate,
  authController.resetPasswordHandler,
);

export default authRouter;
