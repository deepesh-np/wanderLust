/** @format */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('../models/reviews.js');
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  // image: {
  //   type: String,
  //   default:
  //     'https://images.unsplash.com/photo-1709941459223-f674e9bc7d09?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  //   set: (v) =>
  //     v === ''
  //       ? 'https://images.unsplash.com/photo-1709941459223-f674e9bc7d09?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  //       : v,
  // },
  image: {
    url: {
      type: String,
      filename: String,
    },
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],

  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

listingSchema.post('findOneAndDelete', async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
