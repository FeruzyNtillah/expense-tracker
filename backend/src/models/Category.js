const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        name: {
            type: String,
            required: [true, 'Please add a category name'],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Category', categorySchema);