import express from 'express';
import { getMyBuilds } from '../controllers/buildController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/my-matches', protect, getMyBuilds);

export default router;