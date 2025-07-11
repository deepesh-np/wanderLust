/** @format */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

userSchema.plugin(passportLocalMongoose);
//auto adds username and password to schema and also do the hashing and salting over them automatically pass..-local-mongoose

module.exports = mongoose.model('User', userSchema);
