const Category = require('../models/Category');

// @desc    Get user categories
// @route   GET /api/categories
// @access  Private
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ userId: req.user.id });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        const category = await Category.create({
            userId: req.user.id,
            name,
        });

        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getCategories, createCategory };