const express = require('express');
const { getHighlights, saveHighlights } = require('../controllers/highlightController');

const router = express.Router();

router.get('/', getHighlights);
router.post('/', saveHighlights);

module.exports = router;