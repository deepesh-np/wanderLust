/** @format */

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
engine = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema } = require('./schema.js');
const Review = require('./models/reviews.js');

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main()
  .then(() => {
    console.log('connected to DB');
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));
app.engine('ejs', engine);
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Welcome</title>
      </head>
      <body style="font-family: sans-serif; text-align: center; margin-top: 50px;">
        <h1>Welcome Page</h1>
        <button onclick="window.location.href='/listings'" style="padding: 10px 20px; font-size: 16px;">
          Go to Listings
        </button>
      </body>
    </html>
  `);
});

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(400, result.error);
  } else {
    next();
  }
};
//Index Route
app.get(
  '/listings',
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index.ejs', { allListings });
  })
);

//New Route
app.get(
  '/listings/new',
  wrapAsync((req, res) => {
    res.render('listings/new.ejs');
  })
);

//Show Route
app.get(
  '/listings/:id',
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/show.ejs', { listing });
  })
);

//Create Route
app.post(
  '/listings',
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
app.get(
  '/listings/:id/edit',
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs', { listing });
  })
);

//Update Route
app.put(
  '/listings/:id',
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
app.delete(
  '/listings/:id',
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect('/listings');
  })
);

// app.get("/testListing", async (req, res) => {
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

//Reviews
//Post route
app.post('/listings/:id/reviews', async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  console.log('new REview Added');
  res.redirect('/listings/${listing._id');
  // res.send('Your Response has beem saved Succesfully');
});

app.all('*', (req, res, next) => {
  next(new ExpressError(404, 'Page Not Found!'));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = 'Something went Wrong!' } = err;
  res.render('error.ejs', { message });
  // res.status(statusCode).send(message);
  // res.send('Something went wrong!');
});

app.listen(8080, () => {
  console.log('server is listening to port 8080');
});
