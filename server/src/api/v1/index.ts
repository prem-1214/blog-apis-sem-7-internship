import Router from "express";

import adminRouter from "@/api/v1/routes/admin.routes";
import authrouter from "@/api/v1/routes/auth.routes";
import userRouter from "@/api/v1/routes/user.routes";
import blogRouter from "./routes/blog.routes";

const apiRouter = Router();

apiRouter.use("/auth", authrouter);
apiRouter.use("/admin", adminRouter);
apiRouter.use("/user", userRouter);
apiRouter.use("/blog", blogRouter)

export default apiRouter;
