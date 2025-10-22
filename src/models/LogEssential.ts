import mongoose, { Schema, Document } from 'mongoose';

export interface ILogEssential extends Document {
  userId: string;
  date: Date;
  waterIntake: number; // in liters
  steps: number;
  createdAt: Date;
  updatedAt: Date;
}

const LogEssentialSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  waterIntake: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  steps: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient queries
LogEssentialSchema.index({ userId: 1, date: 1 }, { unique: true });

// Update updatedAt before saving
LogEssentialSchema.pre<ILogEssential>('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<ILogEssential>('LogEssential', LogEssentialSchema);
