import mongoose, { Document, Schema } from 'mongoose';

export interface IClient extends Document {
  id: string;
  name: string;
  logo?: string;
  location: string;
  category: string;
  order?:number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CLIENT_CATEGORIES = [
  'Healthcare',
  'Retail',
  'Services',
  'Technology',
  'Sports',
  'Fashion',
  'Automotive',
  'Food & Beverage',
  'Electronics',
  'Hospitality'
] as const;

const clientSchema = new Schema<IClient>({
  id: {
    type: String,
    required: [true, 'Client ID is required'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  logo: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: CLIENT_CATEGORIES,
      message: '{VALUE} is not a valid category'
    }
  },
   order: {  // ADD THIS NEW FIELD
    type: Number,
    default: 999,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

clientSchema.index({ id: 1 }, { unique: true });
clientSchema.index({ category: 1, isActive: 1 });
clientSchema.index({ createdAt: -1 });

clientSchema.statics.getCategories = function() {
  return [...CLIENT_CATEGORIES];
};

const Client = mongoose.models.Client || mongoose.model<IClient>('Client', clientSchema);
export default Client;