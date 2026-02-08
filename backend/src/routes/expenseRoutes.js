const express = require('express');
const {
    getExpenses,
    getExpenseById,
    createExpense,
    updateExpense,
    deleteExpense,
    getMonthlyReport,
    getCategorySummary,
    getExpensesByRange,
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Report routes - MUST come before /:id route
router.get('/reports/monthly', protect, getMonthlyReport);
router.get('/reports/category-summary', protect, getCategorySummary);
router.get('/range', protect, getExpensesByRange);

// Base routes
router.route('/')
    .get(protect, getExpenses)
    .post(protect, createExpense);

// Individual expense routes
router.route('/:id')
    .get(protect, getExpenseById)
    .put(protect, updateExpense)
    .delete(protect, deleteExpense);

module.exports = router;