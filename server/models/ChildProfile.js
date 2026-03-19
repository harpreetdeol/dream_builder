const mongoose = require('mongoose');

const ChildProfileSchema = new mongoose.Schema({
  userId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  childName:     { type: String, required: true },
  age:           { type: Number, min: 1, max: 4 },
  favouriteAnimals: [String],       // learned from story history
  preferredMoods:   [String],       // most used moods
  preferredLanguage: { type: String, default: 'english' },
  totalStories:  { type: Number, default: 0 },
  avgRating:     { type: Number, default: 0 },
  lastStoryAt:   { type: Date },
});

module.exports = mongoose.model('ChildProfile', ChildProfileSchema);