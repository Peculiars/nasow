import mongoose, { Document, Schema } from 'mongoose';

export enum StudentStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  BANNED = 'banned'
}

export enum StudentLevel {
  LEVEL_100 = '100L',
  LEVEL_200 = '200L',
  LEVEL_300 = '300L',
  LEVEL_400 = '400L',
  LEVEL_500 = '500L'
}

export enum StudentType {
  FULL_TIME = 'Full-time',
  ICE = 'ICE'
}

export interface IStudent extends Document {
  kindeId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profileImage?: string;
  level?: StudentLevel;
  studentType?: StudentType;
  profileCompleted: boolean;
  status: StudentStatus;
  totalScore: number;
  quizzesTaken: number;
  registrationDate: Date;
  lastActive?: Date;
  suspensionReason?: string;
  suspendedBy?: string;
  suspendedAt?: Date;
  banReason?: string;
  bannedBy?: string;
  bannedAt?: Date;
  updatedBy?: string;
  updatedAt: Date;
  createdAt: Date;
}

const studentSchema = new Schema<IStudent>(
  {
    kindeId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    phoneNumber: {
      type: String,
      trim: true
    },
    profileImage: {
      type: String
    },
    level: {
      type: String,
      enum: Object.values(StudentLevel)
    },
    studentType: {
      type: String,
      enum: Object.values(StudentType)
    },
    profileCompleted: {
      type: Boolean,
      default: false,
      index: true
    },
    status: {
      type: String,
      enum: Object.values(StudentStatus),
      default: StudentStatus.ACTIVE,
      index: true
    },
    totalScore: {
      type: Number,
      default: 0,
      min: 0
    },
    quizzesTaken: {
      type: Number,
      default: 0,
      min: 0
    },
    registrationDate: {
      type: Date,
      default: Date.now,
      index: true
    },
    lastActive: {
      type: Date
    },
    suspensionReason: {
      type: String
    },
    suspendedBy: {
      type: String
    },
    suspendedAt: {
      type: Date
    },
    banReason: {
      type: String
    },
    bannedBy: {
      type: String
    },
    bannedAt: {
      type: Date
    },
    updatedBy: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

studentSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });

studentSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

studentSchema.virtual('averageScore').get(function() {
  return this.quizzesTaken > 0 ? Math.round(this.totalScore / this.quizzesTaken) : 0;
});

export const Student = mongoose.models.Student || mongoose.model<IStudent>('Student', studentSchema);