const mongoose = require('mongoose');

// Define the schema
const sauceSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  manufacturer: {
    type: String,
    required: true
  },
  mainPepper: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  heat: {
    type: Number,
    required: true
  },
  likes: {
    type: Number,
    required: true
  }, 
    usersLiked: {
        type: [String],
        required: true
    },
    usersDisliked: {
        type:[String],
        required: true
    }
});

// Create a model based on the schema
const Sauce = mongoose.model('Sauce', sauceSchema);

module.exports = Sauce;