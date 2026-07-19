const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  deleteProjectImage,
} = require('../controllers/projectController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/', getProjects);
router.get('/:id', getProject);
router.post('/', protect, adminOnly, upload.array('images', 10), createProject);
router.put('/:id', protect, adminOnly, upload.array('images', 10), updateProject);
router.delete('/:id', protect, adminOnly, deleteProject);
router.delete('/:id/image/:publicId', protect, adminOnly, deleteProjectImage);

module.exports = router;
