const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Residential',
        'Commercial',
        'Interior Design',
        'Renovation',
        'Architecture',
        'Industrial',
      ],
    },
    status: {
      type: String,
      enum: ['Ongoing', 'Completed', 'Planning'],
      default: 'Planning',
    },
    completionDate: {
      type: Date,
    },
    client: {
      type: String,
      trim: true,
    },
    budget: {
      type: String,
      trim: true,
    },
    area: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
      trim: true,
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
        caption: { type: String, default: '' },
        isMain: { type: Boolean, default: false },
      },
    ],
    beforeImages: [
      {
        url: { type: String },
        publicId: { type: String },
      },
    ],
    afterImages: [
      {
        url: { type: String },
        publicId: { type: String },
      },
    ],
    features: [{ type: String }],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for faster queries
projectSchema.index({ category: 1, status: 1 });
projectSchema.index({ isFeatured: -1, createdAt: -1 });

module.exports = mongoose.model('Project', projectSchema);
