import Router, { Request, Response } from "express";

import { deleteUserHandler, getAllUsersHandler, manageAccountStatusHandler } from "@/api/v1/controllers/admin.controller";
import { getUserProfileHandler } from "@/api/v1/controllers/user.controller";
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

adminRouter.get(
  "/manageuser/:userId",
  authenticate,
  checkRole("admin"),
  authorize("manage", "user"),
  manageAccountStatusHandler,
);

adminRouter.get(
  "/profile",
  authenticate,
  checkRole("admin"),
  getUserProfileHandler,
);

adminRouter.get(
  "/allusers",
  authenticate,
  checkRole("admin"),
  authorize("manage", "user"),
  getAllUsersHandler,
)

adminRouter.delete(
  "/deleteuser/:userId",
  authenticate,
  checkRole("admin"),
  authorize("manage", "user"),
  deleteUserHandler,
)

export default adminRouter;
