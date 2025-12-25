import { Request, Response, Router } from "express";

import { updateProfileHandler } from "@/api/v1/controllers/auth.controller";
import { getUserProfileHandler } from "@/api/v1/controllers/user.controller";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { checkRole } from "@/middlewares/checkRole.middleware.ts";

const userRouter = Router();

userRouter.get(
  "/home",
  authenticate,
  checkRole("user"),
  (req: Request, res: Response) => {
    res.send({ message: "welcome User" });
  },
);

userRouter.patch(
  "/profile-update",
  authenticate,
  checkRole("user"),
  updateProfileHandler,
);

userRouter.get(
  "/profile",
  authenticate,
  checkRole("user"),
  getUserProfileHandler,
);

export default userRouter;
