const express = require('express');
const app = express();
const { adminAuth, userAuth } = require('./middleware/auth');
// This is handling all the requests from server side and sending response back to the client

// Handling Auth middleware for all the requests like GET, POST, PUT DELETE AND PATHC, OPTIONS

app.use('/admin',adminAuth );
app.use('/user',userAuth );

app.get('/admin/getAllData', (req,res) =>  { 
    res.send('Admin data fetch successfully');
} )

app.get('/user', (req,res) => {
    try{
        throw new Error('abcd');
        res.send('User data fetched successfully');
    }
    catch(err){ // this is better to way to handle the error in express
        console.log('Error:', err.message);
        res.status(500).send('Khuch to galti ho raha hai babu bhaiya');
    }
})

app.get('/admin/deleteAllData', (req,res) =>  { 
        res.send('Admin data deleted successfully');
} )
// this is the older way of handling the error in the express
app.use('/', (err,req,res,next) => {
    if(err){
        //console.log('Error:', err.message);
        res.status(500).send('Something went wrong');
    }
})

app.listen(3000, () => {
    console.log('Server is running on port 3000...!');
})