const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middleware/auth");
const User = require("../models/user");

requestRouter.patch("/user/:userId", async(req,res)=>{
    const userId = req.params?.userId;
    console.log(req.body);
    const ALLOWED_UPDATES = ["gender","age","about","skills"];
    const isUpdateAllowed = Object.keys(req.body).every(k=>ALLOWED_UPDATES.includes(k));

    try{
        if(!isUpdateAllowed){
            throw new Error("THis update is not allowed!");
        }
        const user = await User.findOneAndUpdate({_id: userId},req.body,{returnDocument: 'after',runValidators: true});
        if(user){
            res.send(user);
        }else{
            res.status(404).send("User not found");
        }
    }catch(err){
        res.status(400).send("Update Failed: "+ err.message);
    }
})

requestRouter.get("/user", async(req,res)=>{
    const userEmail = req.body.emailId;
    try{
        const users = await User.find({});
        if(users.length===0){
            res.status(404).send("User not found!");
        }else{
            res.send(users);
        }
    } catch(err){
        res.status(400).send("Something went wrong");
    }
})

module.exports = requestRouter;