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
    caloriesConsumed?: number;
    caloriesBurned?: number;
    sleepHours?: number;
    sleepQuality?: number;
    weight?: number;
    mood?: number;
    energy?: number;
    bodyFatPercentage?: number;
    muscleMass?: number;
    waistCircumference?: number;
    supplements?: {
      multivitamin?: boolean;
      proteinPowder?: number;
      vitaminD?: boolean;
      omega3?: boolean;
      other?: string;
    };
    habits?: {
      meditation?: number;
      reading?: number;
      screenTime?: number;
      stressLevel?: number;
    };
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

    // Core Essentials
    if (logData.waterIntake !== undefined) updateData.waterIntake = logData.waterIntake;
    if (logData.steps !== undefined) updateData.steps = logData.steps;
    if (logData.caloriesConsumed !== undefined) updateData.caloriesConsumed = logData.caloriesConsumed;
    if (logData.caloriesBurned !== undefined) updateData.caloriesBurned = logData.caloriesBurned;
    if (logData.sleepHours !== undefined) updateData.sleepHours = logData.sleepHours;
    if (logData.sleepQuality !== undefined) updateData.sleepQuality = logData.sleepQuality;
    if (logData.weight !== undefined) updateData.weight = logData.weight;
    if (logData.mood !== undefined) updateData.mood = logData.mood;
    if (logData.energy !== undefined) updateData.energy = logData.energy;

    // Body Measurements
    if (logData.bodyFatPercentage !== undefined) updateData.bodyFatPercentage = logData.bodyFatPercentage;
    if (logData.muscleMass !== undefined) updateData.muscleMass = logData.muscleMass;
    if (logData.waistCircumference !== undefined) updateData.waistCircumference = logData.waistCircumference;

    // Supplements & Habits
    if (logData.supplements) {
      if (logData.supplements.multivitamin !== undefined) updateData['supplements.multivitamin'] = logData.supplements.multivitamin;
      if (logData.supplements.proteinPowder !== undefined) updateData['supplements.proteinPowder'] = logData.supplements.proteinPowder;
      if (logData.supplements.vitaminD !== undefined) updateData['supplements.vitaminD'] = logData.supplements.vitaminD;
      if (logData.supplements.omega3 !== undefined) updateData['supplements.omega3'] = logData.supplements.omega3;
      if (logData.supplements.other !== undefined) updateData['supplements.other'] = logData.supplements.other;
    }

    if (logData.habits) {
      if (logData.habits.meditation !== undefined) updateData['habits.meditation'] = logData.habits.meditation;
      if (logData.habits.reading !== undefined) updateData['habits.reading'] = logData.habits.reading;
      if (logData.habits.screenTime !== undefined) updateData['habits.screenTime'] = logData.habits.screenTime;
      if (logData.habits.stressLevel !== undefined) updateData['habits.stressLevel'] = logData.habits.stressLevel;
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
