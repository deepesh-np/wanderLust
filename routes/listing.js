/** @format */

const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');
const listingController = require('../controllers/listing.js');
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
// const upload = multer({ dest: storage }); //auto created
const upload = multer({ storage });

// Search route
router.get('/search', async (req, res) => {
  const query = req.query.q;

  let listings = [];
  if (query) {
    listings = await Listing.find({
      title: { $regex: query, $options: 'i' }, // case-insensitive regex
    });
  } else {
    listings = await Listing.find({});
  }

  res.render('listings/index', {  allListings: listings  });
});

//New Route
router.get('/new', isLoggedIn, listingController.renderNewForm);

//Edit Route
router.get(
  '/:id/edit',
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);

router
  .route('/')

  //query Route
  .get(wrapAsync(listingController.params))
  .get(wrapAsync(listingController.index)) //new
  .post(
    // create
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createNewListing)
  );

router
  .route('/:id')
  .get(wrapAsync(listingController.show)) //show
  .put(
    //update
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    //destroy
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing)
  );

//Delete Route
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

// const express = require('express');
// const router = express.Router();
const Listing = require('../models/listing');

module.exports = router;
