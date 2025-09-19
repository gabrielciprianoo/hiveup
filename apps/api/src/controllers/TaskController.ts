import { type Request, type Response } from "express";
import Task, { taskStatus } from "../models/Task";

export class TaskController {
  static getAllTasks = async (request: Request, response: Response) => {
    response.send("get all tasks");
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
}
