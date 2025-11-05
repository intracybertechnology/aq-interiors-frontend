import mongoose, { Document, Schema } from 'mongoose';

export interface IContact extends Document {
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  serviceInterestedIn?: string;
  projectDetails: string;
  status: 'new' | 'contacted' | 'closed';
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  markAsContacted(adminNotes?: string): Promise<IContact>;
}

const CONTACT_STATUSES = ['new', 'contacted', 'closed'] as const;

const contactSchema = new Schema<IContact>({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    validate: {
      validator: function(v: string) {
        return /^[\+]?[\d\s\-\(\)]+$/.test(v);
      },
      message: 'Please enter a valid phone number'
    }
  },
  emailAddress: {
    type: String,
    required: [true, 'Email address is required'],
    lowercase: true,
    trim: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please enter a valid email address'
    ]
  },
  serviceInterestedIn: {
    type: String,
    trim: true
  },
  projectDetails: {
    type: String,
    required: [true, 'Project details are required'],
    trim: true,
    maxlength: [2000, 'Project details cannot exceed 2000 characters']
  },
  status: {
    type: String,
    enum: {
      values: CONTACT_STATUSES,
      message: '{VALUE} is not a valid status'
    },
    default: 'new'
  },
  adminNotes: {
    type: String,
    maxlength: [1000, 'Admin notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ emailAddress: 1 });
contactSchema.index({ serviceInterestedIn: 1 });

contactSchema.index({
  fullName: 'text',
  emailAddress: 'text',
  projectDetails: 'text',
  serviceInterestedIn: 'text'
});

contactSchema.statics.getStatusCounts = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

contactSchema.methods.markAsContacted = function(adminNotes?: string) {
  this.status = 'contacted';
  if (adminNotes) {
    this.adminNotes = adminNotes;
  }
  return this.save();
};

const Contact = mongoose.models.Contact || mongoose.model<IContact>('Contact', contactSchema);

export default Contact;