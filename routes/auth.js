const express = require('express');
const authRouter = express.Router();
const User = require('../models/user');
const { validateSignupData, validateLoginData } = require('../utils/validation');
const bcrypt = require('bcrypt');

authRouter.post('/signup', async (req, res) => {
    try {
        // validation of data whether it is valid or not
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


authRouter.post("/login", async (req, res) => {
    try {
      const { emailId, password } = req.body;
  
      const user = await User.findOne({ emailId: emailId });
      if (!user) {
        throw new Error("Invalid credentials");
      }
      const isPasswordValid = await user.validatePassword(password);
  
      if (isPasswordValid) {
        const token = await user.getJWT();
  
        res.cookie("token", token, {
          expires: new Date(Date.now() + 8 * 3600000),
        });
        res.status(200).json({
          message: `${user.firstName} ${user.lastName} You are logged in...!`,
          user: user,
        });
      } else {
        throw new Error("Invalid credentials");
      }

    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
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