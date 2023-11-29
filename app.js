// This is the main file

const express = require('express');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors'); // Import cors module

// Middleware setup - Order matters!
app.use(express.json());

app.use(cors());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Route all api requests with /api/...... to index.js
const indexRouter = require('./Controllers/index');
app.use('/api', indexRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
