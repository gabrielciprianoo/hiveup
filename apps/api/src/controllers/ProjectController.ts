import { json, type Request, type Response } from "express";
import Project from "../models/Project";


export class ProjectController { 

    static getAllProjects = async ( request : Request, response : Response)=> {
        try {
            const projects = await Project.find({});
            response.json(projects);
        } catch (error) {
            console.log(error)
        }
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

    static getProjectById = async ( request : Request, response : Response)=> {
        try {
            
            const project = request.project;

            response.json(project);

        } catch (error) {
            console.log(error)
        }
    }

    static updateProject = async ( request : Request, response : Response)=> {
        try {
            const project = request.project;
            await project.updateOne(request.body);

            if(!project){
                const error = new Error('Proyecto no encontrado');
                response.status(404).json({ error: error.message });
                return;
            }

            await project.save()

            response.send('Proyecto actualizado correctamente');

        } catch (error) {
            console.log(error)
        }
    }

    static deleteProject = async ( request : Request, response : Response)=> {
        try {
            const project = request.project;

           await project.deleteOne();

            response.send('Proyecto eliminado correctamente');

        } catch (error) {
            console.log(error)
        }
    }
}