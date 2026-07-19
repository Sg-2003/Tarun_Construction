const Enquiry = require('../models/Enquiry');
const nodemailer = require('nodemailer');

// @desc    Submit enquiry
// @route   POST /api/enquiries
// @access  Public
const createEnquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, service, message, budget, timeline } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required',
      });
    }

    const enquiry = await Enquiry.create({
      name,
      email,
      phone,
      subject,
      service,
      message,
      budget,
      timeline,
    });

    // Send notification email (optional, won't fail if not configured)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransporter({
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          subject: `New Enquiry from ${name} - Tarun Construction`,
          html: `
            <h2>New Enquiry Received</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
            <p><strong>Service:</strong> ${service || 'N/A'}</p>
            <p><strong>Message:</strong> ${message}</p>
          `,
        });
      } catch (emailError) {
        console.log('Email notification skipped:', emailError.message);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully. We will contact you soon!',
      data: enquiry,
    });
  } catch (error) {
    console.error('Create enquiry error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all enquiries (Admin)
// @route   GET /api/enquiries
// @access  Admin
const getEnquiries = async (req, res) => {
  try {
    const { status, isRead, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (isRead !== undefined) query.isRead = isRead === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Enquiry.countDocuments(query);
    const enquiries = await Enquiry.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const unreadCount = await Enquiry.countDocuments({ isRead: false });

    res.status(200).json({
      success: true,
      total,
      unreadCount,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: enquiries,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single enquiry
// @route   GET /api/enquiries/:id
// @access  Admin
const getEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }
    res.status(200).json({ success: true, data: enquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update enquiry status
// @route   PUT /api/enquiries/:id
// @access  Admin
const updateEnquiry = async (req, res) => {
  try {
    const { status, adminNotes, isRead } = req.body;
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes, isRead },
      { new: true, runValidators: true }
    );
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }
    res.status(200).json({ success: true, message: 'Enquiry updated', data: enquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete enquiry
// @route   DELETE /api/enquiries/:id
// @access  Admin
const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }
    res.status(200).json({ success: true, message: 'Enquiry deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Dashboard stats
// @route   GET /api/enquiries/stats
// @access  Admin
const getStats = async (req, res) => {
  try {
    const Project = require('../models/Project');
    const totalProjects = await Project.countDocuments();
    const completedProjects = await Project.countDocuments({ status: 'Completed' });
    const ongoingProjects = await Project.countDocuments({ status: 'Ongoing' });
    const totalEnquiries = await Enquiry.countDocuments();
    const newEnquiries = await Enquiry.countDocuments({ status: 'New' });
    const unreadEnquiries = await Enquiry.countDocuments({ isRead: false });

    res.status(200).json({
      success: true,
      data: {
        totalProjects,
        completedProjects,
        ongoingProjects,
        totalEnquiries,
        newEnquiries,
        unreadEnquiries,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  createEnquiry,
  getEnquiries,
  getEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getStats,
};
