import mongoose, { Schema, Document } from 'mongoose';

export interface ILog extends Document {
  userId: mongoose.Types.ObjectId;
  exerciseId: mongoose.Types.ObjectId;
  exerciseName: string;
  category: 'arms' | 'core' | 'thighs' | 'back';
  date: Date;
  reps?: number;
  count?: number;
  createdAt: Date;
}

const LogSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exerciseId: {
    type: Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },
  exerciseName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['arms', 'core', 'thighs', 'back']
  },
  date: {
    type: Date,
    required: true
  },
  reps: {
    type: Number,
    default: 0
  },
  count: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<ILog>('Log', LogSchema);

