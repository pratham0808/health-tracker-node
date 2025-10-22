import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { ExerciseGroupsService } from '../services/exerciseGroupsService';

const service = new ExerciseGroupsService();

export class ExerciseGroupsController {
  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const doc = await service.getAll(userId);
      res.json(doc);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch exercise groups' });
    }
  }

  async getByUserId(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const doc = await service.getByUserId(userId);
      res.json(doc);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch exercise groups for user' });
    }
  }

  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const doc = await service.getById(id);
      if (!doc) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      res.json(doc);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch exercise group' });
    }
  }

  async upsert(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { categories } = req.body;
      if (!Array.isArray(categories)) {
        res.status(400).json({ error: 'categories must be an array' });
        return;
      }
      const updated = await service.upsert(userId, categories);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to upsert exercise groups' });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { id } = req.params;
      await service.deleteById(userId, id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete exercise groups' });
    }
  }
}


