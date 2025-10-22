import ExerciseGroups, { IExerciseGroups, ICategoryGroup } from '../models/ExerciseGroups';

export class ExerciseGroupsService {
  async getAll(userId: string): Promise<IExerciseGroups | null> {
    return await ExerciseGroups.findOne({ userId });
  }

  async getByUserId(userId: string): Promise<IExerciseGroups | null> {
    return await ExerciseGroups.findOne({ userId });
  }

  async getById(id: string): Promise<IExerciseGroups | null> {
    return await ExerciseGroups.findById(id);
  }

  async upsert(userId: string, categories: ICategoryGroup[]): Promise<IExerciseGroups> {
    const doc = await ExerciseGroups.findOneAndUpdate(
      { userId },
      { $set: { categories } },
      { new: true, upsert: true }
    );
    return doc as IExerciseGroups;
  }

  async deleteById(userId: string, id: string): Promise<void> {
    await ExerciseGroups.findOneAndDelete({ _id: id, userId });
  }
}


