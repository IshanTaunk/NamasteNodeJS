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

const validatePwd=(password)=>{
    if(!validator.isLength(password,{ min: 4, max: 15 })){
        throw new Error('Password length is not correct!');
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

const validateProfileEditData=(req)=>{
    //ToDo: Also validate if photourl is valid while updating.
    const ALLOWED_UPDATES = ["gender","age","about","skills"];
    const isUpdateAllowed = Object.keys(req.body).every(k=>ALLOWED_UPDATES.includes(k));
    return isUpdateAllowed;
}

module.exports = {
    validateSignUpData,
    validateLoginData,
    validateProfileEditData,
    validatePwd
}