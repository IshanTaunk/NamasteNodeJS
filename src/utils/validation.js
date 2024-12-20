const validator = require("validator");

const validateSignUpData=(req)=>{
    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName){
        throw new Error('Enter Valid Name!');
    }else if(!validator.isEmail(emailId)){
        throw new Error('Enter valid email address.');
    }else if(!validator.isStrongPassword(password)){
        throw new Error('Password is not strong!');
    }
}

const validateLoginData=(req)=>{
    const {emailId, password} = req.body;

    if(!validator.isEmail(emailId)){
        throw new Error('Enter valid email address.');
    }
}

module.exports = {
    validateSignUpData,
    validateLoginData
}