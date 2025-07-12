/** @format */

const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const Review = require('../models/reviews.js');
const Listing = require('../models/listing.js');
const { isLoggedIn, validateReview, isAuthor } = require('../middleware.js');
const ExpressError = require('../utils/ExpressError.js');
//Reviews
//Post review route
router.post(
  '/',
  isLoggedIn,
  //validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log('new REview Added');
    req.flash('success', 'New review created');
    res.redirect(`/listings/${listing._id}`);

    // res.send('Your Response has beem saved Succesfully');
  })
);

//Delete review
router.delete(
  '/:reviewId',
  isLoggedIn,
  isAuthor,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });

    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review Deleted');
    res.redirect(`/listings/${id}`);
  })
);

router.all('*', (req, res, next) => {
  next(new ExpressError(404, 'Page Not Found!'));
});

router.use((err, req, res, next) => {
  let { statusCode = 500, message = 'Something went Wrong!' } = err;
  res.render('error.ejs', { message });
  // res.status(statusCode).send(message);
  // res.send('Something went wrong!');
});

module.exports = router;
