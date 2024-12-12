const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.patch("/user", async(req,res)=>{
    const userEmail = req.body.emailId;
    console.log(req.body);
    try{
        const user = await User.findOneAndUpdate({emailId:userEmail},req.body,{returnDocument:'after'});
        if(user){
            res.send(user);
        }else{
            res.status(404).send("User not found");
        }
    }catch(err){
        res.status(400).send("Something went wrong");
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