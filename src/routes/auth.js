const express = require("express");
const authRouter = express.Router();
const {validateSignUpData, validateLoginData} = require('../utils/validation');
const bcrypt = require("bcrypt");
const User = require("../models/user");

authRouter.post("/signup", async(req,res) => {
    try{
        //Vaildate the data
        validateSignUpData(req);

        const {firstName, lastName, emailId, password} = req.body;

        //Encrypt the password
        const pwdHash = await bcrypt.hash(password,10);

        //Creating new instance of user model
        const user = new User({
            firstName, 
            lastName, 
            emailId, 
            password: pwdHash
        });

        await user.save();
        res.send("User added successfully");
    }catch(err){
        res.send("Error creating User: "+ err.message);
    }
})

authRouter.post("/login", async(req,res) => {
    try{
        //Vaildate the data
        validateLoginData(req);

        const {emailId, password} = req.body;

        const user = await User.findOne({emailId: emailId});
        if(!user){
            throw new Error("Invalid credentials!");
        }

        //compare password
        const isPasswordValid = await user.comparePwd(password);

        if(isPasswordValid){
            const token = await user.getJWT();
            res.cookie("token",token,{ expires: new Date(Date.now() + 7*3600000)});
            res.send("User logged in successfully");
        }else{
            throw new Error("Invalid credentials!");
        }
    }catch(err){
        res.send("Error logging in: "+ err.message);
    }
})

module.exports = authRouter;