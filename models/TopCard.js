const mongoose = require('mongoose');

const TopCardSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  name: String,
  age: Number,
});

// create collection on db
const TopCardModel = mongoose.model('topCard', TopCardSchema);

module.exports = TopCardModel;
