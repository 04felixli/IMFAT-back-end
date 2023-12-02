// This is the main file
import express, { Express, Request, Response, NextFunction } from 'express';

const app: Express = express();
const PORT: number | string = process.env.PORT || 5000;
require('dotenv').config();
const cors = require('cors'); // Import cors module

// Middleware setup - Order matters!
app.use(express.json());

app.use(cors());

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
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
