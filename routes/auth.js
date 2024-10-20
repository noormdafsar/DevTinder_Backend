const express = require('express');
const authRouter = express.Router();
const User = require('../models/user');
const { validateSignupData, validateLoginData } = require('../utils/validation');
const bcrypt = require('bcrypt');

authRouter.post('/signup', async (req, res) => {
    try {
        // validation of data
        validateSignupData(req);

        const { firstName, lastName, emailId, password } = req.body;

        // Encryption of password
        const hashPassword = await bcrypt.hash(password, 10);

        // creating a new instance of the user model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hashPassword,
        });

        await user.save();
        console.log('Signup Successful...!\n'+'User details: ', user);
        res.status(200).json({
            message: `${user.firstName} ${user.lastName} signed up successfully...!`,
            user: user,
        });
    } 
    catch(error) {
        console.log('Error while saving the user: ' + error.message);
        res.status(400).send('ERROR: ' + error.message);
    }
});


authRouter.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if(!validateLoginData(req)) {
            throw new Error('Invalid field', err.message);
        }  
                             // jo tm password diya hai usko compare karna hai db mein jo store password hai usse
       // const isPasswordMatch = await bcrypt.compare(password, user.password);
       const isPasswordMatch = await user.validatePassword(password);
        if(isPasswordMatch) {
            // Create a JWT Token    / userId               // secret key               // expiry time
           // const token = jwt.sign({ _id: user._id}, "Nooruddin@786_Dev_Tinder", { expiresIn:  '1d' });
           const token = await user.getJWT();
            console.log('Token:', token);
            // Add the token to cookie and send the response back to the user
            console.log("Login successful...!", user);
            res.cookie('token', token, { expires: new Date(Date.now() + 8 * 3600000) });
            res.status(200).json({
                message: `${user.firstName} ${user.lastName} logged in successfully...!`,
                user: user,
                token: token,
            });
        }
        else{
            // console.log('User login successfully...!', user);
            throw new Error('Invalid password');
        }
    }
    catch(err) {
        console.log('Error while login :  '+ err.message);
        res.status(400).send('ERROR: ' + err.message);
    }
});

authRouter.post('/logout', async(req,res) => {
    try{
        res.cookie('token', null, {
            expires: new Date(Date.now()),
        });
        res.send('Logout successfully...!');
    }
    catch(err) {
        console.log('Error while logout :  '+ err.message);
        res.status(400).send('ERROR: ' + err.message);
    }
})

module.exports = authRouter;