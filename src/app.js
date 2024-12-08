// const http = require("http");
// console.log("Hello");
// const server = http.createServer(function(req,res){
//     if(req.url==="/getSecret"){
//         res.end("No secret");
//     }
//     res.end("Hello World")
// });

// server.listen(7777);

const express = require("express");

const app = express();

app.use((req,res)=>{
    res.send("Hello from the server side");
})

app.listen(3000,()=>{
    console.log("Server is listening");
});