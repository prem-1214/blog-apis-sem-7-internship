import { Request, Response, Router } from "express";

import { authController } from "@/api/v1/controllers/auth.controller";
import { userController } from "@/api/v1/controllers/user.controller";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { checkRole } from "@/middlewares/checkRole.middleware";

const userRouter = Router();
userRouter.use(authenticate, checkRole("user"));

userRouter.get("/home", (req: Request, res: Response) => {
  res.send({ message: `welcome ${req.user?.firstName}` });
});

userRouter.patch("/profile-update", authController.updateProfileHandler);

userRouter.get("/profile", userController.getUserProfileHandler);

export default userRouter;
