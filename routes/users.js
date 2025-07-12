/** @format */

const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const { saveRedirectUrl } = require('../middleware.js');
const passport = require('passport');
const userController = require('../controllers/user.js');

//signup Page
router.get('/signup', userController.renderSignupPage);

//Signup Route
router.post('/signup', wrapAsync(userController.signup));

//login Page
router.get('/login', userController.renderLoginPage);

//Login Route
router.post(
  '/login',
  saveRedirectUrl,
  userController.Login,
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
  }),
  userController.Login
);

router.get('/logout', userController.logout);

module.exports = router;
