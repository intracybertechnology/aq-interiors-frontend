import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  id: string;
  title: string;
  category: string;
  description: string;
  images: string[];
  location?: string;
  year?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PROJECT_CATEGORIES = [
  'Food & Beverage',
  'Retail Fashion',
  'Electronics Retail',
  'Exhibition',
  'Custom Fixtures',
  'Service Center',
  'Office Interior',
  'Healthcare',
  'Hospitality'
] as const;

const projectSchema = new Schema<IProject>({
  id: {
    type: String,
    required: [true, 'Project ID is required'],
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: PROJECT_CATEGORIES,
      message: '{VALUE} is not a valid category'
    }
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  images: {
    type: [{
      type: String,
      required: true
    }],
    validate: {
      validator: function(v: string[]) {
        return v && v.length > 0;
      },
      message: 'At least one image is required'
    }
  },
  location: {
    type: String,
    trim: true
  },
  year: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        return !v || /^\d{4}$/.test(v);
      },
      message: 'Year must be a 4-digit number'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

projectSchema.index({ id: 1 }, { unique: true });
projectSchema.index({ category: 1, isActive: 1 });
projectSchema.index({ createdAt: -1 });

projectSchema.index({
  title: 'text',
  description: 'text',
  category: 'text',
  location: 'text'
});

projectSchema.statics.getCategories = function() {
  return [...PROJECT_CATEGORIES];
};

const Project = mongoose.models.Project || mongoose.model<IProject>('Project', projectSchema);
export default Project;