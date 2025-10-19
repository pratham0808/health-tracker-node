import Exercise, { IExercise } from '../models/Exercise';

export class ExerciseService {
  async getAllExercises(userId: string): Promise<IExercise[]> {
    return await Exercise.find({ userId }).sort({ createdAt: -1 });
  }

  async getExercisesByCategory(userId: string, category: string): Promise<IExercise[]> {
    return await Exercise.find({ userId, category }).sort({ createdAt: -1 });
  }

  async createExercise(userId: string, name: string, category: string): Promise<IExercise> {
    const exercise = new Exercise({ userId, name, category });
    return await exercise.save();
  }

  async deleteExercise(userId: string, id: string): Promise<void> {
    await Exercise.findOneAndDelete({ _id: id, userId });
  }
}

