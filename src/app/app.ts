import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";

// append .env vars to envirement variables
dotenv.config({ path: "../../.env" });
