import LogEssential, { ILogEssential } from '../models/LogEssential';

export class LogEssentialService {
  async getLogEssentialByDate(userId: string, date: string): Promise<ILogEssential | null> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await LogEssential.findOne({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });
  }

  async getAllLogEssentials(userId: string): Promise<ILogEssential[]> {
    return await LogEssential.find({ userId }).sort({ date: -1 });
  }

  async createOrUpdateLogEssential(userId: string, logData: {
    date: string;
    waterIntake?: number;
    steps?: number;
  }): Promise<ILogEssential> {
    const startOfDay = new Date(logData.date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(logData.date);
    endOfDay.setHours(23, 59, 59, 999);

    const updateData: any = {
      userId,
      date: startOfDay,
      updatedAt: new Date()
    };

    if (logData.waterIntake !== undefined) {
      updateData.waterIntake = logData.waterIntake;
    }

    if (logData.steps !== undefined) {
      updateData.steps = logData.steps;
    }

    return await LogEssential.findOneAndUpdate(
      {
        userId,
        date: { $gte: startOfDay, $lte: endOfDay }
      },
      updateData,
      { 
        upsert: true, 
        new: true, 
        runValidators: true 
      }
    );
  }

  async deleteLogEssential(userId: string, id: string): Promise<void> {
    await LogEssential.findOneAndDelete({ _id: id, userId });
  }
}
