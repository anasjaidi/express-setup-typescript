import express from "express";
import dotenv, { DotenvConfigOptions } from "dotenv";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import appConfig from "../config/app.config";
import { appConfigType } from "../config/app.types";

// append .env vars to envirement variables

const appDotenvOptions: DotenvConfigOptions = {
  path: '../../.env'
}

dotenv.config(appDotenvOptions);

// select settings for choosen mode
const env = process.env.NODE_ENV;

const {
	corsOption,
	name,
	app: { port, debug, logger_format },
}: appConfigType = appConfig(env)!;

// create instance from express
const app = express();
