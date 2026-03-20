import express from 'express';
import { syncInventory } from '../controllers/sync.controller';

const router = express.Router();

// The main sync endpoint
router.post('/sync', syncInventory);

module.exports = router;