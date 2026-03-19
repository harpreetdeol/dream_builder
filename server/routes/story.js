const express = require('express');
const router = express.Router();
const { generateStory } = require('../utils/groq');
const Story = require('../models/Story');
const protect = require('../middleware/authMiddleware');

router.post('/generate', protect, async (req, res) => {
  try {
    const { childName, animal, mood } = req.body;
    if (!childName || !animal || !mood)
      return res.status(400).json({ error: 'All fields are required' });
    const content = await generateStory(childName, animal, mood);
    res.json({ content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Story generation failed' });
  }
});

router.post('/save', protect, async (req, res) => {
  try {
    const { childName, animal, mood, content } = req.body;
    const story = await Story.create({
      userId: req.user._id, childName, animal, mood, content
    });
    res.json(story);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save story' });
  }
});

router.get('/list', protect, async (req, res) => {
  try {
    const stories = await Story.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

router.patch('/:id/favourite', protect, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ error: 'Story not found' });
    story.isFavourite = !story.isFavourite;
    await story.save();
    res.json(story);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update story' });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Story.findByIdAndDelete(req.params.id);
    res.json({ message: 'Story deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete story' });
  }
});

module.exports = router;
