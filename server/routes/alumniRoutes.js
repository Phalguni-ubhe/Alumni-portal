const express = require('express');
const router = express.Router();
const alumni = require('../controllers/alumniController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', alumni.getAllAlumni);
router.post('/', verifyToken(), alumni.createAlumni);
router.get('/admin/stats', verifyToken(['Admin']), alumni.getAdminStats);

module.exports = router;