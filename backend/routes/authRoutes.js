const express = require('express');
const { register, login, authenticate } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, (req, res) => {
    res.status(200).send(`Welcome ${req.user.username}`);
});

module.exports = router;