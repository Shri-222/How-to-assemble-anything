import express from 'express';
import cors from 'cors';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import visionRoutes from './routes/visionRoutes.js';
import projectRoutes from './routes/projectRoutes.js';

const app = express();

// --- Standard Middlewares ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Base Routes ---
app.get('/api', (req, res) => {
  res.status(200).json({ 
    message: 'Assemble-It API is active',
    version: '1.0.0' 
  });
});

app.use('/api/vision', visionRoutes);
app.use('/api/projects', projectRoutes);

// --- Error Handling ---
app.use(notFound);      // Catches 404s
app.use(errorHandler);  // Catches all thrown errors

export default app;