import express from "express";
import dotenv from "dotenv";
import { conectDb } from "./config/db";
import projectRoutes from "./routes/projectRoutes";
import taskToutes from "./routes/taskRoutes";
import authRoutes from "./routes/authRoutes";
import cors from "cors";
import morgan from "morgan";
import { corsConfig } from "./config/cors";

dotenv.config();

conectDb();

const app: express.Application = express();

app.use(cors(corsConfig));
app.use(morgan('dev'));
app.use(express.json());
app.use("/api/projects", projectRoutes);
app.use("/api/projects/:projectId/tasks", taskToutes);
app.use("/api/auth", authRoutes);

export default app;
