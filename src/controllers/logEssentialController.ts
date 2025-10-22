import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { LogEssentialService } from '../services/logEssentialService';

const logEssentialService = new LogEssentialService();

export class LogEssentialController {
  async getLogEssential(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { date } = req.query;
      
      if (!date) {
        res.status(400).json({ error: 'Date parameter is required' });
        return;
      }

      const logEssential = await logEssentialService.getLogEssentialByDate(userId, date as string);
      res.json(logEssential);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch log essential' });
    }
  }

  async getAllLogEssentials(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const logEssentials = await logEssentialService.getAllLogEssentials(userId);
      res.json(logEssentials);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch log essentials' });
    }
  }

  async createOrUpdateLogEssential(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { 
        date, 
        waterIntake, 
        steps,
        caloriesConsumed,
        caloriesBurned,
        sleepHours,
        sleepQuality,
        weight,
        mood,
        energy,
        bodyFatPercentage,
        muscleMass,
        waistCircumference,
        supplements,
        habits
      } = req.body;
      
      if (!date) {
        res.status(400).json({ error: 'Date is required' });
        return;
      }

      const logEssential = await logEssentialService.createOrUpdateLogEssential(userId, {
        date,
        waterIntake,
        steps,
        caloriesConsumed,
        caloriesBurned,
        sleepHours,
        sleepQuality,
        weight,
        mood,
        energy,
        bodyFatPercentage,
        muscleMass,
        waistCircumference,
        supplements,
        habits
      });
      
      res.json(logEssential);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create/update log essential' });
    }
  }

  async deleteLogEssential(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      
      await logEssentialService.deleteLogEssential(userId, id);
      res.json({ message: 'Log essential deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete log essential' });
    }
  }
}
