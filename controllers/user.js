/** @format */

const User = require('../models/user.js');

//Signup page
module.exports.renderSignupPage = (req, res) => {
  res.render('../views/users/signup.ejs');
};

//Signup Route
module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', 'Welcome to Wanderlust!');
      res.redirect('/listings');
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/signup');
  }
};

//Login Page
module.exports.renderLoginPage = (req, res) => {
  res.render('../views/users/login.ejs');
};

//Login Route
module.exports.Login = async (req, res) => {
  req.flash('success', 'Welcome back to Wanderlust!');
  let redirectUrl = res.locals.redirectUrl || '/listings';
  res.redirect(redirectUrl);
};

//Log out Route
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success', 'You are Logged out!');
    res.redirect('/Listings');
  });
};
