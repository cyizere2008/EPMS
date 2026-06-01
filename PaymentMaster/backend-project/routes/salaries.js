const express = require('express');
const Salary = require('../models/Salary');
const auth = require('../middleware/auth');
const router = express.Router();

// Full CRUD on Salary
router.post('/', auth, async (req, res) => {
  try {
    const s = await Salary.create(req.body);
    res.status(201).json(s);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.get('/', auth, async (_req, res) => {
  const list = await Salary.find().sort({ createdAt: -1 });
  res.json(list);
});

router.get('/:id', auth, async (req, res) => {
  const s = await Salary.findById(req.params.id);
  if (!s) return res.status(404).json({ message: 'Not found' });
  res.json(s);
});

router.put('/:id', auth, async (req, res) => {
  try {
    const s = await Salary.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!s) return res.status(404).json({ message: 'Not found' });
    res.json(s);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  const s = await Salary.findByIdAndDelete(req.params.id);
  if (!s) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router;
