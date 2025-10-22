import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  // Profile fields
  weight?: number;
  height?: number;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  fitnessLevel?: 'beginner' | 'intermediate' | 'advanced';
  goals?: string[];
  // Essential goals
  waterGoal?: number; // liters per day
  stepsGoal?: number; // steps per day
  calorieGoal?: number; // calories per day
  sleepGoal?: number; // hours per day
  weightGoal?: number; // target weight in kg
  bodyFatGoal?: number; // target body fat percentage
  muscleMassGoal?: number; // target muscle mass in kg
  waistGoal?: number; // target waist circumference in cm
  meditationGoal?: number; // minutes per day
  readingGoal?: number; // minutes per day
  screenTimeGoal?: number; // hours per day (max)
  
  // Tracking preferences - what user wants to track (required)
  trackingPreferences: {
    waterIntake: boolean;
    steps: boolean;
    calories: boolean;
    sleep: boolean;
    weight: boolean;
    mood: boolean;
    energy: boolean;
    bodyMeasurements: boolean;
    supplements: boolean;
    habits: boolean;
  };
  
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema({
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  // Profile fields
  weight: {
    type: Number,
    min: 0
  },
  height: {
    type: Number,
    min: 0
  },
  age: {
    type: Number,
    min: 0,
    max: 150
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  fitnessLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  goals: [{
    type: String
  }],
  // Essential goals
  waterGoal: {
    type: Number,
    min: 0,
    default: 3
  },
  stepsGoal: {
    type: Number,
    min: 0,
    default: 10000
  },
  calorieGoal: {
    type: Number,
    min: 0,
    default: 2000
  },
  sleepGoal: {
    type: Number,
    min: 0,
    max: 24,
    default: 8
  },
  weightGoal: {
    type: Number,
    min: 0,
    default: 70
  },
  bodyFatGoal: {
    type: Number,
    min: 0,
    max: 100,
    default: 15
  },
  muscleMassGoal: {
    type: Number,
    min: 0,
    default: 30
  },
  waistGoal: {
    type: Number,
    min: 0,
    default: 80
  },
  meditationGoal: {
    type: Number,
    min: 0,
    default: 10
  },
  readingGoal: {
    type: Number,
    min: 0,
    default: 30
  },
  screenTimeGoal: {
    type: Number,
    min: 0,
    default: 8
  },
  
  // Tracking preferences (required)
  trackingPreferences: {
    waterIntake: {
      type: Boolean,
      required: true,
      default: true
    },
    steps: {
      type: Boolean,
      required: true,
      default: true
    },
    calories: {
      type: Boolean,
      required: true,
      default: false
    },
    sleep: {
      type: Boolean,
      required: true,
      default: false
    },
    weight: {
      type: Boolean,
      required: true,
      default: false
    },
    mood: {
      type: Boolean,
      required: true,
      default: false
    },
    energy: {
      type: Boolean,
      required: true,
      default: false
    },
    bodyMeasurements: {
      type: Boolean,
      required: true,
      default: false
    },
    supplements: {
      type: Boolean,
      required: true,
      default: false
    },
    habits: {
      type: Boolean,
      required: true,
      default: false
    }
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

UserSchema.pre<IUser>('save', async function(next) {
  // Update updatedAt field
  this.updatedAt = new Date();
  
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

UserSchema.methods.comparePassword = async function(this: IUser, candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);

