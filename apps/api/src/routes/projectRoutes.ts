import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { createProjectRules } from "../validators/project.validators";

 const router: Router = Router();

 router.get('/', ProjectController.getAllProjects);
 router.post('/', 
    createProjectRules,
    handleInputErrors,
    ProjectController.createProject
);

 export default router;