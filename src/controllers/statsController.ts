import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { StatsService } from '../services/statsService';

const statsService = new StatsService();

export const getStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { categoryId, days } = req.query;
    
    const daysNumber = days ? parseInt(days as string) : 7;

    const stats = await statsService.getEnhancedStats(
      userId,
      daysNumber,
      categoryId as string | undefined
    );
    
    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};

