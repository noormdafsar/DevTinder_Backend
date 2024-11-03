const express = require('express');
const connectDB = require('./config/database');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
//const jwt = require('jsonwebtoken');

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
}));
app.use(cookieParser());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const requestRoutes = require('./routes/request');
const userRoutes = require('./routes/user');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/request', requestRoutes);
app.use('/api/user', userRoutes);



connectDB()
    .then(() => {
            try {
                console.log('Database connected successfully...!');
            app.listen(3000, () => {
                console.log('Server is running on port 3000...!');
            });
            }
            catch(err){
                console.log('Error while connecting to the server', err);
            }
        })
    .catch((err) => {
        console.log('Error while connecting to the database', err);
    });