const express = require('express');
const router = express.Router();
const { addEmployee, getEmployees, searchEmployee, updateEmployee, deleteEmployee } = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addEmployee)
  .get(protect, getEmployees);

router.get('/search', protect, searchEmployee);

router.route('/:id')
  .put(protect, updateEmployee)
  .delete(protect, deleteEmployee);

module.exports = router;
