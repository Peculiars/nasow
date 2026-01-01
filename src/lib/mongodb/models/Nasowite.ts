import mongoose from 'mongoose';

const NasowiteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, required: true },
  position: { type: String, required: true },
  image: { type: String, required: true },
  imagePublicId: { type: String, required: true },
  quote: { type: String, required: true },
  socials: {
    instagram: String,
    twitter: String,
    linkedin: String,
    email: { type: String, required: true },
    phone: String,
  },
  achievements: [{ type: String }],
  isCurrent: { type: Boolean, default: false },
  weekStartDate: { type: Date, required: true },
  weekEndDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

NasowiteSchema.index({ isCurrent: 1 });
NasowiteSchema.index({ weekStartDate: -1 });

export default mongoose.models.Nasowite || mongoose.model('Nasowite', NasowiteSchema);