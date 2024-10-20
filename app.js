const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user')
const cookieParser = require('cookie-parser');
//const jwt = require('jsonwebtoken');

app.use(cookieParser());
app.use(express.json());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);



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