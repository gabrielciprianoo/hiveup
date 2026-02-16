import { Request, Response, NextFunction } from "express";
import Task, { ITask } from "../models/Task";

declare global {
  namespace Express {
    interface Request {
      task: ITask;
    }
  }
}

export async function checkTaskExists(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const { taskId } = request.params;

    const task = await Task.findById(taskId);

    if (!task) {
      const error = new Error("Tarea no encontrado");
      response.status(404).json({ error: error.message });
      return;
    }

    request.task = task;
    next();
  } catch (error) {
    response.status(500).json({ error: "Error del servidor" });
    return;
  }
}

export async function taskBelongsToProject(
  request: Request,
  response: Response,
  next: NextFunction,
) {
   const projectId = request.params.projectId;

  if (projectId !== request.task.project.toString()) {
    response.status(400).json({ error: "Acción no válida" });
    return;
  }

  next();
}
