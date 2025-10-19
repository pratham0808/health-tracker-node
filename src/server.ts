import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import authRoutes from './routes/authRoutes';
import exerciseRoutes from './routes/exerciseRoutes';
import logRoutes from './routes/logRoutes';
import statsRoutes from './routes/statsRoutes';
import { authMiddleware } from './middleware/authMiddleware';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/exercises', authMiddleware, exerciseRoutes);
app.use('/api/logs', authMiddleware, logRoutes);
app.use('/api/stats', authMiddleware, statsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Health Tracker API is running' });
});

const startServer = async () => {
  try {
    await connectDatabase();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

