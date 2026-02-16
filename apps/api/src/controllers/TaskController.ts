import { type Request, type Response } from "express";
import Task, { taskStatus } from "../models/Task";

export class TaskController {
  static getAllTasks = async (request: Request, response: Response) => {
    try {
      const projectId = request.project.id;
      const tasks = await Task.find({ project: projectId }).populate("project");
      response.json(tasks);
    } catch (error) {
      console.log(error);
    }
  };

  static createTask = async (request: Request, response: Response) => {
    try {
      const project = request.project;
      const task = new Task(request.body);
      task.project = project.id;
      project.tasks.push(task.id);
      await Promise.allSettled([task.save(), project.save()]);

      response.send("Tarea Creada Correctamente");
    } catch (error) {
      console.log(error);
    }
  };

  static getTaskById = async (request: Request, response: Response) => {
    const { taskId } = request.params;
    const task = await Task.findById(taskId);

    if (!task) {
      response.status(404).json({ error: "Tarea no encontrada" });
      return;
    }

    const projectId = request.project.id;

    if (projectId !== task.project.toString()) {
      response.status(400).json({ error: "Acción no válida" });
      return;
    }
    response.json(task);
  };

  static updateTaskById = async (request: Request, response: Response) => {
    const { taskId } = request.params;
    const task = await Task.findById(taskId);

    if (!task) {
      response.status(404).json({ error: "Tarea no encontrada" });
      return;
    }

    const projectId = request.project.id;

    if (projectId !== task.project.toString()) {
      response.status(400).json({ error: "Acción no válida" });
      return;
    }

     task.name = request.body.name;
     task.description = request.body.description;
     task.save();

    response.send("Tarea actualizada correctamente");
  };

  static deleteTaskById = async (request: Request, response: Response) => {
    const { taskId } = request.params;
    const task = await Task.findById(taskId);

    if (!task) {
      response.status(404).json({ error: "Tarea no encontrada" });
      return;
    }

    const projectId = request.project.id;

    if (projectId !== task.project.toString()) {
      response.status(400).json({ error: "Acción no válida" });
      return;
    }

    request.project.tasks = request.project.tasks.filter( task => task !== task._id)
  
    await Promise.allSettled([task.deleteOne(), request.project.save()])

    response.send("Tarea eliminada correctamente");
  };
}
