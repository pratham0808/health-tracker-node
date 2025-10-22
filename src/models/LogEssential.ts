import mongoose, { Schema, Document } from 'mongoose';

export interface ILogEssential extends Document {
  userId: string;
  date: Date;
  
  // Core Essentials (High Priority)
  waterIntake: number; // in liters
  steps: number;
  caloriesConsumed: number; // Daily calories eaten
  caloriesBurned: number; // Calories burned from exercise
  sleepHours: number; // Hours of sleep
  sleepQuality: number; // 1-5 rating
  weight: number; // Daily weight in kg
  mood: number; // 1-10 mood rating
  energy: number; // 1-10 energy level
  
  // Body Measurements (Medium Priority)
  bodyFatPercentage: number; // Body fat %
  muscleMass: number; // Muscle mass in kg
  waistCircumference: number; // Waist measurement in cm
  
  // Supplements & Habits (Medium Priority)
  supplements: {
    multivitamin: boolean;
    proteinPowder: number; // grams
    vitaminD: boolean;
    omega3: boolean;
    other: string; // custom supplements
  };
  
  habits: {
    meditation: number; // minutes
    reading: number; // minutes
    screenTime: number; // hours
    stressLevel: number; // 1-10 rating
  };
  
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
  
  // Core Essentials (High Priority)
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
  caloriesConsumed: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  caloriesBurned: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  sleepHours: {
    type: Number,
    required: true,
    min: 0,
    max: 24,
    default: 0
  },
  sleepQuality: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 3
  },
  weight: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  mood: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
    default: 5
  },
  energy: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
    default: 5
  },
  
  // Body Measurements (Medium Priority)
  bodyFatPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0
  },
  muscleMass: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  waistCircumference: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  
  // Supplements & Habits (Medium Priority)
  supplements: {
    multivitamin: {
      type: Boolean,
      default: false
    },
    proteinPowder: {
      type: Number,
      min: 0,
      default: 0
    },
    vitaminD: {
      type: Boolean,
      default: false
    },
    omega3: {
      type: Boolean,
      default: false
    },
    other: {
      type: String,
      default: ''
    }
  },
  
  habits: {
    meditation: {
      type: Number,
      min: 0,
      default: 0
    },
    reading: {
      type: Number,
      min: 0,
      default: 0
    },
    screenTime: {
      type: Number,
      min: 0,
      default: 0
    },
    stressLevel: {
      type: Number,
      min: 1,
      max: 10,
      default: 5
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

// Compound index for efficient queries
LogEssentialSchema.index({ userId: 1, date: 1 }, { unique: true });

// Update updatedAt before saving
LogEssentialSchema.pre<ILogEssential>('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<ILogEssential>('LogEssential', LogEssentialSchema);
