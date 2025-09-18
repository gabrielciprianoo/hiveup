import { Router } from "express";
import { TaskController } from "../controllers/TaskController";
import { checkProjectExists } from "../middleware/project";
import { param } from "express-validator";

const router: Router = Router();

router.post(
  "/project/:projectId",
  param('id').isMongoId().withMessage('ID no válido'),
  checkProjectExists,
  TaskController.createTask
);

router.get("/", TaskController.getAllTasks);

export default router;
