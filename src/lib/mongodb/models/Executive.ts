import mongoose, { Document, Schema } from 'mongoose';

export interface IExecutive extends Document {
  name: string;
  position: string;
  level: string;
  image: {
    url: string;
    publicId: string;
  };
  bio: string;
  email: string;
  phone: string;
  socialMedia: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  achievements: string[];
  responsibilities: string[];
  order: number;
  session: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const executiveSchema = new Schema<IExecutive>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    position: {
      type: String,
      required: true,
      trim: true
    },
    level: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      url: {
        type: String,
        required: true
      },
      publicId: {
        type: String,
        required: true
      }
    },
    bio: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    socialMedia: {
      instagram: String,
      linkedin: String,
      twitter: String,
      facebook: String
    },
    achievements: {
      type: [String],
      default: []
    },
    responsibilities: {
      type: [String],
      default: []
    },
    order: {
      type: Number,
      default: 0
    },
    session: {
      type: String,
      required: true,
      default: '2024/2025'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

executiveSchema.index({ session: 1, order: 1 });
executiveSchema.index({ isActive: 1 });

export const Executive = mongoose.models.Executive || mongoose.model<IExecutive>('Executive', executiveSchema);