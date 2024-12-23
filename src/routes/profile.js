const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middleware/auth");

profileRouter.get("/profile", userAuth, async(req,res) => {
    try{
        const profile = req.user;
        res.send(profile);
    }catch(err){
        res.send("Error getting profile in: "+ err.message);
    }
})

module.exports = profileRouter;