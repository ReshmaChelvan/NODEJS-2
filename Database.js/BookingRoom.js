const mongoose = require("mongoose");

let BookingHall = new mongoose.Schema({
  CustomerName: {
    type: String,
  },
  Date: {
    type: Date,
  },
  CheckIn: {
    type: Date,
  },
  CheckOut: {
    type: Date,
  },
  isBooked: {
    type: Boolean,
  },
  CommonId: {
    type: Number,
  },
});

BookingHall.pre("save", function () {
  const CurrentDate = new Date().getDate();
  const CurrentMonth = new Date().getMonth();
  const CurrentYear = new Date().getFullYear();
  let FinalDate = `${CurrentDate}-${CurrentMonth}-${CurrentYear}`;
  this.Date = FinalDate;
  this.isBooked = true;
});

let BookingModel = mongoose.model("Booking", BookingHall);
module.exports = BookingModel;
