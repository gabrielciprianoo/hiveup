import { type Request, type Response } from "express";
import Task, { taskStatus } from "../models/Task";

export class TaskController {
  static getAllTasks = async (request: Request, response: Response) => {
    try {
      const projectId = request.project.id;
      const tasks = await Task.find({ project: projectId }).populate("project");
      response.json(tasks);
    } catch (error) {
      /* istanbul ignore next */
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
      /* istanbul ignore next */
      console.log(error);
    }
  };

  static getTaskById = async (request: Request, response: Response) => {
   
    response.json(request.task);
  };

  static updateTaskById = async (request: Request, response: Response) => {
   
     request.task.name = request.body.name;
     request.task.description = request.body.description;
     request.task.save();

    response.send("Tarea actualizada correctamente");
  };

  static deleteTaskById = async (request: Request, response: Response) => {
   

    request.project.tasks = request.project.tasks.filter(task => task!.toString() !== request.task.id)
  
    await Promise.allSettled([request.task.deleteOne(), request.project.save()])

    response.send("Tarea eliminada correctamente");
  };

  static updateStatusTaskById = async (request: Request, response: Response) => {
    const { status } = request.body;

    if (!Object.values(taskStatus).includes(status)) {
      response.status(400).json({ error: "Estado de tarea inválido" });
      return;
    }

    request.task.status = status as typeof taskStatus[keyof typeof taskStatus];
    
    await request.task.save();
    response.send("Estado de tarea actualizado correctamente");
  };
}
