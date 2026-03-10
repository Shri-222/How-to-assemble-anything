import express from 'express';
import cors from 'cors';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

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

// Import and use modular routes here
// import partRoutes from './routes/partRoutes.js';
// app.use('/api/parts', partRoutes);

// --- Error Handling ---
app.use(notFound);      // Catches 404s
app.use(errorHandler);  // Catches all thrown errors

export default app;