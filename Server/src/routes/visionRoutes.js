import express from 'express';
import { uploadSingleImage } from '../middlewares/uploadMiddleware.js';
import { scanImage, getProjectInstructions } from '../controllers/visionController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/scan', protect, uploadSingleImage, scanImage);

router.post('/generate-instruction', protect, getProjectInstructions);

export default router;