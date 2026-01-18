import mongoose, { Document, Schema } from 'mongoose';

export interface IBanner extends Document {
  title: string;
  description: string;
  image: {
    url: string;
    publicId: string;
  };
  socialLinks: {
    website?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxLength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxLength: [300, 'Description cannot exceed 300 characters']
    },
    image: {
      url: {
        type: String,
        required: [true, 'Image URL is required']
      },
      publicId: {
        type: String,
        required: [true, 'Image public ID is required']
      }
    },
    socialLinks: {
      website: {
        type: String,
        trim: true,
        validate: {
          validator: function(v: string) {
            if (!v) return true;
            return /^https?:\/\/.+/.test(v);
          },
          message: 'Invalid website URL'
        }
      },
      twitter: {
        type: String,
        trim: true,
        validate: {
          validator: function(v: string) {
            if (!v) return true;
            return /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/.+/.test(v);
          },
          message: 'Invalid Twitter/X URL'
        }
      },
      facebook: {
        type: String,
        trim: true,
        validate: {
          validator: function(v: string) {
            if (!v) return true;
            return /^https?:\/\/(www\.)?facebook\.com\/.+/.test(v);
          },
          message: 'Invalid Facebook URL'
        }
      },
      instagram: {
        type: String,
        trim: true,
        validate: {
          validator: function(v: string) {
            if (!v) return true;
            return /^https?:\/\/(www\.)?instagram\.com\/.+/.test(v);
          },
          message: 'Invalid Instagram URL'
        }
      },
      linkedin: {
        type: String,
        trim: true,
        validate: {
          validator: function(v: string) {
            if (!v) return true;
            return /^https?:\/\/(www\.)?linkedin\.com\/.+/.test(v);
          },
          message: 'Invalid LinkedIn URL'
        }
      }
    },
    isActive: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

BannerSchema.index({ isActive: 1, order: 1 });

export default mongoose.models.Banner || mongoose.model<IBanner>('Banner', BannerSchema);