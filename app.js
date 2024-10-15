const express = require('express');
const app = express();

// This is handling all the requests from server side and sending response back to the client

// This is also called middleware(a fancy technical word)
app.get('/user/:userId/:name/:password', (req,res) => { // this only handle GET call to user
    console.log(req.params);
    res.send({firstname: 'Nooruddin', middlename: 'Md', lastname: 'Afsar'});
})

app.post('/user', (req,res) => { 
    console.log('data is saved into database');
    res.send({email: 'abx@123', phone: '4586515365'});
})

app.put('/user', (req,res) => { 
    console.log('data is update in database');
    res.send({update: 'abx@123', phone: '4586515365'});
})

app.patch('/user', (req,res) => { 
    console.log('data is update in database');
    res.send({address: 'abx@123', phone: '4586515365'});
})

app.delete('/user', (req,res) => { 
    console.log('data is delete from database');
    res.send({delete: 'abx@123', phone: '4586515365'});
})

app.listen(3000, () => {
    console.log('Server is running on port 3000...!');
})