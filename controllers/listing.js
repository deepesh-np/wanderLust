/** @format */

const Listing = require('../models/listing.js');
const ExpressError = require('../utils/ExpressError.js');

//Query Route
module.exports.params = async (req, res) => {
  const { category } = req.query;

  let filter = {};
  if (category) {
    filter.category = category;
  }

  const listings = await Listing.find(filter);
  res.render('listings/index', { allListings: listings });
};

//Index Route
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render('listings/index.ejs', { allListings });
};

//New Route
module.exports.renderNewForm = (req, res) => {
  res.render('listings/new.ejs');
};

//Show Route
module.exports.show = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
      }, //nested populate
    })
    .populate('owner');
  if (!listing) {
    req.flash('error', 'Listing you requested for does not exist');
    res.redirect('/listings');
  } else {
    res.render('listings/show.ejs', { listing });
  }
};

//Create Route
module.exports.createNewListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash('success', 'New listing created');
  res.redirect('/listings');
};

//Edit Route
module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash('error', 'Listing you requested for does not exist');
    res.redirect('/listings');
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace('/upload', '/upload/w_250');
  res.render('listings/edit.ejs', { listing, originalImageUrl });
};

//Update Route
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== 'undefined') {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash('success', 'Listing Updated');
  res.redirect(`/listings/${id}`);
};

//Delete Route
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash('success', 'Listing Deleted');
  res.redirect('/listings');
};
