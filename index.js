const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);

// app.use('/api', (req, res, next) => {
//     console.log(`Incoming Request: ${req.method} ${req.url}`);
//     next();
// });


// Connect to MongoDB
mongoose
    .connect(
        "mongodb+srv://mdp:Vf29122003@cluster0.eyoha.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(() => {
        console.log("Connected to Database");
        app.listen(3000, () => {
            console.log('Server running on http://localhost:3000');
        });
    })
    .catch((err) => {
        console.error("App starting error:", err.stack);
        console.log("Connection Failed");
    });

module.exports = app;