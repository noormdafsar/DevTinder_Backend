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

// const validateStatus = async (req,res) => {
//     const status = req.params.status
//     const ALLOWED_STATUS = ['pending', 'accepted', 'rejected'];
//     const isAllowedStatus = ALLOWED_STATUS.includes(status);
//     if(!isAllowedStatus) {
//         return res
//           .status(400)
//           .json({ message: "Invalid status type: " + status });
//       }
//     return isAllowedStatus;
// }
module.exports = {
    validateSignupData, validateEditProfileData, 
}