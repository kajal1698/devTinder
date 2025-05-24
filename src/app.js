const express = require("express");
const app = express();
//now with this only home page will display but use app.get to match exact path then it will display matching route

//this will match all the http method API calls to /test
app.use("/test",(req,res)=>{
    res.send("Hello From test");
})
app.use("/user",(req,res)=>{
    res.send("All the user rest will display this msg because order matters");
})
//this will only handle GET call to /user
app.get("/user",(req,res)=>{
    res.send({firstName : "Kajal",lastName: "Soni"});
})
app.post("/user",(req,res)=>{
    res.send("user data saved successfully");
})
app.use("/hello",(req,res)=>{
    res.send("Hello From hello");
})
app.use("/hello/2",(req,res)=>{
    res.send("hello from 2");
})
app.use("/",(req,res)=>{
    res.send("Hello From home page");
})
app.listen(5000,()=>{
    console.log("Server is listening on port 5000");
})