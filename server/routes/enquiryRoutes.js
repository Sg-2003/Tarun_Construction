const express = require('express');
const router = express.Router();
const {
  createEnquiry,
  getEnquiries,
  getEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getStats,
} = require('../controllers/enquiryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', createEnquiry);
router.get('/stats', protect, adminOnly, getStats);
router.get('/', protect, adminOnly, getEnquiries);
router.get('/:id', protect, adminOnly, getEnquiry);
router.put('/:id', protect, adminOnly, updateEnquiry);
router.delete('/:id', protect, adminOnly, deleteEnquiry);

module.exports = router;
