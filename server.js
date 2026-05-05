require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const connectDB = require('./config/dbConn');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3500;

// connect to mongoDB
connectDB();

// middleware
app.use(express.json());

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/states', require('./routes/states'));

// root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// 404 catch-all
app.all('/{*splat}', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

// only listen after mongoDB connects
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});