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
            message : "An "+status+` request from ${req.user.firstName} to ${toUser.firstName}!`,
            data
        });
    }catch(err){
        res.status(400).send("Sending request failed: "+ err.message);
    }
});

requestRouter.post("/request/review/:status/:fromUserId", userAuth, async(req,res)=>{
    try{
        const toUserId = req.user._id;
        const {status,fromUserId} = req.params;

        //Validate type of connection request
        const allowedConnectionTypes = ["accepted","rejected"];
        if(!allowedConnectionTypes.includes(status)){
            throw new Error("This type of connection request is not allowed!");
        }

        //Validate if reciever exists in database
        const fromUser = await User.findOne({_id : fromUserId});
        if(!fromUser){
            throw new Error("This sender does not exists!");
        }

        //Validate if connection exists and status is interested.
        const existingConnectionRequest = await ConnectionRequest.findOne({
            status: "interested",
            fromUserId,
            toUserId
        });
        if(!existingConnectionRequest){
            throw new Error("This connection request does not exists!");
        }

        existingConnectionRequest.status = status;

        const data = await existingConnectionRequest.save();
        res.json({
            message : `The connection request by ${fromUser.firstName} is `+status+` by ${req.user.firstName}!`,
            data
        });
    }catch(err){
        res.status(400).send("Request handling failed: "+ err.message);
    }
});

module.exports = requestRouter;