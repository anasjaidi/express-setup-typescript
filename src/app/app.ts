import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import AppError from "./errors/AppError";
import homeRouter from "./components/home/home.router";
import authRouter from "./components/auth/auth.router";
import ErrorsGateway from "./errors/ErrorsGateway";
import appConfigs from "./conf/app.config";
import protectRoute from "./middlewares/auth.middleware";
import DiskMediaImages from "../media/disk/images/image.middleware";

// append .env vars to envirement variables
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

// select settings for choosen mode
const env = process.env.NODE_ENV || "development";
const {
	corsOption,
	name,
	app: { port, debug, logger_format },
} = appConfigs(env)!;

// create instance from express
const app = express();

// add some vars to express app
app.set("port", port);
app.set("debug", debug);
app.set("env", name);

// initialize middlewares
app.use(cors(corsOption));
app.use(helmet());
app.use(express.json());
app.use(morgan(process.env.MORGAN_MODE!));
// app.use(express.urlencoded({ extended: true }));
app.use(
	express.static(path.join(__dirname, "./public"), { dotfiles: "ignore" })
);

// init files uploader

// start resources
app.use("/api/v1", homeRouter);
app.post(
	"/api/v1/upload",
	protectRoute,
	// DiskMediaImages.single.singleMemoryImageUploadMiddleware,
	// DiskMediaImages.single.singleImageCroperMiddlewareFactory(500, 500, 80),
	// DiskMediaImages.single.addSingleDiskImageToLib,
	//////////////////////////////////////////////////
	DiskMediaImages.many.manyMemoryImageUploadMiddleware,
	DiskMediaImages.many.manyImagesCroperMiddlewareFactory(700, 700, 100),
	DiskMediaImages.many.addManyDiskImagesToLib,
	(req, res) => {
		res.json({ status: "success" });
	}
);
app.use("/api/v1/auth", authRouter);

// start deafult route
app.use("*", (req, res, next) => {
	next(new AppError(404, `Requested URL ${req.baseUrl} not found.`));
});

app.use(ErrorsGateway);

export default app;
