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

router.get(
  "/",
  param("projectId").isMongoId().withMessage("ID no válido"),
  checkProjectExists,
  handleInputErrors,
  TaskController.getAllTasks
);

router.get(
  "/:taskId",
  param("projectId").isMongoId().withMessage("ID no válido"),
  param("taskId").isMongoId().withMessage("ID no válido"),
  checkProjectExists,
  handleInputErrors,
  TaskController.getTaskById
);

router.put(
  "/:taskId",
  param("projectId").isMongoId().withMessage("ID no válido"),
  param("taskId").isMongoId().withMessage("ID no válido"),
  checkProjectExists,
  createTaskRules,
  handleInputErrors,
  TaskController.updateTaskById
);

router.delete(
  "/:taskId",
  param("projectId").isMongoId().withMessage("ID no válido"),
  param("taskId").isMongoId().withMessage("ID no válido"),
  checkProjectExists,
  handleInputErrors,
  TaskController.deleteTaskById
);

export default router;
