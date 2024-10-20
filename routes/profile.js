const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const User = require('../models/user');
const { validateEditProfileData } = require('../utils/validation');

profileRouter.get('/profile/view', userAuth, async (req,res) => {
    try{
        const user = req.user;
        res.send(user);
        console.log('User details: ', user);
        
    }
    catch(err){
        console.log('Error while fetching the detail of user: ' + err.message);
        res.status(500).send("Unauthorized access" + err.message);
    }
});

profileRouter.patch('/profile/edit',userAuth, async (req, res) => {
    
    try {    
       if (!validateEditProfileData(req)) {
        throw new Error('Invalid field', err.message);
       }
       const loggedInUser = req.user;   
       Object.keys(req.body).forEach((key) => {
        loggedInUser[key] = req.body[key];
       });
       console.log('Updated user details: ', loggedInUser);
       await loggedInUser.save();
       res.status(200).json({
        message: `${loggedInUser.firstName} ${loggedInUser.lastName} Your profile updated successfully...!`,
        user: loggedInUser,
       });
    }
    catch (err) {
        console.error("Error updating the user details....!", err);
        res.status(400).send('Error updating the user details...! ' + err.message);
    }
});

profileRouter.delete('/deleteProfile', async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        console.log('Attempting to delete user with ID: ', userId, user);
        if (!user) {
            res.status(404).send('User doesn\'t exist');
        } else {
            res.status(200).send('User deleted successfully...!' + user);
        }
    }
    catch (err) {
        console.error("Error while deleting the user detail...!", err);
        res.status(500).send('Error while deleting user: ' + err.message);
    }
});

module.exports = profileRouter;