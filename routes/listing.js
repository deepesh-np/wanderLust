/** @format */

const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('../schema.js');
const Listing = require('../models/listing.js');


const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  //.validate() returns object error and value  this function uis from joi
  //error	Object (if validation fails)	Contains the validation failure details, like which field failed and why.
  //value	Object (validated data)	The input data (possibly sanitized) that passed the schema check.
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//Index Route
router.get(
  '/',
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index.ejs', { allListings });
  })
);

//New Route
router.get(
  '/new',
  wrapAsync((req, res) => {
    res.render('listings/new.ejs');
  })
);

//Show Route
router.get(
  '/:id',
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate('reviews');
    res.render('listings/show.ejs', { listing });
  })
);

//Create Route
router.post(
  '/',
  validateListing,
  wrapAsync(async (req, res, next) => {
    if (!req.body.listing) {
      throw new ExpressError(400, 'Send Valid data');
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect('/listings');
  })
);

//Edit Route
router.get(
  '/:id/edit',
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs', { listing });
  })
);

//Update Route
router.put(
  '/:id',
  validateListing,
  wrapAsync(async (req, res) => {
    // if (!req.body.listing) {
    //   throw new ExpressError(400, 'Send Valid data for listing!');
    // }
    // const newListing = new Listing(req.body.listing);

    // if (!newListing.title) {
    //   throw new ExpressError(400, 'Title is missing!');
    // }

    // if (!newListing.description) {
    //   throw new ExpressError(400, 'Description is missing!');
    // }

    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);

//Delete Route
router.delete(
  '/:id',
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect('/listings');
  })
);

// router.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });

module.exports = router;
