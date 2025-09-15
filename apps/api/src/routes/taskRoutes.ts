import { Router } from "express";
import { TaskController } from "../controllers/TaskController";

const router : Router = Router();

router.post('/project/:projectId', TaskController.createTask );

router.get('/',TaskController.getAllTasks );

export default router;