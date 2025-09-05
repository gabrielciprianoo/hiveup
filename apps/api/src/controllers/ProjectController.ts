import type { Request, Response } from "express";
import Project from "../models/Project";


export class ProjectController { 

    static getAllProjects = async ( request : Request, response : Response)=> {
        response.send('all projects');
    }
    
    static createProject = async ( request : Request, response : Response)=> {
        const project = new Project(request.body);

        try {
            await project.save()
            response.send('Proyecto Creado Correctamente')
        } catch (error) {
            console.log(error)
        }
        
    }
}