import express from 'express';
import { uploadSingleImage } from '../middlewares/uploadMiddleware.js';
import { scanImage } from '../controllers/visionController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/scan', protect, uploadSingleImage, scanImage);

export default router;