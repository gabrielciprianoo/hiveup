import { Router } from "express";
import { TaskController } from "../controllers/TaskController";
import { checkProjectExists } from "../middleware/project";
import { param } from "express-validator";
import { createTaskRules } from "../validators/task.validators";
import { handleInputErrors } from "../middleware/validation";

const router: Router = Router({ mergeParams: true });

router.post(
  "/",
  param("projectId").isMongoId().withMessage("ID no válido"),
  handleInputErrors,
  checkProjectExists,
  createTaskRules,
  handleInputErrors,
  TaskController.createTask
);

router.get("/", TaskController.getAllTasks);

export default router;
