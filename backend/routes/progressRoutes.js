const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');

router.post('/add', async (req, res) => {
  try {
    const { month, week, total, completed , names} = req.body;
    const progress = await Progress.create({ month, week, total, completed , names });
    res.status(201).json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const data = await Progress.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
