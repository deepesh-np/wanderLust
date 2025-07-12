/** @format */

const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const { saveRedirectUrl } = require('../middleware.js');
const passport = require('passport');
const userController = require('../controllers/user.js');

router
  .route('/signup')
  //signup Page
  .get(userController.renderSignupPage)
  //Signup Route
  .post(wrapAsync(userController.signup));

router
  .route('/login')
  //login Page
  .get(userController.renderLoginPage)
  //Login Route
  .post(
    saveRedirectUrl,
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: true,
    }),
    userController.Login
  );

router.get('/logout', userController.logout);

module.exports = router;
