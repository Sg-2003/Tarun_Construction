const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[+]?[\d\s\-()]{7,20}$/, 'Please provide a valid phone number'],
    },
    subject: {
      type: String,
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    service: {
      type: String,
      enum: [
        'Residential Construction',
        'Commercial Construction',
        'Interior Design',
        'Renovation',
        'Architecture Planning',
        'General Inquiry',
      ],
      default: 'General Inquiry',
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    budget: {
      type: String,
      trim: true,
    },
    timeline: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['New', 'In Progress', 'Resolved', 'Closed'],
      default: 'New',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    adminNotes: {
      type: String,
      maxlength: [1000, 'Admin notes cannot exceed 1000 characters'],
    },
  },
  { timestamps: true }
);

enquirySchema.index({ status: 1, createdAt: -1 });
enquirySchema.index({ isRead: 1 });

module.exports = mongoose.model('Enquiry', enquirySchema);
