/** @format */

const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, validateReview, isAuthor } = require('../middleware.js');
const reviewController = require('../controllers/review.js');

//Post review route
router.post(
  '/',
  isLoggedIn,
  //validateReview,
  wrapAsync(reviewController.new)
);

//Delete review
router.delete(
  '/:reviewId',
  isLoggedIn,
  isAuthor,
  wrapAsync(reviewController.deleteReview)
);

router.all('*', (req, res, next) => {
  res.redirect('/listings');
});

router.use((err, req, res, next) => {
  let { statusCode = 500, message = 'Something went Wrong!' } = err;
  res.render('error.ejs', { message });
});

module.exports = router;
