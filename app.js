/** @format */

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
engine = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

const ExpressError = require('./utils/ExpressError.js');

const listings = require('./routes/listing.js');
const reviews = require('./routes/review.js');

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

const sessionOption = {
  secret: 'mysupersecretcode',
  resave: false,
  saveUninitialised: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 3 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOption));
app.use(flash()); //before the req and get post etc

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

app.use(flash()); //before the req and get post etc

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  next();
});

app.use('/listings', listings);
app.use('/listings/:id/reviews', reviews);

app.listen(8080, () => {
  console.log('server is listening to port 8080');
});
