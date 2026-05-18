const express = require('express');
const router = express.Router();
const { getAIRecommendation } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/recommend', protect, getAIRecommendation);

module.exports = router;
