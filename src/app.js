const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const {validateSignUpData, validateLoginData} = require('./utils/validation');
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const {userAuth} = require("./middleware/auth");

app.use(express.json());
app.use(cookieParser());

app.patch("/user/:userId", async(req,res)=>{
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

app.get("/user", async(req,res)=>{
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

app.post("/signup", async(req,res) => {
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

app.post("/login", async(req,res) => {
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

app.get("/profile", userAuth, async(req,res) => {
    try{
        const profile = req.user;
        res.send(profile);
    }catch(err){
        res.send("Error getting profile in: "+ err.message);
    }
})

connectDB()
    .then(()=>{
        console.log("db connection made");
        app.listen(3000,()=>{
            console.log("Server is listening");
        });
    }).catch(err=>{
        console.log("db connection not made");
    });