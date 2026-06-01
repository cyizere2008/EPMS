const express = require('express');
const Employee = require('../models/Employee');
const auth = require('../middleware/auth');
const router = express.Router();

// Insert (required)
router.post('/', auth, async (req, res) => {
  try {
    const emp = await Employee.create(req.body);
    res.status(201).json(emp);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// List (used by reports/dropdowns)
router.get('/', auth, async (_req, res) => {
  const list = await Employee.find().sort({ createdAt: -1 });
  res.json(list);
});

module.exports = router;
