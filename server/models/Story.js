const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  childName:   { type: String, required: true },
  animal:      { type: String, required: true },
  mood:        { type: String, required: true },
  content:     { type: String, required: true },
  isFavourite: { type: Boolean, default: false },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model('Story', StorySchema);
