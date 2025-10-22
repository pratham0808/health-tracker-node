import mongoose, { Schema, Document } from 'mongoose';

export interface IExerciseItem {
  _id?: string;
  exerciseName: string;
  description: string;
}

export interface ICategoryGroup {
  _id?: string;
  categoryName: string;
  exercises: IExerciseItem[];
}

export interface IExerciseGroups extends Document {
  userId: mongoose.Types.ObjectId;
  categories: ICategoryGroup[];
  createdAt: Date;
  updatedAt: Date;
}

 const ExerciseItemSchema = new Schema({
   exerciseName: {
     type: String,
     required: true,
     trim: true
   },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  }
 }, { _id: true }); // Enable _id for each exercise

 const CategoryGroupSchema = new Schema({
   categoryName: {
     type: String,
     required: true,
     trim: true
   },
   exercises: {
     type: [ExerciseItemSchema],
     default: []
   }
 }, { _id: true }); // Enable _id for each category

const ExerciseGroupsSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  categories: {
    type: [CategoryGroupSchema],
    default: []
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

ExerciseGroupsSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IExerciseGroups>('ExerciseGroups', ExerciseGroupsSchema);


