const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user')
const { validateSignupData } = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
//const jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth');

app.use(cookieParser());

app.use(express.json());
    

app.post('/signup', async (req, res) => {

    try {
        const { firstName, lastName, emailId, password } = req.body;
         // validation of data
        validateSignupData(req);

        // Encryption of password
        const hashPassword = await bcrypt.hash(password, 10);
        console.log('Hashed password:', hashPassword);

        // creating a new instance of the user model
        const user = new User ({
            firstName,
            lastName,
            emailId,
            password: hashPassword,
        });
        await user.save();
        console.log('user signup details:', user);
        res.send('Signup successfully...!');
    } 
    catch(err) {
        console.log('Error while saving the user :  '+ err.message);
        res.status(400).send('ERROR: ' + err.message);
    }
});

app.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if(!user) {
            throw new Error('User not found');
        }   
        // check for password
        if(!password) {
            throw new Error('Please provide the password');
        }
        // check for user password
        if(!user.password) {
            throw new Error('Invalid Password..! Please provide the correct password');
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
            res.cookie('token', token, { expires: new Date(Date.now() + 8 * 3600000) });
            res.send('Login successfully...!');
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
})

// This is used to find the user details for only one user using emailId:
app.get('/profile', userAuth, async (req,res) => {
    try{
        const user = req.user;
        res.send(user);
        console.log('User details: ', user);
        
    }
    catch(err){
        console.log('Error while fetching the detail of user: ' + err.message);
        res.status(500).send("Unauthorized access" + err.message);
    }
})

app.post('/sendConnectionRequest', userAuth, async (req,res) => {
    try{
        const user = req.user;
        res.send(user.firstName + ' ' + user.lastName + ' has sent you a connection request');
        console.log( user.firstName + ' ' + user.lastName, 'sent connection request successfully...!');
    }
    catch(err) {
        res.status(500).send('Error while sending the connection request: ' + err.message);
    }
})

// To fetch all the data that present in the database :
    app.get('/findConnection', async (req,res) => {
        try {
            const users = await User.find();
            if(users.lenght === 0){
                res.status(404).send('No user found');
            }
            else{
                res.send(users);
                console.log('All users details: ', users);
            }
        }
        catch(err){
            res.send(500).send('No user found', err.message);
        }
    })
 // This can only update that field only which you want to update
    app.patch('/updateProfile', async (req, res) => {
        const userId = req.body.userId;
        const data = req.body;
        try {    
            const ALLOWED_UPDATES = ['gender', 'skills', 'age']; 
            const isUpdateAllowed = Object.keys(data).every((key) =>
                ALLOWED_UPDATES.includes(key) || key === 'userId'
            ); 
            if (!isUpdateAllowed) {
                throw new Error("Invalid update request. You are trying to update data which is not allowed");
            } 
            
            if (data.skills && data.skills.length > 10) {
                throw new Error("Skills should be less than or equal to 10");
            }          
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $set: data },
                {
                    new: true,
                    runValidators: true
                }
            );
            if (!updatedUser) {
                return res.status(404).send('User not found');
            }
            res.send(updatedUser);
            console.log('User details updated successfully...!', updatedUser);
        }
        catch (err) {
            console.error("Error updating the user details....!", err);
            res.status(400).send('Error updating the user details...! ' + err.message);
        }
    });


    app.put('/completeUpdateProfile', async (req, res) => {
        const userId = req.body.userId;
        const data = req.body;
        try{
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                data,
                {
                    new: true,          // return the updated document
                    runValidators: true // Run the validators    
                },
                {
                    overwrite: true, // overwrite ensure full replacement
                }
                     
            );
            if(!updatedUser){
                res.status(404).send('User not found' + err.message);
            }
            else{
                res.send(updatedUser);
                console.log('complete user details updated successfully...!' + updatedUser);
            }
        }
        catch(err){
            console.error("Error while updating the user details...! ", err)
            res.status(500).send('Error while updating the user details...! ' + err.message);
        }
    });

    app.delete('/deleteProfile', async (req, res) => {
        const userId = req.body.userId;
        try {
            const user = await User.findByIdAndDelete(userId);
            console.log('Attempting to delete user with ID: ', userId, user);
            if (!user) {
                res.status(404).send('User doesn\'t exist');
            } else {
                res.status(200).send('User deleted successfully...!', user);
            }
        } catch (err) {
            console.error("Error while deleting the user detail...!", err);
            res.status(500).send('Error while deleting user: ' + err.message);
        }
    });

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