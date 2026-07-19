const Project = require('../models/Project');
const path = require('path');

// Only require cloudinary if configured
const hasCloudinary =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name';
const cloudinary = hasCloudinary ? require('../config/cloudinary') : null;

// Helper: normalize uploaded file to {url, publicId}
function normalizeFile(file, index) {
  let url, publicId;
  if (hasCloudinary && file.path && file.path.startsWith('http')) {
    // Cloudinary upload — file.path is the full CDN URL
    url = file.path;
    publicId = file.filename;
  } else {
    // Local disk storage — file.path is an absolute path
    url = '/uploads/' + path.basename(file.path);
    publicId = file.filename || path.basename(file.path);
  }
  return { url, publicId, caption: '', isMain: index === 0 };
}

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
  try {
    const { category, status, featured, page = 1, limit = 12 } = req.query;
    const query = {};

    if (category && category !== 'All') query.category = category;
    if (status) query.status = status;
    if (featured === 'true') query.isFeatured = true;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: projects,
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Admin
const createProject = async (req, res) => {
  try {
    const projectData = { ...req.body };

    // Handle uploaded images from Multer (Cloudinary or local disk)
    if (req.files && req.files.length > 0) {
      projectData.images = req.files.map((file, index) => normalizeFile(file, index));
    }

    if (req.body.features && typeof req.body.features === 'string') {
      projectData.features = req.body.features.split(',').map((f) => f.trim());
    }

    const project = await Project.create(projectData);
    res.status(201).json({ success: true, message: 'Project created', data: project });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Admin
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const updateData = { ...req.body };

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file, index) => normalizeFile(file, index));
      updateData.images = [...(project.images || []), ...newImages];
    }

    if (req.body.features && typeof req.body.features === 'string') {
      updateData.features = req.body.features.split(',').map((f) => f.trim());
    }

    const updated = await Project.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, message: 'Project updated', data: updated });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Admin
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Delete images from Cloudinary (if configured)
    if (cloudinary && project.images && project.images.length > 0) {
      for (const img of project.images) {
        if (img.publicId) {
          try { await cloudinary.uploader.destroy(img.publicId); } catch (e) {}
        }
      }
    }

    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete single image from project
// @route   DELETE /api/projects/:id/image/:publicId
// @access  Admin
const deleteProjectImage = async (req, res) => {
  try {
    const { id, publicId } = req.params;
    const decodedPublicId = decodeURIComponent(publicId);

    if (cloudinary) {
      try { await cloudinary.uploader.destroy(decodedPublicId); } catch (e) {}
    }

    const project = await Project.findByIdAndUpdate(
      id,
      { $pull: { images: { publicId: decodedPublicId } } },
      { new: true }
    );

    res.status(200).json({ success: true, message: 'Image deleted', data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Seed projects on startup if collection is empty or has few items
const seedProjects = async () => {
  try {
    const count = await Project.countDocuments();
    if (count < 12) {
      // Clear existing to prevent duplicates during testing and get clean list
      await Project.deleteMany({});

      const mockProjects = [
        {
          title: 'Modern Luxury Villa',
          description: 'A premium 5-bedroom luxury villa with modern amenities, automated systems, and smart home integration.',
          location: 'Mumbai, Maharashtra',
          category: 'Commercial',
          status: 'Ongoing',
          client: 'Singhania Properties',
          budget: '₹12 Cr',
          area: '12,000 sq.ft',
          duration: '14 months',
          isFeatured: true,
          rating: 0,
          features: ['Smart Home Automation', 'Home Cinema', 'Infinity Pool', 'Eco-friendly Materials'],
          images: []
        },
        {
          title: 'Skyline Residency',
          description: 'Luxury 24-floor residential tower with modern amenities, sky lounge, and smart homes.',
          location: 'Mumbai, Maharashtra',
          category: 'Residential',
          status: 'Completed',
          completionDate: new Date('2023-12-01'),
          client: 'Sharma Group',
          budget: '₹45 Cr',
          area: '2.5 Lakh sq.ft',
          duration: '24 months',
          isFeatured: true,
          rating: 5,
          features: ['Swimming Pool', 'Clubhouse', '24/7 Security', 'Solar Power Panels'],
          images: []
        },
        {
          title: 'TechHub Corporate Park',
          description: 'State-of-the-art IT park spread across 10 acres of landscaped grounds.',
          location: 'Pune, Maharashtra',
          category: 'Commercial',
          status: 'Completed',
          completionDate: new Date('2023-06-15'),
          client: 'InfoTech Corp',
          budget: '₹120 Cr',
          area: '8 Lakh sq.ft',
          duration: '36 months',
          isFeatured: true,
          rating: 5,
          features: ['LEED Gold Certification', 'Fibre Optic Backbone', 'Food Court', 'Ample Parking'],
          images: []
        },
        {
          title: 'Royal Villa Renovation',
          description: 'Complete luxury renovation and modernization of a heritage residential villa.',
          location: 'Pune, Maharashtra',
          category: 'Renovation',
          status: 'Completed',
          completionDate: new Date('2024-02-10'),
          client: 'Mehta Family',
          budget: '₹3 Cr',
          area: '8,000 sq.ft',
          duration: '8 months',
          isFeatured: false,
          rating: 4,
          features: ['Home Theatre', 'Infinity Pool Upgrade', 'Smart Kitchen', 'Marble Flooring'],
          images: []
        },
        {
          title: 'Metro Mall',
          description: 'A 5-story commercial shopping complex and entertainment hub.',
          location: 'Nashik, Maharashtra',
          category: 'Commercial',
          status: 'Ongoing',
          client: 'Retail Giants India',
          budget: '₹75 Cr',
          area: '4 Lakh sq.ft',
          duration: '18 months',
          isFeatured: true,
          rating: 0,
          features: ['Multiplex Theatre', 'Central Atrium', 'Hypermarket Zone', 'Escalator Systems'],
          images: []
        },
        {
          title: 'Green Valley Homes',
          description: 'Eco-friendly gated community with 50 luxury smart villas.',
          location: 'Nagpur, Maharashtra',
          category: 'Residential',
          status: 'Ongoing',
          client: 'Eco Housing Developers',
          budget: '₹35 Cr',
          area: '3 Lakh sq.ft',
          duration: '18 months',
          isFeatured: false,
          rating: 0,
          features: ['Rainwater Harvesting', 'Waste Recycling Plant', 'Clubhouse', 'Jogging Track'],
          images: []
        },
        {
          title: 'Modern Office Interior',
          description: 'Complete interior design and build for a 15,000 sq.ft corporate headquarters.',
          location: 'Mumbai, Maharashtra',
          category: 'Interior Design',
          status: 'Completed',
          completionDate: new Date('2024-01-20'),
          client: 'Apex Finance Ltd',
          budget: '₹4.5 Cr',
          area: '15,000 sq.ft',
          duration: '4 months',
          isFeatured: false,
          rating: 5,
          features: ['Acoustic Partitioning', 'Ergonomic Workstations', 'Executive Lounge', 'Custom Lighting'],
          images: []
        },
        {
          title: 'Apex Steel Manufacturing Plant',
          description: 'Heavy civil engineering and structure construction for a manufacturing facility.',
          location: 'Aurangabad, Maharashtra',
          category: 'Industrial',
          status: 'Planning',
          client: 'Apex Heavy Industries',
          budget: '₹95 Cr',
          area: '5 Lakh sq.ft',
          duration: '30 months',
          isFeatured: false,
          rating: 0,
          features: ['Reinforced Gantry Crane Columns', 'High-Load Floor Slabs', 'Substation Enclosure', 'ETP Plant Room'],
          images: []
        },
        {
          title: 'Orion IT Towers',
          description: 'Twin 30-story commercial buildings designed for high-density IT organizations.',
          location: 'Mumbai, Maharashtra',
          category: 'Commercial',
          status: 'Ongoing',
          client: 'Orion Developers',
          budget: '₹210 Cr',
          area: '12 Lakh sq.ft',
          duration: '48 months',
          isFeatured: true,
          rating: 0,
          features: ['Double-Glazed Facade', 'Sky Bridges', 'Underground Transit Link', 'Pneumatic Waste Systems'],
          images: []
        },
        {
          title: 'Emerald Gardens',
          description: 'A premium mid-rise housing society featuring green spaces and community parks.',
          location: 'Pune, Maharashtra',
          category: 'Residential',
          status: 'Completed',
          completionDate: new Date('2024-04-05'),
          client: 'GreenSpace Living',
          budget: '₹60 Cr',
          area: '4 Lakh sq.ft',
          duration: '22 months',
          isFeatured: false,
          rating: 5,
          features: ['Rooftop Gardens', 'Organic Farming Zone', 'EV Charging Station', 'Kid Zone'],
          images: []
        },
        {
          title: 'Heritage Mansion Restoration',
          description: 'Conservation and restoration of a 100-year-old colonial mansion.',
          location: 'Nashik, Maharashtra',
          category: 'Renovation',
          status: 'Completed',
          completionDate: new Date('2024-05-18'),
          client: 'Archaeological Society Private Trust',
          budget: '₹5 Cr',
          area: '15,000 sq.ft',
          duration: '12 months',
          isFeatured: false,
          rating: 4,
          features: ['Original Lime-Plaster Work', 'Teak Wood Refurbishing', 'Foundation Underpinning'],
          images: []
        },
        {
          title: 'Smart Warehouse Facility',
          description: 'An automated smart logistics warehouse with temperature controls.',
          location: 'Nagpur, Maharashtra',
          category: 'Industrial',
          status: 'Completed',
          completionDate: new Date('2024-03-30'),
          client: 'Express Logistics India',
          budget: '₹40 Cr',
          area: '3.5 Lakh sq.ft',
          duration: '10 months',
          isFeatured: false,
          rating: 5,
          features: ['AGV Dedicated Paths', 'Insulated Panels', 'Dock Levelers', 'Solar Roof Array'],
          images: []
        },
        {
          title: 'Silicon Heights Headquarters',
          description: 'A contemporary office interior build-out focusing on collaboration zones and biophilic design.',
          location: 'Pune, Maharashtra',
          category: 'Interior Design',
          status: 'Ongoing',
          client: 'Silicon Heights Inc',
          budget: '₹8 Cr',
          area: '30,000 sq.ft',
          duration: '6 months',
          isFeatured: false,
          rating: 0,
          features: ['Vertical Living Walls', 'Focus Pods', 'Gaming Room', 'Bespoke Executive Suites'],
          images: []
        },
        {
          title: 'Lotus Signature Villa',
          description: 'A high-end architectural planning project for an ultra-luxury private seaside mansion.',
          location: 'Mumbai, Maharashtra',
          category: 'Residential',
          status: 'Planning',
          client: 'Confidential Client',
          budget: '₹25 Cr',
          area: '18,000 sq.ft',
          duration: '12 months',
          isFeatured: true,
          rating: 0,
          features: ['Cantilevered Terraces', 'Private Dock access', 'Sub-level Gallery', 'Bulletproof Glazing'],
          images: []
        }
      ];
      await Project.insertMany(mockProjects);
      console.log('✅ Seed projects expanded and populated successfully!');
    }
  } catch (error) {
    console.error('Projects seed error:', error);
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  deleteProjectImage,
  seedProjects,
};
