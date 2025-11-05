import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  image: string;
  readTime: string;
  featured: boolean;
  isPublished: boolean;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const BLOG_CATEGORIES = [
  'Design Trends',
  'Tips & Guides',
  'Retail Design',
  'Sustainability',
  'Office Design'
] as const;

const blogSchema = new Schema<IBlog>({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    maxlength: [300, 'Title cannot exceed 300 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: [100, 'Content must be at least 100 characters']
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    default: 'AQ Design Team',
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: BLOG_CATEGORIES,
      message: '{VALUE} is not a valid category'
    }
  },
  tags: {
    type: [{
      type: String,
      trim: true
    }],
    validate: {
      validator: function(v: string[]) {
        return v.length <= 10;
      },
      message: 'Cannot have more than 10 tags'
    },
    default: []
  },
  image: {
    type: String,
    required: [true, 'Image is required']
  },
  readTime: {
    type: String,
    default: '5 min read',
    validate: {
      validator: function(v: string) {
        return /^\d+\s*min\s*read$/i.test(v);
      },
      message: 'Read time must be in format "X min read"'
    }
  },
  featured: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

blogSchema.index({ category: 1, isPublished: 1 });
blogSchema.index({ featured: 1, isPublished: 1 });
blogSchema.index({ createdAt: -1 });

blogSchema.index({
  title: 'text',
  excerpt: 'text',
  content: 'text',
  tags: 'text'
});

blogSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

blogSchema.statics.getCategories = function() {
  return [...BLOG_CATEGORIES];
};

const Blog = mongoose.models.Blog || mongoose.model<IBlog>('Blog', blogSchema);
export default Blog;