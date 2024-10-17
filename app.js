const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user')

app.use(express.json())
    
app.post('/detail', async (req,res) => {
    const user = new User ({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailId: req.body.emailId,
        password: req.body.password,
        age: req.body.age,
        gender: req.body.gender,
    })
    try{
        await user.save();
        console.log(req.body);
        res.send('Data added successfully...!');
    }
    catch(err){
        res.status(400).send('Error while saving the user: '+ err.message);
    }
})

app.post('/signup', async (req, res) => {
    const user = new User ({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailId: req.body.emailId,
        password: req.body.password,
        age: req.body.age,
        gender: req.body.gender,
    })
    try {
        await user.save();
        console.log('user signup details:', req.body);
        res.send('User created successfully...!');
    } 
    catch(err) {
        console.log('Error while saving the user :  '+ err.message);
        res.send('Error while saving the user : '+ err.message);
    }
});

// This is used to find the user details for only one user using emailId:
app.get('/getOneUser', async (req,res) => {
    const data = req.body.emailId;
    
    try{
        // another way of fecthing data from database:
        // const user = await User.findOne({ emailId: req.body.emailId })
        const user = await User.findOne({emailId: data});
        if(!user) {
            res.status(404).send('user not found')
        }
        else{
            res.send(user);
            console.log('User details: ', user);
        }
    }
    catch(err){
        console.log('Error while fetching the detail of user' + err.message);
        res.status(500).send("Unauthorized access" + err.message);
    }
})

// To fetch all the data that present in the database :
    app.get('/getAllUsers', async (req,res) => {
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
    app.patch('/updateUser', async (req, res) => {
        const userId = req.body.userId;
        const data = req.body;
        try{                                                                // option          
            const updatedUser = await User.findByIdAndUpdate( //userId, data, {returnDocument: "after",}
                userId, // Find the document by id
                {$set: data}, // Partial replacement of document
                {
                    new: true, // Return the replaced document
                    runValidators: true // Run the validators
                } // Return the replaced document
            );
            if(!updatedUser){
                res.status(404).send('User not found');
            }
            else{
                res.send(updatedUser);
                console.log('User details updated successfully...!' + updatedUser);
            }
        }
        catch(err){
            console.error("Error updating the user details....!  ", err)
            res.status(500).send('Error updating the user details...! ' + err.message);
        }
    });

    app.put('/completeUpdateUser', async (req, res) => {
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

    app.delete('/deleteUser', async (req, res) => {
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
        console.log('Database connected successfully...!');
        app.listen(3000, () => {
            console.log('Server is running on port 3000...!');
        });
    })
    .catch((err) => {
        console.log('Error while connecting to the database', err);
    });