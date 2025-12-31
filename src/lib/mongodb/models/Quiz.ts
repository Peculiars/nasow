import mongoose, { type Document, Schema } from "mongoose"
import { StudentLevel, StudentType } from "./Student"

export interface IQuizTarget {
  levels: StudentLevel[]
  types: StudentType[]
  isGeneral: boolean
}

export interface IQuiz extends Document {
  title: string
  description: string
  target: IQuizTarget
  duration: number
  totalQuestions: number
  passingScore: number
  isActive: boolean
  createdBy: string
  createdAt: Date
  updatedAt: Date
  startDate?: Date
  endDate?: Date
}

const quizSchema = new Schema<IQuiz>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    target: {
      levels: [
        {
          type: String,
          enum: Object.values(StudentLevel),
        },
      ],
      types: [
        {
          type: String,
          enum: Object.values(StudentType),
        },
      ],
      isGeneral: {
        type: Boolean,
        default: false,
      },
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
    },
    passingScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

export const Quiz = mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", quizSchema)
