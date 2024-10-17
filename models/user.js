const mongoose = require('mongoose');
const { Schema } = mongoose;

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
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 20,
    },
    age: {
        type: Number,
        required: true,
        min: 18,
    },
    gender: {
        type: String,
        required: true,
        validate(value){
            if(!['male', 'female', 'others'].includes(value)){
                throw new Error('Invalid gender');
            }
        }
    },
    skills: {
        type: [String],
        required: true,
        validate(array){
            if(array.length > 10){
                throw new Error('Skills should be less than 20');
            }
        }
    },
},
{ 
    timestamps: true,
}
);

const User = mongoose.model('User', userSchema);
module.exports = User;