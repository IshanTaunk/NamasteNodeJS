const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middleware/auth");
const User = require("../models/user");
const {validateProfileEditData, validatePwd} = require("../utils/validation");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async(req,res) => {
    try{
        const profile = req.user;
        res.send(profile);
    }catch(err){
        res.send("Error getting profile in: "+ err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async(req,res)=>{
    
    const userId = req.user._id;
    const isUpdateAllowed = validateProfileEditData(req);

    try{
        if(!isUpdateAllowed){
            throw new Error("THis update is not allowed!");
        }
        // My way
        // const user = await User.findOneAndUpdate({_id: userId},req.body,{returnDocument: 'after',runValidators: true});
        // if(user){
        //     res.send(user);
        // }else{
        //     res.status(404).send("User not found");
        // }

        //Akshay way
        const loggedInUser = req.user;
        Object.keys(req.body).map((key)=>{
            loggedInUser[key] = req.body[key];
        });
        await loggedInUser.save();
        res.json({"message":`${req.user.firstName} updated succesfully`,"data":loggedInUser});
    }catch(err){
        res.status(400).send("Update Failed: "+ err.message);
    }
})

profileRouter.patch("/profile/password", userAuth, async(req,res)=>{
    try{
        const currentPasswordInput = req.body.password;
        const user = req.user;
        const isCurrentPasswordValid = await user.comparePwd(currentPasswordInput);

        if(isCurrentPasswordValid){
            const newPwd = req.body.newPassword;
            validatePwd(newPwd);
            const pwdHash = await bcrypt.hash(newPwd,10);
            const updatedUser = await User.findOneAndUpdate({_id: req.user._id},{"password":pwdHash},{returnDocument: 'after',runValidators: true});
            res.json({"message":`Password of ${user.firstName} updated succesfully`,"data":updatedUser});
        }else{
            throw new Error("Enter correct info!");
        }
    }catch(err){
        res.status(400).send("Update Failed: "+ err.message);
    }
})

module.exports = profileRouter;