import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { LogService } from '../services/logService';

const logService = new LogService();

export class LogController {
  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { date, categoryId } = req.query;
      
      let logs;
      if (date && categoryId) {
        logs = await logService.getLogsByDateAndCategoryId(userId, date as string, categoryId as string);
      } else if (date) {
        logs = await logService.getLogsByDate(userId, date as string);
      } else {
        logs = await logService.getAllLogs(userId);
      }
      
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch logs' });
    }
  }

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { exerciseId, categoryId, exerciseName, category, date, reps, time, count } = req.body;
      
      if (!exerciseId || !categoryId || !exerciseName || !category || !date) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const log = await logService.createLog(userId, {
        exerciseId,
        categoryId,
        exerciseName,
        category,
        date,
        reps,
        count
      });
      
      res.status(201).json(log);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create log' });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      const { reps, count } = req.body;
      
      const log = await logService.updateLog(userId, id, { reps, count });
      
      if (!log) {
        res.status(404).json({ error: 'Log not found' });
        return;
      }
      
      res.json(log);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update log' });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      await logService.deleteLog(userId, id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete log' });
    }
  }
}

