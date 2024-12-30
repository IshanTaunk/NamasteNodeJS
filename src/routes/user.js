const express = require("express");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middleware/auth");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl about";

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

//get all users not having any type of connection request with loggedin user
userRouter.get("/user/requests/feed", userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;

        //Setting pagination
        const pageNumber = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit<50?limit:50;
        const skip = (pageNumber-1) * limit;


        const requestsInvolvingLoggedInUser = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id},
                {fromUserId: loggedInUser._id}
            ]
        }).select("toUserId fromUserId");
        const uniqueUserIdsNotInConnection = new Set();
        requestsInvolvingLoggedInUser.map(connection=>{
            uniqueUserIdsNotInConnection.add(connection.toUserId.toString());
            uniqueUserIdsNotInConnection.add(connection.fromUserId.toString());
        });
        const uniqueIdsArray = Array.from(uniqueUserIdsNotInConnection);
        
        const data = await User.find({
            $and: [
                { _id: { $nin: uniqueIdsArray } },
                { _id: { $ne: loggedInUser._id}}
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);
        res.json({
            message: "All users in feed successfully fetched!",
            data
        })
    }catch(err){
        res.status(400).send("Fetching all connections failed: "+ err.message);
    }
});

module.exports = userRouter;