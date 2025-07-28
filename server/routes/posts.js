const express = require('express');
const router = express.Router();
const PostModel = require('../models/Post');
const authenticate = require('../middleware/auth');

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const newPost = new PostModel({
      title,
      content,
      tags,
      author: req.user.id,
    });

    const savedPost = await newPost.save();
    return res.status(201).json(savedPost);
  } catch (error) {
    console.error('Post creation failed:', error.message);
    res.status(500).json({ message: 'Failed to create post' });
  }
});

// @route   GET /api/posts
// @desc    Retrieve all posts
// @access  Public
router.get('/', async (_req, res) => {
  try {
    const allPosts = await PostModel.find().populate('author', 'username');
    res.json(allPosts);
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    res.status(500).json({ message: 'Unable to fetch posts' });
  }
});

// @route   GET /api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id).populate('author', 'username');

    if (!post) return res.status(404).json({ message: 'Post not found' });

    res.json(post);
  } catch (error) {
    console.error('Error retrieving post:', error.message);
    res.status(500).json({ message: 'Could not retrieve post' });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update post by ID
// @access  Private
router.put('/:id', authenticate, async (req, res) => {
  try {
    const updated = await PostModel.findOneAndUpdate(
      { _id: req.params.id, author: req.user.id },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Post not found or unauthorized' });

    res.json(updated);
  } catch (error) {
    console.error('Update failed:', error.message);
    res.status(500).json({ message: 'Failed to update post' });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete post by ID
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const deleted = await PostModel.findOneAndDelete({
      _id: req.params.id,
      author: req.user.id,
    });

    if (!deleted) return res.status(404).json({ message: 'Post not found or unauthorized' });

    res.json({ message: 'Post successfully deleted' });
  } catch (error) {
    console.error('Delete failed:', error.message);
    res.status(500).json({ message: 'Error deleting post' });
  }
});

module.exports = router;
