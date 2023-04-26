import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import session from "express-session";
const MongoStore = require("connect-mongo");

// append .env vars to envirement variables
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

import AppError from "./errors/AppError";
import homeRouter from "./components/home/home.router";
import authRouter from "./components/auth/custom/jwt/auth.router";
import ErrorsGateway from "./errors/ErrorsGateway";
import appConfigs from "./conf/app.config";
import protectRoute from "./middlewares/auth.middleware";
import DiskMediaImages from "../media/disk/images/image.middleware";
import s3 from "../media/aws/aws.services";

// import mongoConnection from "../databases/mongo/connection/mongo.db";

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

/**
 * -------------- SESSION SETUP ----------------
 */

const sessionStore = new MongoStore({
	mongoUrl: "mongodb://localhost:27017/auth",
	// mongooseConnection: mongoConnection,
	collectionName: "sessions",
});



app.use(
	session({
		secret: "some secret keys",
		resave: false,
		saveUninitialized: true,
		store: sessionStore,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24, // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
		},
	})
);
s3; 
// start resources
app.use("/api/v1", homeRouter);
app.post(
	"/api/v1/upload",
	protectRoute,
	DiskMediaImages.single.singleMemoryImageUploadMiddleware,
	// DiskMediaImages.single.singleImageCroperMiddlewareFactory(500, 500, 80),
	// DiskMediaImages.single.addSingleDiskImageToLib,
	//////////////////////////////////////////////////
	// DiskMediaImages.many.manyMemoryImageUploadMiddleware,
	// DiskMediaImages.many.manyImagesCroperMiddlewareFactory(700, 700, 100),
	DiskMediaImages.single.addSingleDiskImageToLib,
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
