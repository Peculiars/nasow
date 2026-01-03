import mongoose, { Schema, Document } from 'mongoose';

export interface IFlashcard extends Document {
  category: string;
  question: string;
  answer: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  level: '100L' | '200L' | '300L' | '400L' | '500L' | 'General';
  keyPoints: string[];
  relatedTopics: string[];
  explanation: string;
  tags: string[];
  semester?: '1st' | '2nd' | 'Both';
  courseCode?: string;
  isActive: boolean;
  viewCount: number;
  masteredCount: number;
  reviewCount: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const FlashcardSchema = new Schema<IFlashcard>(
  {
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      maxlength: [100, 'Category cannot exceed 100 characters']
    },
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
      minlength: [10, 'Question must be at least 10 characters'],
      maxlength: [500, 'Question cannot exceed 500 characters']
    },
    answer: {
      type: String,
      required: [true, 'Answer is required'],
      trim: true,
      minlength: [10, 'Answer must be at least 10 characters'],
      maxlength: [1000, 'Answer cannot exceed 1000 characters']
    },
    difficulty: {
      type: String,
      enum: {
        values: ['Easy', 'Medium', 'Hard'],
        message: '{VALUE} is not a valid difficulty level'
      },
      required: [true, 'Difficulty level is required'],
      default: 'Medium'
    },
    level: {
      type: String,
      enum: {
        values: ['100L', '200L', '300L', '400L', '500L', 'General'],
        message: '{VALUE} is not a valid level'
      },
      required: [true, 'Level is required']
    },
    keyPoints: {
      type: [String],
      validate: {
        validator: function(v: string[]) {
          return v.length >= 2 && v.length <= 5;
        },
        message: 'Key points must be between 2 and 5 items'
      },
      required: [true, 'At least 2 key points are required']
    },
    relatedTopics: {
      type: [String],
      validate: {
        validator: function(v: string[]) {
          return v.length >= 1 && v.length <= 5;
        },
        message: 'Related topics must be between 1 and 5 items'
      },
      required: [true, 'At least 1 related topic is required']
    },
    explanation: {
      type: String,
      required: [true, 'Explanation is required'],
      trim: true,
      minlength: [20, 'Explanation must be at least 20 characters'],
      maxlength: [500, 'Explanation cannot exceed 500 characters']
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function(v: string[]) {
          return v.length <= 10;
        },
        message: 'Cannot have more than 10 tags'
      }
    },
    semester: {
      type: String,
      enum: ['1st', '2nd', 'Both'],
      default: 'Both'
    },
    courseCode: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: [20, 'Course code cannot exceed 20 characters']
    },
    isActive: {
      type: Boolean,
      default: true
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0
    },
    masteredCount: {
      type: Number,
      default: 0,
      min: 0
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0
    },
    createdBy: {
      type: String,
      required: [true, 'Creator ID is required']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

FlashcardSchema.index({ level: 1, isActive: 1 });
FlashcardSchema.index({ difficulty: 1, isActive: 1 });
FlashcardSchema.index({ category: 1, isActive: 1 });
FlashcardSchema.index({ tags: 1 });
FlashcardSchema.index({ semester: 1 });
FlashcardSchema.index({ createdAt: -1 });

FlashcardSchema.virtual('successRate').get(function() {
  const total = this.masteredCount + this.reviewCount;
  if (total === 0) return 0;
  return Math.round((this.masteredCount / total) * 100);
});

FlashcardSchema.virtual('popularityScore').get(function() {
  return this.viewCount + (this.masteredCount * 2) - (this.reviewCount * 0.5);
});

export default mongoose.models.Flashcard || mongoose.model<IFlashcard>('Flashcard', FlashcardSchema);