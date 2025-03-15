const express = require("express");
const {
  verifyToken,
  insertDefaultProfile,
  register,
  login,
} = require("../controllers/authController");
const router = express.Router();
const passport = require("passport");

router.post("/register", register);
router.post("/verifyToken", verifyToken);
router.post("/insertProfile/:useruid", insertDefaultProfile);
router.post("/login", login);
// router.get('/profile', authenticate, (req, res) => {
//     res.status(200).send(`Welcome ${req.user.username}`);
// });

// Google authentication route
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback route
// router.get(
//     '/google/callback',
//     passport.authenticate('google', { failureRedirect: '/login' }),
//     (req, res) => {
//         // Generate a JWT and send to the client
//         const token = jwt.sign(
//             { userID: req.user.userID, email: req.user.email },
//             process.env.JWT_SECRET,
//             { expiresIn: '1h' }
//         );
//         res.redirect(`/profile?token=${token}`);
//     }
// );

module.exports = router;
