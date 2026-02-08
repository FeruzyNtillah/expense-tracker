const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // Necessary for resolving .env path
const connectDB = require('./config/db');

// Load environment variables from backend directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));

// Health check route
app.get('/', (req, res) => {
    res.json({ message: 'Expense Tracker API' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});