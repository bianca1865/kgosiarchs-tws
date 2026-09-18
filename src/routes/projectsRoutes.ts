import { Router } from 'express';
import upload from '../middleware/upload';
import {
    getAllProjects,
    getProjectBySlug,
    createProject,
    uploadProjectImage
} from '../controllers/projectsController';

const router = Router();

router.get('/', getAllProjects);
router.get('/:slug', getProjectBySlug);
router.post('/', createProject);
router.post('/:projectId/images', upload.single('image'), uploadProjectImage);

export default router;
