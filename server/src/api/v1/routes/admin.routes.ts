import Router, { Request, Response } from "express";

import { adminController } from "@/api/v1/controllers/admin.controller";
import { userController } from "@/api/v1/controllers/user.controller";
import { authenticate } from "@/middlewares/authenticate.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { checkRole } from "@/middlewares/checkRole.middleware";

const adminRouter = Router();

adminRouter.get(
  "/home",
  authenticate,
  checkRole("admin"),
  authorize("create", "blog"),
  (req: Request, res: Response) => {
    res.json({ message: "Hello admin...." });
  },
);

adminRouter.patch(
  "/manageuser/:userId",
  // authenticate,
  // checkRole("admin"),
  // authorize("manage", "user"),
  adminController.manageAccountStatusHandler,
);

adminRouter.get(
  "/profile",
  // authenticate,
  // checkRole("admin"),
  userController.getUserProfileHandler,
);

adminRouter.get(
  "/allusers",
  authenticate,
  // checkRole("admin"),
  // authorize("manage", "user"),
  adminController.getAllUsersHandler,
);

adminRouter.delete(
  "/deleteuser/:userId",
  authenticate,
  // checkRole("admin"),
  // authorize("manage", "user"),
  adminController.deleteUserHandler,
);

export default adminRouter;
