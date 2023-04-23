import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import AppError from './errors/AppError'

// append .env vars to envirement variables
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

// select settings for choosen mode
const env = process.env.NODE_ENV || "development";

import appConfigs from "../conf/app.config";
import ErrorsGateway from './errors/ErrorsGateway';
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

// start deafult route
app.use("*", (req, res, next) => {
	next(new AppError(404, `Requested URL ${req.baseUrl} not found.`))
});

app.use(ErrorsGateway)

export default app;
