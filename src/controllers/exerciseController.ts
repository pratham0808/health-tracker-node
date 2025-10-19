import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { ExerciseService } from '../services/exerciseService';

const exerciseService = new ExerciseService();

export class ExerciseController {
  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { category } = req.query;
      
      const exercises = category 
        ? await exerciseService.getExercisesByCategory(userId, category as string)
        : await exerciseService.getAllExercises(userId);
      
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch exercises' });
    }
  }

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { name, category } = req.body;
      
      if (!name || !category) {
        res.status(400).json({ error: 'Name and category are required' });
        return;
      }

      const exercise = await exerciseService.createExercise(userId, name, category);
      res.status(201).json(exercise);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create exercise' });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      await exerciseService.deleteExercise(userId, id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete exercise' });
    }
  }
}

