import express from "express";
import dotenv from "dotenv";
import { conectDb } from "./config/db";

dotenv.config();

conectDb();

const app: express.Application = express();

export default app;