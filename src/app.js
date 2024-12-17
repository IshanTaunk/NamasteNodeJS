const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

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
    console.log(req.body);
    const user = new User(req.body);

    try{
        await user.save();
        res.send("User added successfully");
    }catch(err){
        res.send("Error creating User: "+ err.message);
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