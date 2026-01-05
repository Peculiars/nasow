import mongoose, { Schema, Document } from 'mongoose';

export interface IContactSubmission extends Document {
  name: string;
  email: string;
  level: string;
  subject: string;
  message: string;
  submittedAt: Date;
  status: 'unread' | 'read' | 'responded';
}

const ContactSubmissionSchema = new Schema<IContactSubmission>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  level: {
    type: String,
    required: [true, 'Level is required'],
    enum: ['100', '200', '300', '400', 'alumni', 'other']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'responded'],
    default: 'unread'
  }
}, {
  timestamps: true
});

ContactSubmissionSchema.index({ submittedAt: -1 });
ContactSubmissionSchema.index({ status: 1 });

export default mongoose.models.ContactSubmission || 
  mongoose.model<IContactSubmission>('ContactSubmission', ContactSubmissionSchema);