const adminAuth = async (req,res,next) => {
    console.log('This is middleware which is authorizing the admin and handling all the requests');
    const token = 'abc';
    const isAdmindAuthorized = token === 'abc';
    if(!isAdmindAuthorized){
        res.status(401).send('Unauthorized access admin');
    }
    else{
        next();
    }
}

const userAuth = async (req,res,next) => {
    console.log('This is middleware which is authorizing the user and handling all the requests');
    const token = 'abc';
    const isAdmindAuthorized = token === 'abc';
    if(!isAdmindAuthorized){
        res.status(401).send('Unauthorized access user');
    }
    else{
        next();
    }
}

module.exports = { 
    adminAuth, userAuth
 };