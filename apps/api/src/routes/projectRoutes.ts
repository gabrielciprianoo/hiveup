import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { createProjectRules } from "../validators/project.validators";
import { param } from "express-validator";

 const router: Router = Router();

 router.get('/', ProjectController.getAllProjects);
 router.post('/', 
    createProjectRules,
    handleInputErrors,
    ProjectController.createProject
);

router.get('/:id',
    param('id').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    ProjectController.getProjectById
);

router.put('/:id',
    param('id').isMongoId().withMessage('ID no válido'),
    createProjectRules,
    handleInputErrors,
    ProjectController.updateProject
);
router.delete('/:id',
    param('id').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    ProjectController.deleteProject
);

 export default router;