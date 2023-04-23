import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import appConfigs from "../conf/app.config";

// append .env vars to envirement variables
dotenv.config({ path: "../../.env" });

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