const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
//const validator = require('validator');

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2,
    },
    lastName: {
        type: String,
        required: true,
    },
    emailId: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
        trim: true,
        // validate(value){
        //     if(!validator.isEmail(value)){
        //         throw new Error('Invalid Email Address:', + value);
        //     }
        // }
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        // maxLength: 20,
        // validate(value){
        //     if(!validator.isStrongPassword(value)){
        //         throw new Error('Enter the strong password:', + value);
        //     }
        // }
    },
    age: {
        type: Number,
        // required: true,
        min: 18,
    },
    gender: {
        type: String,
        // required: true,
        validate(value){
            if(!['male', 'female', 'others'].includes(value)){
                throw new Error('Invalid gender');
            }
        }
    },
    skills: {
        type: [String],
        // required: true,
        validate(array){
            if(array.length > 10){
                throw new Error('Skills should be less than 20');
            }
        }
    },
    about: {
        type: String,
        maxLength: 200,
    }
},
{ 
    timestamps: true,
}
);

userSchema.methods.getJWT =  async function(){
    const user = this;
    const token = await jwt.sign({ _id: user._id }, 'Nooruddin@786_Dev_Tinder', {expiresIn: '7d',});
    return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const hashPassword = user.password;
    const isMatch = await bcrypt.compare(passwordInputByUser, hashPassword);
    return isMatch;
}

const User = mongoose.model('User', userSchema);
module.exports = User;