const validator = require('validator');


const validateSignupData = (req) => {

        const { firstName, lastName, emailId, password } = req.body;
        if(!firstName || !lastName || !emailId || !password) {
            console.log('Validation failed: Missing fields:', { firstName, lastName, emailId, password });
            throw new Error('Please provide all the details');
        }
        else if(!validator.isEmail(emailId)){
            throw new Error('Invalid email address');
        }
        else if(!validator.isStrongPassword(password)){
            throw new Error('Enter the strong password');
        }
}

const validateLoginData = (req) => {
    const { emailId, password } = req.body;
    if(!emailId || !password) {
        throw new Error('Please provide all the details');
    }
    else if(!validator.isEmail(emailId)){
        throw new Error('Invalid email address');
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error('Enter the strong password');
    }
}

const validateEditProfileData = async (req) => {
    const ALLOWED_FIELDS = [
        'firstName', 
        'lastName', 
        'about', 
        'skills', 
        'age', 
        'gender'
    ];
    const isAllowedField = Object.keys(req.body).every( (field) => ALLOWED_FIELDS.includes(field));
    return isAllowedField;
}

module.exports = {
    validateSignupData, validateEditProfileData, validateLoginData,
}