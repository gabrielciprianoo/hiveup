import { type Request, type Response } from "express";
import Project from "../models/Project";
import Task, { taskStatus } from "../models/Task";

export class TaskController {
  static getAllTasks = async (request: Request, response: Response) => {
    response.send("get all tasks");
  };

  static createTask = async (request: Request, response: Response) => {

    const { projectId } = request.params;

    const project = await Project.findById(projectId);

    console.log(project)

    if (!project) {
      const error = new Error("Proyecto no encontrado");
      response.status(404).json({ error: error.message });
      return;
    }

    try {
      const task = new Task(request.body);
      task.project = project.id;
      project.tasks.push(task.id);
      await task.save();
      await project.save();

      response.send("Tarea Creada Correctamente");
    } catch (error) {
      console.log(error);
    }
  };
}
