/** @format */

const mongoose = require('mongoose');
const express = require('express');
const app = express();
const Listing = require('../wanderLust/models/listing.js');

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Connected to DB');
  } catch (err) {
    console.log(err);
  }
}

main();

app.get('/', (req, res) => {
  res.send('Hi, I am root');
});

app.listen(8080, () => {
  console.log('listening at port 8080');
});

// Assuming required imports and Express app setup are already done

app.get('/testListing', async (req, res) => {
  try {
    const sampleListing = new Listing({
      title: 'My New Villa',
      description: 'By the beach',
      price: 1200,
      location: 'Calangute, Goa',
      country: 'India',
    });

    await sampleListing.save();
    console.log('Sample was saved');
    res.send('Successful testing');
  } catch (err) {
    console.error('Error saving sample listing:', err);
    res.status(500).send('Internal Server Error');
  }
});
