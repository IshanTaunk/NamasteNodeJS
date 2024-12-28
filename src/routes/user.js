const express = require("express");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middleware/auth");

const USER_SAFE_DATA = "firstName lastName";

//get all pending connection requests for loggedin user
userRouter.get("/user/requests/received", userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const data = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA);
        res.json({
            message: "Connection requests successfully fetched!",
            data
        })
    }catch(err){
        res.status(400).send("Fetching pending requests failed: "+ err.message);
    }
});

//get all accepted connection requests for loggedin user
userRouter.get("/user/requests/accepted", userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [{
                toUserId: loggedInUser._id
            },{
                fromUserId: loggedInUser._id
            }],
            status: "accepted"
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);
        const data = connectionRequests.map(connection=>{
            if(connection.fromUserId._id.toString()===loggedInUser._id.toString()){
                return connection.toUserId
            }else{
                return connection.fromUserId
            }
        })
        res.json({
            message: "Existing connections successfully fetched!",
            data
        })
    }catch(err){
        res.status(400).send("Fetching accepted requests failed: "+ err.message);
    }
});

//get all other users for a loggedin user
userRouter.get("/user/requests/feed", userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [{
                toUserId: loggedInUser._id
            },{
                fromUserId: loggedInUser._id
            }],
            status: "accepted"
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);
        const data = connectionRequests.map(connection=>{
            if(connection.fromUserId._id.toString()===loggedInUser._id.toString()){
                return connection.toUserId
            }else{
                return connection.fromUserId
            }
        })
        res.json({
            message: "Existing connections successfully fetched!",
            data
        })
    }catch(err){
        res.status(400).send("Fetching accepted requests failed: "+ err.message);
    }
});

module.exports = userRouter;