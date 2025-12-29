import mongoose, { Schema, Document, Model } from 'mongoose';

export enum StudentType {
  FULL_TIME = 'FULL_TIME',
  ICE = 'ICE',
  BOTH = 'BOTH'
}

export enum CourseStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED'
}

export enum Level {
  L100 = '100',
  L200 = '200',
  L300 = '300',
  L400 = '400',
  L500 = '500'
}

interface ICourseMaterial {
  name: string;
  url: string;
  publicId: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
}

interface IWeek {
  weekNumber: number;
  title: string;
  content: string; 
  materials: ICourseMaterial[];
  order: number; 
  isPublished: boolean;
}

export interface ICourse extends Document {
  title: string;
  courseCode: string;
  level: Level;
  studentType: StudentType;
  lecturerName: string;
  coverImage: {
    url: string;
    publicId: string;
  };
  weeks: IWeek[];
  status: CourseStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}


const CourseMaterialSchema = new Schema<ICourseMaterial>({
  name: { type: String, required: true },
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

const WeekSchema = new Schema<IWeek>({
  weekNumber: { type: Number, required: true },
  title: { type: String, required: true },
  content: { type: String, default: '' },
  materials: { type: [CourseMaterialSchema], default: [] },
  order: { type: Number, required: true },
  isPublished: { type: Boolean, default: false }
});

const CourseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: [200, 'Course title cannot exceed 200 characters']
    },
    courseCode: {
      type: String,
      required: [true, 'Course code is required'],
      trim: true,
      uppercase: true,
      maxlength: [20, 'Course code cannot exceed 20 characters']
    },
    level: {
      type: String,
      enum: Object.values(Level),
      required: [true, 'Level is required']
    },
    studentType: {
      type: String,
      enum: Object.values(StudentType),
      required: [true, 'Student type is required']
    },
    lecturerName: {
      type: String,
      required: [true, 'Lecturer name is required'],
      trim: true,
      maxlength: [100, 'Lecturer name cannot exceed 100 characters']
    },
    coverImage: {
      url: { type: String, required: true },
      publicId: { type: String, required: true }
    },
    weeks: {
      type: [WeekSchema],
      default: []
    },
    status: {
      type: String,
      enum: Object.values(CourseStatus),
      default: CourseStatus.DRAFT
    },
    createdBy: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

CourseSchema.index({ level: 1, studentType: 1 });
CourseSchema.index({ status: 1 });
CourseSchema.index({ courseCode: 1 });
CourseSchema.index({ createdBy: 1 });

const Course: Model<ICourse> = 
  mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);

export default Course;