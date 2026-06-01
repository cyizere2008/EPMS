const express = require('express');
const Department = require('../models/Department');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const dep = await Department.create(req.body);
    res.status(201).json(dep);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.get('/', auth, async (_req, res) => {
  const list = await Department.find().sort({ createdAt: -1 });
  res.json(list);
});

module.exports = router;
