import Log, { ILog } from '../models/Log';

export class LogService {
  async getAllLogs(userId: string): Promise<ILog[]> {
    return await Log.find({ userId }).sort({ date: -1, createdAt: -1 });
  }

  async getLogsByDate(userId: string, date: string): Promise<ILog[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await Log.find({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ createdAt: -1 });
  }

  async getLogsByDateAndCategory(userId: string, date: string, category: string): Promise<ILog[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await Log.find({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
      category
    }).sort({ createdAt: -1 });
  }

  async getLogsByDateAndCategoryId(userId: string, date: string, categoryId: string): Promise<ILog[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await Log.find({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
      categoryId
    }).sort({ createdAt: -1 });
  }

  async createLog(userId: string, logData: {
    exerciseId: string;
    categoryId: string;
    exerciseName: string;
    category: string;
    date: string;
    reps?: number;
    count?: number;
  }): Promise<ILog> {
    const log = new Log({
      userId,
      ...logData,
      date: new Date(logData.date)
    });
    return await log.save();
  }

  async updateLog(userId: string, id: string, logData: {
    reps?: number;
    count?: number;
  }): Promise<ILog | null> {
    return await Log.findOneAndUpdate(
      { _id: id, userId },
      { $set: logData },
      { new: true }
    );
  }

  async deleteLog(userId: string, id: string): Promise<void> {
    await Log.findOneAndDelete({ _id: id, userId });
  }
}

