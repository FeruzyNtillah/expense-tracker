const Expense = require('../models/Expense');

// @desc    Get user expenses
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
    try {
        // CRITICAL: Only get expenses for logged-in user
        const expenses = await Expense.find({ userId: req.user.id }).sort({
            date: -1,
        });

        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
const getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        // Security check: Make sure user owns this expense
        if (expense.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create expense
// @route   POST /api/expenses
// @access  Private
const createExpense = async (req, res) => {
    try {
        const { title, amount, category, date } = req.body;

        // Validation
        if (!title || !amount || !category) {
            return res.status(400).json({
                message: 'Please provide title, amount, and category'
            });
        }

        if (amount <= 0) {
            return res.status(400).json({
                message: 'Amount must be greater than 0'
            });
        }

        const expense = await Expense.create({
            userId: req.user.id, // CRITICAL: From JWT middleware, never from req.body
            title,
            amount,
            category,
            date: date || Date.now(),
        });

        res.status(201).json(expense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        // Security check: Make sure user owns this expense
        if (expense.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Validation
        if (req.body.amount && req.body.amount <= 0) {
            return res.status(400).json({
                message: 'Amount must be greater than 0'
            });
        }

        // Update fields
        expense.title = req.body.title || expense.title;
        expense.amount = req.body.amount || expense.amount;
        expense.category = req.body.category || expense.category;
        expense.date = req.body.date || expense.date;

        const updatedExpense = await expense.save();

        res.json(updatedExpense);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        // Security check: Make sure user owns this expense
        if (expense.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await expense.deleteOne();

        res.json({
            message: 'Expense removed',
            id: req.params.id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get monthly report
// @route   GET /api/expenses/reports/monthly
// @access  Private
const getMonthlyReport = async (req, res) => {
    try {
        const { year, month } = req.query;

        // Validation
        if (!year || !month) {
            return res.status(400).json({
                message: 'Please provide year and month parameters'
            });
        }

        const yearNum = parseInt(year);
        const monthNum = parseInt(month);

        if (monthNum < 1 || monthNum > 12) {
            return res.status(400).json({
                message: 'Month must be between 1 and 12'
            });
        }

        // Create date range for the month
        const startDate = new Date(yearNum, monthNum - 1, 1);
        const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);

        // Get expenses for the user in this date range
        const expenses = await Expense.find({
            userId: req.user.id,
            date: { $gte: startDate, $lte: endDate },
        });

        // Calculate total
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

        // Category breakdown
        const categoryTotals = expenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {});

        // Sort categories by amount (descending)
        const sortedCategories = Object.entries(categoryTotals)
            .sort(([, a], [, b]) => b - a)
            .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {});

        res.json({
            period: `${yearNum}-${String(monthNum).padStart(2, '0')}`,
            startDate,
            endDate,
            total: Math.round(total * 100) / 100, // Round to 2 decimals
            count: expenses.length,
            byCategory: sortedCategories,
            expenses: expenses.map(exp => ({
                id: exp._id,
                title: exp.title,
                amount: exp.amount,
                category: exp.category,
                date: exp.date,
            })),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get category summary (all time)
// @route   GET /api/expenses/reports/category-summary
// @access  Private
const getCategorySummary = async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user.id });

        // Calculate total
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

        // Category breakdown with count
        const categoryStats = expenses.reduce((acc, expense) => {
            if (!acc[expense.category]) {
                acc[expense.category] = {
                    total: 0,
                    count: 0,
                };
            }
            acc[expense.category].total += expense.amount;
            acc[expense.category].count += 1;
            return acc;
        }, {});

        // Calculate percentage for each category
        const categorySummary = Object.entries(categoryStats).map(([category, stats]) => ({
            category,
            total: Math.round(stats.total * 100) / 100,
            count: stats.count,
            percentage: total > 0 ? Math.round((stats.total / total) * 100 * 100) / 100 : 0,
            average: Math.round((stats.total / stats.count) * 100) / 100,
        }));

        // Sort by total (descending)
        categorySummary.sort((a, b) => b.total - a.total);

        res.json({
            totalExpenses: Math.round(total * 100) / 100,
            totalCount: expenses.length,
            categories: categorySummary,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get expenses by date range
// @route   GET /api/expenses/range
// @access  Private
const getExpensesByRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                message: 'Please provide startDate and endDate'
            });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start > end) {
            return res.status(400).json({
                message: 'startDate must be before endDate'
            });
        }

        const expenses = await Expense.find({
            userId: req.user.id,
            date: { $gte: start, $lte: end },
        }).sort({ date: -1 });

        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

        res.json({
            startDate: start,
            endDate: end,
            total: Math.round(total * 100) / 100,
            count: expenses.length,
            expenses,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getExpenses,
    getExpenseById,
    createExpense,
    updateExpense,
    deleteExpense,
    getMonthlyReport,
    getCategorySummary,
    getExpensesByRange,
};