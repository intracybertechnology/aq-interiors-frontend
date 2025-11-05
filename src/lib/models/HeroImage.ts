import mongoose, { Schema, Document } from 'mongoose';

export interface IHeroImage extends Document {
  title: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HeroImageSchema = new Schema<IHeroImage>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true
    },
    order: {
      type: Number,
      required: [true, 'Order is required'],
      min: [1, 'Order must be at least 1'],
      default: 1
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);
HeroImageSchema.index({ order: 1, isActive: 1 });

const HeroImage = mongoose.models.HeroImage || mongoose.model<IHeroImage>('HeroImage', HeroImageSchema);
export default HeroImage;