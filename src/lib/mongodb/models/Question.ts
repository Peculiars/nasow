import mongoose, { type Document, Schema } from "mongoose"

export interface IQuestion extends Document {
  quizId: mongoose.Types.ObjectId
  questionText: string
  options: string[]
  correctAnswer: number
  difficulty: "easy" | "medium" | "hard"
  explanation?: string
  order: number
  createdAt: Date
  updatedAt: Date
}

const questionSchema = new Schema<IQuestion>(
  {
    quizId: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
      index: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    options: [
      {
        type: String,
        required: true,
      },
    ],
    correctAnswer: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    explanation: {
      type: String,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export const Question = mongoose.models.Question || mongoose.model<IQuestion>("Question", questionSchema)
