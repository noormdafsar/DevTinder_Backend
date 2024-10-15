const express = require('express');
const app = express();

// This is handling all the requests from server side and sending response back to the client
app.use('/', (req,res) => {  
    res.send('This is handling all the requests from server side and sending response back to the client');
});
// This is also called middleware(a fancy technical word)
app.use('/noor', (req,res) => {  
    res.send('Hello from Noor...');
});


app.listen(3000, () => {
    console.log('Server is running on port 3000...!');
})