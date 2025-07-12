/** @format */

const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');
const listingController = require('../controllers/listing.js');

//Index Route
router.get('/', wrapAsync(listingController.index));

//New Route
router.get('/new', isLoggedIn, listingController.renderNewForm);

//Show Route
router.get('/:id', wrapAsync(listingController.show));

//Create Route
router.post(
  '/',
  isLoggedIn,
  validateListing,
  wrapAsync(listingController.createNewListing)
);

//Edit Route
router.get(
  '/:id/edit',
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);

//Update Route
router.put(
  '/:id',
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListing)
);

//Delete Route
router.delete(
  '/:id',
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.deleteListing)
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
