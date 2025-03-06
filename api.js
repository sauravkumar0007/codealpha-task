const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Post = require('../models/post');

// Create a post
router.post('/posts', async (req, res) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.body.userId
    });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.findAll({ include: User });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like a post
router.post('/posts/:id/like', async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    post.likes += 1;
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;