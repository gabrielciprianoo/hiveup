import express from "express";
import dotenv from "dotenv";
import { conectDb } from "./config/db";
import projectRoutes from './routes/projectRoutes';

dotenv.config();

conectDb();


const app: express.Application = express();

app.use(express.json());
app.use('/api/projects',  projectRoutes);

export default app;