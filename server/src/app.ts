import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, urlencoded } from "express";
import helmet from "helmet";

import apiRouter from "@/api/v1/index";
import { globalErrorHandler } from "@/middlewares/globalErrorHandler.middleware";
import { limitter } from "@/middlewares/rateLimitter";
import { requestLogger } from "@/middlewares/requestLogger";

const app: Application = express();

// middleware
app.use(helmet());
app.use(cors());
app.use(limitter);

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);
app.use(compression());

// route
app.use("/api/v1", apiRouter);

// globalErrorHandler
app.use(globalErrorHandler);

export default app;
