const express = require('express');
const { getProfile, saveProfile } = require('../controllers/profileController');

const router = express.Router();

router.get('/:id', getProfile);
router.post('/save', saveProfile);

module.exports = router;