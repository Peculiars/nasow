import mongoose, { type Document, Schema } from "mongoose"

export interface IQuizResult extends Document {
  quizId: mongoose.Types.ObjectId
  studentId: mongoose.Types.ObjectId
  score: number
  totalPoints: number
  answers: {
    questionId: mongoose.Types.ObjectId
    selectedAnswer: number
    isCorrect: boolean
  }[]
  timeTaken: number
  startedAt: Date
  completedAt: Date
  createdAt: Date
}

const quizResultSchema = new Schema<IQuizResult>(
  {
    quizId: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
      index: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
    },
    totalPoints: {
      type: Number,
      required: true,
    },
    answers: [
      {
        questionId: {
          type: Schema.Types.ObjectId,
          ref: "Question",
        },
        selectedAnswer: {
          type: Number,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          required: true,
        },
      },
    ],
    timeTaken: {
      type: Number,
      required: true,
    },
    startedAt: {
      type: Date,
      required: true,
    },
    completedAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

quizResultSchema.index({ quizId: 1, studentId: 1 })
quizResultSchema.index({ quizId: 1, score: -1 })

export const QuizResult = mongoose.models.QuizResult || mongoose.model<IQuizResult>("QuizResult", quizResultSchema)
