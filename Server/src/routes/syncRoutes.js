import express from 'express';
import { syncInventory } from '../controllers/syncController.js';

const router = express.Router();

// The main sync endpoint
router.post('/sync', syncInventory);

export default router;