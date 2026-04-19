import express from "express";
import projectRoutes from '../src/routes/projectRoutes';
import taskRoutes from '../src/routes/taskRoutes';
import authRoutes from '../src/routes/authRoutes';

const app: express.Application = express();

app.use(express.json());
app.use('/api/projects', projectRoutes);
app.use('/api/projects/:projectId/tasks', taskRoutes);
app.use('/auth', authRoutes);

export default app;
