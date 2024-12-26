const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async(req,res,next) =>{
    try{
        const cookies = req.cookies;
        if(!cookies){
            throw new Error("Login failed, please try again.");
        }
        const {token} = cookies;
        if(!token){
            throw new Error("Token expired. Please login again!");
        }
        //Validate my token
        const {_id} = await jwt.verify(token,"Dev4Tinder@");
        const user = await User.findById({_id:_id});
        if(!user){
            throw new Error("No such user exists!");
        }
        req.user = user;
        next();
    }catch(err){
        res.status(400).send("Error: "+ err.message);
    }
}

module.exports = {userAuth};

// {
//     "emailId" : "elon@gmail.com",
//     "password" : "Elon@123Musk"
// }

// "emailId" : "ram@gmail.com",
//     "password" : "Ram@123Kr",

// "emailId" : "mark@gmail.com",
//     "password" : "Mark@123Zuck",

// "emailId" : "mahi@gmail.com",
//     "password" : "Dhoni@123",