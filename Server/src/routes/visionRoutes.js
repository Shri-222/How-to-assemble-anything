import express from 'express';
import { uploadSingleImage } from '../middlewares/uploadMiddleware.js';
import { scanImage, getProjectInstructions } from '../controllers/visionController.js';
import { protect } from '../middlewares/authMiddleware.js';
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per window
  message: {
    message: "Too many requests from this IP, please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = express.Router();

router.post('/scan', apiLimiter, protect, uploadSingleImage, scanImage);

router.post('/generate-instruction', apiLimiter, protect, getProjectInstructions);

export default router;