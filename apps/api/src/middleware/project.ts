import { Request, Response, NextFunction } from "express";
import Project, { IProject } from "../models/Project";

declare global {
  namespace Express {
    interface Request {
        project: IProject;
    }
  }
}

export async function checkProjectExists(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { projectId } = request.params;

    const project = await Project.findById(projectId);

    if (!project) {
      const error = new Error("Proyecto no encontrado");
      response.status(404).json({ error: error.message });
      return;
    }

    request.project = project;
    next();
  } catch (error) {
    response.status(500).json({ error: "Error del servidor" });
    return;
  }
}
