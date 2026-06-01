const express = require('express');
const Employee = require('../models/Employee');
const Department = require('../models/Department');
const Salary = require('../models/Salary');
const auth = require('../middleware/auth');
const router = express.Router();

// period = daily | weekly | monthly
function getRange(period) {
  const now = new Date();
  const start = new Date(now);
  if (period === 'daily') start.setHours(0, 0, 0, 0);
  else if (period === 'weekly') start.setDate(now.getDate() - 7);
  else start.setMonth(now.getMonth() - 1);
  return { start, end: now };
}

router.get('/:period', auth, async (req, res) => {
  const { period } = req.params;
  if (!['daily', 'weekly', 'monthly'].includes(period)) {
    return res.status(400).json({ message: 'Invalid period' });
  }
  const { start, end } = getRange(period);
  const filter = { createdAt: { $gte: start, $lte: end } };
  const [employees, departments, salaries] = await Promise.all([
    Employee.find(filter),
    Department.find(filter),
    Salary.find(filter),
  ]);
  const totals = salaries.reduce(
    (a, s) => {
      a.gross += s.grossSalary || 0;
      a.deduction += s.totalDeduction || 0;
      a.net += s.netSalary || 0;
      return a;
    },
    { gross: 0, deduction: 0, net: 0 }
  );
  res.json({ period, range: { start, end }, employees, departments, salaries, totals });
});

module.exports = router;
