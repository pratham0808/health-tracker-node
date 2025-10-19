import mongoose, { Schema, Document } from 'mongoose';

export interface IExercise extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  category: 'arms' | 'core' | 'thighs' | 'back';
  createdAt: Date;
}

const ExerciseSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['arms', 'core', 'thighs', 'back']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IExercise>('Exercise', ExerciseSchema);

