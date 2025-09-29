import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { createProjectRules } from "../validators/project.validators";
import { param } from "express-validator";
import { checkProjectExists } from "../middleware/project";

 const router: Router = Router();

 router.get('/', ProjectController.getAllProjects);
 router.post('/', 
    createProjectRules,
    handleInputErrors,
    ProjectController.createProject
);

router.get('/:projectId',
    param('projectId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    ProjectController.getProjectById
);

router.put('/:projectId',
    param('projectId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    checkProjectExists,
    ProjectController.updateProject
);
router.delete('/:projectId',
    param('projectId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    checkProjectExists,
    ProjectController.deleteProject
);

 export default router;