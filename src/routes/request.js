const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middleware/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req,res)=>{
    try{
        const fromUserId = req.user._id;
        const status = req.params.status;
        const toUserId = req.params.toUserId;

        //Validate type of connection request
        const allowedConnectionTypes = ["interested","ignored"];
        if(!allowedConnectionTypes.includes(status)){
            throw new Error("This type of connection request is not allowed!");
        }

        //Validate if reciever exists in database
        const toUser = await User.findOne({_id : toUserId});
        if(!toUser){
            throw new Error("This reciever does not exists!");
        }

        //Validate if connection b/w sender and reciever already exists
        const isExistingConnection = await ConnectionRequest.findOne({
            $or : [
                {fromUserId,toUserId},
                {fromUserId: toUserId,toUserId: fromUserId}
            ]
        });
        if(isExistingConnection){
            throw new Error("This connection request already exists!");
        }

        const newConnection = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });
        const data = await newConnection.save();
        res.json({
            message : "New connection request status is now "+status+"!",
            data
        });
    }catch(err){
        res.status(400).send("Sending request failed: "+ err.message);
    }
})

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