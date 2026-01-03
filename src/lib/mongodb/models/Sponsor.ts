import mongoose, { Schema, Document } from 'mongoose';

export interface ISponsor extends Document {
  name: string;
  logo: {
    url: string;
    publicId: string;
  };
  description: string;
  website: string;
  tier: 'Platinum' | 'Gold' | 'Silver';
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const SponsorSchema = new Schema<ISponsor>(
  {
    name: {
      type: String,
      required: [true, 'Sponsor name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    logo: {
      url: {
        type: String,
        required: [true, 'Logo URL is required']
      },
      publicId: {
        type: String,
        required: [true, 'Logo public ID is required']
      }
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    website: {
      type: String,
      required: [true, 'Website URL is required'],
      trim: true,
      validate: {
        validator: function(v: string) {
          return /^https?:\/\/.+/.test(v);
        },
        message: 'Please provide a valid URL'
      }
    },
    tier: {
      type: String,
      enum: ['Platinum', 'Gold', 'Silver'],
      required: [true, 'Tier is required']
    },
    isActive: {
      type: Boolean,
      default: true
    },
    displayOrder: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

SponsorSchema.index({ tier: 1, displayOrder: 1 });
SponsorSchema.index({ isActive: 1 });

export default mongoose.models.Sponsor || mongoose.model<ISponsor>('Sponsor', SponsorSchema);