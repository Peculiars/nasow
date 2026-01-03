import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILecturer extends Document {
  name: string;
  title: string;
  specialization: string;
  qualifications: string;
  email: string;
  phone?: string;
  bio?: string;
  image: string;
  imagePublicId: string;
  courses: string[];
  researchInterests?: string[];
  publications?: string[];
  education?: {
    degree: string;
    institution: string;
    year: number;
  }[];
  officeLocation?: string;
  officeHours?: string;
  linkedIn?: string;
  googleScholar?: string;
  status: 'active' | 'inactive';
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const LecturerSchema = new Schema<ILecturer>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true,
    },
    qualifications: {
      type: String,
      required: [true, 'Qualifications are required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
    },
    imagePublicId: {
      type: String,
      required: [true, 'Image public ID is required'],
    },
    courses: [{
      type: String,
      trim: true,
    }],
    researchInterests: [{
      type: String,
      trim: true,
    }],
    publications: [{
      type: String,
      trim: true,
    }],
    education: [{
      degree: String,
      institution: String,
      year: Number,
    }],
    officeLocation: {
      type: String,
      trim: true,
    },
    officeHours: {
      type: String,
      trim: true,
    },
    linkedIn: {
      type: String,
      trim: true,
    },
    googleScholar: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

LecturerSchema.index({ name: 1, email: 1 });
LecturerSchema.index({ status: 1, order: 1 });

const Lecturer: Model<ILecturer> =
  mongoose.models.Lecturer || mongoose.model<ILecturer>('Lecturer', LecturerSchema);

export default Lecturer;