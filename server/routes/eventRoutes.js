const express = require('express');
const router = express.Router();
const events = require('../controllers/eventController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', events.getAllEvents);
router.post('/:id/register', verifyToken(), events.registerForEvent);

module.exports = router;