let mongoose = require("mongoose");

let CreateHall = new mongoose.Schema({
  Available: {
    type: String,
  },
  Amenities: {
    type: [String],
  },
  PriceForOneHour: {
    type: Number,
  },
  CommonId: {
    type: Number,
  },
});

let CreateHallModel = mongoose.model("HALL", CreateHall);
module.exports = CreateHallModel;
