const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');


requestRouter.post('/sendConnectionRequest', userAuth, async (req,res) => {
    try{
        const user = req.user;
        res.send(user.firstName + ' ' + user.lastName + ' has sent you a connection request');
        console.log( user.firstName + ' ' + user.lastName, 'sent connection request successfully...!');
    }
    catch(err) {
        res.status(500).send('Error while sending the connection request: ' + err.message);
    }
});

module.exports = requestRouter;