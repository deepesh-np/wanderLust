/** @format */

const Review = require('../models/reviews.js');
const Listing = require('../models/listing.js');

//Post Route
module.exports.new = async (req, res) => {
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
};

//Delete Route
module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });

  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Review Deleted');
  console.log('Review Deleted');
  res.redirect(`/listings/${id}`);
};
