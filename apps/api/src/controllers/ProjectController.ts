import { json, type Request, type Response } from "express";
import Project from "../models/Project";

export class ProjectController {
  static getAllProjects = async (request: Request, response: Response) => {
    try {
      const projects = await Project.find({}).populate('tasks');
      response.json(projects);
    } catch (error) {
      /* istanbul ignore next */
      console.log(error);
    }
  };

  static createProject = async (request: Request, response: Response) => {
    const project = new Project(request.body);

    try {
      await project.save();
      response.send("Proyecto Creado Correctamente");
    } catch (error) {
      /* istanbul ignore next */
      console.log(error);
    }
  };

  static getProjectById = async (request: Request, response: Response) => {
    try {
      const { projectId } = request.params;

      const project = await Project.findById(projectId).populate('tasks');

      response.json(project);
    } catch (error) {
      /* istanbul ignore next */
      console.log(error);
    }
  };

  static updateProject = async (request: Request, response: Response) => {
    try {
      const project = request.project;
      await project.updateOne(request.body);
      await project.save();

      response.send("Proyecto actualizado correctamente");
    } catch (error) {
      /* istanbul ignore next */
      console.log(error);
    }
  };

  static deleteProject = async (request: Request, response: Response) => {
    try {
      const project = request.project;

      await project.deleteOne();

      response.send("Proyecto eliminado correctamente");
    } catch (error) {
      /* istanbul ignore next */
      console.log(error);
    }
  };
}
