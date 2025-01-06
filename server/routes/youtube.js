// filepath: /Elearning/server/routes/youtube.js
import express from 'express';
import { searchVideos } from '../utils/youtube.js';
import { isAuth } from '../middlewares/isAuth.js';

const router = express.Router();

router.get('/youtube/search', isAuth, async (req, res) => {
  try {
    const { query } = req.query;
    const videos = await searchVideos(query);
    res.status(200).json({ videos });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;