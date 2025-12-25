import { Request, Response, Router } from "express";

import { updateProfileHandler } from "@/api/v1/controllers/auth.controller";
import { getUserProfileHandler } from "@/api/v1/controllers/user.controller";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { checkRole } from "@/middlewares/checkRole.middleware.ts";

const userRouter = Router();
userRouter.use(authenticate, checkRole("user"));

userRouter.get(
  "/home",
  (req: Request, res: Response) => {
    res.send({ message: `welcome ${req.user?.firstName}` });
  },
);

userRouter.patch(
  "/profile-update",
  updateProfileHandler,
);

userRouter.get(
  "/profile",
  getUserProfileHandler,
);

export default userRouter;
