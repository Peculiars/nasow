import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface INewsEvent extends Document {
  title: string
  slug: string
  category: "News" | "Campaign" | "Social" | "Workshop" | "Seminar" | "Competition"
  type: "news" | "event"
  description: string
  content: string
  date: Date
  time?: string
  endDate?: Date
  location?: string
  image: {
    url: string
    publicId: string
  }
  gallery?: Array<{
    url: string
    publicId: string
  }>
  attendees?: number
  maxAttendees?: number
  registrationLink?: string
  registrationDeadline?: Date
  featured: boolean
  published: boolean
  tags: string[]
  organizer: {
    name: string
    contact?: string
  }
  createdBy: string
  views: number
  likes: number
  createdAt: Date
  updatedAt: Date
}

const NewsEventSchema = new Schema<INewsEvent>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["News", "Campaign", "Social", "Workshop", "Seminar", "Competition"],
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: ["news", "event"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    time: {
      type: String,
      trim: true,
    },
    endDate: {
      type: Date,
    },
    location: {
      type: String,
      trim: true,
    },
    image: {
      url: {
        type: String,
        required: [true, "Image URL is required"],
      },
      publicId: {
        type: String,
        required: [true, "Image public ID is required"],
      },
    },
    gallery: [
      {
        url: String,
        publicId: String,
      },
    ],
    attendees: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxAttendees: {
      type: Number,
      min: 0,
    },
    registrationLink: {
      type: String,
      trim: true,
    },
    registrationDeadline: {
      type: Date,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    organizer: {
      name: {
        type: String,
        required: [true, "Organizer name is required"],
        trim: true,
      },
      contact: {
        type: String,
        trim: true,
      },
    },
    createdBy: {
      type: String,
      required: [true, "Creator ID is required"],
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
)

NewsEventSchema.index({ slug: 1 })
NewsEventSchema.index({ type: 1, published: 1 })
NewsEventSchema.index({ category: 1 })
NewsEventSchema.index({ date: -1 })
NewsEventSchema.index({ featured: 1, published: 1 })
NewsEventSchema.index({ createdAt: -1 })

NewsEventSchema.pre("validate", function (next) {
  if (this.title && (!this.slug || this.isModified("title"))) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }
  if (typeof next === "function") {
    next()
  }
})

const NewsEvent: Model<INewsEvent> =
  mongoose.models.NewsEvent || mongoose.model<INewsEvent>("NewsEvent", NewsEventSchema)

export default NewsEvent
