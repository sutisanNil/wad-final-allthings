// File: ./models/quotations.js

//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var QuotationSchema = new Schema({
  date: Date,
  code: String,
  name: String,
  price: Number,
  remainingStock: Number
});

//Export function to create "QuotationSchema" model class
module.exports = mongoose.model('Quotation', QuotationSchema );